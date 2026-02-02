import { createFileRoute, redirect } from '@tanstack/react-router';
import { checkAuth } from '@/lib/serverFn/auth';

export const Route = createFileRoute('/_guested')({
	beforeLoad: async () => {
		const auth = await checkAuth();

		if (auth?.isAuthenticated) {
			throw redirect({
				to: '/dashboard',
			});
		}

		return auth;
	},
});
