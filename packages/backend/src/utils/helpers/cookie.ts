import type { Context } from 'hono';
import {
	deleteCookie as honoDeleteCookie,
	setCookie as honoSetCookie,
	setSignedCookie as honoSetSignedCookie,
} from 'hono/cookie';
import type { CookieOptions } from 'hono/utils/cookie';
import appConfig from '../../config/app';

const defaultOptions: CookieOptions = {
	httpOnly: true,
	secure: appConfig.isVercel,
	sameSite: appConfig.isVercel
		? appConfig.hasCookieDomain
			? 'lax'
			: 'none'
		: appConfig.hasCookieDomain
			? 'strict'
			: 'lax',
	domain: appConfig.hasCookieDomain ? process.env.COOKIE_DOMAIN : undefined,
	path: '/',
};

export const setSignedCookie = async (
	c: Context,
	name: string,
	value: string,
	secret: string,
	options?: CookieOptions,
) => {
	await honoSetSignedCookie(c, name, value, secret, {
		...defaultOptions,
		...options,
	});
};

export const setCookie = (
	c: Context,
	name: string,
	value: string,
	options?: CookieOptions,
) => {
	honoSetCookie(c, name, value, {
		...defaultOptions,
		...options,
	});
};

export const deleteCookie = (
	c: Context,
	name: string,
	options?: CookieOptions,
) => {
	honoDeleteCookie(c, name, {
		...defaultOptions,
		...options,
	});
};
