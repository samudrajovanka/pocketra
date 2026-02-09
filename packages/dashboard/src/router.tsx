import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { getQueryClient } from './lib/queryClient';
// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const getRouter = () => {
	const rqContext = {
		queryClient: getQueryClient(),
	};

	const router = createRouter({
		routeTree,
		context: {
			...rqContext,
		},

		defaultPreload: 'intent',
		scrollRestoration: true,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	return router;
};
