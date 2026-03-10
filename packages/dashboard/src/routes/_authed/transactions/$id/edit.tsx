import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import EditTransactionPage from '@/components/pages/transactions/EditTransactionPage';
import { generateMetadata } from '@/lib/helpers/meta';

export const Route = createFileRoute('/_authed/transactions/$id/edit')({
	validateSearch: z.object({
		from: z.enum(['detail_pocket']).optional(),
	}),
	head: () => ({ meta: generateMetadata({ title: 'Edit Transaction' }) }),
	component: EditTransactionPage,
});
