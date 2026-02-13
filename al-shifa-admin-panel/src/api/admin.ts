import apiClient from './axios';
import { DashboardStats, User } from '../types';

export const adminApi = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await apiClient.get('/admin/stats');
        return response.data.stats;  // Return the nested stats object
    },

    getUsers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
    }): Promise<{ users: User[]; total: number }> => {
        const response = await apiClient.get('/admin/users', { params });

        // Transform backend response to match frontend User type
        const transformedUsers = response.data.users.map((user: any): User => ({
            id: user._id,
            name: user.full_name || 'Unknown',
            email: user.email,
            phone: user.phone_number || 'N/A',
            roles: user.roles || ['passenger'],
            active_role: user.active_role || 'passenger',
            created_at: user.created_at,
            profile_picture: user.profile_picture,
            profile_pic_id: user.profile_pic_id,
        }));

        return {
            users: transformedUsers,
            total: response.data.total
        };
    },

    switchUserRole: async (userId: string, role: 'passenger' | 'driver' | 'admin'): Promise<User> => {
        const response = await apiClient.put(`/admin/users/${userId}/role`, { active_role: role });
        return response.data;
    },

    getUserImage: (fileId: string): string => {
        const token = localStorage.getItem('access_token');
        return `${apiClient.defaults.baseURL}/image/${fileId}?token=${token}`;
    },
};
