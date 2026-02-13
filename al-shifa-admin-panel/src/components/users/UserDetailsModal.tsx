import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, Shield, CreditCard, User as UserIcon } from 'lucide-react';
import { User } from '../../types';
import { formatDateSafe } from '../../utils/formatters';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
    isOpen,
    onClose,
    user,
}) => {
    if (!user) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/50 shadow-2xl">
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-500 to-cyan-500" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="relative pt-16 px-6 pb-8 text-center">
                                {/* Profile Picture */}
                                <div className="relative inline-block mb-6">
                                    <div className="w-32 h-32 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl mx-auto">
                                        {user.profile_picture ? (
                                            <img
                                                src={user.profile_picture}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-4xl font-black text-slate-400 uppercase">
                                                {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-2 right-2 p-2 bg-slate-900 rounded-full border-2 border-slate-800">
                                        {user.active_role === 'admin' ? (
                                            <Shield className="h-5 w-5 text-cyan-400" />
                                        ) : user.active_role === 'driver' ? (
                                            <CreditCard className="h-5 w-5 text-emerald-400" />
                                        ) : (
                                            <UserIcon className="h-5 w-5 text-slate-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Header Info */}
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                                    {user.name}
                                </h2>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${user.active_role === 'admin'
                                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                    : user.active_role === 'driver'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                                    }`}>
                                    {user.active_role} Account
                                </span>

                                {/* User Details Grid */}
                                <div className="mt-8 grid grid-cols-1 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2 text-center hover:bg-slate-800 transition-colors group">
                                        <div className="p-3 rounded-xl bg-slate-700/50 text-slate-400 group-hover:text-teal-400 group-hover:bg-teal-500/10 transition-colors">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Email Address</p>
                                            <p className="text-sm font-semibold text-white break-all">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2 text-center hover:bg-slate-800 transition-colors group">
                                        <div className="p-3 rounded-xl bg-slate-700/50 text-slate-400 group-hover:text-teal-400 group-hover:bg-teal-500/10 transition-colors">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Phone Number</p>
                                            <p className="text-sm font-semibold text-white">{user.phone}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2 text-center hover:bg-slate-800 transition-colors group">
                                            <div className="p-3 rounded-xl bg-slate-700/50 text-slate-400 group-hover:text-teal-400 group-hover:bg-teal-500/10 transition-colors">
                                                <Calendar className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Joined On</p>
                                                <p className="text-sm font-semibold text-white">{formatDateSafe(user.created_at)}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center gap-2 text-center hover:bg-slate-800 transition-colors group">
                                            <div className="p-3 rounded-xl bg-slate-700/50 text-slate-400 group-hover:text-teal-400 group-hover:bg-teal-500/10 transition-colors">
                                                <Shield className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">User ID</p>
                                                <p className="text-xs font-mono font-semibold text-slate-400 truncate w-full max-w-[100px]">{user.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};
