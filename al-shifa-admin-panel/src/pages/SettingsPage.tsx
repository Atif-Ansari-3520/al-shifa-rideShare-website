import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Settings</h1>

            <div className="bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-slate-700 rounded-lg">
                        <Settings className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">General Settings</h2>
                        <p className="text-sm text-slate-400">Manage your admin preferences</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-slate-400" />
                            <div>
                                <h3 className="font-medium text-white">Notifications</h3>
                                <p className="text-xs text-slate-500">Receive alerts for new rides</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-slate-400" />
                            <div>
                                <h3 className="font-medium text-white">Security</h3>
                                <p className="text-xs text-slate-500">Two-factor authentication</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
