import { createFileRoute } from '@tanstack/react-router';

const proxyRequest = async ({ request }: { request: Request }) => {
	const target = process.env.VITE_API_BASE_URL || 'http://localhost:5000';
	const url = new URL(request.url);
	const targetUrl = `${target}${url.pathname}${url.search}`;

	const headers = new Headers(request.headers);
	headers.set('host', new URL(target).host);

	headers.delete('accept-encoding');

	const body = ['GET', 'HEAD'].includes(request.method)
		? undefined
		: await request.arrayBuffer();

	const response = await fetch(targetUrl, {
		method: request.method,
		headers,
		body,
	});

	const responseHeaders = new Headers(response.headers);
	responseHeaders.delete('content-encoding');
	responseHeaders.delete('content-length');
	responseHeaders.delete('transfer-encoding');

	const buffer = await response.arrayBuffer();

	return new Response(buffer, {
		status: response.status,
		headers: responseHeaders,
	});
};

export const Route = createFileRoute('/api/$')({
	server: {
		handlers: {
			GET: proxyRequest,
			POST: proxyRequest,
			PUT: proxyRequest,
			PATCH: proxyRequest,
			DELETE: proxyRequest,
		},
	},
});
