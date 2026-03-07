import type z from 'zod';
import type {
	payloadCreateTransactionValidator,
	payloadGetTransactionByIdValidator,
	payloadGetTransactionsValidator,
	payloadTransferIdValidator,
	payloadTransferTransactionValidator,
	payloadUpdateTransactionValidator,
	payloadUpdateTransferTransactionValidator,
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

export type PayloadTransferTransaction = z.infer<
	typeof payloadTransferTransactionValidator
>;

export type PayloadTransferId = z.infer<typeof payloadTransferIdValidator>;

export type PayloadUpdateTransferTransaction = z.infer<
	typeof payloadUpdateTransferTransactionValidator
>;
