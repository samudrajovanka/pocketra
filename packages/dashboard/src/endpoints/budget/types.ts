import type { z } from 'zod';
import type { createBudgetValidator, updateBudgetValidator } from './validator';

export type CreateBudgetPayload = z.infer<typeof createBudgetValidator>;
export type UpdateBudgetPayload = z.infer<typeof updateBudgetValidator>;
