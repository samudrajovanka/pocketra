import { useQueryClient } from '@tanstack/react-query';
import { getPocketByIdQueryKey, getTotalBalanceQueryKey } from '../pocket';
import { getTransactionByIdQueryKey, getTransactionsQueryKey } from '.';

export const useInvalidateTransactionQueries = () => {
	const queryClient = useQueryClient();

	return async (options?: { transactionId?: string }) => {
		const { transactionId } = options || {};

		await Promise.all([
			queryClient.invalidateQueries({ queryKey: getTransactionsQueryKey() }),
			queryClient.invalidateQueries({ queryKey: ['pockets'] }),
			queryClient.invalidateQueries({ queryKey: getTotalBalanceQueryKey() }),
			queryClient.invalidateQueries({ queryKey: ['report'] }),
			...(transactionId
				? [
						queryClient.invalidateQueries({
							queryKey: getTransactionByIdQueryKey(transactionId),
						}),
					]
				: []),
		]);
	};
};

export const useInvalidateTransferTransactionQueries = () => {
	const queryClient = useQueryClient();
	const invalidateTransactionQueries = useInvalidateTransactionQueries();

	return async (payload: { fromPocketId: string; toPocketId: string }) => {
		await Promise.all([
			invalidateTransactionQueries(),
			queryClient.invalidateQueries({
				queryKey: getPocketByIdQueryKey(payload.fromPocketId),
			}),
			queryClient.invalidateQueries({
				queryKey: getPocketByIdQueryKey(payload.toPocketId),
			}),
		]);
	};
};
