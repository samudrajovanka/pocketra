import { Hono } from 'hono';
import authRoute from '../modules/auth/auth.route';
import categoriesRoute from '../modules/category/category.route';
import cronRoute from '../modules/cron/cron.route';
import pocketsRoute from '../modules/pocket/pocket.route';
import reportRoute from '../modules/report/report.route';
import transactionsRoute from '../modules/transaction/transaction.route';

const apiApp = new Hono().basePath('/api');

apiApp.route('/auth', authRoute);
apiApp.route('/categories', categoriesRoute);
apiApp.route('/pockets', pocketsRoute);
apiApp.route('/reports', reportRoute);
apiApp.route('/transactions', transactionsRoute);
apiApp.route('/cron', cronRoute);

export default apiApp;
