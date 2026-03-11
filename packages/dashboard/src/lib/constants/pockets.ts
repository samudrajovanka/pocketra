export const POCKET_TYPE = {
	cash: 'cash',
	bank: 'bank',
	ewallet: 'ewallet',
} as const;

export const POCKET_TYPE_LABELS = {
	[POCKET_TYPE.cash]: 'Cash',
	[POCKET_TYPE.bank]: 'Bank',
	[POCKET_TYPE.ewallet]: 'E-Wallet',
} as const;

export const POCKET_TYPE_OPTIONS = Object.values(POCKET_TYPE).map((value) => ({
	value,
	label: POCKET_TYPE_LABELS[value as keyof typeof POCKET_TYPE_LABELS],
}));

export const POKCET_COLORS = [
	{ value: '#FFB3BA', label: 'Pastel Red' },
	{ value: '#FFDFBA', label: 'Pastel Orange' },
	{ value: '#FFFFBA', label: 'Pastel Yellow' },
	{ value: '#BAFFC9', label: 'Pastel Green' },
	{ value: '#BAE1FF', label: 'Pastel Blue' },
	{ value: '#E8BAFF', label: 'Pastel Purple' },
];

export const POCKET_EMOJIS = [
	'💰',
	'💸',
	'💳',
	'🏦',
	'💹',
	'💵',
	'💶',
	'💷',
	'🏠',
	'🛒',
	'🛍️',
	'🎁',
	'🎓',
	'🏥',
	'💊',
	'🍴',
	'🍔',
	'🍕',
	'☕',
	'🍻',
	'✈️',
	'🚗',
	'⛽',
	'🎬',
	'🎮',
	'📱',
	'💻',
	'📷',
	'🎵',
	'🏋️',
	'🐶',
	'🐱',
];
