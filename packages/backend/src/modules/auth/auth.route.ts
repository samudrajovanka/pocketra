import { Hono } from 'hono';
import {
	exchangeCode,
	getLoginUser,
	logout,
	oauthCallback,
	oauthLogin,
	refreshToken,
} from './auth.controller';

const authRoute = new Hono();
const oauthRoute = new Hono().basePath('/oauth');

oauthRoute.get('/:type', ...oauthLogin);
oauthRoute.get('/:type/callback', ...oauthCallback);

authRoute.get('/me', ...getLoginUser);
authRoute.post('/exchange', ...exchangeCode);
authRoute.post('/refresh', ...refreshToken);
authRoute.delete('/logout', ...logout);

authRoute.route('/', oauthRoute);

export default authRoute;
