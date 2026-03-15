import type { DATE_RANGE_PERIOD } from '@/lib/constants/time';

export type DateRangePeriod =
	(typeof DATE_RANGE_PERIOD)[keyof typeof DATE_RANGE_PERIOD];
