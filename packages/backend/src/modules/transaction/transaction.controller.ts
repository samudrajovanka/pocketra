import { createFactory } from 'hono/factory';
import { authMiddleware } from '../../middlewares/auth';
import { getCursorPaginationFromQuery } from '../../utils/helpers/pagination';
import { successResponse } from '../../utils/helpers/response';
import type { LoggedUser } from '../auth/types';
import TransactionService from './transaction.service';
import {
	zPayloadCreateTransactionValidator,
	zPayloadGetTransactionByIdValidator,
	zPayloadGetTransactionsValidator,
	zPayloadUpdateTransactionValidator,
} from './transaction.validator';
import type {
	PayloadCreateTransaction,
	PayloadGetTransactionById,
	PayloadGetTransactions,
	PayloadUpdateTransaction,
} from './types';

const { createHandlers } = createFactory<{ Variables: { user: LoggedUser } }>();

export const createTransaction = createHandlers(
	authMiddleware,
	zPayloadCreateTransactionValidator,
	async (c) => {
		const user = c.var.user;
		const payload = c.req.valid('json') as PayloadCreateTransaction;
		const transactionService = new TransactionService();

		const transaction = await transactionService.createTransaction(user.id, {
			pocketId: payload.pocketId,
			categoryId: payload.categoryId,
			amount: payload.amount,
			description: payload.description,
			date: payload.date,
			type: payload.type,
		});

		return c.json(
			successResponse({
				message: 'Success create transaction',
				data: transaction,
			}),
		);
	},
);

export const getTransactions = createHandlers(
	authMiddleware,
	zPayloadGetTransactionsValidator,
	async (c) => {
		const user = c.var.user;
		const pagination = getCursorPaginationFromQuery(c);
		const params = c.req.valid('query') as PayloadGetTransactions;

		const transactionService = new TransactionService();
		const { data, meta } = await transactionService.getTransactions(user.id, {
			...params,
			pagination,
		});

		return c.json(
			successResponse({
				message: 'Success get list transactions',
				data: data,
				meta,
			}),
		);
	},
);

export const getTransactionById = createHandlers(
	authMiddleware,
	zPayloadGetTransactionByIdValidator,
	async (c) => {
		const user = c.var.user;
		const { id: transactionId } = c.req.valid(
			'param',
		) as PayloadGetTransactionById;
		const transactionService = new TransactionService();

		const transaction = await transactionService.getTransactionById(
			user.id,
			transactionId,
		);

		return c.json(
			successResponse({
				message: 'Success get transaction',
				data: transaction,
			}),
		);
	},
);

export const updateTransaction = createHandlers(
	authMiddleware,
	zPayloadGetTransactionByIdValidator,
	zPayloadUpdateTransactionValidator,
	async (c) => {
		const user = c.var.user;
		const { id: transactionId } = c.req.valid(
			'param',
		) as PayloadGetTransactionById;
		const payload = c.req.valid('json') as PayloadUpdateTransaction;
		const transactionService = new TransactionService();

		const transaction = await transactionService.updateTransaction(
			user.id,
			transactionId,
			payload,
		);

		return c.json(
			successResponse({
				message: 'Success update transaction',
				data: transaction,
			}),
		);
	},
);

export const deleteTransaction = createHandlers(
	authMiddleware,
	zPayloadGetTransactionByIdValidator,
	async (c) => {
		const user = c.var.user;
		const { id: transactionId } = c.req.valid(
			'param',
		) as PayloadGetTransactionById;
		const transactionService = new TransactionService();

		const transaction = await transactionService.deleteTransaction(
			user.id,
			transactionId,
		);

		return c.json(
			successResponse({
				message: 'Success delete transaction',
				data: transaction,
			}),
		);
	},
);
