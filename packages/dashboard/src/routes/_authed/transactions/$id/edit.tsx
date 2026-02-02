import { createFileRoute } from '@tanstack/react-router';
import EditTransactionPage from '@/components/pages/transactions/EditTransactionPage';

export const Route = createFileRoute('/_authed/transactions/$id/edit')({
	component: EditTransactionPage,
});
