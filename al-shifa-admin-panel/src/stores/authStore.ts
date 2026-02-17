import { create } from 'zustand';
import { User } from '../types';
import { authApi } from '../api/auth';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    isLoading: false,
    error: null,

    setUser: (user) => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, isAuthenticated: true });
        } else {
            localStorage.removeItem('user');
            set({ user: null, isAuthenticated: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.login({ email, password });
            localStorage.setItem('access_token', response.access_token);
            if (response.refresh_token) {
                localStorage.setItem('refresh_token', response.refresh_token);
            }
            localStorage.setItem('user', JSON.stringify(response.user));

            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
            set({
                error: errorMessage,
                isLoading: false
            });
            throw error;
        }
    },

    logout: () => {
        authApi.logout(); // Call API logout to blacklist tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    },
}));
