import type { DateRangePeriod } from '../../../types/time';
import { DATE_RANGE_PERIOD } from '../../../utils/constants/time';

export const REPORT_PERIOD: Record<DateRangePeriod, DateRangePeriod> = {
	[DATE_RANGE_PERIOD.today]: DATE_RANGE_PERIOD.today,
	[DATE_RANGE_PERIOD.month_to_date]: DATE_RANGE_PERIOD.month_to_date,
	[DATE_RANGE_PERIOD.full_month]: DATE_RANGE_PERIOD.full_month,
	[DATE_RANGE_PERIOD.last_7_days]: DATE_RANGE_PERIOD.last_7_days,
	[DATE_RANGE_PERIOD.last_30_days]: DATE_RANGE_PERIOD.last_30_days,
	[DATE_RANGE_PERIOD.custom]: DATE_RANGE_PERIOD.custom,
};
