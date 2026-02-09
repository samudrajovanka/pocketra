import type { ReportPeriod } from '@/types/report';

export type GetReportSummaryParams = {
	period?: ReportPeriod;
	startDate?: string;
	endDate?: string;
};

export type GetExpenseReportParams = GetReportSummaryParams & {
	top?: number;
};

export type ReportSummaryResponse = {
	income: {
		value: string;
		growthPercent: number | null;
	};
	expense: {
		value: string;
		growthPercent: number | null;
	};
	net: {
		value: string;
		growthPercent: number | null;
	};
};

export type ExpenseByPocketResponse = {
	pocketId: string;
	name: string;
	amount: string;
	percentage: number;
}[];

export type ExpenseByCategoryResponse = {
	categoryId: string;
	name: string;
	amount: string;
	percentage: number;
}[];
