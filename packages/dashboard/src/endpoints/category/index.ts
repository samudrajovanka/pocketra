import { apiClient } from '@/lib/apiClient';
import type { CategoryOptions } from '@/types/category';
import type { SuccessResponseData } from '@/types/response';

export const getCategories = async () => {
	return await apiClient.get<SuccessResponseData<CategoryOptions>>(
		'/categories',
	);
};
