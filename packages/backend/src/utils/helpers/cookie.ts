import type { CookieOptions } from 'hono/utils/cookie';
import appConfig from '../../config/app';

export const secureCookieOptions: CookieOptions = {
	httpOnly: true,
	secure: appConfig.isVercel,
	sameSite: 'strict',
	domain: appConfig.hasCookieDomain ? process.env.COOKIE_DOMAIN : undefined,
	path: '/',
};
