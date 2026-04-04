import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { amountType, baseColumns } from '../../utils/helpers/schema';
import { categoriesTable } from '../category/category.schema';
import { pocketsTable } from '../pocket/pocket.schema';
import { TRANSACTION_TYPE } from './data';

export const transactionTypeEnum = pgEnum(
	'transaction_type',
	Object.values(TRANSACTION_TYPE) as [string, ...string[]],
);

export const transactionsTable = pgTable('transactions', {
	...baseColumns,
	pocketId: uuid('pocket_id')
		.notNull()
		.references(() => pocketsTable.id, { onDelete: 'cascade' }),
	categoryId: uuid('category_id')
		.notNull()
		.references(() => categoriesTable.id, { onDelete: 'restrict' }),
	type: transactionTypeEnum('type').notNull(),
	amount: amountType('amount').notNull(),
	description: text('description').notNull(),
	date: timestamp('date', { withTimezone: true }).notNull(),
	transferId: text('transfer_id'),
	relatedPocketId: uuid('related_pocket_id').references(() => pocketsTable.id, {
		onDelete: 'cascade',
	}),
});

export const transactionsRelations = relations(
	transactionsTable,
	({ one }) => ({
		pocket: one(pocketsTable, {
			fields: [transactionsTable.pocketId],
			references: [pocketsTable.id],
			relationName: 'transactions',
		}),
		relatedPocket: one(pocketsTable, {
			fields: [transactionsTable.relatedPocketId],
			references: [pocketsTable.id],
			relationName: 'relatedTransactions',
		}),
		category: one(categoriesTable, {
			fields: [transactionsTable.categoryId],
			references: [categoriesTable.id],
		}),
	}),
);
