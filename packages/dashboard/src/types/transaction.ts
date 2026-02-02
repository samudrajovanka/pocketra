export type TransactionType = 'income' | 'expense';

export type Transaction = {
	id: string;
	pocketId: string;
	categoryId: string;
	type: TransactionType;
	amount: string;
	description: string | null;
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
