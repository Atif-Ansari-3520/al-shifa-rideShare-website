import apiClient from './axios';
import { LoginRequest, LoginResponse } from '../types';

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post('/login', data);
        return response.data;
    },

    logout: async () => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        // Call backend logout API to blacklist tokens
        if (accessToken) {
            try {
                await apiClient.post('/logout', null, {
                    params: { refresh_token: refreshToken || undefined }
                });
                console.log('✅ Tokens blacklisted successfully');
            } catch (error) {
                console.warn('⚠️ Failed to blacklist tokens:', error);
                // Continue with local logout even if API fails
            }
        }

        // Clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/';
    },
};

