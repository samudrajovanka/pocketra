import { z } from 'zod';
import { validationMiddleware } from '../../middlewares/validation';
import { BUDGET_PERIOD } from './data';
import type { BudgetPeriod } from './types';

export const createPocketBudgetValidator = z.object({
	limitAmount: z.number().positive(),
	period: z.enum(
		Object.values(BUDGET_PERIOD) as [string, ...string[]],
	) as z.ZodType<BudgetPeriod>,
	alertThreshold: z.number().min(0.1).max(1.0).default(0.8),
	periodStartDate: z.coerce.date(),
});

export const zCreatePocketBudgetValidator = validationMiddleware(
	'json',
	createPocketBudgetValidator,
);

export const updatePocketBudgetValidator = z.object({
	limitAmount: z.number().positive().optional(),
	period: z
		.enum(Object.values(BUDGET_PERIOD) as [string, ...string[]])
		.optional() as z.ZodOptional<z.ZodType<BudgetPeriod>>,
	alertThreshold: z.number().min(0.1).max(1.0).optional(),
});

export const zUpdatePocketBudgetValidator = validationMiddleware(
	'json',
	updatePocketBudgetValidator,
);

export const pocketBudgetParamValidator = z.object({
	pocketId: z.string().uuid(),
});

export const zGetPocketBudgetParamValidator = validationMiddleware(
	'param',
	pocketBudgetParamValidator,
);
