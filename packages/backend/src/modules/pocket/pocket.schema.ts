import { relations } from 'drizzle-orm';
import { decimal, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { baseColumns } from '../../utils/helpers/schema';
import { usersTable } from '../auth/auth.schema';
import { transactionsTable } from '../transaction/transaction.schema';
import { POCKET_TYPE } from './data';

export const pocketTypeEnum = pgEnum(
	'pocket_type',
	Object.values(POCKET_TYPE) as [string, ...string[]],
);

export const pocketsTable = pgTable('pockets', {
	...baseColumns,
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	name: varchar('name').notNull(),
	icon: varchar('icon').notNull(),
	type: pocketTypeEnum().default(POCKET_TYPE.Cash).notNull(),
	color: varchar('color'),
	initialBalance: decimal('initial_balance', { precision: 19, scale: 4 })
		.notNull()
		.default('0'),
});

export const pocketsRelations = relations(pocketsTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [pocketsTable.userId],
		references: [usersTable.id],
	}),
	transactions: many(transactionsTable, { relationName: 'transactions' }),
	relatedTransactions: many(transactionsTable, {
		relationName: 'relatedTransactions',
	}),
}));
