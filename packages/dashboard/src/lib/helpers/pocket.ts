import type { Pocket, PocketType } from '@/types/pocket';

export const groupPocketsByType = (pockets: Pocket[]) => {
	const grouped = pockets.reduce(
		(acc, pocket) => {
			const type = pocket.type;
			if (!acc[type]) acc[type] = [];
			acc[type].push(pocket);
			return acc;
		},
		{} as Record<PocketType, Pocket[]>,
	);

	return {
		...(grouped.bank ? { bank: grouped.bank } : {}),
		...(grouped.ewallet ? { ewallet: grouped.ewallet } : {}),
		...(grouped.cash ? { cash: grouped.cash } : {}),
		...grouped,
	} as Record<PocketType, Pocket[]>;
};
