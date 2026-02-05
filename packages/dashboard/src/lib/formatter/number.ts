export const formatNumber = (value: number | undefined | null) => {
	if (value === undefined || value === null || Number.isNaN(value)) return '';
	return new Intl.NumberFormat('en-US').format(value);
};

export const formatCurrency = (value: number | undefined | null) => {
	if (value === undefined || value === null || Number.isNaN(value)) return '';

	const isUpperBillion = value >= 1_000_000_000;

	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: isUpperBillion ? 2 : 0,
		notation: isUpperBillion ? 'compact' : 'standard',
		compactDisplay: 'short',
	}).format(value);
};
