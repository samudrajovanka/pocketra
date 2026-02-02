import { apiClient } from '@/lib/apiClient';
import type {
	SuccessGeneralResponse,
	SuccessResponseData,
} from '@/types/response';
import type { User } from '@/types/user';

export const getMe = async () => {
	return await apiClient.get<SuccessResponseData<User>>('/auth/me');
};

export const logout = async () => {
	return await apiClient.delete<SuccessGeneralResponse>('/auth/logout');
};
