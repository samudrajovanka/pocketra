import type { REPORT_PERIOD } from '@/lib/constants/report';

export type ReportPeriod = (typeof REPORT_PERIOD)[keyof typeof REPORT_PERIOD];
