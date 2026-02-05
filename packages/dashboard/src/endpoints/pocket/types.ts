import type z from 'zod';
import type { createPocketValidator, updatePocketValidator } from './validator';

export type CreatePocketPayload = z.infer<typeof createPocketValidator>;

export type UpdatePocketPayload = z.infer<typeof updatePocketValidator>;

export type GetPocketsParams = {
	limit?: number;
};
