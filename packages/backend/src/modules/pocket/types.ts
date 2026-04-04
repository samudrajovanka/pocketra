import type z from 'zod';
import type { POCKET_TYPE } from './data';
import type { pocketsTable } from './pocket.schema';
import type {
	GetPocketByIdParamValidator,
	payloadCreatePocketValidator,
	payloadGetPocketsValidator,
	payloadUpdatePocketValidator,
} from './pocket.validator';

export type PocketType = (typeof POCKET_TYPE)[keyof typeof POCKET_TYPE];

export type PocketWithBalance = Omit<
	typeof pocketsTable.$inferSelect,
	'initialBalance'
> & {
	currentBalance: number;
	hasBudget: boolean;
};

export type PayloadCreatePocket = z.infer<typeof payloadCreatePocketValidator>;

export type GetPocketByIdParam = z.infer<typeof GetPocketByIdParamValidator>;

export type PayloadUpdatePocket = z.infer<typeof payloadUpdatePocketValidator>;

export type PayloadGetPockets = z.infer<typeof payloadGetPocketsValidator>;

export type GetPocketsWithBalanceParams = {
	userId: string;
	limit?: number;
	pocketId?: string;
	sortBy?: 'balance';
};
