import axios from 'axios';
import useAuthStore from '../store/authStore';
import { BASE_URL } from '../baseURL';

export const api = axios.create({
    baseURL: `${BASE_URL}`,
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
