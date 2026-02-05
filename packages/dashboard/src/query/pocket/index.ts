import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { getTransactionsQueryKey } from '../transaction';

export const getPocketsQueryKey = (params?: GetPocketsParams) => {
	if (params) {
		return ['pockets', params];
	}
	return ['pockets'];
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

export const getPocketByIdQueryKey = (id: string) => ['pockets', id];

export const useGetPocketByIdQuery = (id: string) => {
	return useQuery({
		queryKey: getPocketByIdQueryKey(id),
		queryFn: () => getPocketById(id),
		enabled: !!id,
	});
};

export const useCreatePocketMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createPocket,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: getPocketsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getTotalBalanceQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getPocketOptionsQueryKey() }),
			]);
		},
	});
};

export const useUpdatePocketMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: UpdatePocketPayload;
		}) => updatePocket(id, payload),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: getPocketsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getTotalBalanceQueryKey() }),
				queryClient.invalidateQueries({
					queryKey: getPocketByIdQueryKey(variables.id),
				}),
				queryClient.invalidateQueries({ queryKey: getPocketOptionsQueryKey() }),
			]);
		},
	});
};

export const useDeletePocketMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deletePocket,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: getPocketsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getTotalBalanceQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getPocketOptionsQueryKey() }),
				queryClient.invalidateQueries({ queryKey: getTransactionsQueryKey() }),
			]);
		},
	});
};
