import { apiClient } from '@/lib/apiClient';
import type { SuccessResponseData } from '@/types/response';
import type {
	ExpenseByCategoryResponse,
	ExpenseByPocketResponse,
	GetExpenseReportParams,
	GetReportSummaryParams,
	ReportSummaryResponse,
} from './types';

export const getReportSummary = async (params?: GetReportSummaryParams) => {
	return await apiClient.get<SuccessResponseData<ReportSummaryResponse>>(
		'/reports/summary',
		{
			params,
		},
	);
};

export const getExpenseByPocket = async (params?: GetExpenseReportParams) => {
	return await apiClient.get<SuccessResponseData<ExpenseByPocketResponse>>(
		'/reports/expense-by-pocket',
		{
			params,
		},
	);
};

export const getExpenseByCategory = async (params?: GetExpenseReportParams) => {
	return await apiClient.get<SuccessResponseData<ExpenseByCategoryResponse>>(
		'/reports/expense-by-category',
		{
			params,
		},
	);
};
