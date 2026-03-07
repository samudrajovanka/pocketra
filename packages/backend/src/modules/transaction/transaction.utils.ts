import dayjs from 'dayjs';
import { createRandomString } from '../../utils/helpers/encrypt';

export const generateTransferId = (date?: string | Date) => {
	const txDate = date ? dayjs(date) : dayjs();
	const dateFormated = txDate.format('DDMMYY');
	const uniqueCode = createRandomString(2).toUpperCase();
	return `TF${uniqueCode}${dateFormated}`;
};
