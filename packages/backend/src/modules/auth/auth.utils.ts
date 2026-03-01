import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import InvariantError from '../../exceptions/InvariantError';
import { secureCookieOptions } from '../../utils/helpers/cookie';
import { createRandomString } from '../../utils/helpers/encrypt';
import { authProvider } from './data';
import type OauthService from './oauth/oauth.abstract';
import OauthGoogleService from './oauth/oauth.google.service';
import type { AuthProvider } from './types';

export const getOauthService = (type: AuthProvider): OauthService => {
	if (type === authProvider.Google) {
		return new OauthGoogleService();
	}

	throw new InvariantError(`Unsupported oauth provider ${type}`);
};

export const createOauthCallbackRedirect = (
	c: Context,
	authTokens: { accessToken: string; refreshToken: string },
) => {
	const randomString = createRandomString(6);

	setCookie(c, randomString, JSON.stringify(authTokens), {
		...secureCookieOptions,
		maxAge: 5 * 60, // 5 minutes
	});

	const redirectUrl = new URL(
		process.env.FRONTEND_URL ?? 'http://localhost:3000',
	);
	redirectUrl.pathname = '/auth/callback';
	redirectUrl.searchParams.append('code', randomString);

	return redirectUrl;
};

export const createOauthErrorRedirect = (error: string) => {
	const loginUrl = new URL(process.env.FRONTEND_URL ?? 'http://localhost:3000');
	loginUrl.pathname = '/auth/callback';
	loginUrl.searchParams.append('error', error);

	return loginUrl;
};
