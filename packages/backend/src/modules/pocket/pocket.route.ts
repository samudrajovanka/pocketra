import { Hono } from 'hono';
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

export default pocketRoute;
