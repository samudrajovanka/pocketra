import type { Pocket, PocketType } from '@/types/pocket';

export const groupPocketsByType = (pockets: Pocket[]) => {
	return pockets.reduce(
		(acc, pocket) => {
			const type = pocket.type || 'other';
			if (!acc[type]) acc[type] = [];
			acc[type].push(pocket);
			return acc;
		},
		{} as Record<PocketType, Pocket[]>,
	);
};
