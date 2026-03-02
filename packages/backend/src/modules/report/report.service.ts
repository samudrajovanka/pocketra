import { and, between, eq, sql } from 'drizzle-orm';
import { db } from '../../config/db';
import {
	calculateGrowth,
	calculatePercentage,
	processTopNItems,
} from '../../utils/helpers/math';
import { getDateRangeComparison } from '../../utils/helpers/time';
import { categoriesTable } from '../category/category.schema';
import { pocketsTable } from '../pocket/pocket.schema';
import { transactionsTable } from '../transaction/transaction.schema';
import type { PayloadReportExpense, PayloadReportSummary } from './types';

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

	async getExpenseByPocket(userId: string, params: PayloadReportExpense) {
		const { current } = getDateRangeComparison(
			params.period,
			params.startDate,
			params.endDate,
		);

		const result = await db
			.select({
				pocketId: pocketsTable.id,
				pocketName: pocketsTable.name,
				amount: sql<number>`SUM(transactions.amount) as amount`,
			})
			.from(transactionsTable)
			.innerJoin(pocketsTable, eq(transactionsTable.pocketId, pocketsTable.id))
			.where(
				and(
					eq(pocketsTable.userId, userId),
					eq(transactionsTable.type, 'expense'),
					between(transactionsTable.date, current.start, current.end),
				),
			)
			.groupBy(pocketsTable.id, pocketsTable.name);

		const totalAmount = result.reduce(
			(acc, curr) => acc + Number(curr.amount),
			0,
		);

		const formattedResult = result
			.map((item) => ({
				pocketId: item.pocketId,
				name: item.pocketName,
				amount: Number(item.amount),
				percentage: calculatePercentage(Number(item.amount), totalAmount),
			}))
			.sort((a, b) => b.amount - a.amount);

		if (params.top) {
			return processTopNItems(
				formattedResult,
				params.top,
				(item) => item.amount,
				(otherValue, name) => ({
					pocketId: 'others',
					name,
					amount: otherValue,
					percentage: calculatePercentage(otherValue, totalAmount),
				}),
			);
		}

		return formattedResult;
	}

	async getExpenseByCategory(userId: string, params: PayloadReportExpense) {
		const { current } = getDateRangeComparison(
			params.period,
			params.startDate,
			params.endDate,
		);

		const result = await db
			.select({
				categoryId: categoriesTable.id,
				categoryName: categoriesTable.name,
				amount: sql<number>`SUM(transactions.amount) as amount`,
			})
			.from(transactionsTable)
			.innerJoin(
				categoriesTable,
				eq(transactionsTable.categoryId, categoriesTable.id),
			)
			.innerJoin(pocketsTable, eq(transactionsTable.pocketId, pocketsTable.id))
			.where(
				and(
					eq(pocketsTable.userId, userId),
					eq(transactionsTable.type, 'expense'),
					between(transactionsTable.date, current.start, current.end),
				),
			)
			.groupBy(categoriesTable.id, categoriesTable.name);

		const totalAmount = result.reduce(
			(acc, curr) => acc + Number(curr.amount),
			0,
		);

		const formattedResult = result
			.map((item) => ({
				categoryId: item.categoryId,
				name: item.categoryName,
				amount: Number(item.amount),
				percentage: calculatePercentage(Number(item.amount), totalAmount),
			}))
			.sort((a, b) => b.amount - a.amount);

		if (params.top) {
			return processTopNItems(
				formattedResult,
				params.top,
				(item) => item.amount,
				(otherValue, name) => ({
					categoryId: 'others',
					name,
					amount: otherValue,
					percentage: calculatePercentage(otherValue, totalAmount),
				}),
			);
		}

		return formattedResult;
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
