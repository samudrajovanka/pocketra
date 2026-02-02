import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import DashboardLayout from '@/components/layout/dashboardLayout';
import { checkAuth } from '@/lib/serverFn/auth';

export const Route = createFileRoute('/_authed')({
	beforeLoad: async ({ location }) => {
		const auth = await checkAuth();

		if (!auth) {
			throw redirect({
				to: '/auth/login',
				search: { redirect: location.href },
			});
		}

		return auth;
	},
	component: RootDocument,
});

function RootDocument() {
	return (
		<DashboardLayout>
			<Outlet />
		</DashboardLayout>
	);
}
