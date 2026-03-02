import type z from 'zod';
import type { REPORT_PERIOD } from './data';
import type {
	payloadReportExpenseValidator,
	payloadReportSummaryValidator,
} from './report.validator';

export type PayloadReportSummary = z.infer<
	typeof payloadReportSummaryValidator
>;

export type PayloadReportExpense = z.infer<
	typeof payloadReportExpenseValidator
>;

export type ReportPeriod = (typeof REPORT_PERIOD)[keyof typeof REPORT_PERIOD];
