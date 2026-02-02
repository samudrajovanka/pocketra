import z from 'zod';

export const createPocketValidator = z.object({
	name: z.string().min(1, 'Name is required'),
	icon: z.string().min(1, 'Icon is required'),
	initialBalance: z.number().default(0),
});

export const updatePocketValidator = z.object({
	name: z.string().min(1, 'Name is required').optional(),
	icon: z.string().min(1, 'Icon is required').optional(),
});
