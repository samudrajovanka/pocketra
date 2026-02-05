import { apiClient } from '@/lib/apiClient';
import type { SuccessResponseData } from '@/types/response';
import type { GetReportSummaryParams, ReportSummaryResponse } from './types';

export const getReportSummary = async (params?: GetReportSummaryParams) => {
	return await apiClient.get<SuccessResponseData<ReportSummaryResponse>>(
		'/reports/summary',
		{
			params,
		},
	);
};
