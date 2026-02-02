import { relations } from 'drizzle-orm';
import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { baseColumns } from '../../utils/helpers/schema';
import {
	transactionsTable,
	transactionTypeEnum,
} from '../transaction/transaction.schema';

export const categoriesTable = pgTable(
	'categories',
	{
		...baseColumns,
		name: varchar('name').notNull(),
		type: transactionTypeEnum('type').notNull(),
	},
	(transaction) => [
		uniqueIndex('unique_category_name_type').on(
			transaction.name,
			transaction.type,
		),
	],
);

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
	transactions: many(transactionsTable),
}));
