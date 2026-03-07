import { useQueryClient } from '@tanstack/react-query';
import {
	getPocketByIdQueryKey,
	getPocketOptionsQueryKey,
	getPocketsQueryKey,
	getTotalBalanceQueryKey,
} from '.';

export const useInvalidatePocketQueries = () => {
	const queryClient = useQueryClient();

	return async (options?: {
		pocketId?: string;
		invalidateTransactions?: boolean;
	}) => {
		const { pocketId, invalidateTransactions } = options || {};

		await Promise.all([
			queryClient.invalidateQueries({ queryKey: getPocketsQueryKey() }),
			queryClient.invalidateQueries({ queryKey: getTotalBalanceQueryKey() }),
			queryClient.invalidateQueries({ queryKey: getPocketOptionsQueryKey() }),
			...(pocketId
				? [
						queryClient.invalidateQueries({
							queryKey: getPocketByIdQueryKey(pocketId),
						}),
					]
				: []),
			...(invalidateTransactions
				? [
						queryClient.invalidateQueries({
							queryKey: ['transactions'],
						}),
					]
				: []),
		]);
	};
};
