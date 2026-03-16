import { format } from 'date-fns';
import type { Transaction, TransferTransaction } from '@/types/transaction';
import { ONE_WEEK_IN_MS } from '../constants/time';

export const isEditableTransaction = (createdAt: string) => {
	const oneWeekAgo = Date.now() - ONE_WEEK_IN_MS;
	return new Date(createdAt).getTime() >= oneWeekAgo;
};

export const groupTransactionsByMonth = (transactions: Transaction[]) => {
	const groupedTransactions = transactions.reduce(
		(groups, transaction) => {
			const date = new Date(transaction.date);
			const key = format(date, 'MMMM yyyy');
			if (!groups[key]) {
				groups[key] = [];
			}
			groups[key].push(transaction);
			return groups;
		},
		{} as Record<string, typeof transactions>,
	);

	return Object.entries(groupedTransactions).sort(
		(a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
	);
};

export const isTransferTransaction = (
	transaction: Transaction | TransferTransaction,
): transaction is TransferTransaction => {
	return 'transferId' in transaction && transaction.transferId !== null;
};
