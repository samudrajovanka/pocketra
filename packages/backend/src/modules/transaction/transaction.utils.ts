import { format } from 'date-fns';
import { createRandomString } from '../../utils/helpers/encrypt';

export const generateTransferId = (date?: string | Date) => {
	const txDate = date ? new Date(date) : new Date();
	const dateFormated = format(txDate, 'ddMMyy');
	const uniqueCode = createRandomString(2).toUpperCase();
	return `TF${uniqueCode}${dateFormated}`;
};
