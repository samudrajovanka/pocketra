import { endOfMonth, startOfMonth } from 'date-fns';
import { createFactory } from 'hono/factory';
import { authMiddleware } from '../../middlewares/auth';
import { successResponse } from '../../utils/helpers/response';
import ReportService from './report.service';
import { zPayloadReportSummaryValidator } from './report.validator';
import type { PayloadReportSummary } from './types';

const { createHandlers } = createFactory();

export const getSummary = createHandlers(
	authMiddleware,
	zPayloadReportSummaryValidator,
	async (c) => {
		const user = c.var.user;
		const { startDate: startDateParam, endDate: endDateParam } = c.req.valid(
			'query',
		) as PayloadReportSummary;

		let startDate: Date;
		let endDate: Date;

		if (startDateParam && endDateParam) {
			startDate = new Date(startDateParam);
			endDate = new Date(endDateParam);
		} else {
			const now = new Date();
			startDate = startOfMonth(now);
			endDate = endOfMonth(now);
		}

		const reportService = new ReportService();
		const data = await reportService.getSummary(user.id, {
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
