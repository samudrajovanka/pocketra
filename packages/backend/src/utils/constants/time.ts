export const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const DATE_RANGE_PERIOD = {
	today: 'today',
	month_to_date: 'month_to_date',
	full_month: 'full_month',
	last_7_days: 'last_7_days',
	last_30_days: 'last_30_days',
	custom: 'custom',
} as const;

export const PERIOD = {
	daily: 'daily',
	weekly: 'weekly',
	monthly: 'monthly',
} as const;
