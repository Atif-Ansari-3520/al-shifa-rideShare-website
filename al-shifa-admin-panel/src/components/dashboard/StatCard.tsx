import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import { staggerItem } from '../../utils/animations';
import { cn } from '../../utils/cn';

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    trend?: string;
    color: 'blue' | 'amber' | 'green' | 'purple';
    index: number;
}

const iconBgColors = {
    blue: 'bg-gradient-to-br from-teal-400 to-cyan-500',
    amber: 'bg-gradient-to-br from-amber-400 to-orange-500',
    green: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    purple: 'bg-gradient-to-br from-cyan-400 to-blue-500',
};

const badgeColors = {
    blue: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    purple: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    color,
    index,
}) => {
    const animatedValue = useCountUp(value, 1500);

    return (
        <motion.div
            custom={index}
            variants={staggerItem}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative overflow-hidden rounded-3xl bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 p-6 group cursor-pointer transition-all duration-300 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/10"
        >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Glow effect */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1 space-y-3">
                    {/* Title */}
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {title}
                    </p>

                    {/* Value */}
                    <p className="text-4xl font-black text-white tracking-tight">
                        {animatedValue.toLocaleString()}
                    </p>

                    {/* Trend Badge */}
                    {trend && (
                        <div className={cn(
                            "inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            badgeColors[color]
                        )}>
                            {trend}
                        </div>
                    )}
                </div>

                {/* Icon */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={cn(
                        'p-4 rounded-2xl shadow-lg flex items-center justify-center',
                        iconBgColors[color]
                    )}
                >
                    <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </motion.div>
            </div>
        </motion.div>
    );
};
