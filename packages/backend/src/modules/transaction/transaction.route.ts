import { Hono } from 'hono';
import {
	createTransaction,
	deleteTransaction,
	getTransactionById,
	getTransactions,
	transferTransaction,
	updateTransaction,
	updateTransferTransaction,
} from './transaction.controller';

const transactionRoute = new Hono();

transactionRoute.post('/', ...createTransaction);
transactionRoute.get('/', ...getTransactions);
transactionRoute.get('/:id', ...getTransactionById);
transactionRoute.patch('/:id', ...updateTransaction);
transactionRoute.delete('/:id', ...deleteTransaction);
transactionRoute.post('/transfer', ...transferTransaction);
transactionRoute.patch('/transfer/:id', ...updateTransferTransaction);

export default transactionRoute;
