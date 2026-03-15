import { createMiddleware } from 'hono/factory';
import AuthService from '../modules/auth/auth.service';
import type { LoggedUser } from '../modules/auth/types';
import { extractBearerToken } from '../utils/helpers/token';

export const authMiddleware = createMiddleware<{
	Variables: {
		user: LoggedUser;
	};
}>(async (c, next) => {
	const accessToken = extractBearerToken(c);

	const authService = new AuthService();
	const user = await authService.getLoginUserFromAccessToken(accessToken);

	c.set('user', user);
	await next();
});
