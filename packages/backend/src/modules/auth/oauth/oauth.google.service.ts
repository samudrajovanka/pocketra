import { google } from 'googleapis';
import AuthenticationError from '../../../exceptions/AuthenticationError';
import ForbiddenError from '../../../exceptions/ForbiddenError';
import { authProvider } from '../data';
import type { AuthProvider, GoogleOauthProfile } from '../types';
import OauthService from './oauth.abstract';

export default class OauthGoogleService extends OauthService {
	private oauth2Client;

	constructor() {
		super();

		this.oauth2Client = new google.auth.OAuth2(
			process.env.OAUTH_GOOGLE_CLIENT_ID,
			process.env.OAUTH_GOOGLE_CLIENT_SECRET,
			this.getRedirectUrl(authProvider.Google as AuthProvider),
		);
	}

	async getAuthorizationUrl(oauthState: string) {
		const scopes = ['openid', 'email', 'profile'];

		const authorizationUrl = this.oauth2Client.generateAuthUrl({
			scope: scopes,
			include_granted_scopes: true,
			state: oauthState,
		});

		return authorizationUrl;
	}

	async handleCallback(oauthState: string, query: Record<string, string>) {
		if (query.error) {
			throw new AuthenticationError(`Google OAuth error: ${query.error}`);
		} else if (query.state !== oauthState) {
			throw new ForbiddenError('Invalid OAuth state');
		}

		const { tokens } = await this.oauth2Client.getToken(query.code ?? '');
		this.oauth2Client.setCredentials(tokens);

		return this.getProfile();
	}

	async getProfile() {
		const { data } = await this.oauth2Client.request<GoogleOauthProfile | null>(
			{
				url: 'https://www.googleapis.com/oauth2/v3/userinfo',
			},
		);

		if (!data) {
			throw new AuthenticationError('Failed to fetch user profile from Google');
		}

		return {
			providerUserId: data.sub,
			name: data.name,
			picture: data.picture,
			email: data.email,
		};
	}
}
