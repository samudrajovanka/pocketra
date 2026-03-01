import { createHash, randomBytes } from 'node:crypto';

export const hash = (content: string) => {
	return createHash('sha256').update(content).digest('hex');
};

export const createRandomString = (length: number) => {
	return randomBytes(length).toString('hex');
};
