import { createFactory } from 'hono/factory';
import { successResponse } from '../../utils/helpers/response';
import { TRANSACTION_TYPE } from '../transaction/data';
import CategoryService from './category.service';

const { createHandlers } = createFactory();

import { authMiddleware } from '../../middlewares/auth';

export const getCategories = createHandlers(authMiddleware, async (c) => {
	const categoryService = new CategoryService();
	const categories = await categoryService.getCategories();

	const groupByCategoriesByType = categories.reduce(
		(res, category) => {
			if (category.type === TRANSACTION_TYPE.income) {
				res.income.push(category);
			} else if (category.type === TRANSACTION_TYPE.expense) {
				res.expense.push(category);
			}

			return res;
		},
		{
			income: [] as typeof categories,
			expense: [] as typeof categories,
		},
	);

	return c.json(
		successResponse({
			message: 'Success get list categories',
			data: {
				income: groupByCategoriesByType.income,
				expense: groupByCategoriesByType.expense,
			},
		}),
	);
});
