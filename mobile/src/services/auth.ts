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
            return payload.exp * 1000; // Convert to milliseconds
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

// Auth API calls
export const authAPI = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
        if (response.data.success) {
            await authStorage.saveAuthData(response.data.data);
            return response.data.data;
        }
        throw new Error('Registration failed');
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data);
        if (response.data.success) {
            await authStorage.saveAuthData(response.data.data);
            return response.data.data;
        }
        throw new Error('Login failed');
    },

    logout: async (): Promise<void> => {
        try {
            // Optional: call backend logout endpoint
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                // Set token in header for authenticated request
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await api.post('/auth/logout');
            }
        } catch (error) {
            console.log('Logout API call failed:', error);
        } finally {
            // Always clear local storage
            await authStorage.clearAuthData();
            delete api.defaults.headers.common['Authorization'];
        }
    },
};

// Auth storage utilities with token expiry
export const authStorage = {
    async saveAuthData(data: AuthResponse): Promise<void> {
        await SecureStore.setItemAsync(TOKEN_KEY, data.token);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));

        // Get token expiry from JWT
        const expiry = getTokenExpiry(data.token);
        if (expiry) {
            await SecureStore.setItemAsync(TOKEN_TIMESTAMP_KEY, expiry.toString());
        }

        // Set token in axios headers
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

            // Check if token is expired
            const tokenExpiry = parseInt(timestampStr);
            if (Date.now() > tokenExpiry) {
                // Token expired, clear storage
                await this.clearAuthData();
                return null;
            }

            const user = JSON.parse(userData);

            // Set token in axios headers for API calls
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

// Set up axios interceptors for automatic token attachment
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

// Interceptor for handling 401 errors (unauthorized)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token is invalid, clear auth data
            await authStorage.clearAuthData();
        }
        return Promise.reject(error);
    }
);

