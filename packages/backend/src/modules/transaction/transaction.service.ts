import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../../config/db';
import InvariantError from '../../exceptions/InvariantError';
import NotFoundError from '../../exceptions/NotFoundError';
import {
	type CursorPagination,
	generateCursorPaginationMetaResponse,
} from '../../utils/helpers/pagination';
import { categoriesTable } from '../category/category.schema';
import { pocketsTable } from '../pocket/pocket.schema';
import TransactionRepository from './transaction.repository';
import { transactionsTable } from './transaction.schema';
import { generateTransferId, isEditableTransaction } from './transaction.utils';
import type {
	PayloadCreateTransaction,
	PayloadGetTransactions,
	PayloadTransferTransaction,
	PayloadUpdateTransaction,
	PayloadUpdateTransferTransaction,
} from './types';

export default class TransactionService {
	private repository = new TransactionRepository();

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
			columns: {
				id: true,
			},
		});

		if (pockets.length !== 2) {
			throw new InvariantError(
				'One or both pockets not found or do not belong to you',
			);
		}

		const categories = await db.query.categoriesTable.findMany({
			where: inArray(categoriesTable.type, ['transfer_in', 'transfer_out']),
			columns: {
				id: true,
				type: true,
			},
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
			columns: {
				id: true,
			},
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
		const conditions = this.repository.buildListConditions(userId, params);
		const limit = params.pagination?.limit || 10;

		const rawTransactions = await this.repository.findTransactionsWithRelations(
			conditions,
			limit,
		);

		let nextCursor: string | null = null;
		if (rawTransactions.length > limit) {
			const nextItem = rawTransactions.pop();
			nextCursor = nextItem?.transaction.id || null;
		}

		const transactions = rawTransactions.map((row) => ({
			...row.transaction,
			pocket: row.pocket,
			relatedPocket: row.relatedPocket,
			category: row.category,
		}));

		return {
			data: transactions,
			meta: {
				pagination: generateCursorPaginationMetaResponse(
					params.pagination,
					nextCursor,
				),
			},
		};
	}

	async getTransactionById(userId: string, transactionId: string) {
		const transaction =
			await this.repository.findTransactionWithRelationsById(transactionId);

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
				pocket: {
					columns: {
						userId: true,
					},
				},
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
				columns: {
					type: true,
				},
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
				columns: {
					userId: true,
				},
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
			with: {
				pocket: {
					columns: {
						userId: true,
					},
				},
			},
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
			const newFromPocketId = fromPocketId || outTx.pocketId;
			const newToPocketId = toPocketId || inTx.pocketId;

			if (newFromPocketId === newToPocketId) {
				throw new InvariantError('Cannot transfer to the same pocket');
			}

			const pockets = await db.query.pocketsTable.findMany({
				where: and(
					inArray(pocketsTable.id, [newFromPocketId, newToPocketId]),
					eq(pocketsTable.userId, userId),
				),
				columns: {
					id: true,
				},
			});

			if (pockets.length !== 2) {
				throw new InvariantError('Pockets not found or invalid');
			}

			outTx.pocketId = newFromPocketId;
			outTx.relatedPocketId = newToPocketId;

			inTx.pocketId = newToPocketId;
			inTx.relatedPocketId = newFromPocketId;
		}

		const amountStr = amount ? amount.toString() : undefined;
		const transactionDate = date ? new Date(date) : undefined;

		await this.repository.updateTransferPair(
			{
				id: outTx.id,
				pocketId: outTx.pocketId,
				relatedPocketId: outTx.relatedPocketId,
			},
			{
				id: inTx.id,
				pocketId: inTx.pocketId,
				relatedPocketId: inTx.relatedPocketId,
			},
			{
				amount: amountStr,
				description: description ?? undefined,
				date: transactionDate,
			},
		);

		return transferId;
	}

	async deleteTransaction(userId: string, transactionId: string) {
		const transaction = await db.query.transactionsTable.findFirst({
			where: eq(transactionsTable.id, transactionId),
			with: {
				pocket: {
					columns: {
						userId: true,
					},
				},
			},
			columns: {
				transferId: true,
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
