export type GetReportSummaryParams = {
	startDate?: string;
	endDate?: string;
};

export type ReportSummaryResponse = {
	income: string;
	expense: string;
	net: string;
};
