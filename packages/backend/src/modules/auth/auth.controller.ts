import { randomBytes } from 'node:crypto';
import { getCookie } from 'hono/cookie';
import { createFactory } from 'hono/factory';
import InvariantError from '../../exceptions/InvariantError';
import { authMiddleware } from '../../middlewares/auth';
import {
	deleteCookie,
	setCookie,
	setSignedCookie,
} from '../../utils/helpers/cookie';
import { successResponse } from '../../utils/helpers/response';
import AuthService from './auth.service';
import { authProvider, expiresAccessTokenInSeconds } from './data';
import type OauthService from './oauth/oauth.abstract';
import OauthGoogleService from './oauth/oauth.google.service';
import type { AuthProvider } from './types';

const { createHandlers } = createFactory();

export const oauthLogin = createHandlers(async (c) => {
	const type = c.req.param('type') as AuthProvider;

	let oauthService: OauthService;

	if (type === authProvider.Google) {
		oauthService = new OauthGoogleService();
	} else {
		throw new InvariantError(`Unsupported oauth provider ${type}`);
	}

	const oauthState = randomBytes(32).toString('hex');

	setCookie(c, 'oauth_state', oauthState, {
		maxAge: 300, // 5 minutes
	});

	const autorizationUrl = await oauthService.getAuthorizationUrl(oauthState);

	return c.redirect(autorizationUrl);
});

export const oauthCallback = createHandlers(async (c) => {
	const type = c.req.param('type') as AuthProvider;
	const query = c.req.query();

	const oauthState = getCookie(c, 'oauth_state');
	console.log('oauthstate', oauthState);
	let oauthService: OauthService;

	if (type === authProvider.Google) {
		oauthService = new OauthGoogleService();
	} else {
		throw new InvariantError(`Unsupported oauth provider ${type}`);
	}

	const oauthProfile = await oauthService.handleCallback(
		oauthState ?? '',
		query,
	);

	deleteCookie(c, 'oauth_state');

	const authService = new AuthService();
	const accessToken = await authService.oauthLogin(oauthProfile, type);

	const ACCESS_TOKEN_SECRET_COOKIE = process.env
		.ACCESS_TOKEN_SECRET_COOKIE as string;
	await setSignedCookie(
		c,
		'access_token',
		accessToken,
		ACCESS_TOKEN_SECRET_COOKIE,
		{
			maxAge: expiresAccessTokenInSeconds,
		},
	);

	return c.redirect(
		`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/auth/callback`,
	);
});

export const getLoginUser = createHandlers(authMiddleware, async (c) => {
	const user = c.get('user');

	return c.json(
		successResponse({
			message: 'Success get login user',
			data: user,
		}),
	);
});

export const logout = createHandlers(authMiddleware, async (c) => {
	deleteCookie(c, 'access_token', {
		path: '/',
	});

	return c.json(
		successResponse({
			message: 'Success logout user',
		}),
	);
});
