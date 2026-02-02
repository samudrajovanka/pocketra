import type z from 'zod';
import type {
	payloadCreateTransactionValidator,
	payloadGetTransactionByIdValidator,
	payloadGetTransactionsValidator,
	payloadUpdateTransactionValidator,
} from './transaction.validator';

export type PayloadCreateTransaction = z.infer<
	typeof payloadCreateTransactionValidator
>;

export type PayloadGetTransactions = z.infer<
	typeof payloadGetTransactionsValidator
>;

export type PayloadGetTransactionById = z.infer<
	typeof payloadGetTransactionByIdValidator
>;

export type PayloadUpdateTransaction = z.infer<
	typeof payloadUpdateTransactionValidator
>;
