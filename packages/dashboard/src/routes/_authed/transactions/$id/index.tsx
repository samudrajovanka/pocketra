import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import TransactionDetailPage from '@/components/pages/transactions/TransactionDetailPage';

export const Route = createFileRoute('/_authed/transactions/$id/')({
	validateSearch: z.object({
		from: z.enum(['detail_pocket']).optional(),
	}),
	component: TransactionDetailPage,
});
