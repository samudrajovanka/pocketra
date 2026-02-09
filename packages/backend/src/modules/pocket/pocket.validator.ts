import z from 'zod';
import { validationMiddleware } from '../../middlewares/validation';

export const payloadCreatePocketValidator = z.object({
	name: z.string().min(1),
	icon: z.string().min(1),
	initialBalance: z.number().min(0),
});

export const zPayloadreatePocketValidator = validationMiddleware(
	'json',
	payloadCreatePocketValidator,
);

export const payloadGetPocketByIdValidator = z.object({
	id: z.uuidv7(),
});

export const zPayloadGetPocketByIdValidator = validationMiddleware(
	'param',
	payloadGetPocketByIdValidator,
);

export const payloadUpdatePocketValidator = z.object({
	name: z.string().min(1).optional(),
	icon: z.string().min(1).optional(),
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
