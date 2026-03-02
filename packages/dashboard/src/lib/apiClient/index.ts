import { redirect } from '@tanstack/react-router';
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { logout, refreshToken } from '@/endpoints/auth';
import {
	COOKIE_ACCESS_TOKEN,
	COOKIE_REFRESH_TOKEN,
} from '@/lib/constants/cookie';
import { getCookieServer } from '@/serverFn/cookie';
import {
	clearAuthCookie,
	getCookie,
	getCookies,
	setAuthCookie,
} from '../helpers/cookie';

export interface RequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
	_fromRefresh?: boolean;
}

export const apiClient = axios.create({
	baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}> = [];
const ENDPOINT_WITHOUT_REFRESH = [
	'/auth/refresh',
	'/auth/login',
	'/auth/logout',
	'/auth/exchange',
];

const processQueue = (error: Error | null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve();
		}
	});

	failedQueue = [];
};

const setCookieOnRequest = async (setter: (cookie: string) => void) => {
	if (import.meta.env.SSR) {
		const cookies = getCookies();
		if (cookies) {
			setter(cookies);
		}
	}
};

apiClient.interceptors.request.use(async (config: RequestConfig) => {
	if (!config._fromRefresh) {
		await setCookieOnRequest((cookie) => {
			config.headers.cookie = cookie;
		});
	}

	const accessToken = getCookie(COOKIE_ACCESS_TOKEN);

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (!originalRequest) {
			return Promise.reject(error);
		}

		if (ENDPOINT_WITHOUT_REFRESH.includes(originalRequest.url)) {
			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(async () => {
						return apiClient(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			originalRequest._fromRefresh = true;
			isRefreshing = true;

			const handleError = async (err: Error) => {
				processQueue(err);
				await logout();
				await clearAuthCookie();

				const loginPath = '/auth/login';

				if (import.meta.env.SSR) {
					redirect({ to: loginPath });
				} else {
					window.location.href = loginPath;
				}
			};

			const refreshTokenFn = async (
				resolve: (value?: unknown) => void,
				reject: (reason?: unknown) => void,
			) => {
				try {
					const refreshTokenValue = await getCookieServer({
						data: { name: COOKIE_REFRESH_TOKEN },
					});

					if (!refreshTokenValue) {
						const error = new Error('No refresh token');
						handleError(error);
						reject(error);
						return;
					}

					const {
						data: { data: authTokens },
					} = await refreshToken(refreshTokenValue);

					await setAuthCookie(authTokens);

					processQueue(null);
					resolve(apiClient(originalRequest));
				} catch (err) {
					handleError(err as Error);
					reject(err);
				} finally {
					isRefreshing = false;
				}
			};

			return new Promise(refreshTokenFn);
		}

		return Promise.reject(error);
	},
);
