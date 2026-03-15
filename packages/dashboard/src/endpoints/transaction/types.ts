import type z from 'zod';
import type { CursorPaginationParams } from '@/types/pagination';
import type { TransactionType } from '@/types/transaction';
import type {
	createTransactionValidator,
	transferTransactionValidator,
	updateTransactionValidator,
	updateTransferTransactionValidator,
} from './validator';

export type GetTransactionsParams = CursorPaginationParams & {
	pocketId?: string;
	type?: TransactionType;
	description?: string;
	minAmount?: number;
	maxAmount?: number;
	startDate?: Date;
	endDate?: Date;
};

export type CreateTransactionPayload = z.infer<
	typeof createTransactionValidator
>;

export type UpdateTransactionPayload = z.infer<
	typeof updateTransactionValidator
>;

export type TransferTransactionPayload = z.infer<
	typeof transferTransactionValidator
>;

export type UpdateTransferTransactionPayload = z.infer<
	typeof updateTransferTransactionValidator
>;
