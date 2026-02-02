import { db } from '../../config/db';
import { categoriesTable } from './category.schema';

export default class CategoryService {
	async getCategories() {
		return await db
			.select({
				id: categoriesTable.id,
				name: categoriesTable.name,
				type: categoriesTable.type,
			})
			.from(categoriesTable);
	}
}
