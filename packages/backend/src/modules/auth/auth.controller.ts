import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { createFactory } from 'hono/factory';
import AuthenticationError from '../../exceptions/AuthenticationError';
import { authMiddleware } from '../../middlewares/auth';
import { secureCookieOptions } from '../../utils/helpers/cookie';
import { createRandomString } from '../../utils/helpers/encrypt';
import { successResponse } from '../../utils/helpers/response';
import AuthService from './auth.service';
import {
	createOauthCallbackRedirect,
	createOauthErrorRedirect,
	getOauthService,
} from './auth.utils';
import {
	zPayloadExchangeCodeValidator,
	zPayloadLogoutValidator,
	zPayloadRefreshTokenValidator,
} from './auth.validator';
import type { AuthProvider } from './types';

const { createHandlers } = createFactory();

export const oauthLogin = createHandlers(async (c) => {
	const type = c.req.param('type') as AuthProvider;
	const oauthService = getOauthService(type);
	const oauthState = createRandomString(32);

	setCookie(c, 'oauth_state', oauthState, {
		...secureCookieOptions,
		maxAge: 5 * 60, // 5 minutes
	});

	const autorizationUrl = await oauthService.getAuthorizationUrl(oauthState);

	return c.redirect(autorizationUrl);
});

export const oauthCallback = createHandlers(async (c) => {
	try {
		const type = c.req.param('type') as AuthProvider;
		const query = c.req.query();

		const oauthState = getCookie(c, 'oauth_state');
		const oauthService = getOauthService(type);

		const oauthProfile = await oauthService.handleCallback(
			oauthState ?? '',
			query,
		);

		deleteCookie(c, 'oauth_state');

		const authService = new AuthService();
		const authTokens = await authService.oauthLogin(oauthProfile, type);

		const redirectUrl = createOauthCallbackRedirect(c, authTokens);
		return c.redirect(redirectUrl);
	} catch (_) {
		deleteCookie(c, 'oauth_state');

		const redirectUrl = createOauthErrorRedirect('oauth_failed');

		return c.redirect(redirectUrl);
	}
});

export const exchangeCode = createHandlers(
	zPayloadExchangeCodeValidator,
	async (c) => {
		const { code } = c.req.valid('json') as { code: string };

		const rawTokens = getCookie(c, code);

		if (!rawTokens) {
			throw new AuthenticationError('Invalid or expired code');
		}

		const authTokens = JSON.parse(rawTokens) as {
			accessToken: string;
			refreshToken: string;
		};

		deleteCookie(c, code);

		return c.json(
			successResponse({
				message: 'Success exchange code',
				data: {
					accessToken: authTokens.accessToken,
					refreshToken: authTokens.refreshToken,
				},
			}),
		);
	},
);

export const getLoginUser = createHandlers(authMiddleware, async (c) => {
	const user = c.get('user');

	return c.json(
		successResponse({
			message: 'Success get login user',
			data: user,
		}),
	);
});

export const refreshToken = createHandlers(
	zPayloadRefreshTokenValidator,
	async (c) => {
		const { refreshToken: rawRefreshToken } = c.req.valid('json') as {
			refreshToken: string;
		};

		const authService = new AuthService();
		const { accessToken, refreshToken: newRefreshToken } =
			await authService.refreshAccessToken(rawRefreshToken);

		return c.json(
			successResponse({
				message: 'Success refresh token',
				data: {
					accessToken,
					refreshToken: newRefreshToken,
				},
			}),
		);
	},
);

export const logout = createHandlers(zPayloadLogoutValidator, async (c) => {
	const { refreshToken } = c.req.valid('json') as {
		refreshToken?: string;
	};

	const authService = new AuthService();

	if (refreshToken) {
		await authService.logout(refreshToken);
	}

	return c.json(
		successResponse({
			message: 'Logout success',
		}),
	);
});
