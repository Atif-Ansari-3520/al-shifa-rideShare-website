import { Variants } from 'framer-motion';

export const pageTransition: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const pageTransitionConfig = {
    duration: 0.3,
    ease: [0.43, 0.13, 0.23, 0.96] as const,
};

export const staggerContainer: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export const cardHover: Variants = {
    rest: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    hover: { y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
};

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const slideIn: Variants = {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
};

export const shake: Variants = {
    shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 },
    },
};

export const scale: Variants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
};

export const modalBackdrop: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};
