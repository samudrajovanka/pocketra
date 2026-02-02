import { Hono } from 'hono';
import { getCategories } from './category.controller';

const categoryRoute = new Hono();

categoryRoute.get('/', ...getCategories);

export default categoryRoute;
