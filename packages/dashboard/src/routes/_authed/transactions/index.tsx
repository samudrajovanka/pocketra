import { createFileRoute } from '@tanstack/react-router';
import TransactionListPage from '@/components/pages/transactions/TransactionListPage';
import { generateMetadata } from '@/lib/helpers/meta';

export const Route = createFileRoute('/_authed/transactions/')({
	head: () => ({ meta: generateMetadata({ title: 'Transactions' }) }),
	component: TransactionListPage,
});
