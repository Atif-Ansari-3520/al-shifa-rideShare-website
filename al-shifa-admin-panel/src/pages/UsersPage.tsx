
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, User as UserIcon, Calendar, Eye, Users, Mail, Phone, CreditCard } from 'lucide-react';
import { adminApi } from '../api/admin';
import { Skeleton } from '../components/ui/Skeleton';
import { staggerContainer, staggerItem } from '../utils/animations';
import { useDebounce } from '../hooks/useDebounce';
import { cn } from '../utils/cn';
import { formatDateSafe } from '../utils/formatters';
import { User } from '../types';
import { ImagePreviewModal } from '../components/ui/ImagePreviewModal';

export const UsersPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Fetch users
    const { data, isLoading } = useQuery({
        queryKey: ['users', debouncedSearch],
        queryFn: () => adminApi.getUsers({ search: debouncedSearch || undefined }),
    });

    const users = data?.users || [];

    const handleImageClick = (user: User) => {
        if (user.profile_pic_id) {
            setPreviewImage(adminApi.getUserImage(user.profile_pic_id));
        } else if (user.profile_picture) {
            setPreviewImage(user.profile_picture);
        }
    };

    return (
        <div className="space-y-8 py-4">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        User Directory
                    </h1>
                    <p className="text-slate-400 text-base">
                        Manage and view all registered users across the platform.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
                >
                    <div className="p-2.5 bg-teal-500/10 rounded-xl">
                        <Users className="h-5 w-5 text-teal-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Users</p>
                        <p className="text-xl font-bold text-white leading-none">
                            {data?.total || 0}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative group max-w-2xl"
            >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-400 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, or phone..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder:text-slate-500 focus:ring-0 focus:border-teal-500/50 focus:outline-none transition-all shadow-lg"
                    />
                </div>
            </motion.div>

            {/* Users Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-64 rounded-3xl bg-slate-800/50" />
                    ))}
                </div>
            ) : users.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30"
                >
                    <div className="bg-slate-800/50 p-4 rounded-full w-fit mx-auto mb-4">
                        <Search className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">No users found</h3>
                    <p className="text-slate-500">Try adjusting your search terms.</p>
                </motion.div>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {users.map((user) => (
                            <motion.div
                                key={user.id}
                                variants={staggerItem}
                                layout
                                className="group relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-teal-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/5"
                            >
                                {/* Decorative Gradient Bg */}
                                <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-slate-800 to-slate-900 opacity-50" />

                                <div className="relative p-6 pt-8 flex flex-col items-center text-center h-full">
                                    {/* Profile Avatar */}
                                    <div className="relative inline-block mb-4">
                                        <div
                                            className={`w-24 h-24 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden shadow-lg mx-auto group-hover:border-teal-500/50 transition-colors ${user.profile_pic_id || user.profile_picture ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
                                            onClick={() => handleImageClick(user)}
                                        >
                                            {user.profile_pic_id ? (
                                                <img
                                                    src={adminApi.getUserImage(user.profile_pic_id)}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : user.profile_picture ? (
                                                <img
                                                    src={user.profile_picture}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl font-black text-slate-600 uppercase group-hover:text-teal-500 transition-colors">
                                                    {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute bottom-1 right-1 p-1.5 bg-slate-900 rounded-full border border-slate-700 pointer-events-none">
                                            {user.active_role === 'admin' ? (
                                                <Shield className="h-3.5 w-3.5 text-cyan-400" />
                                            ) : user.active_role === 'driver' ? (
                                                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                                            ) : (
                                                <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-1 truncate px-2">{user.name}</h3>

                                    <div className="space-y-2 w-full px-4 mb-4">
                                        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-800/40 py-1.5 rounded-lg break-all px-2">
                                            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-800/40 py-1.5 rounded-lg break-all px-2">
                                            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span>{user.phone}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-700/50 w-full flex justify-center pb-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.active_role === 'admin'
                                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                            : user.active_role === 'driver'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                                            }`}>
                                            {user.active_role}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Image Preview Modal */}
            <ImagePreviewModal
                isOpen={!!previewImage}
                onClose={() => setPreviewImage(null)}
                imageUrl={previewImage}
            />
        </div>
    );
};
