import { createFileRoute } from '@tanstack/react-router';
import PocketListPage from '@/components/pages/pockets/PocketListPage';

export const Route = createFileRoute('/_authed/pockets/')({
	component: PocketListPage,
});
