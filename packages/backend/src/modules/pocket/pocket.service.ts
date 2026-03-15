import { and, eq } from 'drizzle-orm';
import { db } from '../../config/db';
import NotFoundError from '../../exceptions/NotFoundError';
import PocketRepository from './pocket.repository';
import { pocketsTable } from './pocket.schema';
import type {
	PayloadCreatePocket,
	PayloadGetPockets,
	PayloadUpdatePocket,
} from './types';

export default class PocketService {
	private repository = new PocketRepository();

	async createPocket(userId: string, data: PayloadCreatePocket) {
		const [pocket] = await db
			.insert(pocketsTable)
			.values({
				...data,
				initialBalance: data.initialBalance.toString(),
				userId,
			})
			.returning({
				id: pocketsTable.id,
			});

		return pocket;
	}

	async getPockets(userId: string, params?: PayloadGetPockets) {
		return this.repository.findPocketsWithBalance({
			userId,
			limit: params?.limit,
			sortBy: params?.sortBy,
		});
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
		const pockets = await this.repository.findPocketsWithBalance({
			userId,
			pocketId,
		});

		if (!pockets.length) throw new NotFoundError('Pocket not found');

		return pockets[0];
	}

	async updatePocket(
		userId: string,
		pocketId: string,
		data: PayloadUpdatePocket,
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
		return this.repository.getTotalBalance(userId);
	}
}
