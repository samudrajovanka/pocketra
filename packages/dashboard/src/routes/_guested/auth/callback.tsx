import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';
import { exchangeCode } from '@/endpoints/auth';
import { setAuthCookie } from '@/lib/helpers/cookie';

const searchSchema = z.object({
	code: z.string().optional(),
	error: z.string().optional(),
});

export const Route = createFileRoute('/_guested/auth/callback')({
	validateSearch: searchSchema,
	beforeLoad: async ({ search }) => {
		try {
			if (search.error || !search.code) {
				throw Error(search.error || 'auth_failed');
			}

			const {
				data: { data: authTokens },
			} = await exchangeCode(search.code).catch(() => {
				throw new Error('exchange_failed');
			});

			await setAuthCookie(authTokens);

			throw redirect({ to: '/dashboard' });
		} catch (error) {
			throw redirect({
				to: '/auth/login',
				search: {
					error: error instanceof Error ? error.message : 'auth_failed',
				},
			});
		}
	},
});
