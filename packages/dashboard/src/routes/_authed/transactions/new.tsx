import { createFileRoute } from '@tanstack/react-router';
import CreateTransactionPage from '@/components/pages/transactions/CreateTransactionPage';

export const Route = createFileRoute('/_authed/transactions/new')({
	component: CreateTransactionPage,
});
