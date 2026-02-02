import type z from 'zod';
import type { pocketsTable } from './pocket.schema';
import type {
	payloadCreatePocketValidator,
	payloadGetPocketByIdValidator,
	payloadUpdatePocketValidator,
} from './pocket.validator';

export type PocketWithBalance = typeof pocketsTable.$inferSelect & {
	currentBalance: number;
};

export type PayloadCreatePocket = z.infer<typeof payloadCreatePocketValidator>;
export type PayloadGetPocketById = z.infer<
	typeof payloadGetPocketByIdValidator
>;
export type PayloadUpdatePocket = z.infer<typeof payloadUpdatePocketValidator>;
