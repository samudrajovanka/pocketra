import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { cache } from 'react';
import { toast } from 'sonner';

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
				if (isAxiosError(error)) {
					toast.error(error.response?.data.message);
				} else {
					toast.error(error.message);
				}
			},
		},
	},
};

export const getQueryClient = cache(() => new QueryClient(queryClientConfig));
