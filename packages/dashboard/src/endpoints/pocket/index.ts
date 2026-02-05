import { apiClient } from '@/lib/apiClient';
import type { Pocket } from '@/types/pocket';
import type {
	SuccessGeneralResponse,
	SuccessResponseData,
} from '@/types/response';
import type {
	CreatePocketPayload,
	GetPocketsParams,
	UpdatePocketPayload,
} from './types';

export const getPockets = async (params?: GetPocketsParams) => {
	return await apiClient.get<SuccessResponseData<Pocket[]>>('/pockets', {
		params,
	});
};

export const getTotalBalance = async () => {
	return await apiClient.get<SuccessResponseData<{ totalBalance: string }>>(
		'/pockets/total-balance',
	);
};

export const getPocketOptions = async () => {
	return await apiClient.get<
		SuccessResponseData<{ id: string; name: string }[]>
	>('/pockets/options');
};

export const getPocketById = async (id: string) => {
	return await apiClient.get<SuccessResponseData<Pocket>>(`/pockets/${id}`);
};

export const createPocket = async (payload: CreatePocketPayload) => {
	return await apiClient.post<SuccessResponseData<Pocket>>('/pockets', payload);
};

export const updatePocket = async (
	id: string,
	payload: UpdatePocketPayload,
) => {
	return await apiClient.patch<SuccessResponseData<Pocket>>(
		`/pockets/${id}`,
		payload,
	);
};

export const deletePocket = async (id: string) => {
	return await apiClient.delete<SuccessGeneralResponse>(`/pockets/${id}`);
};
