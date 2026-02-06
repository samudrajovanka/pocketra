export const calculateGrowth = (current: number, previous: number) => {
	if (previous === 0 || current === 0) return null;

	const growth = ((current - previous) / Math.abs(previous)) * 100;
	return Math.round(growth * 10) / 10;
};
