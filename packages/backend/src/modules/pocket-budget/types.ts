import type { z } from 'zod';
import type { BUDGET_PERIOD } from './data';
import type { pocketBudgetsTable } from './pocket-budget.schema';
import type {
	createPocketBudgetValidator,
	pocketBudgetParamValidator,
	updatePocketBudgetValidator,
} from './pocket-budget.validator';

export type PocketBudget = typeof pocketBudgetsTable.$inferSelect;

export type CreatePocketBudgetPayload = z.infer<
	typeof createPocketBudgetValidator
>;

export type CreatePocketBudgetWithResetDate = CreatePocketBudgetPayload & {
	nextResetDate: string;
};

export type UpdatePocketBudgetPayload = z.infer<
	typeof updatePocketBudgetValidator
>;

export type UpdatePocketBudgetWithResetDate = UpdatePocketBudgetPayload & {
	nextResetDate?: Date;
};

export type PocketBudgetParam = z.infer<typeof pocketBudgetParamValidator>;

export type GetPocketBudgetParam = PocketBudgetParam;

export type PocketBudgetWithProgress = PocketBudget & {
	currentSpent: number;
	progressPercentage: number;
	remainingAmount: number;
	isOverBudget: boolean;
	shouldAlert: boolean;
};

export type BudgetPeriod = (typeof BUDGET_PERIOD)[keyof typeof BUDGET_PERIOD];
