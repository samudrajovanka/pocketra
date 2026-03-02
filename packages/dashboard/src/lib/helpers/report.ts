import { REPORT_PERIOD } from '@/lib/constants/report';
import type { ReportPeriod } from '@/types/report';

export const getGrowthTooltipMessage = (period: ReportPeriod) => {
	switch (period) {
		case REPORT_PERIOD.today:
			return 'Compared to yesterday';
		case REPORT_PERIOD.last_7_days:
			return 'Compared to previous 7 days';
		case REPORT_PERIOD.last_30_days:
			return 'Compared to previous 30 days';
		case REPORT_PERIOD.month_to_date:
			return 'Compared to previous month (same period)';
		case REPORT_PERIOD.full_month:
			return 'Compared to previous month';
		case REPORT_PERIOD.custom:
			return 'Compared to previous period';
		default:
			return 'Compared to previous month (same period)';
	}
};
