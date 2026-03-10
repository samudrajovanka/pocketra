import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { useState } from 'react';
import appCss from '@/assets/styles/globals.css?url';
import GlobalLoading from '@/components/parts/loading/GlobalLoading';
import { RouteProgressBar } from '@/components/parts/loading/RouteProgressBar';
import { Toaster } from '@/components/ui/sonner';
import { refreshToken } from '@/endpoints/auth';
import {
	COOKIE_ACCESS_TOKEN,
	COOKIE_REFRESH_TOKEN,
} from '@/lib/constants/cookie';
import { getCookie, setAuthCookie } from '@/lib/helpers/cookie';
import { getQueryClient } from '@/lib/queryClient';
import { getCookieServer } from '@/serverFn/cookie';
import app from '@/config/app';
import { generateMetadata } from '@/lib/helpers/meta';

export const Route = createRootRoute({
	beforeLoad: async () => {
		const hasAccessToken = getCookie(COOKIE_ACCESS_TOKEN);

		if (hasAccessToken) {
			return { isAuthenticated: true };
		}

		const refreshTokenValue = await getCookieServer({
			data: { name: COOKIE_REFRESH_TOKEN },
		});

		if (refreshTokenValue) {
			try {
				const {
					data: { data: authTokens },
				} = await refreshToken(refreshTokenValue);

				await setAuthCookie(authTokens);
				return { isAuthenticated: true };
			} catch (_) {
				return { isAuthenticated: false };
			}
		}

		return { isAuthenticated: false };
	},
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				name: 'theme-color',
				content: '#2563eb',
			},
			...generateMetadata(
				{
					title: app.name,
					description: app.description,
					keywords: app.keywords,
				},
				{ withSuffix: false },
			),
		],
		links: [
			{
				rel: 'manifest',
				href: '/manifest.webmanifest',
			},
			{
				rel: 'icon',
				href: '/icons/favicon.ico',
			},
			{
				rel: 'icon',
				href: '/icons/pwa-64x64.png',
				type: 'image/png',
			},
			{
				rel: 'apple-touch-icon',
				href: '/icons/apple-touch-icon-180x180.png',
			},
			{
				rel: 'preconnect',
				href: 'https://fonts.googleapis.com',
			},
			{
				rel: 'preconnect',
				href: 'https://fonts.gstatic.com',
				crossOrigin: 'anonymous',
			},
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap',
			},
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(getQueryClient());

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					{children}

					<RouteProgressBar />
					<GlobalLoading />
					<Toaster richColors position="top-right" />

					<TanStackDevtools
						config={{
							position: 'bottom-right',
						}}
						plugins={[
							{
								name: 'Tanstack Router',
								render: <TanStackRouterDevtoolsPanel />,
							},
							{
								name: 'React Query',
								render: <ReactQueryDevtools initialIsOpen={false} />,
							},
						]}
					/>
				</QueryClientProvider>
				<Scripts />
			</body>
		</html>
	);
}
