import { useQuery } from '@tanstack/react-query';
import { getReportSummary } from '@/endpoints/report';
import type { GetReportSummaryParams } from '@/endpoints/report/types';

export const getReportSummaryQueryKey = (params?: GetReportSummaryParams) => {
	if (params) return ['report', 'summary', params];

	return ['report', 'summary'];
};

export const useGetReportSummaryQuery = (params?: GetReportSummaryParams) => {
	return useQuery({
		queryKey: getReportSummaryQueryKey(params),
		queryFn: () => getReportSummary(params),
	});
};
