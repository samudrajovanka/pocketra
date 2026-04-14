import { and, between, eq, lte, sql } from 'drizzle-orm';
import { db } from '../../config/db';
import { transactionsTable } from '../transaction/transaction.schema';
import { BUDGET_PERIOD } from './data';
import { pocketBudgetsTable } from './pocket-budget.schema';
import type {
	CreatePocketBudgetWithResetDate,
	UpdatePocketBudgetWithResetDate,
} from './types';

export default class PocketBudgetRepository {
	async checkBudgetExist(pocketId: string, userId: string) {
		const budget = await db.query.pocketBudgetsTable.findFirst({
			where: eq(pocketBudgetsTable.pocketId, pocketId),
			columns: {
				pocketId: true,
			},
			with: {
				pocket: {
					columns: {
						userId: true,
					},
				},
			},
		});

		if (budget?.pocket.userId !== userId) {
			return false;
		}

		return true;
	}

	async findBudgetByPocketId(pocketId: string, userId: string) {
		const result = await db.query.pocketBudgetsTable.findFirst({
			where: eq(pocketBudgetsTable.pocketId, pocketId),
			with: {
				pocket: {
					columns: {
						id: true,
						userId: true,
					},
				},
			},
		});

		if (result?.pocket.userId !== userId) {
			return null;
		}

		return result;
	}

	async calculateCurrentNet(
		pocketId: string,
		periodStartDate: Date,
		nextResetDate: Date,
	) {
		const result = await db
			.select({
				spent: sql<number>`COALESCE(
				SUM(
					CASE
						WHEN ${transactionsTable.type} IN ('income', 'transfer_in') THEN -${transactionsTable.amount}
						ELSE ${transactionsTable.amount}
					END
				), 0
			)`,
			})
			.from(transactionsTable)
			.where(
				and(
					eq(transactionsTable.pocketId, pocketId),
					between(transactionsTable.date, periodStartDate, nextResetDate),
				),
			);

		return Number(result[0]?.spent || 0);
	}

	async createBudget(pocketId: string, data: CreatePocketBudgetWithResetDate) {
		const [budget] = await db
			.insert(pocketBudgetsTable)
			.values({
				pocketId,
				limitAmount: data.limitAmount.toString(),
				period: data.period,
				alertThreshold: data.alertThreshold.toString(),
				periodStartDate: new Date(data.periodStartDate),
				nextResetDate: new Date(data.nextResetDate),
			})
			.returning({
				id: pocketBudgetsTable.id,
			});

		return budget;
	}

	async updateBudget(pocketId: string, data: UpdatePocketBudgetWithResetDate) {
		const [budget] = await db
			.update(pocketBudgetsTable)
			.set({
				...data,
				limitAmount: data.limitAmount?.toString(),
				alertThreshold: data.alertThreshold?.toString(),
				nextResetDate: data.nextResetDate,
			})
			.where(eq(pocketBudgetsTable.pocketId, pocketId))
			.returning();

		return budget;
	}

	async deleteBudget(pocketId: string) {
		const [budget] = await db
			.delete(pocketBudgetsTable)
			.where(eq(pocketBudgetsTable.pocketId, pocketId))
			.returning();

		return budget;
	}

	async findBudgetsToReset(currentDate: Date) {
		return await db.query.pocketBudgetsTable.findMany({
			where: lte(pocketBudgetsTable.nextResetDate, currentDate),
			with: {
				pocket: {
					columns: {
						name: true,
						userId: true,
					},
				},
			},
		});
	}

	async resetBudgetPeriod(
		budgetId: string,
		newPeriodStart: Date,
		newNextReset: Date,
	) {
		const [budget] = await db
			.update(pocketBudgetsTable)
			.set({
				periodStartDate: newPeriodStart,
				nextResetDate: newNextReset,
			})
			.where(eq(pocketBudgetsTable.id, budgetId))
			.returning();

		return budget;
	}

	async bulkResetBudgetPeriods(currentDate: Date) {
		const result = await db.execute(sql`
			UPDATE pocket_budgets pb
			SET 
				period_start_date = pb.next_reset_date,
				next_reset_date = CASE 
					WHEN period = ${BUDGET_PERIOD.daily} THEN (pb.next_reset_date::date + INTERVAL '1 day')
					WHEN period = ${BUDGET_PERIOD.weekly} THEN (pb.next_reset_date::date + INTERVAL '1 week')  
					WHEN period = ${BUDGET_PERIOD.monthly} THEN (pb.next_reset_date::date + INTERVAL '1 month')
					ELSE next_reset_date
				END,
				updated_at = NOW()
			WHERE next_reset_date <= ${currentDate}
			RETURNING id
		`);

		return result.rows;
	}

	async getAllBudgetsForUser(userId: string) {
		const result = await db.query.pocketBudgetsTable.findMany({
			with: {
				pocket: {
					columns: {
						name: true,
						userId: true,
					},
				},
			},
		});

		// Filter for user's pockets only
		return result.filter((budget) => budget.pocket.userId === userId);
	}
}
