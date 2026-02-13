import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { pageTransition, pageTransitionConfig } from '../../utils/animations';

export const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex">
            <Sidebar />

            {/* Main Content - Fixed margin for static sidebar */}
            <div className="ml-72 flex-1 min-h-screen flex flex-col">
                <main className="flex-1 p-6 overflow-x-hidden">
                    <motion.div
                        variants={pageTransition}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransitionConfig}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};
