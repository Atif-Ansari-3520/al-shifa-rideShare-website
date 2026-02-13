import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { adminApi } from '../api/admin';
import { Skeleton } from '../components/ui/Skeleton';

export const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: adminApi.getStats,
        refetchInterval: 30000, // Refresh every 30 seconds for real-time data
    });

    if (isLoading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-20 w-80 rounded-2xl bg-slate-800/50" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-3xl bg-slate-800/50" />
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
            bgGlow: 'bg-violet-500/20',
            borderColor: 'border-violet-500/30',
            iconBg: 'bg-violet-500',
        },
        {
            title: 'Approved Drivers',
            value: stats?.approved_drivers || 0,
            icon: CheckCircle,
            gradient: 'from-emerald-500 to-teal-600',
            bgGlow: 'bg-emerald-500/20',
            borderColor: 'border-emerald-500/30',
            iconBg: 'bg-emerald-500',
        },
        {
            title: 'Rejected Drivers',
            value: stats?.rejected_drivers || 0,
            icon: XCircle,
            gradient: 'from-rose-500 to-red-600',
            bgGlow: 'bg-rose-500/20',
            borderColor: 'border-rose-500/30',
            iconBg: 'bg-rose-500',
        },
        {
            title: 'Pending Drivers',
            value: stats?.pending_drivers || 0,
            icon: Clock,
            gradient: 'from-amber-500 to-orange-600',
            bgGlow: 'bg-amber-500/20',
            borderColor: 'border-amber-500/30',
            iconBg: 'bg-amber-500',
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
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className={`relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-sm border ${card.borderColor} p-6 cursor-pointer group transition-all duration-300 hover:shadow-2xl`}
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-8 -top-8 w-32 h-32 ${card.bgGlow} rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity`} />
                        <div className={`absolute -left-4 -bottom-4 w-24 h-24 ${card.bgGlow} rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity`} />

                        <div className="relative z-10">
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-4 shadow-lg`}>
                                <card.icon className="w-7 h-7 text-white" strokeWidth={2} />
                            </div>

                            {/* Title */}
                            <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wide">
                                {card.title}
                            </p>

                            {/* Value */}
                            <motion.p
                                className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${card.gradient}`}
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                            >
                                {card.value}
                            </motion.p>
                        </div>

                        {/* Decorative Line */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                    </motion.div>
                ))}
            </div>

            {/* Quick Info Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div className="rounded-3xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Platform Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Total Registered</span>
                            <span className="text-white font-semibold">{stats?.total_users || 0} users</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Active Drivers</span>
                            <span className="text-emerald-400 font-semibold">{stats?.approved_drivers || 0} verified</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Awaiting Review</span>
                            <span className="text-amber-400 font-semibold">{stats?.pending_drivers || 0} pending</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <a
                            href="/drivers?status=pending"
                            className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                        >
                            <span className="text-slate-300 group-hover:text-white transition-colors">Review Pending Drivers</span>
                            <span className="text-amber-400">→</span>
                        </a>
                        <a
                            href="/users"
                            className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                        >
                            <span className="text-slate-300 group-hover:text-white transition-colors">Manage Users</span>
                            <span className="text-teal-400">→</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
