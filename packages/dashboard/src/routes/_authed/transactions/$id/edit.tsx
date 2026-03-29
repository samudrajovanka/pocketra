import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import EditTransactionPage from '@/components/pages/transactions/EditTransactionPage';
import { TRANSACTION_TYPE } from '@/lib/constants/transactions';
import { generateMetadata } from '@/lib/helpers/meta';

export const Route = createFileRoute('/_authed/transactions/$id/edit')({
	validateSearch: z.object({
		from: z.enum(['detail_pocket']).optional(),
		method: z.enum(Object.values(TRANSACTION_TYPE)).optional(),
	}),
	head: () => ({ meta: generateMetadata({ title: 'Edit Transaction' }) }),
	component: EditTransactionPage,
});
