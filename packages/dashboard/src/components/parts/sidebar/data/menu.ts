import {
	ArrowRightLeft,
	LayoutDashboard,
	type LucideIcon,
	Wallet,
} from 'lucide-react';

export interface MenuItem {
	title: string;
	url: string;
	icon: LucideIcon;
}

export const menuItems: MenuItem[] = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: 'Pockets',
		url: '/pockets',
		icon: Wallet,
	},
	{
		title: 'Transactions',
		url: '/transactions',
		icon: ArrowRightLeft,
	},
];
