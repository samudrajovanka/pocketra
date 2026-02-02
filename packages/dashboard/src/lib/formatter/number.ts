export const formatNumber = (value: number | undefined | null) => {
	if (value === undefined || value === null || Number.isNaN(value)) return '';
	return new Intl.NumberFormat('en-US').format(value);
};

export const formatCurrency = (value: number | undefined | null) => {
	if (value === undefined || value === null || Number.isNaN(value)) return '';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'IDR',
	}).format(value);
};
