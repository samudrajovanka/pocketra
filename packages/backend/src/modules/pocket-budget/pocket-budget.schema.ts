import { relations } from 'drizzle-orm';
import { date, decimal, pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core';
import { amountType, baseColumns } from '../../utils/helpers/schema';
import { pocketsTable } from '../pocket/pocket.schema';
import { BUDGET_PERIOD } from './data';

export const budgetPeriodEnum = pgEnum(
	'budget_period',
	Object.values(BUDGET_PERIOD) as [string, ...string[]],
);

export const pocketBudgetsTable = pgTable('pocket_budgets', {
	...baseColumns,
	pocketId: uuid('pocket_id')
		.notNull()
		.unique()
		.references(() => pocketsTable.id, { onDelete: 'cascade' }),
	limitAmount: amountType('limit_amount').notNull(),
	period: budgetPeriodEnum().default('monthly').notNull(),
	alertThreshold: decimal('alert_threshold', { precision: 3, scale: 2 })
		.default('0.8')
		.notNull(),
	periodStartDate: date('period_start_date').notNull(),
	nextResetDate: date('next_reset_date').notNull(),
});

export const pocketBudgetsRelations = relations(
	pocketBudgetsTable,
	({ one }) => ({
		pocket: one(pocketsTable, {
			fields: [pocketBudgetsTable.pocketId],
			references: [pocketsTable.id],
		}),
	}),
);
