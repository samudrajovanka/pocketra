import z from 'zod';
import { TRANSACTION_TYPE } from '@/lib/constants/transactions';

export const createTransactionValidator = z.object({
	pocketId: z.uuidv7('Pocket is required'),
	categoryId: z.uuidv7('Category is required'),
	amount: z.number().positive('Amount must be positive'),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(255, 'Description must be at most 255 characters'),
	date: z.iso.datetime('Date is required'),
	type: z.enum(Object.values(TRANSACTION_TYPE)),
});

export const updateTransactionValidator = z.object({
	pocketId: z.uuidv7('Pocket is required'),
	categoryId: z.uuidv7('Category is required'),
	amount: z.number().positive('Amount must be positive'),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(255, 'Description must be at most 255 characters'),
	date: z.iso.datetime('Date is required'),
});

export const transferTransactionValidator = z.object({
	fromPocketId: z.string().min(1, 'Source Pocket is required'),
	toPocketId: z.string().min(1, 'Destination Pocket is required'),
	amount: z.number().positive('Amount must be positive'),
	description: z.string().max(255).min(1, 'Description is required'),
	date: z.iso.datetime('Date is required'),
});

export const updateTransferTransactionValidator = z.object({
	fromPocketId: z.string().min(1, 'Source Pocket is required'),
	toPocketId: z.string().min(1, 'Destination Pocket is required'),
	amount: z.number().positive('Amount must be positive'),
	description: z.string().max(255).min(1, 'Description is required'),
	date: z.iso.datetime('Date is required'),
});
