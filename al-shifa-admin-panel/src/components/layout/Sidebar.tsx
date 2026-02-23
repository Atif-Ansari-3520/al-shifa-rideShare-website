import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Car,
    UserCheck,
    ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const Sidebar: React.FC = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: UserCheck, label: 'Drivers', path: '/drivers' },
        { icon: Car, label: 'Rides', path: '/rides' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-blue-500/10 blur-3xl rounded-full translate-y-[-50%]" />

            {/* Logo Section */}
            <div className="p-5 pb-3 flex flex-col items-start justify-start relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-18 flex flex-col items-start"
                >
                    <img
                        src="/logo-r.png"
                        alt="RAHI"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                    />
                    <div className="mt-1 flex items-center gap-1.5 w-full">
                        <span className="text-[7px] uppercase tracking-[0.12em] text-blue-400 font-bold whitespace-nowrap text-shadow-glow">
                            Admin Panel
                        </span>
                        <div className="h-[1px] bg-gradient-to-r from-slate-700 to-transparent flex-1" />
                    </div>
                </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive }) => `
                                group relative flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300
                                ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-900/40 hover:brightness-110 active:scale-95'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`
                                        p-1.5 rounded-lg transition-colors duration-300
                                        ${isActive ? 'bg-blue-500/30' : 'bg-slate-800 group-hover:bg-slate-700'}
                                    `}>
                                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="font-medium tracking-wide flex-1 text-sm">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@rahi.com'}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors group border border-transparent hover:border-rose-500/20"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm">Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Trigger */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-3 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 h-screen fixed left-0 top-0 z-40">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden"
                        >
                            <SidebarContent />
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
