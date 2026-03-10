import { Hono } from 'hono';
import { cleanupRefreshTokens } from './cron.controller';

const cronRoute = new Hono();

cronRoute.post('/refresh-tokens-cleanup', ...cleanupRefreshTokens);

export default cronRoute;
