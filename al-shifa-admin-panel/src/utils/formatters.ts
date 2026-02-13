import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
    return format(new Date(date), formatStr);
};

export const timeAgo = (date: string | Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
};

// ✅ Keep only ONE getInitials
export const getInitials = (name: string): string => {
    if (!name || !name.trim()) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0] ? parts[0][0].toUpperCase() : "?";
    const first = parts[0][0] || "";
    const last = parts[parts.length - 1][0] || "";
    return (first + last).toUpperCase() || "?";
};

export const maskPhone = (phone: string): string => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

export const maskEmail = (email: string): string => {
    const [name, domain] = email.split('@');
    if (name.length <= 3) return email;
    return `${name.slice(0, 2)}***@${domain}`;
};

export function formatDateSafe(date?: string | Date) {
    if (!date) return "N/A";

    try {
        // Handle DD-MM-YYYY or DD/MM/YYYY manually if string
        if (typeof date === 'string') {
            // Check for DD-MM-YYYY or DD/MM/YYYY
            const ddmmyyyy = date.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
            if (ddmmyyyy) {
                const day = parseInt(ddmmyyyy[1], 10);
                const month = parseInt(ddmmyyyy[2], 10) - 1; // Month is 0-indexed
                const year = parseInt(ddmmyyyy[3], 10);
                const dateObj = new Date(year, month, day);
                if (!isNaN(dateObj.getTime())) {
                    return format(dateObj, "dd/MM/yyyy");
                }
            }
        }

        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return String(date); // Fallback to original string if invalid date but not empty

        return format(dateObj, "dd/MM/yyyy");
    } catch {
        return String(date); // Fallback to original string
    }
}
