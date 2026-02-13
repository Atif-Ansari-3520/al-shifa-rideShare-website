import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { modalBackdrop, scale } from '../../utils/animations';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    className,
    showCloseButton = true,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        variants={modalBackdrop}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal content */}
                    <motion.div
                        variants={scale}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={cn(
                            'relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-auto custom-scrollbar',
                            className
                        )}
                    >
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors z-10"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
