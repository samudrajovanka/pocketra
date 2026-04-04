import { format } from 'date-fns';
import { ONE_WEEK_IN_MS } from '../../utils/constants/time';
import { createRandomString } from '../../utils/helpers/encrypt';

export const generateTransferId = (date?: string | Date) => {
	const txDate = date ? new Date(date) : new Date();
	const dateFormated = format(txDate, 'ddMMyy');
	const uniqueCode = createRandomString(2).toUpperCase();
	return `TF${uniqueCode}${dateFormated}`;
};

export const isEditableTransaction = (createdAt: string) => {
	const oneWeekAgo = Date.now() - ONE_WEEK_IN_MS;
	return new Date(createdAt).getTime() >= oneWeekAgo;
};
