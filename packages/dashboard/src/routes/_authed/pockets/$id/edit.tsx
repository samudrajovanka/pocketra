import { createFileRoute } from '@tanstack/react-router';
import EditPocketPage from '@/components/pages/pockets/EditPocketPage';

export const Route = createFileRoute('/_authed/pockets/$id/edit')({
	component: EditPocketPage,
});
