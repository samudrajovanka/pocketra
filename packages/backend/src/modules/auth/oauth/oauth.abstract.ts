import { authProvider } from '../data';
import type { AuthProvider, OauthProfile } from '../types';

export default abstract class OauthService {
	abstract getAuthorizationUrl(oauthState: string): Promise<string>;
	abstract handleCallback(
		oauthState: string,
		query: Record<string, string>,
	): Promise<OauthProfile>;
	abstract getProfile(): Promise<OauthProfile>;

	protected getRedirectUrlCallback(type: AuthProvider) {
		let pathUrl = '';

		if (type === authProvider.Google) {
			pathUrl = '/google/callback';
		} else {
			throw new Error(`Unsupported oauth provider ${type}`);
		}

		return process.env.OAUTH_BASE_CALLBACK_URL + pathUrl;
	}
}
