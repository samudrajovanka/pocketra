import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import EditTransactionPage from '@/components/pages/transactions/EditTransactionPage';

export const Route = createFileRoute('/_authed/transactions/$id/edit')({
	validateSearch: z.object({
		from: z.enum(['detail_pocket']).optional(),
	}),
	component: EditTransactionPage,
});
