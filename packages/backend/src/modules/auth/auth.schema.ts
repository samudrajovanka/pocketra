import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { baseColumns } from '../../utils/helpers/schema';
import { authProvider } from './data';

export const usersTable = pgTable('users', {
	...baseColumns,
	email: varchar('email').unique().notNull(),
	name: varchar('name').notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
	userProviders: many(userProvidersTable),
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
