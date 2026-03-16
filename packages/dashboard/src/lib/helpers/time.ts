import {
	endOfDay,
	endOfMonth,
	startOfDay,
	startOfMonth,
	subDays,
} from 'date-fns';
import type { DateRange, DateRangePeriod } from '@/types/time';
import { DATE_RANGE_PERIOD } from '../constants/time';

const getTodayRange = (now: Date): DateRange => {
	const from = startOfDay(now);
	const to = endOfDay(now);

	return { from, to };
};

const getLast7DaysRange = (now: Date): DateRange => {
	const to = endOfDay(now);
	const from = startOfDay(subDays(to, 6));

	return { from, to };
};

const getLast30DaysRange = (now: Date): DateRange => {
	const to = endOfDay(now);
	const from = startOfDay(subDays(to, 29));

	return { from, to };
};

const getMonthToDateRange = (now: Date): DateRange => {
	const from = startOfMonth(now);
	const to = endOfDay(now);

	return { from, to };
};

const getFullMonthRange = (startDate: Date): DateRange => {
	const from = startOfMonth(startDate);
	const to = endOfMonth(from);

	return { from, to };
};

const getCustomRange = (startDate: Date, endDate: Date): DateRange => {
	const from = startOfDay(startDate);
	const to = endOfDay(endDate);

	return { from, to };
};

export const getDateRange = (
	period: DateRangePeriod,
	customDate?: {
		from?: Date;
		to?: Date;
	},
): DateRange => {
	const dateFrom = customDate?.from || new Date();

	switch (period) {
		case DATE_RANGE_PERIOD.today:
			return getTodayRange(dateFrom);

		case DATE_RANGE_PERIOD.last_7_days:
			return getLast7DaysRange(dateFrom);

		case DATE_RANGE_PERIOD.last_30_days:
			return getLast30DaysRange(dateFrom);

		case DATE_RANGE_PERIOD.month_to_date:
			return getMonthToDateRange(dateFrom);

		case DATE_RANGE_PERIOD.full_month:
			return getFullMonthRange(dateFrom);

		case DATE_RANGE_PERIOD.custom:
			if (!customDate?.from || !customDate?.to) {
				throw new Error(
					'Start date and to date are required for custom period',
				);
			}
			return getCustomRange(customDate.from, customDate.to);

		default:
			return getMonthToDateRange(dateFrom);
	}
};
