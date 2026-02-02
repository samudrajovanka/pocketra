import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoute from '../modules/auth/auth.route';
import categoriesRoute from '../modules/category/category.route';
import pocketsRoute from '../modules/pocket/pocket.route';
import transactionsRoute from '../modules/transaction/transaction.route';

const apiApp = new Hono().basePath('/api');

const allowedOrigins = (process.env.ALLOWED_CORS_ORIGINS || '')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

apiApp.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
);

apiApp.route('/auth', authRoute);
apiApp.route('/categories', categoriesRoute);
apiApp.route('/pockets', pocketsRoute);
apiApp.route('/transactions', transactionsRoute);

export default apiApp;
