import { z } from 'zod';
import { validationMiddleware } from '../../middlewares/validation';
import { REPORT_PERIOD } from './data';

const reportDateRangeSchema = z
	.object({
		period: z
			.enum(Object.values(REPORT_PERIOD))
			.default(REPORT_PERIOD.month_to_date),
		startDate: z.date().optional(),
		endDate: z.date().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.period === REPORT_PERIOD.custom) {
			if (!data.startDate) {
				ctx.addIssue({
					code: 'custom',
					message: 'Start date is required for custom period',
					path: ['startDate'],
				});
			}

			if (!data.endDate) {
				ctx.addIssue({
					code: 'custom',
					message: 'End date is required for custom period',
					path: ['endDate'],
				});
			}
		}

		if (data.period === REPORT_PERIOD.full_month) {
			if (!data.startDate) {
				ctx.addIssue({
					code: 'custom',
					message: 'Start date is required for full month period',
					path: ['startDate'],
				});
			}
		}
	});

export const payloadReportSummaryValidator = reportDateRangeSchema;

export const payloadReportExpenseValidator = reportDateRangeSchema.and(
	z.object({
		top: z.coerce.number().optional(),
	}),
);

export const zPayloadReportSummaryValidator = validationMiddleware(
	'query',
	payloadReportSummaryValidator,
);

export const zPayloadReportExpenseValidator = validationMiddleware(
	'query',
	payloadReportExpenseValidator,
);
