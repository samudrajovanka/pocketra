import z from 'zod';
import { POCKET_TYPE } from '@/lib/constants/pockets';

export const createPocketValidator = z.object({
	name: z.string().min(1, 'Name is required'),
	icon: z.string().min(1, 'Icon is required'),
	type: z
		.enum(Object.values(POCKET_TYPE) as [string, ...string[]])
		.default(POCKET_TYPE.cash),
	color: z.string().nullable().optional(),
	initialBalance: z.number().default(0),
});

export const updatePocketValidator = z.object({
	name: z.string().min(1, 'Name is required').optional(),
	icon: z.string().min(1, 'Icon is required').optional(),
	type: z.enum(Object.values(POCKET_TYPE) as [string, ...string[]]).optional(),
	color: z.string().nullable().optional(),
});
