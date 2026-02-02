import { seedCategories } from './categories';

const main = async () => {
	console.log('Start seeding');

	await seedCategories();

	console.log('Finish seeding');
	process.exit(0);
};

main();
