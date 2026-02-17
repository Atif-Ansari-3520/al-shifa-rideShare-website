import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

const toastIcons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const toastStyles = {
    success: 'bg-blue-500 text-white border-blue-600 shadow-blue-500/30',
    error: 'bg-rose-500 text-white border-rose-600 shadow-rose-500/30',
    warning: 'bg-amber-500 text-white border-amber-600 shadow-amber-500/30',
    info: 'bg-slate-800 text-white border-slate-700 shadow-slate-900/30',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                <AnimatePresence>
                    {toasts.map((toast) => {
                        const Icon = toastIcons[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ x: 100, opacity: 0, scale: 0.9 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ x: 100, opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                                layout
                                className={cn(
                                    'min-w-[320px] p-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-center gap-3',
                                    toastStyles[toast.type]
                                )}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <p className="flex-1 text-sm font-medium">{toast.message}</p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
