/** biome-ignore-all lint/suspicious/noDocumentCookie: use document cookie */

import { createIsomorphicFn } from '@tanstack/react-start';
import {
	getCookie as getCookieStart,
	getRequest,
	setCookie as setCookieStart,
} from '@tanstack/react-start/server';
import type { AuthTokens } from '@/endpoints/auth/types';
import {
	COOKIE_ACCESS_TOKEN,
	COOKIE_REFRESH_TOKEN,
} from '@/lib/constants/cookie';
import { deleteCookieServer, setCookieServer } from '@/serverFn/cookie';

export type CookieOptions = {
	maxAge?: number;
	path?: string;
	sameSite?: 'strict' | 'lax' | 'none';
	secure?: boolean;
	httpOnly?: boolean;
	domain?: string;
	expires?: Date;
};

type SetCookieData = {
	name: string;
	value: string;
	options?: CookieOptions;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const buildCookieString = (
	name: string,
	value: string,
	options?: CookieOptions,
): string => {
	const {
		path = '/',
		sameSite = 'strict',
		secure = true,
		maxAge,
		httpOnly,
		domain,
		expires,
	} = options ?? {};

	const parts = [`${name}=${value}`];

	if (path) parts.push(`Path=${path}`);
	if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);
	if (expires) parts.push(`Expires=${expires.toUTCString()}`);
	if (domain) parts.push(`Domain=${domain}`);
	if (sameSite) parts.push(`SameSite=${capitalize(sameSite)}`);
	if (secure) parts.push('Secure');
	if (httpOnly) parts.push('HttpOnly');

	return parts.join('; ');
};

export const setCookie = createIsomorphicFn()
	.server((data: SetCookieData) => {
		const { name, value, options } = data;

		setCookieStart(name, value, options);

		return true;
	})
	.client((data: SetCookieData) => {
		const { name, value, options } = data;

		document.cookie = buildCookieString(name, value, options);

		return true;
	});

export const deleteCookie = createIsomorphicFn()
	.server((name: string) => {
		setCookieStart(name, '', {
			maxAge: 0,
		});

		return true;
	})
	.client((name: string) => {
		document.cookie = buildCookieString(name, '', {
			maxAge: 0,
		});
	});

export const getCookies = createIsomorphicFn()
	.server(() => {
		const request = getRequest();
		return request.headers.get('cookie');
	})
	.client(() => {
		return document.cookie;
	});

export const getCookie = createIsomorphicFn()
	.server((name: string) => {
		const cookie = getCookieStart(name);
		return cookie;
	})
	.client((name: string) => {
		const cookies = document.cookie;
		const cookie = cookies
			.split('; ')
			.find((cookie) => cookie.startsWith(`${name}=`));
		return cookie?.split('=')[1];
	});

export const setAuthCookie = async (authTokens: AuthTokens) => {
	setCookie({
		name: COOKIE_ACCESS_TOKEN,
		value: authTokens.accessToken,
		options: {
			maxAge: 15 * 60, // 15 minutes
		},
	});

	await setCookieServer({
		data: {
			name: COOKIE_REFRESH_TOKEN,
			value: authTokens.refreshToken,
			options: {
				httpOnly: true,
				maxAge: 7 * 24 * 60 * 60, // 7 days
			},
		},
	});
};

export const clearAuthCookie = async () => {
	deleteCookie(COOKIE_ACCESS_TOKEN);
	await deleteCookieServer({
		data: { name: COOKIE_REFRESH_TOKEN },
	});
};
