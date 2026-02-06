import type z from 'zod';
import type { REPORT_PERIOD } from './data';
import type { payloadReportSummaryValidator } from './report.validator';

export type PayloadReportSummary = z.infer<
	typeof payloadReportSummaryValidator
>;

export type ReportPeriod = (typeof REPORT_PERIOD)[keyof typeof REPORT_PERIOD];
