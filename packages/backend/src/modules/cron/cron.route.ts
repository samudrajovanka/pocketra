import { Hono } from 'hono';

import { cronSecurity } from '../../middlewares/cron';
import { cleanupRefreshTokens, resetBudgetPeriods } from './cron.controller';

const cronRoute = new Hono();

cronRoute.use(cronSecurity);

cronRoute.post('/refresh-tokens-cleanup', ...cleanupRefreshTokens);
cronRoute.post('/reset-budget-periods', ...resetBudgetPeriods);

export default cronRoute;
