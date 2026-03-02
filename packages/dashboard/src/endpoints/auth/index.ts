import { apiClient } from '@/lib/apiClient';
import type {
	SuccessGeneralResponse,
	SuccessResponseData,
} from '@/types/response';
import type { User } from '@/types/user';
import type { AuthTokens } from './types';

export const getMe = async () => {
	return await apiClient.get<SuccessResponseData<User>>('/auth/me');
};

export const logout = async () => {
	return await apiClient.delete<SuccessGeneralResponse>('/auth/logout');
};

export const exchangeCode = async (code: string) => {
	return await apiClient.post<SuccessResponseData<AuthTokens>>(
		'/auth/exchange',
		{
			code,
		},
	);
};

export const refreshToken = async (refreshToken: string) => {
	return await apiClient.post<SuccessResponseData<AuthTokens>>(
		'/auth/refresh',
		{
			refreshToken,
		},
	);
};
