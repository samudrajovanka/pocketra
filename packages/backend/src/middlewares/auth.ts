import { createMiddleware } from 'hono/factory';
import AuthenticationError from '../exceptions/AuthenticationError';
import AuthService from '../modules/auth/auth.service';
import type { LoggedUser } from '../modules/auth/types';

export const authMiddleware = createMiddleware<{
	Variables: {
		user: LoggedUser;
	};
}>(async (c, next) => {
	const authHeader = c.req.header('Authorization');

	if (!authHeader) {
		throw new AuthenticationError();
	}

	const [type, accessToken] = authHeader.split(' ');

	if (type !== 'Bearer' || !accessToken) {
		throw new AuthenticationError();
	}

	const authService = new AuthService();
	const user = await authService.getLoginUserFromAccessToken(accessToken);

	c.set('user', user);
	await next();
});
