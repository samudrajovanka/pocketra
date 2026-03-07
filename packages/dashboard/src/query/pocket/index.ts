import { useMutation, useQuery } from '@tanstack/react-query';
import {
	createPocket,
	deletePocket,
	getPocketById,
	getPocketOptions,
	getPockets,
	getTotalBalance,
	updatePocket,
} from '@/endpoints/pocket';
import type {
	GetPocketsParams,
	UpdatePocketPayload,
} from '@/endpoints/pocket/types';
import { useInvalidatePocketQueries } from './invalidate';

export const getPocketsQueryKey = (params?: GetPocketsParams) => {
	if (params) {
		return ['pockets', 'list', params];
	}
	return ['pockets', 'list'];
};

export const useGetPocketsQuery = (state?: { params?: GetPocketsParams }) => {
	return useQuery({
		queryKey: getPocketsQueryKey(state?.params),
		queryFn: () => getPockets(state?.params),
	});
};

export const getTotalBalanceQueryKey = () => ['total-balance'];

export const useGetTotalBalanceQuery = () => {
	return useQuery({
		queryKey: getTotalBalanceQueryKey(),
		queryFn: getTotalBalance,
	});
};

export const getPocketOptionsQueryKey = () => ['pocket-options'];

export const useGetPocketOptionsQuery = () => {
	return useQuery({
		queryKey: getPocketOptionsQueryKey(),
		queryFn: getPocketOptions,
	});
};

export const getPocketByIdQueryKey = (id: string) => ['pockets', 'detail', id];

export const useGetPocketByIdQuery = (id: string) => {
	return useQuery({
		queryKey: getPocketByIdQueryKey(id),
		queryFn: () => getPocketById(id),
		enabled: !!id,
	});
};

export const useCreatePocketMutation = () => {
	const invalidatePocketQueries = useInvalidatePocketQueries();
	return useMutation({
		mutationFn: createPocket,
		onSuccess: async () => {
			await invalidatePocketQueries();
		},
	});
};

export const useUpdatePocketMutation = () => {
	const invalidatePocketQueries = useInvalidatePocketQueries();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: UpdatePocketPayload;
		}) => updatePocket(id, payload),
		onSuccess: async (_, variables) => {
			await invalidatePocketQueries({ pocketId: variables.id });
		},
	});
};

export const useDeletePocketMutation = () => {
	const invalidatePocketQueries = useInvalidatePocketQueries();
	return useMutation({
		mutationFn: deletePocket,
		onSuccess: async () => {
			await invalidatePocketQueries({ invalidateTransactions: true });
		},
	});
};
