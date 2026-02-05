import axios from 'axios';
import { deleteCookie } from '../serverFn/cookie';

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
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
