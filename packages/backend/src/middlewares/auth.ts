import { getSignedCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import AuthenticationError from '../exceptions/AuthenticationError';
import AuthService from '../modules/auth/auth.service';
import type { LoggedUser } from '../modules/auth/types';

export const authMiddleware = createMiddleware<{
	Variables: {
		user: LoggedUser;
	};
}>(async (c, next) => {
	const ACCESS_TOKEN_SECRET_COOKIE = process.env
		.ACCESS_TOKEN_SECRET_COOKIE as string;
	const accessToken = await getSignedCookie(
		c,
		ACCESS_TOKEN_SECRET_COOKIE,
		'pocketra_access_token',
	);

	if (!accessToken) {
		throw new AuthenticationError();
	}

	const authService = new AuthService();
	const user = await authService.getLoginUserFromAccessToken(accessToken);

	c.set('user', user);
	await next();
});
