import { createFactory } from 'hono/factory';
import { authMiddleware } from '../../middlewares/auth';
import type { LoggedFactory } from '../../types/hono';
import { successResponse } from '../../utils/helpers/response';
import PocketService from './pocket.service';
import {
	zGetPocketByIdParamValidator,
	zPayloadCreatePocketValidator,
	zPayloadGetPocketsValidator,
	zPayloadUpdatePocketValidator,
} from './pocket.validator';
import type {
	GetPocketByIdParam,
	PayloadCreatePocket,
	PayloadGetPockets,
	PayloadUpdatePocket,
} from './types';

const { createHandlers } = createFactory<LoggedFactory>();

export const createPocket = createHandlers(
	authMiddleware,
	zPayloadCreatePocketValidator,
	async (c) => {
		const user = c.var.user;
		const payload = c.req.valid('json') as PayloadCreatePocket;
		const pocketService = new PocketService();

		const pocket = await pocketService.createPocket(user.id, payload);

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
	zGetPocketByIdParamValidator,
	async (c) => {
		const user = c.var.user;
		const { id: pocketId } = c.req.valid('param') as GetPocketByIdParam;
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
	zGetPocketByIdParamValidator,
	zPayloadUpdatePocketValidator,
	async (c) => {
		const user = c.var.user;
		const { id: pocketId } = c.req.valid('param') as GetPocketByIdParam;
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
	zGetPocketByIdParamValidator,
	async (c) => {
		const user = c.var.user;
		const { id: pocketId } = c.req.valid('param') as GetPocketByIdParam;
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
