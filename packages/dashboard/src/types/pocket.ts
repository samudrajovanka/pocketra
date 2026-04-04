import type { POCKET_TYPE } from '@/lib/constants/pockets';

export type PocketType = (typeof POCKET_TYPE)[keyof typeof POCKET_TYPE];

export type Pocket = {
	id: string;
	name: string;
	icon: string;
	type: PocketType;
	color?: string;
	currentBalance: string;
	hasBudget: boolean;
	createdAt: string;
	updatedAt: string;
};
