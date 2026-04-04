import { Hono } from 'hono';
import {
	createPocketBudget,
	deletePocketBudget,
	getPocketBudget,
	updatePocketBudget,
} from '../pocket-budget/pocket-budget.controller';
import {
	createPocket,
	deletePocket,
	getPocketById,
	getPocketOptions,
	getPockets,
	getTotalBalance,
	updatePocket,
} from './pocket.controller';

const pocketRoute = new Hono();

pocketRoute.post('/', ...createPocket);
pocketRoute.get('/total-balance', ...getTotalBalance);
pocketRoute.get('/options', ...getPocketOptions);
pocketRoute.get('/', ...getPockets);
pocketRoute.get('/:id', ...getPocketById);
pocketRoute.patch('/:id', ...updatePocket);
pocketRoute.delete('/:id', ...deletePocket);

// Budget routes
pocketRoute.post('/:pocketId/budget', ...createPocketBudget);
pocketRoute.get('/:pocketId/budget', ...getPocketBudget);
pocketRoute.patch('/:pocketId/budget', ...updatePocketBudget);
pocketRoute.delete('/:pocketId/budget', ...deletePocketBudget);

export default pocketRoute;
