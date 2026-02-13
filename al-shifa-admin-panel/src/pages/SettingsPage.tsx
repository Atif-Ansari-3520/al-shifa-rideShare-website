import React from 'react';

export const SettingsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Configure system settings and preferences
                </p>
            </div>

            <div className="glass-card p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Settings interface coming soon...
                </p>
            </div>
        </div>
    );
};
