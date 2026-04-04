import type { BUDGET_PERIOD } from '@/lib/constants/pockets';

export type BudgetPeriod = (typeof BUDGET_PERIOD)[keyof typeof BUDGET_PERIOD];

type Budget = {
	id: string;
	pocketId: string;
	limitAmount: string;
	period: BudgetPeriod;
	alertThreshold: number;
	periodStartDate: string;
	nextResetDate: string;
	createdAt: string;
	updatedAt: string;
};

export type BudgetWithProgress = Budget & {
	currentSpent: number;
	progressPercentage: number;
	shouldAlert: boolean;
	isOverBudget: boolean;
};
