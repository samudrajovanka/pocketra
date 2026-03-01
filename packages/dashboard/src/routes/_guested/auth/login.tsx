import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import LoginPage from '@/components/pages/login';

const searchSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute('/_guested/auth/login')({
	validateSearch: searchSchema,
	component: LoginPage,
});
