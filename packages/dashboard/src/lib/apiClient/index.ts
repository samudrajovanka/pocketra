import axios from 'axios';
import { deleteCookie } from '../serverFn/cookie';

const getBaseUrl = () => {
	if (import.meta.env.VITE_USE_PROXY === 'true') {
		return `${import.meta.env.VITE_BASE_URL}/api`;
	}
	return `${import.meta.env.VITE_API_BASE_URL}/api`;
};

export const apiClient = axios.create({
	baseURL: getBaseUrl(),
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (error.response?.status === 401) {
			await deleteCookie({ data: { name: 'is_authenticated' } });
			window.location.href = '/auth/login';
		}
		return Promise.reject(error);
	},
);
