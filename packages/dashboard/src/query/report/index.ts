import { useQuery } from '@tanstack/react-query';
import {
	getExpenseByCategory,
	getExpenseByPocket,
	getReportSummary,
} from '@/endpoints/report';
import type {
	GetExpenseReportParams,
	GetReportSummaryParams,
} from '@/endpoints/report/types';

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

export const getExpenseByPocketQueryKey = (params?: GetExpenseReportParams) => {
	if (params) return ['report', 'expense-by-pocket', params];

	return ['report', 'expense-by-pocket'];
};

export const useGetExpenseByPocketQuery = (params?: GetExpenseReportParams) => {
	return useQuery({
		queryKey: getExpenseByPocketQueryKey(params),
		queryFn: () => getExpenseByPocket(params),
	});
};

export const getExpenseByCategoryQueryKey = (
	params?: GetExpenseReportParams,
) => {
	if (params) return ['report', 'expense-by-category', params];

	return ['report', 'expense-by-category'];
};

export const useGetExpenseByCategoryQuery = (
	params?: GetExpenseReportParams,
) => {
	return useQuery({
		queryKey: getExpenseByCategoryQueryKey(params),
		queryFn: () => getExpenseByCategory(params),
	});
};
