import { createFileRoute } from '@tanstack/react-router';
import PocketDetailPage from '@/components/pages/pockets/PocketDetailPage';

export const Route = createFileRoute('/_authed/pockets/$id/')({
	component: PocketDetailPage,
});
