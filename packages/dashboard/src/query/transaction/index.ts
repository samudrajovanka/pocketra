import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import {
	createTransaction,
	deleteTransaction,
	getTransactionById,
	getTransactions,
	updateTransaction,
} from '@/endpoints/transaction';
import type { UpdateTransactionPayload } from '@/endpoints/transaction/types';
import type { CursorPaginationParams } from '@/types/pagination';
import { getPocketsQueryKey, getTotalBalanceQueryKey } from '../pocket';

export const getTransactionsQueryKey = (params?: CursorPaginationParams) => [
	'transactions',
	params,
];

export const getTransactionByIdQueryKey = (id: string) => ['transactions', id];

export const useGetInfiniteTransactionsQuery = (
	params?: CursorPaginationParams,
) => {
	return useInfiniteQuery({
		queryKey: getTransactionsQueryKey(params),
		queryFn: ({ pageParam }) =>
			getTransactions({ ...params, cursor: pageParam as string }),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.data.meta?.pagination?.nextCursor,
	});
};

export const useGetTransactionByIdQuery = (id: string) => {
	return useQuery({
		queryKey: getTransactionByIdQueryKey(id),
		queryFn: () => getTransactionById(id),
		enabled: !!id,
	});
};

export const useCreateTransactionMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createTransaction,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: getTransactionsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getPocketsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getTotalBalanceQueryKey() }),
			]);
		},
	});
};

export const useUpdateTransactionMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: UpdateTransactionPayload;
		}) => updateTransaction(id, payload),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: getTransactionsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getPocketsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getTotalBalanceQueryKey() }),
				queryClient.invalidateQueries({
					queryKey: getTransactionByIdQueryKey(variables.id),
				}),
			]);
		},
	});
};

export const useDeleteTransactionMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteTransaction,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: getTransactionsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getPocketsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getTotalBalanceQueryKey() }),
			]);
		},
	});
};
