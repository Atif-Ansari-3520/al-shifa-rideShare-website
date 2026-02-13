import apiClient from './axios';
import { Driver, DriverDetails } from '../types';

export const driversApi = {
    getDrivers: async (params?: {
        status?: 'pending' | 'approved' | 'rejected';
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{ drivers: Driver[]; total: number }> => {
        const response = await apiClient.get('/drivers/', { params });

        // Transform backend response to match frontend Driver type
        const transformedDrivers = response.data.drivers.map((driver: any): Driver => ({
            email: driver.user_email,
            status: driver.status,
            applied_date: driver.created_at,
            name: `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || 'Unknown',
            phone: driver.phone || 'N/A',
            personal_pic_id: driver.personal_pic_id,
            vehicle_brand: driver.vehicle?.brand,
            vehicle_model: driver.vehicle?.model,
            vehicle_color: driver.vehicle?.color,
            vehicle_year: driver.vehicle?.year,
            plate_number: driver.vehicle?.plate,
            license_number: driver.licence?.number,
            rejection_reason: driver.rejection_reason,
            rejection_message: driver.rejection_message,
        }));

        return {
            drivers: transformedDrivers,
            total: response.data.total
        };
    },

    getDriverDetails: async (email: string): Promise<DriverDetails> => {
        const response = await apiClient.get(`/drivers/admin/documents/${email}`);
        const driver = response.data.driver;
        console.log("Raw Driver Details Response:", driver);
        console.log("Vehicle Object:", driver.vehicle); // Debug vehicle fields // Debugging log

        // Transform backend response to match frontend DriverDetails type
        return {
            email: driver.user_email,
            status: driver.status,
            applied_date: driver.created_at,
            name: `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || 'Unknown',
            phone: driver.phone || 'N/A',
            date_of_birth: driver.dob,
            license_number: driver.licence?.number,
            license_expiry: driver.licence?.expiry,
            vehicle_brand: driver.vehicle?.brand,
            vehicle_model: driver.vehicle?.model,
            vehicle_color: driver.vehicle?.color || driver.vehicle?.vehicle_color,
            vehicle_year: driver.vehicle?.year || driver.vehicle?.production_year,
            plate_number: driver.vehicle?.plate || driver.vehicle?.number_plate,
            documents: {
                personal_photo_id: driver.personal_pic_id,
                license_front_id: driver.licence?.front_id,
                license_selfie_id: driver.licence?.selfie_id,
                vehicle_photo_id: driver.vehicle?.pic_id,
                registration_doc_id: driver.vehicle?.reg_id,
                certificate_back_id: driver.vehicle?.cert_back_id,
            }
        };
    },

    getDriverImage: (fileId: string): string => {
        const token = localStorage.getItem('access_token');
        return `${apiClient.defaults.baseURL}/drivers/image/${fileId}?token=${token}`;
    },

    approveDriver: async (email: string): Promise<{ message: string }> => {
        const response = await apiClient.put(`/drivers/admin/approve/${email}`);
        return response.data;
    },

    rejectDriver: async (data: {
        email: string;
        reason: string;
        message?: string;
    }): Promise<{ message: string }> => {
        const response = await apiClient.post('/drivers/admin/reject', {
            ...data,
            message: data.message || "",
        });
        return response.data;
    },
};
