import { createServerFn } from '@tanstack/react-start';
import { exchangeCode } from '@/endpoints/auth';
import { setAuthCookie } from '@/lib/helpers/cookie';

export const exchangeCodeAuth = createServerFn({
	method: 'POST',
})
	.inputValidator((d: { code: string }) => d)
	.handler(async ({ data }) => {
		const { code } = data;
		const {
			data: { data: authTokens },
		} = await exchangeCode(code);

		await setAuthCookie(authTokens);

		return data;
	});
