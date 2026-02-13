import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Car,
    Settings,
    LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../api/auth';
import { cn } from '../../utils/cn';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/drivers', icon: Car, label: 'Drivers' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
    const { user } = useAuthStore();

    const handleLogout = () => {
        authApi.logout();
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 z-50">
            <div className="flex flex-col h-full">
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-teal-500/20">
                            <Car className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-white leading-none">
                                Rahi 
                            </h2>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-400 mt-0.5">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group',
                                    isActive
                                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={cn(
                                        "h-5 w-5 transition-transform group-hover:scale-110",
                                        isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                    )} />
                                    <span className="font-medium text-sm">
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Section & Footer */}
                <div className="p-4 border-t border-slate-700/50 space-y-3">
                    {user && (
                        <div className="p-3 bg-slate-800/60 rounded-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-white truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-medium text-sm transition-all duration-200"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
