import z from 'zod';
import { validationMiddleware } from '../../middlewares/validation';
import { pocketType } from './data';

export const payloadCreatePocketValidator = z.object({
	name: z.string().min(1),
	icon: z.string().min(1),
	type: z
		.enum(Object.values(pocketType) as [string, ...string[]])
		.default(pocketType.Cash),
	color: z.string().nullable().optional(),
	initialBalance: z.number().min(0),
});

export const zPayloadreatePocketValidator = validationMiddleware(
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
	type: z.enum(Object.values(pocketType) as [string, ...string[]]).optional(),
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
