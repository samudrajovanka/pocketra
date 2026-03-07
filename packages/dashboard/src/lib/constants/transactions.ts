export const TRANSACTION_TYPE = {
	income: 'income',
	expense: 'expense',
	transfer_in: 'transfer_in',
	transfer_out: 'transfer_out',
} as const;

export const TRANSACTION_TYPE_LABELS = {
	[TRANSACTION_TYPE.income]: 'Income',
	[TRANSACTION_TYPE.expense]: 'Expense',
	[TRANSACTION_TYPE.transfer_in]: 'Transfer In',
	[TRANSACTION_TYPE.transfer_out]: 'Transfer Out',
} as const;
