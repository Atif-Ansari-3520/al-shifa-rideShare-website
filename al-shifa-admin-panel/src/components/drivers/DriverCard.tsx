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
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        dot: 'bg-amber-500',
        glow: 'group-hover:shadow-amber-500/10',
    },
    approved: {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-500',
        glow: 'group-hover:shadow-emerald-500/10',
    },
    rejected: {
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        dot: 'bg-rose-500',
        glow: 'group-hover:shadow-rose-500/10',
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
                "bg-slate-800 border border-slate-700",
                "shadow-sm transition-all duration-300",
                "hover:shadow-xl hover:border-blue-500/30 hover:bg-slate-800/80",
                "group"
            )}
        >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full -mr-20 -mt-20 transition-transform duration-700 opacity-50" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/5 to-blue-500/5 rounded-full -ml-12 -mb-12 transition-transform duration-700 opacity-50" />

            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div
                        className={cn('flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider', styles.bg)}
                    >
                        <span className={cn('w-1.5 h-1.5 rounded-full', styles.dot)} />
                        {driver.status}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">
                        {formatDateSafe(driver.applied_date)}
                    </span>
                </div>

                {/* Driver Info */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-xl font-black text-blue-400 shadow-sm border border-slate-700/50 overflow-hidden flex-shrink-0">
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
                        <h3 className="text-lg font-bold text-white truncate tracking-tight">
                            {driver.name}
                        </h3>
                        <div className="space-y-1 mt-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                <Mail className="h-3.5 w-3.5 text-slate-500" />
                                <span className="truncate">{driver.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 relative z-10 mt-auto">
                <button
                    onClick={onViewDocuments}
                    className="w-full h-11 flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-600 hover:border-blue-500 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                    <Eye className="h-4 w-4 text-slate-400 group-hover:text-white" />
                    View Docs
                </button>

                {driver.status === 'pending' && onApprove && onReject && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onApprove}
                            className="h-10 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                        </button>
                        <button
                            onClick={onReject}
                            className="h-10 flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                            <XCircle className="h-4 w-4" />
                            Reject
                        </button>
                    </div>
                )}

                {driver.status === 'rejected' && driver.rejection_reason && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider leading-relaxed">
                            Denied: {driver.rejection_reason}
                        </p>
                        {driver.rejection_message && (
                            <p className="text-[10px] text-rose-300 font-medium mt-1 leading-relaxed">
                                "{driver.rejection_message}"
                            </p>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
