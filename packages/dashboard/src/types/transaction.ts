import type { TRANSACTION_TYPE } from '@/lib/constants/transactions';

export type TransactionType =
	(typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export type Transaction = {
	id: string;
	pocketId: string;
	categoryId: string;
	type: TransactionType;
	amount: string;
	description: string;
	date: string;
	createdAt: string;
	updatedAt: string;
	pocket: {
		id: string;
		name: string;
	};
	category: {
		id: string;
		name: string;
	};
};

export type TransferTransaction = Transaction & {
	transferId: string;
	relatedPocketId: string;
	relatedPocket: {
		id: string;
		name: string;
	};
};
