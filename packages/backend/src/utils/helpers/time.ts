import { TZDate } from '@date-fns/tz';
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
import { APP_TIMEZONE, DATE_RANGE_PERIOD } from '../constants/time';

/** Convert a TZDate (or any Date) to a plain UTC Date to ensure consistent toISOString() output */
const toUtc = (d: Date): Date => new Date(d.getTime());

export const getTodayRange = (now: Date): DateRange => {
	const nowInTz = new TZDate(now, APP_TIMEZONE);
	const start = toUtc(startOfDay(nowInTz));
	const end = toUtc(endOfDay(nowInTz));

	return { start, end };
};

export const getTodayRangeComparison = (now: Date): DateRangeComparison => {
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

export const getLast7DaysRange = (now: Date): DateRange => {
	const nowInTz = new TZDate(now, APP_TIMEZONE);
	const end = toUtc(endOfDay(nowInTz));
	const start = toUtc(
		startOfDay(new TZDate(subDays(nowInTz, 6), APP_TIMEZONE)),
	);

	return { start, end };
};

export const getLast7DaysRangeComparison = (now: Date): DateRangeComparison => {
	const current = getLast7DaysRange(now);
	const previousEnd = subDays(current.start, 1);
	const previousStart = subDays(previousEnd, 6);

	return {
		current,
		previous: { start: previousStart, end: previousEnd },
	};
};

export const getLast30DaysRange = (now: Date): DateRange => {
	const nowInTz = new TZDate(now, APP_TIMEZONE);
	const end = toUtc(endOfDay(nowInTz));
	const start = toUtc(
		startOfDay(new TZDate(subDays(nowInTz, 29), APP_TIMEZONE)),
	);

	return { start, end };
};

export const getLast30DaysRangeComparison = (
	now: Date,
): DateRangeComparison => {
	const current = getLast30DaysRange(now);
	const previousEnd = subDays(current.start, 1);
	const previousStart = subDays(previousEnd, 29);

	return {
		current,
		previous: { start: previousStart, end: previousEnd },
	};
};

export const getMonthToDateRange = (now: Date): DateRange => {
	const nowInTz = new TZDate(now, APP_TIMEZONE);
	const start = toUtc(startOfMonth(nowInTz));
	const end = toUtc(endOfDay(nowInTz));

	return { start, end };
};

export const getMonthToDateRangeComparison = (
	now: Date,
): DateRangeComparison => {
	const current = getMonthToDateRange(now);
	const previousStart = subMonths(current.start, 1);
	const previousEnd = subMonths(current.end, 1);

	return {
		current,
		previous: { start: previousStart, end: previousEnd },
	};
};

export const getFullMonthRange = (startDate: Date): DateRange => {
	const startInTz = new TZDate(startDate, APP_TIMEZONE);
	const start = toUtc(startOfMonth(startInTz));
	const end = toUtc(endOfMonth(startOfMonth(startInTz)));

	return { start, end };
};

export const getFullMonthRangeComparison = (
	startDate: Date,
): DateRangeComparison => {
	const current = getFullMonthRange(startDate);
	const previousStart = subMonths(current.start, 1);
	const previousEnd = endOfMonth(previousStart);

	return {
		current,
		previous: { start: previousStart, end: previousEnd },
	};
};

export const getCustomRange = (startDate: Date, endDate: Date): DateRange => {
	const startInTz = new TZDate(startDate, APP_TIMEZONE);
	const endInTz = new TZDate(endDate, APP_TIMEZONE);
	const start = toUtc(startOfDay(startInTz));
	const end = toUtc(endOfDay(endInTz));

	return { start, end };
};

export const getCustomRangeComparison = (
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
	now: Date = new Date(),
): DateRangeComparison => {
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
