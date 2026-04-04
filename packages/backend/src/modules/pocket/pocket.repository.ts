import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../../config/db';
import { pocketBudgetsTable } from '../pocket-budget/pocket-budget.schema';
import { transactionsTable } from '../transaction/transaction.schema';
import { pocketsTable } from './pocket.schema';
import type { GetPocketsWithBalanceParams, PocketWithBalance } from './types';

const balanceSql = sql<number>`
	COALESCE(
		SUM(
			CASE
				WHEN ${transactionsTable.type} IN ('income', 'transfer_in') THEN ${transactionsTable.amount}
				ELSE -${transactionsTable.amount}
			END
		), 0
	) + ${pocketsTable.initialBalance} AS current_balance
`;

export default class PocketRepository {
	async findPocketsWithBalance(params?: GetPocketsWithBalanceParams) {
		const pocketsQuery = db
			.select({
				id: pocketsTable.id,
				name: pocketsTable.name,
				icon: pocketsTable.icon,
				type: pocketsTable.type,
				color: pocketsTable.color,
				createdAt: pocketsTable.createdAt,
				updatedAt: pocketsTable.updatedAt,
				currentBalance: balanceSql,
				hasBudget: sql<boolean>`CASE WHEN ${pocketBudgetsTable.id} IS NOT NULL THEN true ELSE false END`,
			})
			.from(pocketsTable)
			.leftJoin(
				transactionsTable,
				eq(pocketsTable.id, transactionsTable.pocketId),
			)
			.leftJoin(
				pocketBudgetsTable,
				eq(pocketsTable.id, pocketBudgetsTable.pocketId),
			)
			.groupBy(pocketsTable.id, pocketBudgetsTable.id)
			.orderBy(
				params?.sortBy === 'balance'
					? sql`current_balance DESC`
					: desc(pocketsTable.createdAt),
			);

		const conditions = [];

		if (params?.userId) {
			conditions.push(eq(pocketsTable.userId, params.userId));
		}

		if (params?.pocketId) {
			conditions.push(eq(pocketsTable.id, params.pocketId));
		}

		pocketsQuery.where(and(...conditions));

		if (params?.limit !== undefined) {
			pocketsQuery.limit(params.limit);
		}

		return (await pocketsQuery) as PocketWithBalance[];
	}

	async getTotalBalance(userId: string) {
		const result = await db.execute(sql`
			SELECT
				COALESCE(SUM(current_balance), 0) as total_balance
			FROM (
				SELECT
					COALESCE(
						SUM(
							CASE
								WHEN t.type IN ('income', 'transfer_in') THEN t.amount
								ELSE -t.amount
							END
						), 0
					) + p.initial_balance AS current_balance
				FROM pockets p
				LEFT JOIN transactions t ON p.id = t.pocket_id
				WHERE p.user_id = ${userId}
				GROUP BY p.id
			) as balances
		`);

		return {
			totalBalance: result.rows[0]?.total_balance || 0,
		};
	}
}
