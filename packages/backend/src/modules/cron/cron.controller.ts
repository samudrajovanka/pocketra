import { createFactory } from 'hono/factory';
import { cronSecurity } from '../../middlewares/cron';
import { successResponse } from '../../utils/helpers/response';
import { CronService } from './cron.service';

const { createHandlers } = createFactory();

export const cleanupRefreshTokens = createHandlers(cronSecurity, async (c) => {
	const cronService = new CronService();
	const deletedCount = await cronService.cleanupExpiredRefreshTokens();

	return c.json(
		successResponse({
			data: { deletedCount },
			message: `Successfully deleted ${deletedCount} expired refresh tokens.`,
		}),
	);
});
