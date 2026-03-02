export const calculateGrowth = (current: number, previous: number) => {
	if (previous === 0 || current === 0) return null;
	return calculatePercentage(current - previous, Math.abs(previous));
};

export const calculatePercentage = (amount: number, total: number) => {
	if (total === 0) return 0;
	return Math.round((amount / total) * 100 * 10) / 10;
};

export const processTopNItems = <T>(
	items: T[],
	top: number,
	calcOtherValue: (item: T) => number,
	mapperOther: (otherValue: number, name: string) => T,
) => {
	if (top && items.length > top) {
		const topItems = items.slice(0, top);
		const otherItems = items.slice(top);
		const otherValue = otherItems.reduce(
			(acc, curr) => acc + calcOtherValue(curr),
			0,
		);

		return [
			...topItems,
			mapperOther(otherValue, `Others (${otherItems.length})`),
		];
	}

	return items;
};
