import { Hono } from 'hono';
import {
	getExpenseByCategory,
	getExpenseByPocket,
	getSummary,
} from './report.controller';

const report = new Hono();

report.get('/summary', ...getSummary);
report.get('/expense-by-pocket', ...getExpenseByPocket);
report.get('/expense-by-category', ...getExpenseByCategory);

export default report;
