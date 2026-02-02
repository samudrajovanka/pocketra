import { db } from '../config/db';
import { categoriesTable } from '../modules/category/category.schema';

const INCOME_CATEGORIES = [
	'Salary',
	'Bonus',
	'Freelance',
	'Business',
	'Investment',
	'Interest',
	'Dividend',
	'Rental',
	'Commission',
	'Side Hustle',
	'Gift',
	'Refund',
	'Reimbursement',
	'Top up',
	'Other',
];

const EXPENSE_CATEGORIES = [
	'Food & Drink',
	'Transportation',
	'Gasoline',
	'Parking',
	'Taxi',
	'Housing',
	'Utilities',
	'Internet & Mobile',
	'Healthcare',
	'Insurance',
	'Education',
	'Shopping',
	'Entertainment',
	'Subscription',
	'Travel',
	'Personal Care',
	'Debt Payment',
	'Tax',
	'Donation',
	'Pet Care',
	'Childcare',
	'Other',
];

export const seedCategories = async () => {
	console.log('Seeding categories...');

	await db
		.insert(categoriesTable)
		.values([
			...INCOME_CATEGORIES.map((name) => ({ name, type: 'income' })),
			...EXPENSE_CATEGORIES.map((name) => ({ name, type: 'expense' })),
		])
		.onConflictDoNothing();
};
