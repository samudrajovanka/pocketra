import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../../config/db';
import NotFoundError from '../../exceptions/NotFoundError';
import { transactionsTable } from '../transaction/transaction.schema';
import { pocketsTable } from './pocket.schema';
import type {
	GetPocketsWithBalanceParams,
	PayloadGetPockets,
	PocketWithBalance,
} from './types';

export default class PocketService {
	async createPocket(
		userId: string,
		data: { name: string; icon: string; initialBalance: string },
	) {
		const [pocket] = await db
			.insert(pocketsTable)
			.values({
				...data,
				userId,
			})
			.returning({
				id: pocketsTable.id,
			});

		return pocket;
	}

	private async getPocketsWithBalance(params?: GetPocketsWithBalanceParams) {
		const pocketsQuery = db
			.select({
				id: pocketsTable.id,
				name: pocketsTable.name,
				icon: pocketsTable.icon,
				createdAt: pocketsTable.createdAt,
				updatedAt: pocketsTable.updatedAt,
				currentBalance: sql<number>`
				COALESCE(
					SUM(
						CASE
							WHEN ${transactionsTable.type} IN ('income', 'transfer_in') THEN ${transactionsTable.amount}
							ELSE -${transactionsTable.amount}
						END
					), 0
				) + ${pocketsTable.initialBalance} AS current_balance
			`,
			})
			.from(pocketsTable)
			.leftJoin(
				transactionsTable,
				eq(pocketsTable.id, transactionsTable.pocketId),
			)
			.groupBy(pocketsTable.id)
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

		return await pocketsQuery;
	}

	async getPockets(userId: string, params?: PayloadGetPockets) {
		const pockets = await this.getPocketsWithBalance({
			userId,
			limit: params?.limit,
			sortBy: params?.sortBy,
		});

		const mappedPockets = pockets.map(
			(pocket) =>
				({
					id: pocket.id,
					name: pocket.name,
					icon: pocket.icon,
					createdAt: pocket.createdAt,
					updatedAt: pocket.updatedAt,
					currentBalance: pocket.currentBalance,
				}) as PocketWithBalance,
		);

		return mappedPockets;
	}

	async getPocketOptions(userId: string) {
		return await db.query.pocketsTable.findMany({
			where: eq(pocketsTable.userId, userId),
			columns: {
				id: true,
				name: true,
			},
		});
	}

	async getPocketById(userId: string, pocketId: string) {
		const pockets = await this.getPocketsWithBalance({
			userId,
			pocketId,
		});

		if (!pockets.length) throw new NotFoundError('Pocket not found');

		const pocket = {
			id: pockets[0].id,
			name: pockets[0].name,
			icon: pockets[0].icon,
			createdAt: pockets[0].createdAt,
			updatedAt: pockets[0].updatedAt,
			currentBalance: pockets[0].currentBalance,
		} as PocketWithBalance;

		return pocket;
	}
	async updatePocket(
		userId: string,
		pocketId: string,
		data: { name?: string; icon?: string },
	) {
		const [pocket] = await db
			.update(pocketsTable)
			.set(data)
			.where(
				and(eq(pocketsTable.id, pocketId), eq(pocketsTable.userId, userId)),
			)
			.returning({
				id: pocketsTable.id,
			});

		if (!pocket) throw new NotFoundError('Pocket not found');

		return pocket;
	}

	async deletePocket(userId: string, pocketId: string) {
		const [pocket] = await db
			.delete(pocketsTable)
			.where(
				and(eq(pocketsTable.id, pocketId), eq(pocketsTable.userId, userId)),
			)
			.returning({
				id: pocketsTable.id,
			});

		if (!pocket) throw new NotFoundError('Pocket not found');

		return pocket;
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
