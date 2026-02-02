import { and, eq, sql } from 'drizzle-orm';
import { db } from '../../config/db';
import NotFoundError from '../../exceptions/NotFoundError';
import { pocketsTable } from './pocket.schema';
import type { PocketWithBalance } from './types';

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
			.returning();

		return pocket;
	}

	async getPockets(userId: string) {
		const pockets = await db.execute(sql`
			SELECT
				p.id,
				p.name,
				p.icon,
				p.created_at,
				p.updated_at,
				COALESCE(
					SUM(
						CASE
							WHEN t.type = 'income' THEN t.amount
							ELSE -t.amount
						END
					), 0
				) + p.initial_balance AS current_balance
			FROM pockets p
			LEFT JOIN transactions t ON p.id = t.pocket_id
			WHERE p.user_id = ${userId}
			GROUP BY p.id
			ORDER BY p.created_at DESC;
		`);

		const mappedPockets = pockets.rows.map(
			(pocket) =>
				({
					id: pocket.id,
					name: pocket.name,
					icon: pocket.icon,
					createdAt: pocket.created_at,
					updatedAt: pocket.updated_at,
					currentBalance: pocket.current_balance,
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
		const pockets = await db.execute(sql`
			SELECT
				p.id,
				p.name,
				p.icon,
				p.created_at,
				p.updated_at,
				COALESCE(
					SUM(
						CASE
							WHEN t.type = 'income' THEN t.amount
							ELSE -t.amount
						END
					), 0
				) + p.initial_balance AS current_balance
			FROM pockets p
			LEFT JOIN transactions t ON p.id = t.pocket_id
			WHERE p.user_id = ${userId} AND p.id = ${pocketId}
			GROUP BY p.id
		`);

		if (!pockets.rowCount) throw new NotFoundError('Pocket not found');

		const pocket = {
			id: pockets.rows[0].id,
			name: pockets.rows[0].name,
			icon: pockets.rows[0].icon,
			createdAt: pockets.rows[0].created_at,
			updatedAt: pockets.rows[0].updated_at,
			currentBalance: pockets.rows[0].current_balance,
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
			.returning();

		if (!pocket) throw new NotFoundError('Pocket not found');

		return pocket;
	}

	async deletePocket(userId: string, pocketId: string) {
		const [pocket] = await db
			.delete(pocketsTable)
			.where(
				and(eq(pocketsTable.id, pocketId), eq(pocketsTable.userId, userId)),
			)
			.returning();

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
								WHEN t.type = 'income' THEN t.amount
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
