import {
	endOfDay,
	endOfMonth,
	startOfDay,
	startOfMonth,
	subDays,
} from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { DateRangePeriod } from '@/types/time';
import { DATE_RANGE_PERIOD } from '../constants/time';

const getTodayRange = (now: Date): DateRange => {
	const from = startOfDay(now);
	const to = endOfDay(now);

	return { from, to };
};

const getLast7DaysRange = (now: Date): DateRange => {
	const to = endOfDay(now);
	const from = subDays(to, 6);

	return { from, to };
};

const getLast30DaysRange = (now: Date): DateRange => {
	const to = endOfDay(now);
	const from = subDays(to, 29);

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
	const now = new Date();

	switch (period) {
		case DATE_RANGE_PERIOD.today:
			return getTodayRange(now);

		case DATE_RANGE_PERIOD.last_7_days:
			return getLast7DaysRange(now);

		case DATE_RANGE_PERIOD.last_30_days:
			return getLast30DaysRange(now);

		case DATE_RANGE_PERIOD.month_to_date:
			return getMonthToDateRange(now);

		case DATE_RANGE_PERIOD.full_month:
			if (!customDate?.from) {
				throw new Error('Start date is required for full month period');
			}
			return getFullMonthRange(customDate.from);

		case DATE_RANGE_PERIOD.custom:
			if (!customDate?.from || !customDate?.to) {
				throw new Error(
					'Start date and to date are required for custom period',
				);
			}
			return getCustomRange(customDate.from, customDate.to);

		default:
			return getMonthToDateRange(now);
	}
};
