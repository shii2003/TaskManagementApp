import api from './api';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

const getTokenExpiry = (token: string): number | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp) {
            return payload.exp * 1000;
        }
        return null;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
};

interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface LoginData {
    email: string;
    password: string;
}

const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';
const TOKEN_TIMESTAMP_KEY = 'tokenTimestamp';

export const authAPI = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<{
            success: boolean;
            data: AuthResponse
        }>('/auth/register', data);
        if (response.data.success) {
            await authStorage.saveAuthData(response.data.data);
            return response.data.data;
        }
        throw new Error('Registration failed');
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<{
            success: boolean;
            data: AuthResponse
        }>('/auth/login', data);
        if (response.data.success) {
            await authStorage.saveAuthData(response.data.data);
            return response.data.data;
        }
        throw new Error('Login failed');
    },

    logout: async (): Promise<void> => {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await api.post('/auth/logout');
            }
        } catch (error) {
            console.log('Logout API call failed:', error);
        } finally {

            await authStorage.clearAuthData();
            delete api.defaults.headers.common['Authorization'];
        }
    },
};

export const authStorage = {
    async saveAuthData(data: AuthResponse): Promise<void> {
        await SecureStore.setItemAsync(TOKEN_KEY, data.token);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));

        const expiry = getTokenExpiry(data.token);
        if (expiry) {
            await SecureStore.setItemAsync(TOKEN_TIMESTAMP_KEY, expiry.toString());
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    },

    async getAuthData(): Promise<AuthResponse | null> {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const userData = await SecureStore.getItemAsync(USER_KEY);
            const timestampStr = await SecureStore.getItemAsync(TOKEN_TIMESTAMP_KEY);

            if (!token || !userData || !timestampStr) {
                return null;
            }

            const tokenExpiry = parseInt(timestampStr);
            if (Date.now() > tokenExpiry) {

                await this.clearAuthData();
                return null;
            }

            const user = JSON.parse(userData);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { token, user };
        } catch (error) {
            console.error('Error reading auth data:', error);
            return null;
        }
    },

    async clearAuthData(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
            await SecureStore.deleteItemAsync(TOKEN_TIMESTAMP_KEY);
            delete api.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error('Error clearing auth data:', error);
        }
    },

    async getToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    },

    async getUser(): Promise<User | null> {
        try {
            const userData = await SecureStore.getItemAsync(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error reading user data:', error);
            return null;
        }
    },
};

api.interceptors.request.use(
    async (config) => {
        const token = await authStorage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {

            await authStorage.clearAuthData();
        }
        return Promise.reject(error);
    }
);

