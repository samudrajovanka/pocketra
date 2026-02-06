import {
	endOfDay,
	endOfMonth,
	startOfDay,
	startOfMonth,
	subDays,
	subMonths,
} from 'date-fns';
import { REPORT_PERIOD } from '../../modules/report/data';
import type { ReportPeriod } from '../../modules/report/types';

interface DateRange {
	current: { start: Date; end: Date };
	previous: { start: Date; end: Date };
}

const getTodayRange = (now: Date): DateRange => {
	const currentStart = startOfDay(now);
	const currentEnd = endOfDay(now);
	const previousStart = subDays(currentStart, 1);
	const previousEnd = subDays(currentEnd, 1);

	return {
		current: { start: currentStart, end: currentEnd },
		previous: { start: previousStart, end: previousEnd },
	};
};

const getLast7DaysRange = (now: Date): DateRange => {
	const currentEnd = endOfDay(now);
	const currentStart = subDays(currentEnd, 6);
	const previousEnd = subDays(currentStart, 1);
	const previousStart = subDays(previousEnd, 6);

	return {
		current: { start: currentStart, end: currentEnd },
		previous: { start: previousStart, end: previousEnd },
	};
};

const getLast30DaysRange = (now: Date): DateRange => {
	const currentEnd = endOfDay(now);
	const currentStart = subDays(currentEnd, 29);
	const previousEnd = subDays(currentStart, 1);
	const previousStart = subDays(previousEnd, 29);

	return {
		current: { start: currentStart, end: currentEnd },
		previous: { start: previousStart, end: previousEnd },
	};
};

const getMonthToDateRange = (now: Date): DateRange => {
	const currentStart = startOfMonth(now);
	const currentEnd = endOfDay(now);
	const previousStart = subMonths(currentStart, 1);
	const previousEnd = subMonths(currentEnd, 1);

	return {
		current: { start: currentStart, end: currentEnd },
		previous: { start: previousStart, end: previousEnd },
	};
};

const getFullMonthRange = (startDate: Date): DateRange => {
	const currentStart = startOfMonth(startDate);
	const currentEnd = endOfMonth(currentStart);
	const previousStart = subMonths(currentStart, 1);
	const previousEnd = endOfMonth(previousStart);

	return {
		current: { start: currentStart, end: currentEnd },
		previous: { start: previousStart, end: previousEnd },
	};
};

const getCustomRange = (startDate: Date, endDate: Date): DateRange => {
	const currentStart = startOfDay(startDate);
	const currentEnd = endOfDay(endDate);
	const duration = currentEnd.getTime() - currentStart.getTime();
	const previousEnd = new Date(currentStart.getTime() - 1);
	const previousStart = new Date(previousEnd.getTime() - duration);

	return {
		current: { start: currentStart, end: currentEnd },
		previous: { start: previousStart, end: previousEnd },
	};
};

export const getDateRangeComparison = (
	period: ReportPeriod,
	customStart?: Date,
	customEnd?: Date,
): DateRange => {
	const now = new Date();

	switch (period) {
		case REPORT_PERIOD.today:
			return getTodayRange(now);

		case REPORT_PERIOD.last_7_days:
			return getLast7DaysRange(now);

		case REPORT_PERIOD.last_30_days:
			return getLast30DaysRange(now);

		case REPORT_PERIOD.month_to_date:
			return getMonthToDateRange(now);

		case REPORT_PERIOD.full_month:
			if (!customStart) {
				throw new Error('Start date is required for full month period');
			}
			return getFullMonthRange(customStart);

		case REPORT_PERIOD.custom:
			if (!customStart || !customEnd) {
				throw new Error(
					'Start date and end date are required for custom period',
				);
			}
			return getCustomRange(customStart, customEnd);

		default:
			return getMonthToDateRange(now);
	}
};
