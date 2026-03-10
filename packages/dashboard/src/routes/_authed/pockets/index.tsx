import { createFileRoute } from '@tanstack/react-router';
import PocketListPage from '@/components/pages/pockets/PocketListPage';
import { generateMetadata } from '@/lib/helpers/meta';

export const Route = createFileRoute('/_authed/pockets/')({
	head: () => ({ meta: generateMetadata({ title: 'Pockets' }) }),
	component: PocketListPage,
});
