import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/endpoints/category';

export const getCategoriesQueryKey = () => ['categories'];

export const useGetCategoriesQuery = () => {
	return useQuery({
		queryKey: getCategoriesQueryKey(),
		queryFn: getCategories,
	});
};
