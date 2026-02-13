import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
    tabs,
    activeTab,
    onChange,
}) => {
    return (
        <div className="flex gap-2 glass p-2 rounded-2xl border border-white/20 shadow-xl overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        'relative px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-3 min-w-fit',
                        activeTab === tab.id
                            ? 'text-white shadow-lg shadow-emerald-500/20'
                            : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                    )}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                    {tab.count !== undefined && (
                        <motion.span
                            className={cn(
                                'relative z-10 px-2 py-0.5 rounded-lg text-[10px] font-black',
                                activeTab === tab.id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            )}
                            animate={tab.id === 'pending' && tab.count > 0 ? { scale: [1, 1.15, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {tab.count}
                        </motion.span>
                    )}
                </button>
            ))}
        </div>
    );
};
