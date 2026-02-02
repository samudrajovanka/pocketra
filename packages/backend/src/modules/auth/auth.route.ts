import { Hono } from 'hono';
import {
	getLoginUser,
	logout,
	oauthCallback,
	oauthLogin,
} from './auth.controller';

const authRoute = new Hono();
const oauthRoute = new Hono().basePath('/oauth');

oauthRoute.get('/:type', ...oauthLogin);
oauthRoute.get('/:type/callback', ...oauthCallback);

authRoute.get('/me', ...getLoginUser);
authRoute.delete('/logout', ...logout);

authRoute.route('/', oauthRoute);

export default authRoute;
