import { DrizzleQueryError } from 'drizzle-orm';
import ConflictError from '../../exceptions/ConflictError';
import type { ErrorWithCode } from '../../types/error';
import ErrorConstant from '../constants/error';
import PgErrorConstant from '../constants/pgError';

type CatchErrorDrizzleCause = {
	conflict?: {
		column: string;
	};
};

export const catchErrorDrizzle = (
	error: unknown,
	cause: CatchErrorDrizzleCause,
) => {
	if (error instanceof DrizzleQueryError) {
		if (
			cause.conflict &&
			(error.cause as ErrorWithCode).code ===
				PgErrorConstant.code.UNIQUE_VIOLATION
		) {
			throw new ConflictError(
				ErrorConstant.template.conflict(cause.conflict.column),
			);
		}
	}
};
