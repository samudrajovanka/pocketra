import { lt } from 'drizzle-orm';
import { db } from '../../config/db';
import { refreshTokensTable } from '../auth/auth.schema';
import PocketBudgetService from '../pocket-budget/pocket-budget.service';

export class CronService {
	public async cleanupExpiredRefreshTokens() {
		const now = new Date();

		const result = await db
			.delete(refreshTokensTable)
			.where(lt(refreshTokensTable.expiresAt, now))
			.returning({ id: refreshTokensTable.id });

		return result.length;
	}

	public async resetBudgetPeriods() {
		const pocketBudgetService = new PocketBudgetService();
		const resetCount = await pocketBudgetService.resetExpiredBudgets();

		return resetCount;
	}
}
