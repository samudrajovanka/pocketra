import { and, desc, eq, gte, ilike, lte } from 'drizzle-orm';
import {
	type CursorPagination,
	generateCursorPaginationMetaResponse,
} from '../../utils/helpers/pagination';
import { isEditableTransaction } from '../../utils/helpers/transactions';
import { db } from '../../config/db';
import InvariantError from '../../exceptions/InvariantError';
import NotFoundError from '../../exceptions/NotFoundError';
import { categoriesTable } from '../category/category.schema';
import { pocketsTable } from '../pocket/pocket.schema';
import { transactionsTable } from './transaction.schema';
import type {
	PayloadCreateTransaction,
	PayloadGetTransactions,
	PayloadUpdateTransaction,
} from './types';

export default class TransactionService {
	async createTransaction(userId: string, data: PayloadCreateTransaction) {
		const pocket = await db.query.pocketsTable.findFirst({
			where: and(
				eq(pocketsTable.id, data.pocketId),
				eq(pocketsTable.userId, userId),
			),
		});

		if (!pocket) {
			throw new NotFoundError('Pocket not found');
		}

		const category = await db.query.categoriesTable.findFirst({
			where: eq(categoriesTable.id, data.categoryId),
		});

		if (!category) {
			throw new NotFoundError('Category not found');
		}

		const [transaction] = await db
			.insert(transactionsTable)
			.values({
				pocketId: data.pocketId,
				categoryId: data.categoryId,
				type: data.type,
				amount: data.amount.toString(),
				description: data.description,
				date: new Date(data.date),
			})
			.returning();

		return transaction;
	}

	async getTransactions(
		userId: string,
		params: PayloadGetTransactions & { pagination: CursorPagination },
	) {
		const conditions = [eq(pocketsTable.userId, userId)];

		if (params.pocketId) {
			conditions.push(eq(transactionsTable.pocketId, params.pocketId));
		}

		if (params.type) {
			console.log('params.type', params.type);
			conditions.push(eq(transactionsTable.type, params.type));
		}

		if (params.description) {
			conditions.push(
				ilike(transactionsTable.description, `%${params.description}%`),
			);
		}

		if (params.minAmount) {
			conditions.push(
				gte(transactionsTable.amount, params.minAmount.toString()),
			);
		}

		if (params.maxAmount) {
			conditions.push(
				lte(transactionsTable.amount, params.maxAmount.toString()),
			);
		}

		if (params.pagination?.cursor) {
			conditions.push(lte(transactionsTable.id, params.pagination.cursor));
		}

		const limit = params.pagination?.limit || 10;

		const rows = await db
			.select({
				transaction: transactionsTable,
				pocket: {
					id: pocketsTable.id,
					name: pocketsTable.name,
				},
				category: {
					id: categoriesTable.id,
					name: categoriesTable.name,
				},
			})
			.from(transactionsTable)
			.innerJoin(pocketsTable, eq(transactionsTable.pocketId, pocketsTable.id))
			.innerJoin(
				categoriesTable,
				eq(transactionsTable.categoryId, categoriesTable.id),
			)
			.where(and(...conditions))
			.orderBy(desc(transactionsTable.id))
			.limit(limit + 1);

		let nextCursor: string | null = null;
		if (rows.length > limit) {
			const nextItem = rows.pop();
			nextCursor = nextItem?.transaction.id || null;
		}

		const data = rows.map((row) => ({
			...row.transaction,
			pocket: row.pocket,
			category: row.category,
		}));

		return {
			data,
			meta: {
				pagination: generateCursorPaginationMetaResponse(
					params.pagination,
					nextCursor,
				),
			},
		};
	}

	async getTransactionById(userId: string, transactionId: string) {
		const transaction = await db.query.transactionsTable.findFirst({
			where: eq(transactionsTable.id, transactionId),
			with: {
				pocket: {
					columns: {
						id: true,
						name: true,
						userId: true,
					},
				},
				category: {
					columns: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!transaction || transaction.pocket.userId !== userId) {
			throw new NotFoundError('Transaction not found');
		}

		return transaction;
	}

	async updateTransaction(
		userId: string,
		transactionId: string,
		data: PayloadUpdateTransaction,
	) {
		const transaction = await db.query.transactionsTable.findFirst({
			where: eq(transactionsTable.id, transactionId),
			with: {
				pocket: true,
			},
		});

		if (!transaction || transaction.pocket.userId !== userId) {
			throw new NotFoundError('Transaction not found');
		}

		if (!isEditableTransaction(transaction.createdAt.toISOString())) {
			throw new InvariantError('Cannot update transaction older than 1 week');
		}

		let type: string | undefined;

		if (data.categoryId) {
			const category = await db.query.categoriesTable.findFirst({
				where: eq(categoriesTable.id, data.categoryId),
			});

			if (!category) {
				throw new NotFoundError('Category not found');
			}

			if (category.type !== transaction.type) {
				throw new InvariantError('Cannot update transaction type');
			}

			type = category.type;
		}

		if (data.pocketId) {
			const pocket = await db.query.pocketsTable.findFirst({
				where: eq(pocketsTable.id, data.pocketId),
			});

			if (!pocket) {
				throw new NotFoundError('Pocket not found');
			}

			if (pocket.userId !== userId) {
				throw new InvariantError('Cannot update transaction pocket');
			}
		}

		const [updatedTransaction] = await db
			.update(transactionsTable)
			.set({
				...data,
				amount: data.amount?.toString(),
				date: data.date ? new Date(data.date) : undefined,
				type,
			})
			.where(eq(transactionsTable.id, transactionId))
			.returning();

		return updatedTransaction;
	}

	async deleteTransaction(userId: string, transactionId: string) {
		const transaction = await db.query.transactionsTable.findFirst({
			where: eq(transactionsTable.id, transactionId),
			with: {
				pocket: true,
			},
		});

		if (!transaction || transaction.pocket.userId !== userId) {
			throw new NotFoundError('Transaction not found');
		}

		const [deletedTransaction] = await db
			.delete(transactionsTable)
			.where(eq(transactionsTable.id, transactionId))
			.returning();

		return deletedTransaction;
	}
}
