import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Download,
    ZoomIn,
    User,
    Mail,
    Phone,
    Calendar,
    CreditCard,
    Car,
    CheckCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DriverDetails } from '../../types';
import { driversApi } from '../../api/drivers';
import { cn } from '../../utils/cn';
import { formatDateSafe } from '../../utils/formatters';
import { Skeleton } from '../ui/Skeleton';
import { Button } from '../ui/Button';

interface DocumentViewerModalProps {
    driverEmail: string;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    status: 'pending' | 'approved' | 'rejected';
}

const documentLabels = {
    personal_photo_id: 'Personal Photo',
    license_front_id: 'License Front',
    license_selfie_id: 'License Selfie',
    vehicle_photo_id: 'Vehicle Photo',
    registration_doc_id: 'Registration Document',
    certificate_back_id: 'Certificate Back',
};

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
    driverEmail,
    onClose,
    onApprove,
    onReject,
    status,
}) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data: driverDetails, isLoading, error } = useQuery({
        queryKey: ['driver-details', driverEmail],
        queryFn: () => driversApi.getDriverDetails(driverEmail),
        retry: 1,
    });

    const handleApprove = () => {
        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#34D399', '#6EE7B7'],
        });
        onApprove();
    };

    const handleDownload = (fileId: string, label: string) => {
        const url = driversApi.getDriverImage(fileId);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${driverEmail}_${label}.jpg`;
        link.click();
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 max-w-6xl w-full shadow-2xl">
                    <Skeleton className="h-8 w-64 mb-6 bg-slate-200" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Skeleton className="h-96 bg-slate-200" />
                        <div className="lg:col-span-2 space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-32 bg-slate-200" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !driverDetails) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                    <X className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Documents</h3>
                    <p className="text-slate-500 mb-6">
                        We couldn't retrieve the documents for this driver. The data might be missing or the server might be unreachable.
                    </p>
                    <Button variant="primary" onClick={onClose} className="w-full">
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Driver Documents
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50/30">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                            {/* Left Panel - Driver Info */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                                            {(driverDetails.name || '?').charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-center">{driverDetails.name || 'Anonymous Driver'}</h3>
                                </div>

                                <div className="bg-white rounded-2xl p-4 space-y-3 border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-700 break-all">{driverDetails.email}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span className="text-slate-700">
                                            DOB: {formatDateSafe(driverDetails.date_of_birth)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <CreditCard className="h-4 w-4 text-slate-400" />
                                        <div className="flex-1">
                                            <p className="text-slate-700 font-medium">
                                                {driverDetails.license_number || 'No license info'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Exp: {formatDateSafe(driverDetails.license_expiry)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Details */}
                                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Car className="h-5 w-5 text-blue-500" />
                                        <h4 className="font-semibold text-slate-900">Vehicle Details</h4>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-slate-600">
                                            <span className="font-medium text-slate-900">Brand:</span> {driverDetails.vehicle_brand}
                                        </p>
                                        <p className="text-slate-600">
                                            <span className="font-medium text-slate-900">Model:</span> {driverDetails.vehicle_model}
                                        </p>
                                        <p className="text-slate-600">
                                            <span className="font-medium text-slate-900">Year:</span> {driverDetails.vehicle_year}
                                        </p>
                                        <p className="text-slate-600">
                                            <span className="font-medium text-slate-900">Color:</span> {driverDetails.vehicle_color}
                                        </p>
                                        <p className="text-slate-600">
                                            <span className="font-medium text-slate-900">Plate:</span> {driverDetails.plate_number}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel - Documents */}
                            <div className="lg:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {driverDetails.documents && Object.entries(driverDetails.documents).map(([key, fileId]) => {
                                        if (!fileId) return null;
                                        const label = documentLabels[key as keyof typeof documentLabels];
                                        const imageUrl = driversApi.getDriverImage(fileId);

                                        return (
                                            <div
                                                key={key}
                                                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group shadow-sm"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                                                        {label}
                                                    </h4>
                                                    <button
                                                        onClick={() => handleDownload(fileId, label)}
                                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div
                                                    onClick={() => setSelectedImage(imageUrl)}
                                                    className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden cursor-pointer group-hover:ring-2 ring-offset-2 ring-blue-100 transition-all"
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={label}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-200" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Action Buttons */}
                    {status === 'pending' && (
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                            <button
                                onClick={handleApprove}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-[0.98]"
                            >
                                <CheckCircle className="h-6 w-6" />
                                Approve Driver
                            </button>
                            <button
                                onClick={onReject}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-rose-500/30 transition-all active:scale-[0.98]"
                            >
                                <X className="h-6 w-6" />
                                Reject Driver
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Image Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            src={selectedImage}
                            alt="Document"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
