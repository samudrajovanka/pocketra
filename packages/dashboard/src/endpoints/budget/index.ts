import { apiClient } from '@/lib/apiClient';
import type { BudgetWithProgress } from '@/types/budget';
import type {
	SuccessGeneralResponse,
	SuccessResponseData,
} from '@/types/response';
import type { CreateBudgetPayload, UpdateBudgetPayload } from './types';

export const getPocketBudget = async (pocketId: string) => {
	return await apiClient.get<SuccessResponseData<BudgetWithProgress>>(
		`/pockets/${pocketId}/budget`,
	);
};

export const createPocketBudget = async (
	pocketId: string,
	payload: CreateBudgetPayload,
) => {
	return await apiClient.post<SuccessResponseData<BudgetWithProgress>>(
		`/pockets/${pocketId}/budget`,
		payload,
	);
};

export const updatePocketBudget = async (
	pocketId: string,
	payload: UpdateBudgetPayload,
) => {
	return await apiClient.patch<SuccessResponseData<BudgetWithProgress>>(
		`/pockets/${pocketId}/budget`,
		payload,
	);
};

export const deletePocketBudget = async (pocketId: string) => {
	return await apiClient.delete<SuccessGeneralResponse>(
		`/pockets/${pocketId}/budget`,
	);
};
