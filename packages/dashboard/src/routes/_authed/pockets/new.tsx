import { createFileRoute } from '@tanstack/react-router';
import CreatePocketPage from '@/components/pages/pockets/CreatePocketPage';
import { generateMetadata } from '@/lib/helpers/meta';

export const Route = createFileRoute('/_authed/pockets/new')({
	head: () => ({ meta: generateMetadata({ title: 'Create Pocket' }) }),
	component: CreatePocketPage,
});
