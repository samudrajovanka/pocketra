import { and, desc, eq, gte, ilike, inArray, lte } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '../../config/db';
import InvariantError from '../../exceptions/InvariantError';
import NotFoundError from '../../exceptions/NotFoundError';
import {
	type CursorPagination,
	generateCursorPaginationMetaResponse,
} from '../../utils/helpers/pagination';
import { isEditableTransaction } from '../../utils/helpers/transactions';
import { categoriesTable } from '../category/category.schema';
import { pocketsTable } from '../pocket/pocket.schema';
import { transactionsTable } from './transaction.schema';
import { generateTransferId } from './transaction.utils';
import type {
	PayloadCreateTransaction,
	PayloadGetTransactions,
	PayloadTransferTransaction,
	PayloadUpdateTransaction,
	PayloadUpdateTransferTransaction,
} from './types';

export default class TransactionService {
	async createTransferTransaction(
		userId: string,
		data: PayloadTransferTransaction,
	) {
		const { fromPocketId, toPocketId, amount, description, date } = data;

		if (fromPocketId === toPocketId) {
			throw new InvariantError('Cannot transfer to the same pocket');
		}

		const pockets = await db.query.pocketsTable.findMany({
			where: and(
				inArray(pocketsTable.id, [fromPocketId, toPocketId]),
				eq(pocketsTable.userId, userId),
			),
		});

		if (pockets.length !== 2) {
			throw new InvariantError(
				'One or both pockets not found or do not belong to you',
			);
		}

		const categories = await db.query.categoriesTable.findMany({
			where: inArray(categoriesTable.type, ['transfer_in', 'transfer_out']),
		});

		const transferInCategory = categories.find((c) => c.type === 'transfer_in');
		const transferOutCategory = categories.find(
			(c) => c.type === 'transfer_out',
		);

		if (!transferInCategory || !transferOutCategory) {
			throw new InvariantError('Transfer categories not configured internally');
		}

		const transferId = generateTransferId(date);
		const amountStr = amount.toString();
		const transactionDate = new Date(date);

		await db.insert(transactionsTable).values([
			{
				pocketId: fromPocketId,
				relatedPocketId: toPocketId,
				categoryId: transferOutCategory.id,
				type: 'transfer_out',
				amount: amountStr,
				description,
				date: transactionDate,
				transferId,
			},
			{
				pocketId: toPocketId,
				relatedPocketId: fromPocketId,
				categoryId: transferInCategory.id,
				type: 'transfer_in',
				amount: amountStr,
				description,
				date: transactionDate,
				transferId,
			},
		]);

		return transferId;
	}

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
			.returning({
				id: transactionsTable.id,
			});

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
		const relatedPocketsTable = alias(pocketsTable, 'relatedPocket');

		const rows = await db
			.select({
				transaction: transactionsTable,
				pocket: {
					id: pocketsTable.id,
					name: pocketsTable.name,
				},
				relatedPocket: {
					id: relatedPocketsTable.id,
					name: relatedPocketsTable.name,
				},
				category: {
					id: categoriesTable.id,
					name: categoriesTable.name,
				},
			})
			.from(transactionsTable)
			.innerJoin(pocketsTable, eq(transactionsTable.pocketId, pocketsTable.id))
			.leftJoin(
				relatedPocketsTable,
				eq(transactionsTable.relatedPocketId, relatedPocketsTable.id),
			)
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
			relatedPocket: row.relatedPocket,
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
				relatedPocket: {
					columns: {
						id: true,
						name: true,
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
			.returning({
				id: transactionsTable.id,
			});

		if (!updatedTransaction) throw new NotFoundError('Transaction not found');

		return updatedTransaction;
	}

	async updateTransferTransaction(
		userId: string,
		transferId: string,
		data: PayloadUpdateTransferTransaction,
	) {
		const transactions = await db.query.transactionsTable.findMany({
			where: eq(transactionsTable.transferId, transferId),
			with: { pocket: true },
		});

		if (transactions.length !== 2 || transactions[0].pocket.userId !== userId) {
			throw new NotFoundError('Transfer transaction not found');
		}

		if (!isEditableTransaction(transactions[0].createdAt.toISOString())) {
			throw new InvariantError('Cannot update transaction older than 1 week');
		}

		const { fromPocketId, toPocketId, amount, description, date } = data;

		const outTx = transactions.find((t) => t.type === 'transfer_out');
		const inTx = transactions.find((t) => t.type === 'transfer_in');

		if (!outTx || !inTx) throw new InvariantError('Invalid transfer records');

		if (fromPocketId || toPocketId) {
			const newFrom = fromPocketId || outTx.pocketId;
			const newTo = toPocketId || inTx.pocketId;

			if (newFrom === newTo) {
				throw new InvariantError('Cannot transfer to the same pocket');
			}

			const pockets = await db.query.pocketsTable.findMany({
				where: and(
					inArray(pocketsTable.id, [newFrom, newTo]),
					eq(pocketsTable.userId, userId),
				),
			});

			if (pockets.length !== 2) {
				throw new InvariantError('Pockets not found or invalid');
			}

			outTx.pocketId = newFrom;
			outTx.relatedPocketId = newTo;

			inTx.pocketId = newTo;
			inTx.relatedPocketId = newFrom;
		}

		const amountStr = amount ? amount.toString() : undefined;
		const transactionDate = date ? new Date(date) : undefined;

		await db.transaction(async (tx) => {
			if (!outTx || !inTx) return;

			await tx
				.update(transactionsTable)
				.set({
					pocketId: outTx.pocketId,
					relatedPocketId: outTx.relatedPocketId,
					amount: amountStr ?? outTx.amount,
					description: description ?? outTx.description,
					date: transactionDate ?? outTx.date,
				})
				.where(eq(transactionsTable.id, outTx.id));

			await tx
				.update(transactionsTable)
				.set({
					pocketId: inTx.pocketId,
					relatedPocketId: inTx.relatedPocketId,
					amount: amountStr ?? inTx.amount,
					description: description ?? inTx.description,
					date: transactionDate ?? inTx.date,
				})
				.where(eq(transactionsTable.id, inTx.id));
		});

		return transferId;
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

		let deletedTransactions: { id: string }[];

		if (transaction.transferId) {
			deletedTransactions = await db
				.delete(transactionsTable)
				.where(eq(transactionsTable.transferId, transaction.transferId))
				.returning({
					id: transactionsTable.id,
				});
		} else {
			deletedTransactions = await db
				.delete(transactionsTable)
				.where(eq(transactionsTable.id, transactionId))
				.returning({
					id: transactionsTable.id,
				});
		}

		if (!deletedTransactions.length)
			throw new NotFoundError('Transaction not found');

		return deletedTransactions[0];
	}
}
