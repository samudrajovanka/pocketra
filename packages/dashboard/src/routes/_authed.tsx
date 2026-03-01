import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import DashboardLayout from '@/components/layout/dashboardLayout';

export const Route = createFileRoute('/_authed')({
	beforeLoad: async ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({
				to: '/auth/login',
			});
		}
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
