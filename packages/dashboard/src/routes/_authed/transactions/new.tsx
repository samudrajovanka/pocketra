import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import CreateTransactionPage from '@/components/pages/transactions/CreateTransactionPage';

export const Route = createFileRoute('/_authed/transactions/new')({
	validateSearch: z.object({
		pocket_id: z.uuidv7().optional(),
		navigate_after_create: z.enum(['selected-pocket']).optional(),
	}),
	component: CreateTransactionPage,
});
