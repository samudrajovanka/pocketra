import type { TransactionType } from './transaction';

export type Category = {
	id: string;
	name: string;
	type: TransactionType;
};

export type CategoryOptions = {
	income: Category[];
	expense: Category[];
};
