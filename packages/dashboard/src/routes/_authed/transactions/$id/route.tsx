import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/transactions/$id')({
	component: () => <Outlet />,
});
