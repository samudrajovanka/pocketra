import { apiClient } from '@/lib/apiClient';
import type { CursorPaginationMeta } from '@/types/pagination';
import type { SuccessResponseData } from '@/types/response';
import type { Transaction } from '@/types/transaction';
import type {
	CreateTransactionPayload,
	GetTransactionsParams,
	UpdateTransactionPayload,
} from './types';

export const getTransactions = async (params?: GetTransactionsParams) => {
	return await apiClient.get<
		SuccessResponseData<Transaction[], CursorPaginationMeta>
	>('/transactions', {
		params,
	});
};

export const getTransactionById = async (id: string) => {
	return await apiClient.get<SuccessResponseData<Transaction>>(
		`/transactions/${id}`,
	);
};

export const createTransaction = async (payload: CreateTransactionPayload) => {
	return await apiClient.post<SuccessResponseData<Transaction>>(
		'/transactions',
		payload,
	);
};

export const updateTransaction = async (
	id: string,
	payload: UpdateTransactionPayload,
) => {
	return await apiClient.patch<SuccessResponseData<Transaction>>(
		`/transactions/${id}`,
		payload,
	);
};

export const deleteTransaction = async (id: string) => {
	return await apiClient.delete<SuccessResponseData<Transaction>>(
		`/transactions/${id}`,
	);
};
