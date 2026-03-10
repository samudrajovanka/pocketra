import { createMiddleware } from 'hono/factory';
import ForbiddenError from '../exceptions/ForbiddenError';

export const cronSecurity = createMiddleware(async (c, next) => {
	const authHeader = c.req.header('Authorization');

	if (!authHeader) {
		throw new ForbiddenError('Missing CRON secret');
	}

	const [type, secret] = authHeader.split(' ');

	if (type !== 'Bearer' || !secret) {
		throw new ForbiddenError('Invalid authorization format');
	}

	const expectedSecret = process.env.CRON_SECRET;

	if (!expectedSecret) {
		throw new Error('CRON_SECRET environment variable is not set');
	}

	if (secret !== expectedSecret) {
		throw new ForbiddenError('Invalid CRON secret');
	}

	await next();
});
