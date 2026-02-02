import { Hono } from 'hono';
import {
	createTransaction,
	deleteTransaction,
	getTransactionById,
	getTransactions,
	updateTransaction,
} from './transaction.controller';

const transactionRoute = new Hono();

transactionRoute.post('/', ...createTransaction);
transactionRoute.get('/', ...getTransactions);
transactionRoute.get('/:id', ...getTransactionById);
transactionRoute.patch('/:id', ...updateTransaction);
transactionRoute.delete('/:id', ...deleteTransaction);

export default transactionRoute;
