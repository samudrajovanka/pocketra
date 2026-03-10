import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import LoginPage from '@/components/pages/login';
import { generateMetadata } from '@/lib/helpers/meta';

const searchSchema = z.object({
	error: z.string().optional(),
});

export const Route = createFileRoute('/_guested/auth/login')({
	validateSearch: searchSchema,
	head: () => ({ meta: generateMetadata({ title: 'Login' }) }),
	component: LoginPage,
});
