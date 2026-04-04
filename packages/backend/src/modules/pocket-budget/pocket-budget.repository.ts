import { and, eq, gte, inArray, lt, lte, sql, sum } from 'drizzle-orm';
import { db } from '../../config/db';
import { TRANSACTION_TYPE } from '../transaction/data';
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
				pocket: true,
			},
		});

		if (result?.pocket.userId !== userId) {
			return null;
		}

		return result;
	}

	async calculateCurrentSpent(
		pocketId: string,
		periodStartDate: Date,
		nextResetDate: Date,
	) {
		const result = await db
			.select({ spent: sum(transactionsTable.amount) })
			.from(transactionsTable)
			.where(
				and(
					eq(transactionsTable.pocketId, pocketId),
					inArray(transactionsTable.type, [
						TRANSACTION_TYPE.expense,
						TRANSACTION_TYPE.transfer_out,
					]),
					gte(transactionsTable.date, periodStartDate),
					lt(transactionsTable.date, nextResetDate),
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
				periodStartDate: data.periodStartDate.toISOString(),
				nextResetDate: data.nextResetDate.toISOString(),
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
				periodStartDate: data.periodStartDate?.toISOString(),
				nextResetDate: data.nextResetDate?.toISOString(),
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
		const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
		return await db.query.pocketBudgetsTable.findMany({
			where: lte(pocketBudgetsTable.nextResetDate, dateStr),
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
		const periodStartStr = newPeriodStart.toISOString();
		const nextResetStr = newNextReset.toISOString();

		const [budget] = await db
			.update(pocketBudgetsTable)
			.set({
				periodStartDate: periodStartStr,
				nextResetDate: nextResetStr,
			})
			.where(eq(pocketBudgetsTable.id, budgetId))
			.returning();

		return budget;
	}

	async bulkResetBudgetPeriods(currentDate: Date) {
		const dateStr = currentDate.toISOString();

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
			WHERE next_reset_date <= ${dateStr}::date
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
