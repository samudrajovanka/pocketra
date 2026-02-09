import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.clear();
		},
	});
};
