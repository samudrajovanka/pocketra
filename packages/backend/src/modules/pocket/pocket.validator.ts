import z from 'zod';
import { validationMiddleware } from '../../middlewares/validation';
import { POCKET_TYPE } from './data';
import type { PocketType } from './types';

export const payloadCreatePocketValidator = z.object({
	name: z.string().min(1),
	icon: z.string().min(1),
	type: z
		.enum(Object.values(POCKET_TYPE) as [string, ...string[]])
		.default(POCKET_TYPE.Cash) as z.ZodType<PocketType>,
	color: z.string().nullable().optional(),
	initialBalance: z.number().min(0),
});

export const zPayloadCreatePocketValidator = validationMiddleware(
	'json',
	payloadCreatePocketValidator,
);

export const GetPocketByIdParamValidator = z.object({
	id: z.uuidv7(),
});

export const zGetPocketByIdParamValidator = validationMiddleware(
	'param',
	GetPocketByIdParamValidator,
);

export const payloadUpdatePocketValidator = z.object({
	name: z.string().optional(),
	icon: z.string().optional(),
	type: z
		.enum(Object.values(POCKET_TYPE) as [string, ...string[]])
		.optional() as z.ZodOptional<z.ZodType<PocketType>>,
	color: z.string().nullable().optional(),
});

export const zPayloadUpdatePocketValidator = validationMiddleware(
	'json',
	payloadUpdatePocketValidator,
);

export const payloadGetPocketsValidator = z.object({
	limit: z.string().transform(Number).optional(),
	sortBy: z.enum(['balance']).optional(),
});

export const zPayloadGetPocketsValidator = validationMiddleware(
	'query',
	payloadGetPocketsValidator,
);
