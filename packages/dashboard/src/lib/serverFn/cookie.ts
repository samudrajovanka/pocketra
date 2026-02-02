import { createServerFn } from '@tanstack/react-start';
import { setResponseHeaders } from '@tanstack/react-start/server';

export const setCookie = createServerFn({ method: 'POST' })
	.inputValidator((d: { name: string; value: string; maxAge?: number }) => d)
	.handler(async ({ data }) => {
		const { name, value, maxAge = 60 * 60 * 24 } = data;

		setResponseHeaders({
			'set-cookie': `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`,
		});

		return { success: true };
	});

export const deleteCookie = createServerFn({ method: 'POST' })
	.inputValidator((d: { name: string }) => d)
	.handler(async ({ data }) => {
		setResponseHeaders({
			'set-cookie': `${data.name}=; Path=/; Max-Age=0; SameSite=Lax; Secure`,
		});

		return { success: true };
	});
