import { z } from 'zod';
import { BUDGET_PERIOD } from '@/lib/constants/pockets';
import type { BudgetPeriod } from '@/types/budget';

export const createBudgetValidator = z.object({
	limitAmount: z.number().positive('Limit amount must be positive'),
	period: z
		.enum(
			Object.values(BUDGET_PERIOD) as [string, ...string[]],
			'Please select a valid budget period',
		)
		.default(BUDGET_PERIOD.monthly) as z.ZodType<BudgetPeriod>,
	alertThreshold: z
		.number()
		.min(1, 'Alert threshold must be at least 1%')
		.max(100, 'Alert threshold cannot exceed 100%')
		.default(80),
	periodStartDate: z.date('Please select a valid start date'),
});

export const updateBudgetValidator = z.object({
	limitAmount: z.coerce
		.number()
		.positive('Limit amount must be positive')
		.optional(),
	period: z
		.enum(
			Object.values(BUDGET_PERIOD) as [string, ...string[]],
			'Please select a valid budget period',
		)
		.optional() as z.ZodOptional<z.ZodType<BudgetPeriod>>,
	alertThreshold: z
		.number()
		.min(1, 'Alert threshold must be at least 1%')
		.max(100, 'Alert threshold cannot exceed 100%')
		.optional(),
});
