import { createMiddleware } from 'hono/factory';
import AuthenticationError from '../exceptions/AuthenticationError';
import { extractBearerToken } from '../utils/helpers/token';

export const cronSecurity = createMiddleware(async (c, next) => {
	const secret = extractBearerToken(c);

	const expectedSecret = process.env.CRON_SECRET;

	if (!expectedSecret) {
		throw new Error('CRON_SECRET environment variable is not set');
	}

	if (secret !== expectedSecret) {
		throw new AuthenticationError('Invalid CRON secret');
	}

	await next();
});
