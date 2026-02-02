import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const queryClientConfig = {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: STALE_TIME,
			retry: 0,
		},
		mutations: {
			onError: (error: Error) => {
				console.error(error.message);
			},
		},
	},
};

export const getQueryClient = cache(() => new QueryClient(queryClientConfig));
