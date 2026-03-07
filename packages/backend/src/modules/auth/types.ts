import type z from 'zod';
import type { userProvidersTable, usersTable } from './auth.schema';
import type {
	payloadExchangeCodeValidator,
	payloadLogoutValidator,
	payloadRefreshTokenValidator,
} from './auth.validator';
import type { authProvider } from './data';

export type User = typeof usersTable.$inferSelect;
export type UserProvider = typeof userProvidersTable.$inferSelect;
export type AuthProvider = keyof typeof authProvider;

export type OauthProfile = {
	providerUserId: string;
	name: string;
	picture: string;
	email: string;
};

export type GoogleOauthProfile = {
	sub: string;
	name: string;
	picture: string;
	email: string;
};

export type GenerateAccessTokenPayload = {
	email: string;
};

export type GenerateRefreshTokenPayload = {
	email: string;
};

export type LoggedUser = Pick<User, 'id' | 'email' | 'name'>;

export type ExchangeCodeParam = z.infer<typeof payloadExchangeCodeValidator>;

export type PayloadRefreshToken = z.infer<typeof payloadRefreshTokenValidator>;

export type PayloadLogout = z.infer<typeof payloadLogoutValidator>;
