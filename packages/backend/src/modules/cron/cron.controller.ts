import { createFactory } from 'hono/factory';
import { successResponse } from '../../utils/helpers/response';
import { CronService } from './cron.service';

const { createHandlers } = createFactory();

export const cleanupRefreshTokens = createHandlers(async (c) => {
	const cronService = new CronService();
	const deletedCount = await cronService.cleanupExpiredRefreshTokens();

	return c.json(
		successResponse({
			data: { deletedCount },
			message: `Successfully deleted ${deletedCount} expired refresh tokens.`,
		}),
	);
});

export const resetBudgetPeriods = createHandlers(async (c) => {
	const cronService = new CronService();
	const resetCount = await cronService.resetBudgetPeriods();

	return c.json(
		successResponse({
			data: { resetCount },
			message: `Successfully reset ${resetCount} expired budget periods.`,
		}),
	);
});
