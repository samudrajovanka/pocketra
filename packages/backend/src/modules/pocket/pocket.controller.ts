import { createFactory } from 'hono/factory';
import { authMiddleware } from 'src/middlewares/auth';
import { successResponse } from '../../utils/helpers/response';
import type { LoggedUser } from '../auth/types';
import PocketService from './pocket.service';
import {
	zPayloadGetPocketByIdValidator,
	zPayloadGetPocketsValidator,
	zPayloadreatePocketValidator,
	zPayloadUpdatePocketValidator,
} from './pocket.validator';
import type {
	PayloadCreatePocket,
	PayloadGetPocketById,
	PayloadGetPockets,
	PayloadUpdatePocket,
} from './types';

const { createHandlers } = createFactory<{ Variables: { user: LoggedUser } }>();

export const createPocket = createHandlers(
	authMiddleware,
	zPayloadreatePocketValidator,
	async (c) => {
		const user = c.var.user;
		const payload = c.req.valid('json') as PayloadCreatePocket;
		const pocketService = new PocketService();

		const pocket = await pocketService.createPocket(user.id, {
			name: payload.name,
			icon: payload.icon,
			initialBalance: payload.initialBalance.toString(),
		});

		return c.json(
			successResponse({
				message: 'Success create pocket',
				data: pocket,
			}),
		);
	},
);

export const getPockets = createHandlers(
	authMiddleware,
	zPayloadGetPocketsValidator,
	async (c) => {
		const user = c.var.user;
		const params = c.req.valid('query') as PayloadGetPockets;

		const pocketService = new PocketService();
		const pockets = await pocketService.getPockets(user.id, params);

		return c.json(
			successResponse({
				message: 'Success get list pockets',
				data: pockets,
			}),
		);
	},
);

export const getPocketOptions = createHandlers(authMiddleware, async (c) => {
	const user = c.var.user;
	const pocketService = new PocketService();
	const pockets = await pocketService.getPocketOptions(user.id);

	return c.json(
		successResponse({
			message: 'Success get pocket options',
			data: pockets,
		}),
	);
});

export const getPocketById = createHandlers(
	authMiddleware,
	zPayloadGetPocketByIdValidator,
	async (c) => {
		const user = c.var.user;
		const { id: pocketId } = c.req.valid('param') as PayloadGetPocketById;
		const pocketService = new PocketService();
		const pocket = await pocketService.getPocketById(user.id, pocketId);

		return c.json(
			successResponse({
				message: 'Success get pocket detail',
				data: pocket,
			}),
		);
	},
);

export const updatePocket = createHandlers(
	authMiddleware,
	zPayloadGetPocketByIdValidator,
	zPayloadUpdatePocketValidator,
	async (c) => {
		const user = c.var.user;
		const { id: pocketId } = c.req.valid('param') as PayloadGetPocketById;
		const body = c.req.valid('json') as PayloadUpdatePocket;
		const pocketService = new PocketService();

		const pocket = await pocketService.updatePocket(user.id, pocketId, body);

		return c.json(
			successResponse({
				message: 'Success update pocket',
				data: pocket,
			}),
		);
	},
);

export const deletePocket = createHandlers(
	authMiddleware,
	zPayloadGetPocketByIdValidator,
	async (c) => {
		const user = c.var.user;
		const { id: pocketId } = c.req.valid('param') as PayloadGetPocketById;
		const pocketService = new PocketService();

		const pocket = await pocketService.deletePocket(user.id, pocketId);

		return c.json(
			successResponse({
				message: 'Success delete pocket',
				data: pocket,
			}),
		);
	},
);

export const getTotalBalance = createHandlers(authMiddleware, async (c) => {
	const user = c.var.user;
	const pocketService = new PocketService();
	const result = await pocketService.getTotalBalance(user.id);

	return c.json(
		successResponse({
			message: 'Success get total balance',
			data: result,
		}),
	);
});
