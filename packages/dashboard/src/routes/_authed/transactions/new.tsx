import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import CreateTransactionPage from '@/components/pages/transactions/CreateTransactionPage';
import { generateMetadata } from '@/lib/helpers/meta';

export const Route = createFileRoute('/_authed/transactions/new')({
	validateSearch: z.object({
		pocket_id: z.uuidv7().optional(),
		method: z.enum(['transfer']).optional(),
		from_pocket_id: z.uuidv7().optional(),
		from: z.enum(['detail_pocket']).optional(),
	}),
	head: () => ({ meta: generateMetadata({ title: 'Create Transaction' }) }),
	component: CreateTransactionPage,
});
