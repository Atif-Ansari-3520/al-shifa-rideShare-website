import React from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, XCircle, Mail, Phone, Car } from 'lucide-react';
import { Driver } from '../../types';
import { cn } from '../../utils/cn';
import { formatDateSafe, getInitials } from '../../utils/formatters';
import { staggerItem } from '../../utils/animations';
import { driversApi } from '../../api/drivers';

interface DriverCardProps {
    driver: Driver;
    onViewDocuments: () => void;
    onApprove?: () => void;
    onReject?: () => void;
    index: number;
}

const statusStyles = {
    pending: {
        bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        dot: 'bg-amber-500',
        glow: 'group-hover:shadow-amber-500/20',
    },
    approved: {
        bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        dot: 'bg-emerald-500',
        glow: 'group-hover:shadow-emerald-500/20',
    },
    rejected: {
        bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        dot: 'bg-rose-500',
        glow: 'group-hover:shadow-rose-500/20',
    },
};

export const DriverCard: React.FC<DriverCardProps> = ({
    driver,
    onViewDocuments,
    onApprove,
    onReject,
    index,
}) => {
    const styles = statusStyles[driver.status as keyof typeof statusStyles] || statusStyles.pending;

    return (
        <motion.div
            custom={index}
            variants={staggerItem}
            className={cn(
                "relative p-6 rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer",
                "bg-gradient-to-br from-white via-white to-slate-50",
                "dark:from-slate-800 dark:via-slate-800 dark:to-slate-900",
                "border-2 border-transparent",
                "shadow-lg transition-all duration-500",
                "group"
            )}
        >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full -mr-20 -mt-20 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/10 to-emerald-500/10 rounded-full -ml-12 -mb-12 transition-transform duration-700" />

            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div
                        className={cn('flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm', styles.bg)}
                    >
                        <span className={cn('w-2 h-2 rounded-full', styles.dot)} />
                        {driver.status}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                        {formatDateSafe(driver.applied_date)}
                    </span>
                </div>

                {/* Driver Info */}
                <div className="flex items-center gap-5 mb-6 relative z-10">
                    <div
                        className="w-18 h-18 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-emerald-500/30 overflow-hidden ring-4 ring-white dark:ring-slate-700 transition-all duration-300"
                        style={{ width: '72px', height: '72px' }}
                    >
                        {driver.personal_pic_id ? (
                            <img
                                src={driversApi.getDriverImage(driver.personal_pic_id)}
                                alt={driver.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            getInitials(driver.name)
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white truncate tracking-tight transition-colors duration-300">
                            {driver.name}
                        </h3>
                        <div className="space-y-1.5 mt-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 transition-colors">
                                <Mail className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="truncate">{driver.email}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 relative z-10">
                <button
                    onClick={onViewDocuments}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                >
                    <Eye className="h-4 w-4" />
                    View
                </button>

                {driver.status === 'pending' && onApprove && onReject && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onApprove}
                            className="h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                        </button>
                        <button
                            onClick={onReject}
                            className="h-11 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-rose-500/25 hover:shadow-rose-500/40"
                        >
                            <XCircle className="h-4 w-4" />
                            Reject
                        </button>
                    </div>
                )}

                {driver.status === 'rejected' && driver.rejection_reason && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-relaxed">
                            Denied: {driver.rejection_reason}
                        </p>
                        {driver.rejection_message && (
                            <p className="text-[10px] text-rose-500/70 font-bold mt-1 leading-relaxed">
                                "{driver.rejection_message}"
                            </p>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

