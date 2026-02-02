import { createFileRoute, redirect } from '@tanstack/react-router';
import { setCookie } from '@/lib/serverFn/cookie';

export const Route = createFileRoute('/_guested/auth/callback')({
	beforeLoad: async () => {
		await setCookie({
			data: {
				name: 'is_authenticated',
				value: 'true',
			},
		});

		throw redirect({
			to: '/dashboard',
		});
	},
});
