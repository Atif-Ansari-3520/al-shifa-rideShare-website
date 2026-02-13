// User Types
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    roles: ('passenger' | 'driver' | 'admin')[];
    active_role: 'passenger' | 'driver' | 'admin';
    created_at: string;
    profile_picture?: string;
    profile_pic_id?: string;
}

// Driver Types
export interface Driver {
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    applied_date: string;
    name: string;
    phone: string;
    personal_pic_id?: string;
    vehicle_brand?: string;
    vehicle_model?: string;
    vehicle_color?: string;
    vehicle_year?: string;
    plate_number?: string;
    license_number?: string;
    rejection_reason?: string;
    rejection_message?: string;
}

export interface DriverDetails extends Driver {
    date_of_birth: string;
    license_expiry: string;
    documents: {
        personal_photo_id?: string;
        license_front_id?: string;
        license_selfie_id?: string;
        vehicle_photo_id?: string;
        registration_doc_id?: string;
        certificate_back_id?: string;
    };
}

export interface RejectionReason {
    id: string;
    label: string;
    icon: string;
}

// Dashboard Types
export interface DashboardStats {
    total_users: number;
    pending_drivers: number;
    approved_drivers: number;
    rejected_drivers: number;
    today_signups: number;
}

// Auth Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

// API Response wrapper
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// Pagination
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}
