import { and, between, eq, sql } from 'drizzle-orm';
import { db } from '../../config/db';
import { calculateGrowth } from '../../utils/helpers/math';
import { getDateRangeComparison } from '../../utils/helpers/time';
import { pocketsTable } from '../pocket/pocket.schema';
import { transactionsTable } from '../transaction/transaction.schema';
import type { PayloadReportSummary } from './types';

export default class ReportService {
	async getSummary(userId: string, params: PayloadReportSummary) {
		const { current, previous } = getDateRangeComparison(
			params.period,
			params.startDate,
			params.endDate,
		);

		const [currentSummary, previousSummary] = await Promise.all([
			this.getPeriodSummary(userId, current.start, current.end),
			this.getPeriodSummary(userId, previous.start, previous.end),
		]);

		return {
			income: {
				value: currentSummary.income.toString(),
				growthPercent: calculateGrowth(
					currentSummary.income,
					previousSummary.income,
				),
			},
			expense: {
				value: currentSummary.expense.toString(),
				growthPercent: calculateGrowth(
					currentSummary.expense,
					previousSummary.expense,
				),
			},
			net: {
				value: (currentSummary.income - currentSummary.expense).toString(),
				growthPercent: calculateGrowth(
					currentSummary.income - currentSummary.expense,
					previousSummary.income - previousSummary.expense,
				),
			},
		};
	}

	private async getPeriodSummary(
		userId: string,
		startDate: Date,
		endDate: Date,
	) {
		const result = await db
			.select({
				type: transactionsTable.type,
				amount: sql<number>`SUM(amount) as amount`,
			})
			.from(transactionsTable)
			.innerJoin(pocketsTable, eq(transactionsTable.pocketId, pocketsTable.id))
			.where(
				and(
					eq(pocketsTable.userId, userId),
					between(transactionsTable.date, startDate, endDate),
				),
			)
			.groupBy(transactionsTable.type);

		const income = result.find((row) => row.type === 'income')?.amount || 0;
		const expense = result.find((row) => row.type === 'expense')?.amount || 0;

		return { income, expense };
	}
}
