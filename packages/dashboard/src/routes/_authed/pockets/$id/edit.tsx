import { createFileRoute } from '@tanstack/react-router';
import EditPocketPage from '@/components/pages/pockets/EditPocketPage';
import { generateMetadata } from '@/lib/helpers/meta';

export const Route = createFileRoute('/_authed/pockets/$id/edit')({
	head: () => ({ meta: generateMetadata({ title: 'Edit Pocket' }) }),
	component: EditPocketPage,
});
