import { createFileRoute } from '@tanstack/react-router';
import TransactionListPage from '@/components/pages/transactions/TransactionListPage';

export const Route = createFileRoute('/_authed/transactions/')({
	component: TransactionListPage,
});
