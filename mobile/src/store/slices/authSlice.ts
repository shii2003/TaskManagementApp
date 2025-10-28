import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, authStorage, User, AuthResponse } from '../../services/auth';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
};


export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
    const authData = await authStorage.getAuthData();
    return authData;
});

export const loginAsync = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const result = await authAPI.login({ email, password });
            return result;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Login failed. Please try again.');
        }
    }
);

export const registerAsync = createAsyncThunk(
    'auth/register',
    async ({ name, email, password, confirmPassword }: { name: string; email: string; password: string, confirmPassword: string }, { rejectWithValue }) => {
        try {
            const result = await authAPI.register({ name, email, password, confirmPassword });
            return result;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
        }
    }
);

export const logoutAsync = createAsyncThunk('auth/logout', async () => {
    await authAPI.logout();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    state.isAuthenticated = true;
                } else {
                    state.user = null;
                    state.token = null;
                    state.isAuthenticated = false;
                }
                state.isLoading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
            })
            // Login
            .addCase(loginAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.isLoading = false;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            // Register
            .addCase(registerAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.isLoading = false;
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isLoading = false;
            })
            // Logout
            .addCase(logoutAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(logoutAsync.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

