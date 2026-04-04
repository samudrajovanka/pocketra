import { createFactory } from 'hono/factory';
import { authMiddleware } from '../../middlewares/auth';
import type { LoggedFactory } from '../../types/hono';
import { successResponse } from '../../utils/helpers/response';
import PocketBudgetService from './pocket-budget.service';
import {
	zCreatePocketBudgetValidator,
	zGetPocketBudgetParamValidator,
	zUpdatePocketBudgetValidator,
} from './pocket-budget.validator';
import type {
	CreatePocketBudgetPayload,
	GetPocketBudgetParam,
	UpdatePocketBudgetPayload,
} from './types';

const { createHandlers } = createFactory<LoggedFactory>();

export const createPocketBudget = createHandlers(
	authMiddleware,
	zGetPocketBudgetParamValidator,
	zCreatePocketBudgetValidator,
	async (c) => {
		const user = c.var.user;
		const { pocketId } = c.req.valid('param') as GetPocketBudgetParam;
		const payload = c.req.valid('json') as CreatePocketBudgetPayload;
		const pocketBudgetService = new PocketBudgetService();

		const budget = await pocketBudgetService.createBudget(
			pocketId,
			user.id,
			payload,
		);

		return c.json(
			successResponse({
				message: 'Budget created successfully',
				data: budget,
			}),
		);
	},
);

export const getPocketBudget = createHandlers(
	authMiddleware,
	zGetPocketBudgetParamValidator,
	async (c) => {
		const user = c.var.user;
		const { pocketId } = c.req.valid('param') as GetPocketBudgetParam;
		const pocketBudgetService = new PocketBudgetService();

		const budget = await pocketBudgetService.getBudgetWithProgress(
			pocketId,
			user.id,
		);

		return c.json(
			successResponse({
				message: 'Budget retrieved successfully',
				data: budget,
			}),
		);
	},
);

export const updatePocketBudget = createHandlers(
	authMiddleware,
	zGetPocketBudgetParamValidator,
	zUpdatePocketBudgetValidator,
	async (c) => {
		const user = c.var.user;
		const { pocketId } = c.req.valid('param') as GetPocketBudgetParam;
		const payload = c.req.valid('json') as UpdatePocketBudgetPayload;
		const pocketBudgetService = new PocketBudgetService();

		const budget = await pocketBudgetService.updateBudget(
			pocketId,
			user.id,
			payload,
		);

		return c.json(
			successResponse({
				message: 'Budget updated successfully',
				data: budget,
			}),
		);
	},
);

export const deletePocketBudget = createHandlers(
	authMiddleware,
	zGetPocketBudgetParamValidator,
	async (c) => {
		const user = c.var.user;
		const { pocketId } = c.req.valid('param') as GetPocketBudgetParam;
		const pocketBudgetService = new PocketBudgetService();

		const budget = await pocketBudgetService.deleteBudget(pocketId, user.id);

		return c.json(
			successResponse({
				message: 'Budget deleted successfully',
				data: budget,
			}),
		);
	},
);
