import { ONE_WEEK_IN_MS } from '../constants/time';

export const isEditableTransaction = (createdAt: string) => {
	const oneWeekAgo = Date.now() - ONE_WEEK_IN_MS;
	return new Date(createdAt).getTime() >= oneWeekAgo;
};
