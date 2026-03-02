import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_guested')({
	beforeLoad: async ({ context }) => {
		if (context.isAuthenticated) {
			throw redirect({
				to: '/dashboard',
			});
		}
	},
});
