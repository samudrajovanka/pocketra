import { createServerFn } from '@tanstack/react-start';
import {
	type CookieOptions,
	deleteCookie,
	getCookie,
	setCookie,
} from '@/lib/helpers/cookie';

export const getCookieServer = createServerFn()
	.inputValidator((d: { name: string }) => d)
	.handler(({ data }) => {
		const cookie = getCookie(data.name);
		return cookie;
	});

export const setCookieServer = createServerFn()
	.inputValidator(
		(d: { name: string; value: string; options?: CookieOptions }) => d,
	)
	.handler(({ data }) => {
		setCookie(data);
		return true;
	});

export const deleteCookieServer = createServerFn()
	.inputValidator((d: { name: string }) => d)
	.handler(({ data }) => {
		deleteCookie(data.name);
		return true;
	});
