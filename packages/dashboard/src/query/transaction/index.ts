import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import {
	createTransaction,
	deleteTransaction,
	getTransactionById,
	getTransactions,
	transferTransaction,
	updateTransaction,
	updateTransferTransaction,
} from '@/endpoints/transaction';
import type {
	UpdateTransactionPayload,
	UpdateTransferTransactionPayload,
} from '@/endpoints/transaction/types';
import type { CursorPaginationParams } from '@/types/pagination';
import {
	useInvalidateTransactionQueries,
	useInvalidateTransferTransactionQueries,
} from './invalidate';

export const getTransactionsQueryKey = (params?: CursorPaginationParams) => {
	if (params) return ['transactions', 'list', params];

	return ['transactions', 'list'];
};

export const useGetInfiniteTransactionsQuery = (state?: {
	params?: CursorPaginationParams;
}) => {
	return useInfiniteQuery({
		queryKey: getTransactionsQueryKey(state?.params),
		queryFn: ({ pageParam }) =>
			getTransactions({ ...state?.params, cursor: pageParam as string }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.data.meta?.pagination?.nextCursor,
	});
};

export const getTransactionByIdQueryKey = (id: string) => [
	'transactions',
	'detail',
	id,
];

export const useGetTransactionByIdQuery = (id: string) => {
	return useQuery({
		queryKey: getTransactionByIdQueryKey(id),
		queryFn: () => getTransactionById(id),
		enabled: !!id,
	});
};

export const useGetTransactionsQuery = (state?: {
	params?: CursorPaginationParams;
}) => {
	return useQuery({
		queryKey: getTransactionsQueryKey(state?.params),
		queryFn: () => getTransactions(state?.params),
	});
};

export const useCreateTransactionMutation = () => {
	const invalidateTransactionQueries = useInvalidateTransactionQueries();
	return useMutation({
		mutationFn: createTransaction,
		onSuccess: async () => {
			await invalidateTransactionQueries();
		},
	});
};

export const useUpdateTransactionMutation = () => {
	const invalidateTransactionQueries = useInvalidateTransactionQueries();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: UpdateTransactionPayload;
		}) => updateTransaction(id, payload),
		onSuccess: async (_, variables) => {
			await invalidateTransactionQueries({ transactionId: variables.id });
		},
	});
};

export const useDeleteTransactionMutation = () => {
	const invalidateTransactionQueries = useInvalidateTransactionQueries();
	return useMutation({
		mutationFn: deleteTransaction,
		onSuccess: async (_, variables) => {
			await invalidateTransactionQueries({ transactionId: variables });
		},
	});
};

export const useTransferTransactionMutation = () => {
	const invalidateTransferTransactionQueries =
		useInvalidateTransferTransactionQueries();
	return useMutation({
		mutationFn: transferTransaction,
		onSuccess: async (_, payload) => {
			await invalidateTransferTransactionQueries({
				fromPocketId: payload.fromPocketId,
				toPocketId: payload.toPocketId,
			});
		},
	});
};

export const useUpdateTransferTransactionMutation = () => {
	const invalidateTransactionQueries = useInvalidateTransactionQueries();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: UpdateTransferTransactionPayload;
		}) => updateTransferTransaction(id, payload),
		onSuccess: async (_, variables) => {
			await invalidateTransactionQueries({ transactionId: variables.id });
		},
	});
};
