import type { LoggedUser } from '../modules/auth/types';

export type LoggedFactory = {
	Variables: { user: LoggedUser };
};
