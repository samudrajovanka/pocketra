import type z from 'zod';
import type { payloadReportSummaryValidator } from './report.validator';

export type PayloadReportSummary = z.infer<
	typeof payloadReportSummaryValidator
>;
