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
	categoryId: z.uuidv7('Category is required').optional(),
	pocketId: z.uuidv7('Pocket is required').optional(),
	amount: z.number().positive('Amount must be positive').optional(),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(255, 'Description must be at most 255 characters')
		.optional(),
	date: z.iso.datetime('Date is required').optional(),
});
