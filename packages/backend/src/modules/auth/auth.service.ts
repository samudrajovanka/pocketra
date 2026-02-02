import { eq } from 'drizzle-orm';
import * as jwt from 'jsonwebtoken';
import { db } from '../../config/db';
import AuthenticationError from '../../exceptions/AuthenticationError';
import AuthorizationError from '../../exceptions/AuthorizationError';
import { decodeJwt } from '../../utils/helpers/token';
import { userProvidersTable, usersTable } from './auth.schema';
import { expiresAccessTokenInSeconds } from './data';
import type {
	AuthProvider,
	GenerateAccessTokenPayload,
	LoggedUser,
	OauthProfile,
} from './types';

export default class AuthService {
	private async generateAccessToken(payload: GenerateAccessTokenPayload) {
		const jwtPayload: GenerateAccessTokenPayload = {
			email: payload.email,
		};

		const secretKey = process.env.ACCESS_TOKEN_SECRET ?? '';
		return jwt.sign(jwtPayload, secretKey, {
			expiresIn: expiresAccessTokenInSeconds,
		});
	}

	async oauthLogin(oauthProfile: OauthProfile, provider: AuthProvider) {
		const user = await db.query.usersTable.findFirst({
			with: {
				userProviders: true,
			},
			where: eq(usersTable.email, oauthProfile.email),
		});

		const providerMatch = user?.userProviders.find(
			(up) =>
				up.providerUserId === oauthProfile.providerUserId &&
				up.provider === provider,
		);

		if (!user) {
			await db.transaction(async (tx) => {
				const [newUser] = await tx
					.insert(usersTable)
					.values({
						email: oauthProfile.email,
						name: oauthProfile.name,
					})
					.returning({ id: usersTable.id });
				await tx.insert(userProvidersTable).values({
					provider,
					providerUserId: oauthProfile.providerUserId,
					userId: newUser.id,
				});
			});
		} else if (!providerMatch) {
			await db.insert(userProvidersTable).values({
				provider,
				providerUserId: oauthProfile.providerUserId,
				userId: user.id,
			});
		}

		return this.generateAccessToken({
			email: oauthProfile.email,
		});
	}

	async getLoginUserFromAccessToken(accessToken: string) {
		let decodedToken: GenerateAccessTokenPayload;

		try {
			decodedToken = decodeJwt<GenerateAccessTokenPayload>(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET ?? '',
			);
		} catch (err) {
			throw new AuthenticationError((err as Error).message);
		}

		const user = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, decodedToken.email),
		});

		if (!user) {
			throw new AuthorizationError();
		}

		return {
			id: user.id,
			email: user.email,
			name: user.name,
		} as LoggedUser;
	}
}
