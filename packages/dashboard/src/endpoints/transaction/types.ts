import type z from 'zod';
import type { CursorPaginationParams } from '@/types/pagination';
import type { TransactionType } from '@/types/transaction';
import type {
	createTransactionValidator,
	updateTransactionValidator,
} from './validator';

export type GetTransactionsParams = CursorPaginationParams & {
	pocketId?: string;
	type?: TransactionType;
	description?: string;
	minAmount?: number;
	maxAmount?: number;
};

export type CreateTransactionPayload = z.infer<
	typeof createTransactionValidator
>;

export type UpdateTransactionPayload = z.infer<
	typeof updateTransactionValidator
>;
