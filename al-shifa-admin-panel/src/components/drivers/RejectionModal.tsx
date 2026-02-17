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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                variants={showError ? shake : undefined}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto custom-scrollbar border border-slate-100"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Reject Driver Application
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Driver Summary */}
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-6">
                    <p className="text-sm font-medium text-rose-900">
                        You are about to reject:
                    </p>
                    <p className="text-lg font-bold text-rose-700 mt-1">
                        {driverName}
                    </p>
                    <p className="text-sm text-rose-600">{driverEmail}</p>
                </div>

                {/* Rejection Reasons */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
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
                                        ? 'border-rose-400 bg-rose-50 text-rose-700'
                                        : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                )}
                            >
                                <div
                                    className={cn(
                                        'p-2 rounded-lg',
                                        selectedReason === reason.id
                                            ? 'bg-rose-400 text-white'
                                            : 'bg-slate-100 text-slate-500'
                                    )}
                                >
                                    <reason.icon className="h-5 w-5" />
                                </div>
                                <span className="font-semibold text-sm">
                                    {reason.label}
                                </span>
                            </button>
                        ))}
                    </div>
                    {showError && !selectedReason && (
                        <p className="text-sm text-rose-500 mt-2 font-medium">Please select a rejection reason</p>
                    )}
                </div>

                {/* Custom Message */}
                {selectedReason === 'other' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6"
                    >
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Custom Message
                        </label>
                        <textarea
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:outline-none transition-all resize-none shadow-sm"
                            placeholder="Enter a detailed reason for rejection..."
                        />
                    </motion.div>
                )}

                {/* Email Preview */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        EMAIL PREVIEW
                    </p>
                    <p className="text-sm text-slate-800">
                        Dear {driverName},
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                        We regret to inform you that your driver application has been rejected.
                    </p>
                    {selectedReason && (
                        <p className="text-sm text-slate-600 mt-2">
                            <strong>Reason:</strong>{' '}
                            {rejectionReasons.find((r) => r.id === selectedReason)?.label}
                            {selectedReason === 'other' && customMessage && ` - ${customMessage}`}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={onClose} className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200">
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirm} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30">
                        Confirm Rejection
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
