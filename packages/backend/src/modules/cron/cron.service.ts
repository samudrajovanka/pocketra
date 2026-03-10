import { lt } from 'drizzle-orm';
import { db } from '../../config/db';
import { refreshTokensTable } from '../auth/auth.schema';

export class CronService {
	public async cleanupExpiredRefreshTokens() {
		const now = new Date();

		const result = await db
			.delete(refreshTokensTable)
			.where(lt(refreshTokensTable.expiresAt, now))
			.returning({ id: refreshTokensTable.id });

		return result.length;
	}
}
