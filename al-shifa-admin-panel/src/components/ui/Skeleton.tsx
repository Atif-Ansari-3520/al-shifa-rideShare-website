import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-gray-200 dark:bg-slate-700',
                className
            )}
            {...props}
        />
    );
};

export const CardSkeleton: React.FC = () => {
    return (
        <div className="glass-card p-6 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
        </div>
    );
};
