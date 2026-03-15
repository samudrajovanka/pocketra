import {
	endOfDay,
	endOfMonth,
	startOfDay,
	startOfMonth,
	subDays,
	subMonths,
} from 'date-fns';
import type {
	DateRange,
	DateRangeComparison,
	DateRangePeriod,
} from '../../types/time';
import { DATE_RANGE_PERIOD } from '../constants/time';

const getTodayRange = (now: Date): DateRange => {
	const start = startOfDay(now);
	const end = endOfDay(now);

	return { start, end };
};

const getTodayRangeComparison = (now: Date): DateRangeComparison => {
	const current = getTodayRange(now);
	const previous = {
		start: subDays(current.start, 1),
		end: subDays(current.end, 1),
	};

	return {
		current,
		previous,
	};
};

const getLast7DaysRange = (now: Date): DateRange => {
	const end = endOfDay(now);
	const start = subDays(end, 6);

	return { start, end };
};

const getLast7DaysRangeComparison = (now: Date): DateRangeComparison => {
	const current = getLast7DaysRange(now);
	const previousEnd = subDays(current.start, 1);
	const previousStart = subDays(previousEnd, 6);

	return {
		current,
		previous: { start: previousStart, end: previousEnd },
	};
};

const getLast30DaysRange = (now: Date): DateRange => {
	const end = endOfDay(now);
	const start = subDays(end, 29);

	return { start, end };
};

const getLast30DaysRangeComparison = (now: Date): DateRangeComparison => {
	const current = getLast30DaysRange(now);
	const previousEnd = subDays(current.start, 1);
	const previousStart = subDays(previousEnd, 29);

	return {
		current,
		previous: { start: previousStart, end: previousEnd },
	};
};

const getMonthToDateRange = (now: Date): DateRange => {
	const start = startOfMonth(now);
	const end = endOfDay(now);

	return { start, end };
};

const getMonthToDateRangeComparison = (now: Date): DateRangeComparison => {
	const current = getMonthToDateRange(now);
	const previousStart = subMonths(current.start, 1);
	const previousEnd = subMonths(current.end, 1);

	return {
		current,
		previous: { start: previousStart, end: previousEnd },
	};
};

const getFullMonthRange = (startDate: Date): DateRange => {
	const start = startOfMonth(startDate);
	const end = endOfMonth(start);

	return { start, end };
};

const getFullMonthRangeComparison = (startDate: Date): DateRangeComparison => {
	const current = getFullMonthRange(startDate);
	const previousStart = subMonths(current.start, 1);
	const previousEnd = endOfMonth(previousStart);

	return {
		current,
		previous: { start: previousStart, end: previousEnd },
	};
};

const getCustomRange = (startDate: Date, endDate: Date): DateRange => {
	const start = startOfDay(startDate);
	const end = endOfDay(endDate);

	return { start, end };
};

const getCustomRangeComparison = (
	startDate: Date,
	endDate: Date,
): DateRangeComparison => {
	const current = getCustomRange(startDate, endDate);
	const duration = current.end.getTime() - current.start.getTime();
	const previousEnd = new Date(current.start.getTime() - 1);
	const previousStart = new Date(previousEnd.getTime() - duration);

	return {
		current,
		previous: { start: previousStart, end: previousEnd },
	};
};

export const getDateRangeComparison = (
	period: DateRangePeriod,
	customStart?: Date,
	customEnd?: Date,
): DateRangeComparison => {
	const now = new Date();

	switch (period) {
		case DATE_RANGE_PERIOD.today:
			return getTodayRangeComparison(now);

		case DATE_RANGE_PERIOD.last_7_days:
			return getLast7DaysRangeComparison(now);

		case DATE_RANGE_PERIOD.last_30_days:
			return getLast30DaysRangeComparison(now);

		case DATE_RANGE_PERIOD.month_to_date:
			return getMonthToDateRangeComparison(now);

		case DATE_RANGE_PERIOD.full_month:
			if (!customStart) {
				throw new Error('Start date is required for full month period');
			}
			return getFullMonthRangeComparison(customStart);

		case DATE_RANGE_PERIOD.custom:
			if (!customStart || !customEnd) {
				throw new Error(
					'Start date and end date are required for custom period',
				);
			}
			return getCustomRangeComparison(customStart, customEnd);

		default:
			return getMonthToDateRangeComparison(now);
	}
};
