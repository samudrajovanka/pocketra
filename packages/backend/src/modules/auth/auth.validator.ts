import z from 'zod';
import { validationMiddleware } from '../../middlewares/validation';

export const payloadExchangeCodeValidator = z.object({
	code: z.string().min(1),
});

export const zPayloadExchangeCodeValidator = validationMiddleware(
	'json',
	payloadExchangeCodeValidator,
);

export const payloadRefreshTokenValidator = z.object({
	refreshToken: z.string().min(1),
});

export const zPayloadRefreshTokenValidator = validationMiddleware(
	'json',
	payloadRefreshTokenValidator,
);

export const payloadLogoutValidator = z.object({
	refreshToken: z.string().min(1).optional(),
});

export const zPayloadLogoutValidator = validationMiddleware(
	'json',
	payloadLogoutValidator,
);
