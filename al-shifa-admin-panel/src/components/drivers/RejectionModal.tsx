import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileX,
    CalendarX,
    Car,
    AlertCircle,
    MessageSquare,
    X,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { shake } from '../../utils/animations';

interface RejectionModalProps {
    driverName: string;
    driverEmail: string;
    onConfirm: (reason: string, message?: string) => void;
    onClose: () => void;
}

const rejectionReasons = [
    { id: 'invalid_documents', label: 'Invalid Documents', icon: FileX },
    { id: 'license_expired', label: 'License Expired', icon: CalendarX },
    { id: 'vehicle_unfit', label: 'Vehicle Unfit', icon: Car },
    { id: 'incomplete_info', label: 'Incomplete Information', icon: AlertCircle },
    { id: 'other', label: 'Other', icon: MessageSquare },
];

export const RejectionModal: React.FC<RejectionModalProps> = ({
    driverName,
    driverEmail,
    onConfirm,
    onClose,
}) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const handleConfirm = () => {
        if (!selectedReason) {
            setShowError(true);
            setTimeout(() => setShowError(false), 400);
            return;
        }

        const reason = rejectionReasons.find((r) => r.id === selectedReason)?.label || '';
        onConfirm(reason, customMessage || undefined);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                variants={showError ? shake : undefined}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Reject Driver Application
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Driver Summary */}
                <div className="bg-danger-50 dark:bg-danger-950 border border-danger-200 dark:border-danger-800 rounded-xl p-4 mb-6">
                    <p className="text-sm font-medium text-danger-900 dark:text-danger-100">
                        You are about to reject:
                    </p>
                    <p className="text-lg font-bold text-danger-700 dark:text-danger-300 mt-1">
                        {driverName}
                    </p>
                    <p className="text-sm text-danger-600 dark:text-danger-400">{driverEmail}</p>
                </div>

                {/* Rejection Reasons */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Select Rejection Reason *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {rejectionReasons.map((reason) => (
                            <button
                                key={reason.id}
                                onClick={() => setSelectedReason(reason.id)}
                                className={cn(
                                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                                    selectedReason === reason.id
                                        ? 'border-danger-400 bg-danger-50 dark:bg-danger-950'
                                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                )}
                            >
                                <div
                                    className={cn(
                                        'p-2 rounded-lg',
                                        selectedReason === reason.id
                                            ? 'bg-danger-400 text-white'
                                            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                                    )}
                                >
                                    <reason.icon className="h-5 w-5" />
                                </div>
                                <span
                                    className={cn(
                                        'font-medium',
                                        selectedReason === reason.id
                                            ? 'text-danger-700 dark:text-danger-300'
                                            : 'text-gray-700 dark:text-gray-300'
                                    )}
                                >
                                    {reason.label}
                                </span>
                            </button>
                        ))}
                    </div>
                    {showError && !selectedReason && (
                        <p className="text-sm text-danger-500 mt-2">Please select a rejection reason</p>
                    )}
                </div>

                {/* Custom Message */}
                {selectedReason === 'other' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6"
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Custom Message
                        </label>
                        <textarea
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-danger-400 focus:outline-none transition-all resize-none"
                            placeholder="Enter a detailed reason for rejection..."
                        />
                    </motion.div>
                )}

                {/* Email Preview */}
                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 mb-6">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        EMAIL PREVIEW
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                        Dear {driverName},
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        We regret to inform you that your driver application has been rejected.
                    </p>
                    {selectedReason && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                            <strong>Reason:</strong>{' '}
                            {rejectionReasons.find((r) => r.id === selectedReason)?.label}
                            {selectedReason === 'other' && customMessage && ` - ${customMessage}`}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirm} className="flex-1">
                        Confirm Rejection
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
