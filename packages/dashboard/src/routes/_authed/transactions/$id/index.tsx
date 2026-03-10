import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import TransactionDetailPage from '@/components/pages/transactions/TransactionDetailPage';
import { generateMetadata } from '@/lib/helpers/meta';

export const Route = createFileRoute('/_authed/transactions/$id/')({
	validateSearch: z.object({
		from: z.enum(['detail_pocket']).optional(),
	}),
	head: () => ({ meta: generateMetadata({ title: 'Transaction Detail' }) }),
	component: TransactionDetailPage,
});
