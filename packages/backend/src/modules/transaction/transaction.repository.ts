import { format } from 'date-fns';
import { and, desc, eq, gte, ilike, lte, type SQL, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '../../config/db';
import type { CursorPagination } from '../../utils/helpers/pagination';
import { categoriesTable } from '../category/category.schema';
import { pocketsTable } from '../pocket/pocket.schema';
import { transactionsTable } from './transaction.schema';
import type { PayloadGetTransactions } from './types';

export default class TransactionRepository {
	async findTransactionsWithRelations(conditions: SQL[], limit: number) {
		const relatedPocketsTable = alias(pocketsTable, 'relatedPocket');

		return db
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
			.orderBy(desc(transactionsTable.date))
			.limit(limit + 1);
	}

	async findTransactionWithRelationsById(transactionId: string) {
		return db.query.transactionsTable.findFirst({
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
	}

	async updateTransferPair(
		outTx: Pick<
			typeof transactionsTable.$inferSelect,
			'id' | 'pocketId' | 'relatedPocketId'
		>,
		inTx: Pick<
			typeof transactionsTable.$inferSelect,
			'id' | 'pocketId' | 'relatedPocketId'
		>,
		payload: Partial<
			Pick<
				typeof transactionsTable.$inferSelect,
				'amount' | 'description' | 'date'
			>
		>,
	) {
		await db.transaction(async (tx) => {
			await tx
				.update(transactionsTable)
				.set({
					pocketId: outTx.pocketId,
					relatedPocketId: outTx.relatedPocketId,
					...payload,
				})
				.where(eq(transactionsTable.id, outTx.id));

			await tx
				.update(transactionsTable)
				.set({
					pocketId: inTx.pocketId,
					relatedPocketId: inTx.relatedPocketId,
					...payload,
				})
				.where(eq(transactionsTable.id, inTx.id));
		});
	}

	buildListConditions(
		userId: string,
		params: PayloadGetTransactions & {
			pagination: Pick<CursorPagination, 'cursor'>;
		},
	) {
		const conditions: SQL[] = [eq(pocketsTable.userId, userId)];

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

		if (params.startDate) {
			conditions.push(
				gte(
					sql`DATE(${transactionsTable.date})`,
					format(params.startDate, 'yyyy-MM-dd'),
				),
			);
		}

		if (params.endDate) {
			conditions.push(
				lte(
					sql`DATE(${transactionsTable.date})`,
					format(params.endDate, 'yyyy-MM-dd'),
				),
			);
		}

		if (params.pagination.cursor) {
			conditions.push(lte(transactionsTable.id, params.pagination.cursor));
		}

		return conditions;
	}
}
