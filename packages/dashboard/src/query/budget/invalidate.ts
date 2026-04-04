import { useQueryClient } from '@tanstack/react-query';
import { getPocketByIdQueryKey } from '../pocket';

export const useInvalidateBudgetQueries = () => {
	const queryClient = useQueryClient();

	return async (options?: { pocketId?: string }) => {
		if (options?.pocketId) {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['pockets', 'budget', options.pocketId],
				}),
				queryClient.invalidateQueries({
					queryKey: getPocketByIdQueryKey(options.pocketId),
				}),
			]);
		} else {
			await queryClient.invalidateQueries({
				queryKey: ['pockets', 'budget'],
			});
		}
	};
};
