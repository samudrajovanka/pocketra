import { createFileRoute } from '@tanstack/react-router';
import TransactionDetailPage from '@/components/pages/transactions/TransactionDetailPage';

export const Route = createFileRoute('/_authed/transactions/$id/')({
	component: TransactionDetailPage,
});
