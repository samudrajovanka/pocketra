import { createFactory } from 'hono/factory';
import { authMiddleware } from '../../middlewares/auth';
import { successResponse } from '../../utils/helpers/response';
import ReportService from './report.service';
import {
	zPayloadReportExpenseValidator,
	zPayloadReportSummaryValidator,
} from './report.validator';
import type { PayloadReportExpense, PayloadReportSummary } from './types';

const { createHandlers } = createFactory();

export const getSummary = createHandlers(
	authMiddleware,
	zPayloadReportSummaryValidator,
	async (c) => {
		const user = c.var.user;
		const { period, startDate, endDate } = c.req.valid(
			'query',
		) as PayloadReportSummary;

		console.log('CORS', process.env.ALLOWED_CORS_ORIGINS);

		const reportService = new ReportService();
		const data = await reportService.getSummary(user.id, {
			period,
			startDate,
			endDate,
		});

		return c.json(
			successResponse({
				message: 'Report summary fetched successfully',
				data,
			}),
		);
	},
);

export const getExpenseByPocket = createHandlers(
	authMiddleware,
	zPayloadReportExpenseValidator,
	async (c) => {
		const user = c.var.user;
		const { period, startDate, endDate, top } = c.req.valid(
			'query',
		) as PayloadReportExpense;

		const reportService = new ReportService();
		const data = await reportService.getExpenseByPocket(user.id, {
			period,
			startDate,
			endDate,
			top,
		});

		return c.json(
			successResponse({
				message: 'Expense by pocket fetched successfully',
				data,
			}),
		);
	},
);

export const getExpenseByCategory = createHandlers(
	authMiddleware,
	zPayloadReportExpenseValidator,
	async (c) => {
		const user = c.var.user;
		const { period, startDate, endDate, top } = c.req.valid(
			'query',
		) as PayloadReportExpense;

		const reportService = new ReportService();
		const data = await reportService.getExpenseByCategory(user.id, {
			period,
			startDate,
			endDate,
			top,
		});

		return c.json(
			successResponse({
				message: 'Expense by category fetched successfully',
				data,
			}),
		);
	},
);
