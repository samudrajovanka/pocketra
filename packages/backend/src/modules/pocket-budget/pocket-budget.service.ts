import { TZDate } from '@date-fns/tz';
import { addDays, addMonths, addWeeks, startOfDay } from 'date-fns';
import InvariantError from '../../exceptions/InvariantError';
import NotFoundError from '../../exceptions/NotFoundError';
import { APP_TIMEZONE } from '../../utils/constants/time';
import { BUDGET_PERIOD } from './data';
import PocketBudgetRepository from './pocket-budget.repository';
import type {
	BudgetPeriod,
	CreatePocketBudgetPayload,
	PocketBudgetWithProgress,
	UpdatePocketBudgetPayload,
	UpdatePocketBudgetWithResetDate,
} from './types';

export default class PocketBudgetService {
	private repository = new PocketBudgetRepository();

	async createBudget(
		pocketId: string,
		userId: string,
		data: CreatePocketBudgetPayload,
	) {
		const existingBudget = await this.repository.checkBudgetExist(
			pocketId,
			userId,
		);

		if (existingBudget) {
			throw new InvariantError('Budget already exists for this pocket');
		}

		const nextResetDate = this.calculateNextResetDate(
			data.period,
			data.periodStartDate,
		);

		const budgetData = {
			...data,
			periodStartDate: startOfDay(
				new TZDate(data.periodStartDate, APP_TIMEZONE),
			).toISOString(),
			nextResetDate: startOfDay(new TZDate(nextResetDate, APP_TIMEZONE)),
		};

		return await this.repository.createBudget(pocketId, budgetData);
	}

	async getBudgetWithProgress(
		pocketId: string,
		userId: string,
	): Promise<PocketBudgetWithProgress> {
		console.log('new Date', new Date());
		const budget = await this.repository.findBudgetByPocketId(pocketId, userId);

		if (!budget) {
			throw new NotFoundError('Budget not found for this pocket');
		}

		const periodStart = new Date(budget.periodStartDate);
		const nextReset = new Date(budget.nextResetDate);

		const currentSpent = await this.repository.calculateCurrentNet(
			pocketId,
			periodStart,
			nextReset,
		);

		const limitAmount = Number(budget.limitAmount);
		const alertThreshold = Number(budget.alertThreshold);

		const progressPercentage =
			limitAmount > 0 ? (currentSpent / limitAmount) * 100 : 0;
		const remainingAmount = limitAmount - currentSpent;
		const isOverBudget = progressPercentage > 100;
		const shouldAlert = progressPercentage >= alertThreshold * 100;

		return {
			...budget,
			currentSpent,
			progressPercentage,
			remainingAmount,
			isOverBudget,
			shouldAlert,
		};
	}

	async updateBudget(
		pocketId: string,
		userId: string,
		data: UpdatePocketBudgetPayload,
	) {
		const existingBudget = await this.repository.findBudgetByPocketId(
			pocketId,
			userId,
		);

		if (!existingBudget) {
			throw new NotFoundError('Budget not found for this pocket');
		}

		const updateData = { ...data } as UpdatePocketBudgetWithResetDate;

		if (data.period) {
			const nextResetDate = this.calculateNextResetDate(
				data.period,
				existingBudget.periodStartDate,
			);
			updateData.nextResetDate = startOfDay(
				new TZDate(nextResetDate, APP_TIMEZONE),
			);
		}

		return await this.repository.updateBudget(pocketId, updateData);
	}

	async deleteBudget(pocketId: string, userId: string) {
		const existingBudget = await this.repository.checkBudgetExist(
			pocketId,
			userId,
		);

		if (!existingBudget) {
			throw new NotFoundError('Budget not found for this pocket');
		}

		return await this.repository.deleteBudget(pocketId);
	}

	async resetExpiredBudgets() {
		const today = new Date();

		const resetResults = await this.repository.bulkResetBudgetPeriods(today);

		return resetResults.length;
	}

	private calculateNextResetDate(
		period: BudgetPeriod,
		startDate: string | Date,
	): Date {
		switch (period) {
			case BUDGET_PERIOD.daily:
				return addDays(startDate, 1);
			case BUDGET_PERIOD.weekly:
				return addWeeks(startDate, 1);
			case BUDGET_PERIOD.monthly:
				return addMonths(startDate, 1);
			default:
				throw new InvariantError('Invalid budget period');
		}
	}
}
