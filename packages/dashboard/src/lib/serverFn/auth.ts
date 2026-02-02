import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';

export const checkAuth = createServerFn({ method: 'GET' }).handler(async () => {
	const session = getCookie('is_authenticated');

	if (!session) {
		return null;
	}

	return { isAuthenticated: true };
});
