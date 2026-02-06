import type { ReportPeriod } from '@/types/report';

export type GetReportSummaryParams = {
	period?: ReportPeriod;
	startDate?: string;
	endDate?: string;
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
