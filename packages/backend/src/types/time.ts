import type { DATE_RANGE_PERIOD } from '../utils/constants/time';

export type DateRangePeriod =
	(typeof DATE_RANGE_PERIOD)[keyof typeof DATE_RANGE_PERIOD];

export type DateRange = {
	start: Date;
	end: Date;
};

export type DateRangeComparison = {
	current: DateRange;
	previous: DateRange;
};
