import { and, between, eq, sql } from 'drizzle-orm';
import { db } from '../../config/db';
import { pocketsTable } from '../pocket/pocket.schema';
import { transactionsTable } from '../transaction/transaction.schema';

export default class ReportService {
	async getSummary(
		userId: string,
		params: { startDate?: Date; endDate?: Date },
	) {
		const conditions = [eq(pocketsTable.userId, userId)];

		if (params.startDate && params.endDate) {
			conditions.push(
				between(transactionsTable.date, params.startDate, params.endDate),
			);
		}

		const result = await db
			.select({
				type: transactionsTable.type,
				amount: sql<number>`SUM(amount) as amount`,
			})
			.from(transactionsTable)
			.innerJoin(pocketsTable, eq(transactionsTable.pocketId, pocketsTable.id))
			.where(and(...conditions))
			.groupBy(transactionsTable.type);

		const income = result.find((row) => row.type === 'income')?.amount || 0;
		const expense = result.find((row) => row.type === 'expense')?.amount || 0;

		return {
			income: income.toString(),
			expense: expense.toString(),
			net: (income - expense).toString(),
		};
	}
}
