import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { baseColumns } from '../../utils/helpers/schema';
import { authProvider } from './data';

export const usersTable = pgTable('users', {
	...baseColumns,
	email: varchar('email').unique().notNull(),
	name: varchar('name').notNull(),
	avatarUrl: varchar('avatar_url'),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
	userProviders: many(userProvidersTable),
	refreshTokens: many(refreshTokensTable),
}));

export const authProviderEnum = pgEnum(
	'auth_provider',
	Object.values(authProvider) as [string, ...string[]],
);

export const userProvidersTable = pgTable('user_providers', {
	...baseColumns,
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	provider: authProviderEnum().notNull(),
	providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
});

export const userProvidersRelations = relations(
	userProvidersTable,
	({ one }) => ({
		user: one(usersTable, {
			fields: [userProvidersTable.userId],
			references: [usersTable.id],
		}),
	}),
);

export const refreshTokensTable = pgTable('refresh_tokens', {
	...baseColumns,
	token: varchar('token').unique().notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const refreshTokensRelations = relations(
	refreshTokensTable,
	({ one }) => ({
		user: one(usersTable, {
			fields: [refreshTokensTable.userId],
			references: [usersTable.id],
		}),
	}),
);
