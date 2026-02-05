import { z } from 'zod';
import { validationMiddleware } from '../../middlewares/validation';

export const payloadReportSummaryValidator = z.object({
	startDate: z.iso.datetime().optional(),
	endDate: z.iso.datetime().optional(),
});

export const zPayloadReportSummaryValidator = validationMiddleware(
	'query',
	payloadReportSummaryValidator,
);
