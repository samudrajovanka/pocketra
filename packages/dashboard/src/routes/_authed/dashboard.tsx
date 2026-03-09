import { createFileRoute } from '@tanstack/react-router';
import DashboardPage from '@/components/pages/dashboard/DashboardPage';
import { generateMetadata } from '@/lib/helpers/meta';

export const Route = createFileRoute('/_authed/dashboard')({
	head: () => ({ meta: generateMetadata({ title: 'Dashboard' }) }),
	component: DashboardPage,
});
