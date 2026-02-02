import { useMutation, useQuery } from '@tanstack/react-query';
import { getMe, logout } from '@/endpoints/auth';

export const getMeQueryKey = () => {
	return ['me'];
};

export const useGetMeQuery = () =>
	useQuery({
		queryKey: getMeQueryKey(),
		queryFn: getMe,
	});

export const useLogoutMutation = () => {
	return useMutation({
		mutationFn: logout,
	});
};
