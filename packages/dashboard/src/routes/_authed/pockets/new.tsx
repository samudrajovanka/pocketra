import { createFileRoute } from '@tanstack/react-router';
import CreatePocketPage from '@/components/pages/pockets/CreatePocketPage';

export const Route = createFileRoute('/_authed/pockets/new')({
	component: CreatePocketPage,
});
