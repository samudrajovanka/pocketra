import { useMutation, useQuery } from '@tanstack/react-query';
import {
	createPocketBudget,
	deletePocketBudget,
	getPocketBudget,
	updatePocketBudget,
} from '@/endpoints/budget';
import type {
	CreateBudgetPayload,
	UpdateBudgetPayload,
} from '@/endpoints/budget/types';
import { useInvalidateBudgetQueries } from './invalidate';

export const getPocketBudgetQueryKey = (pocketId: string) => [
	'pockets',
	'budget',
	pocketId,
];

export const usePocketBudgetQuery = (pocketId: string) => {
	return useQuery({
		queryKey: getPocketBudgetQueryKey(pocketId),
		queryFn: () => getPocketBudget(pocketId),
		enabled: !!pocketId,
	});
};

export const useCreatePocketBudgetMutation = () => {
	const invalidateBudgetQueries = useInvalidateBudgetQueries();

	return useMutation({
		mutationFn: ({
			pocketId,
			payload,
		}: {
			pocketId: string;
			payload: CreateBudgetPayload;
		}) => createPocketBudget(pocketId, payload),
		onSuccess: async (_, variables) => {
			await invalidateBudgetQueries({ pocketId: variables.pocketId });
		},
	});
};

export const useUpdatePocketBudgetMutation = () => {
	const invalidateBudgetQueries = useInvalidateBudgetQueries();

	return useMutation({
		mutationFn: ({
			pocketId,
			payload,
		}: {
			pocketId: string;
			payload: UpdateBudgetPayload;
		}) => updatePocketBudget(pocketId, payload),
		onSuccess: async (_, variables) => {
			await invalidateBudgetQueries({ pocketId: variables.pocketId });
		},
	});
};

export const useDeletePocketBudgetMutation = () => {
	const invalidateBudgetQueries = useInvalidateBudgetQueries();

	return useMutation({
		mutationFn: (pocketId: string) => deletePocketBudget(pocketId),
		onSuccess: async (_, pocketId) => {
			await invalidateBudgetQueries({ pocketId });
		},
	});
};
