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
		const { period, startDate, endDate } = c.req.valid(
			'query',
		) as PayloadReportSummary;

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
