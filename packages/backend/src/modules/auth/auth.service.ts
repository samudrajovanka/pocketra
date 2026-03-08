import { and, eq } from 'drizzle-orm';
import * as jwt from 'jsonwebtoken';
import { db } from '../../config/db';
import AuthenticationError from '../../exceptions/AuthenticationError';
import AuthorizationError from '../../exceptions/AuthorizationError';
import { hash } from '../../utils/helpers/encrypt';
import { decodeJwt } from '../../utils/helpers/token';
import {
	refreshTokensTable,
	userProvidersTable,
	usersTable,
} from './auth.schema';
import {
	expiresAccessTokenInSeconds,
	expiresRefreshTokenInSeconds,
} from './data';
import type {
	AuthProvider,
	GenerateAccessTokenPayload,
	GenerateRefreshTokenPayload,
	LoggedUser,
	OauthProfile,
	User,
} from './types';

export default class AuthService {
	private generateAccessToken(payload: GenerateAccessTokenPayload) {
		const secretKey = process.env.ACCESS_TOKEN_SECRET ?? '';
		return jwt.sign(payload, secretKey, {
			expiresIn: expiresAccessTokenInSeconds,
		});
	}

	private generateRefreshToken(payload: GenerateRefreshTokenPayload) {
		const secretKey = process.env.REFRESH_TOKEN_SECRET ?? '';
		return jwt.sign(payload, secretKey, {
			expiresIn: expiresRefreshTokenInSeconds,
		});
	}

	private async generateAuthToken(
		accessTokenPayload: GenerateAccessTokenPayload,
		refreshTokenPayload: GenerateRefreshTokenPayload,
		user: Pick<User, 'id'>,
	) {
		const accessToken = this.generateAccessToken(accessTokenPayload);
		const refreshToken = this.generateRefreshToken(refreshTokenPayload);

		await db.insert(refreshTokensTable).values({
			token: hash(refreshToken),
			userId: user.id,
			expiresAt: new Date(Date.now() + expiresRefreshTokenInSeconds * 1000),
		});

		return { accessToken, refreshToken };
	}

	async refreshAccessToken(refreshToken: string) {
		let decodedToken: GenerateAccessTokenPayload;

		try {
			decodedToken = decodeJwt<GenerateAccessTokenPayload>(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET ?? '',
			);
		} catch (err) {
			throw new AuthenticationError((err as Error).message);
		}

		const user = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, decodedToken.email),
		});

		if (!user) {
			throw new AuthorizationError('User not found');
		}

		const hashedToken = hash(refreshToken);
		const existingToken = await db.query.refreshTokensTable.findFirst({
			where: and(
				eq(refreshTokensTable.token, hashedToken),
				eq(refreshTokensTable.userId, user.id),
			),
		});

		if (!existingToken || existingToken.expiresAt < new Date()) {
			throw new AuthenticationError('Invalid or expired refresh token');
		}

		await db
			.delete(refreshTokensTable)
			.where(eq(refreshTokensTable.token, hashedToken));

		return this.generateAuthToken(
			{ email: decodedToken.email },
			{ email: decodedToken.email },
			{
				id: user.id,
			},
		);
	}

	async oauthLogin(oauthProfile: OauthProfile, provider: AuthProvider) {
		const userWithProviders = await db.query.usersTable.findFirst({
			with: {
				userProviders: true,
			},
			where: eq(usersTable.email, oauthProfile.email),
		});

		if (!userWithProviders) {
			const newUser = await db.transaction(async (tx) => {
				const [newUser] = await tx
					.insert(usersTable)
					.values({
						email: oauthProfile.email,
						name: oauthProfile.name,
						avatarUrl: oauthProfile.picture,
					})
					.returning();
				await tx.insert(userProvidersTable).values({
					provider,
					providerUserId: oauthProfile.providerUserId,
					userId: newUser.id,
				});

				return newUser;
			});

			return this.generateAuthToken(
				{ email: oauthProfile.email },
				{ email: oauthProfile.email },
				{
					id: newUser.id,
				},
			);
		}

		const isProviderMatch = userWithProviders.userProviders.some(
			(up) =>
				up.providerUserId === oauthProfile.providerUserId &&
				up.provider === provider,
		);

		if (!isProviderMatch) {
			await db.insert(userProvidersTable).values({
				provider,
				providerUserId: oauthProfile.providerUserId,
				userId: userWithProviders.id,
			});
		}

		if (!userWithProviders.avatarUrl && oauthProfile.picture) {
			await db
				.update(usersTable)
				.set({ avatarUrl: oauthProfile.picture })
				.where(eq(usersTable.id, userWithProviders.id));
		}

		return this.generateAuthToken(
			{ email: oauthProfile.email },
			{ email: oauthProfile.email },
			{
				id: userWithProviders.id,
			},
		);
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
			avatarUrl: user.avatarUrl,
		} satisfies LoggedUser;
	}

	async logout(refreshToken: string) {
		if (!refreshToken) return;

		try {
			const decodedToken = decodeJwt<GenerateRefreshTokenPayload>(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET ?? '',
			);

			const user = await db.query.usersTable.findFirst({
				where: eq(usersTable.email, decodedToken.email),
			});

			if (user) {
				const hashedRefreshToken = hash(refreshToken);
				await db
					.delete(refreshTokensTable)
					.where(
						and(
							eq(refreshTokensTable.token, hashedRefreshToken),
							eq(refreshTokensTable.userId, user.id),
						),
					);
			}
		} catch (_) {
			// If token is invalid or expired, just ignore
		}
	}
}
