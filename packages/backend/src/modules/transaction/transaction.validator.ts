import { cursorPaginationParamsValidator } from 'src/utils/validators/paginationParams';
import z from 'zod';
import { validationMiddleware } from '../../middlewares/validation';
import { TRANSACTION_TYPE } from './data';

export const payloadCreateTransactionValidator = z.object({
	pocketId: z.uuidv7(),
	categoryId: z.uuidv7(),
	amount: z.number().positive(),
	description: z.string().max(255),
	date: z.iso.datetime(),
	type: z.enum(Object.values(TRANSACTION_TYPE)).default('expense'),
});

export const zPayloadCreateTransactionValidator = validationMiddleware(
	'json',
	payloadCreateTransactionValidator,
);

export const payloadGetTransactionsValidator = z.object({
	pocketId: z.uuidv7().optional(),
	type: z.enum(Object.values(TRANSACTION_TYPE)).optional(),
	description: z.string().optional(),
	minAmount: z.coerce.number().optional(),
	maxAmount: z.coerce.number().optional(),
});

export const zPayloadGetTransactionsValidator = validationMiddleware(
	'query',
	payloadGetTransactionsValidator.extend(cursorPaginationParamsValidator.shape),
);

export const payloadGetTransactionByIdValidator = z.object({
	id: z.uuidv7(),
});

export const zPayloadGetTransactionByIdValidator = validationMiddleware(
	'param',
	payloadGetTransactionByIdValidator,
);

export const payloadUpdateTransactionValidator = z.object({
	categoryId: z.uuidv7().optional(),
	pocketId: z.uuidv7().optional(),
	amount: z.number().positive().optional(),
	description: z.string().optional(),
	date: z.iso.datetime().optional(),
});

export const zPayloadUpdateTransactionValidator = validationMiddleware(
	'json',
	payloadUpdateTransactionValidator,
);
