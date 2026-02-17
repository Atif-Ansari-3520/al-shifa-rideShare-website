import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, XCircle, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { adminApi } from '../api/admin';
import { Skeleton } from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: adminApi.getStats,
        refetchInterval: 30000,
    });

    if (isLoading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-20 w-80 rounded-2xl bg-slate-800" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-3xl bg-slate-800" />
                    ))}
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Active Users',
            value: stats?.total_users || 0,
            icon: Users,
            gradient: 'from-violet-500 to-purple-600',
            bgGlow: 'bg-violet-500/10',
            borderColor: 'border-violet-500/20',
            iconBg: 'bg-violet-500/20 text-violet-400',
        },
        {
            title: 'Approved Drivers',
            value: stats?.approved_drivers || 0,
            icon: CheckCircle,
            gradient: 'from-emerald-500 to-teal-600',
            bgGlow: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            iconBg: 'bg-emerald-500/20 text-emerald-400',
        },
        {
            title: 'Rejected Drivers',
            value: stats?.rejected_drivers || 0,
            icon: XCircle,
            gradient: 'from-rose-500 to-red-600',
            bgGlow: 'bg-rose-500/10',
            borderColor: 'border-rose-500/20',
            iconBg: 'bg-rose-500/20 text-rose-400',
        },
        {
            title: 'Pending Drivers',
            value: stats?.pending_drivers || 0,
            icon: Clock,
            gradient: 'from-amber-500 to-orange-600',
            bgGlow: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20',
            iconBg: 'bg-amber-500/20 text-amber-400',
        },
        {
            title: 'Total Rides',
            value: stats?.total_rides || 0,
            icon: MapPin,
            gradient: 'from-blue-500 to-indigo-600',
            bgGlow: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            iconBg: 'bg-blue-500/20 text-blue-400',
        },
        {
            title: 'Today Rides',
            value: stats?.today_rides || 0,
            icon: Calendar,
            gradient: 'from-pink-500 to-rose-600',
            bgGlow: 'bg-pink-500/10',
            borderColor: 'border-pink-500/20',
            iconBg: 'bg-pink-500/20 text-pink-400',
        },
    ];

    return (
        <div className="space-y-10 py-4">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Welcome back,{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        {user?.name || 'Admin'}
                    </span>{' '}
                    <motion.span
                        animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="inline-block"
                    >
                        👋
                    </motion.span>
                </h1>
                <p className="text-slate-400 text-base">
                    Here's what's happening with your platform today.
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, index) => {
                    // Extract color from iconBg to apply to text
                    const valueColor = card.iconBg.split(' ')[1].replace('text-', 'text-');
                    return (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className={`relative overflow-hidden rounded-3xl bg-slate-800/50 border ${card.borderColor} p-5 cursor-pointer group transition-all duration-300 hover:shadow-xl shadow-lg backdrop-blur-sm`}
                        >
                            {/* Background Glow */}
                            <div className={`absolute -right-8 -top-8 w-32 h-32 ${card.bgGlow} rounded-full blur-3xl opacity-40 group-hover:opacity-80 transition-opacity`} />
                            <div className={`absolute -left-4 -bottom-4 w-24 h-24 ${card.bgGlow} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center mb-4 shadow-sm backdrop-blur-md`}>
                                    <card.icon className="w-6 h-6" strokeWidth={2.5} />
                                </div>

                                {/* Title */}
                                <p className="text-slate-400 text-xs font-bold mb-2 uppercase tracking-widest">
                                    {card.title}
                                </p>

                                {/* Value */}
                                <motion.p
                                    className={`text-4xl font-extrabold ${valueColor.replace('400', '500')}`}
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                                >
                                    {card.value}
                                </motion.p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Info Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div className="rounded-3xl bg-slate-800/50 border border-slate-700 p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Platform Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-slate-700">
                            <span className="text-slate-400">Total Registered</span>
                            <span className="text-white font-bold">{stats?.total_users || 0} users</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-slate-700">
                            <span className="text-slate-400">Active Drivers</span>
                            <span className="text-emerald-400 font-bold">{stats?.approved_drivers || 0} verified</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-slate-700">
                            <span className="text-slate-400">Awaiting Review</span>
                            <span className="text-amber-400 font-bold">{stats?.pending_drivers || 0} pending</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-slate-800/50 border border-slate-700 p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Link
                            to="/drivers?status=pending"
                            className="flex justify-between items-center p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 transition-colors group cursor-pointer border border-amber-500/20"
                        >
                            <span className="text-amber-400 font-medium">Review Pending Drivers</span>
                            <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/users"
                            className="flex justify-between items-center p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors group cursor-pointer border border-blue-500/20"
                        >
                            <span className="text-blue-400 font-medium">Manage Users</span>
                            <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
