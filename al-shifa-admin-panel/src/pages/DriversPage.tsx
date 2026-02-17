import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Car, AlertCircle, Loader2 } from 'lucide-react';
import { driversApi } from '../api/drivers';
import { useToast } from '../components/ui/Toast';
import { TabNavigation } from '../components/drivers/TabNavigation';
import { DriverCard } from '../components/drivers/DriverCard';
import { DocumentViewerModal } from '../components/drivers/DocumentViewerModal';
import { RejectionModal } from '../components/drivers/RejectionModal';
import { Skeleton } from '../components/ui/Skeleton';
import { staggerContainer } from '../utils/animations';
import { useDebounce } from '../hooks/useDebounce';

import { Driver } from '../types';

type DriverStatus = 'all' | 'pending' | 'approved' | 'rejected';

// Error Boundary wrapper
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center py-12 bg-slate-800 rounded-2xl border border-rose-500/20">
                    <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                    <p className="text-rose-500 font-black uppercase tracking-tighter italic">Fleet Data Stream Interrupted.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-sm text-blue-400 hover:underline"
                    >
                        Refresh page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export const DriversPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const observerTarget = useRef(null);

    const [activeTab, setActiveTab] = useState<DriverStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [driverToReject, setDriverToReject] = useState<{ email: string; name: string } | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Fetch drivers (Infinite Scroll)
    const {
        data: driversData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['drivers', activeTab, debouncedSearch],
        queryFn: ({ pageParam = 1 }) =>
            driversApi.getDrivers({
                status: activeTab === 'all' ? undefined : activeTab,
                search: debouncedSearch || undefined,
                page: pageParam,
                limit: 12, // Load 12 at a time
            }),
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= Math.ceil(lastPage.total / 12) ? nextPage : undefined;
        },
        initialPageParam: 1,
    });

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage]);


    // Fetch counts for tabs
    const { data: allDrivers } = useQuery({
        queryKey: ['drivers', 'all-count'],
        queryFn: () => driversApi.getDrivers({ limit: 1 }), // Minimal fetch for count
    });

    const { data: pendingDrivers } = useQuery({
        queryKey: ['drivers', 'pending-count'],
        queryFn: () => driversApi.getDrivers({ status: 'pending', limit: 1 }),
    });

    const { data: approvedDrivers } = useQuery({
        queryKey: ['drivers', 'approved-count'],
        queryFn: () => driversApi.getDrivers({ status: 'approved', limit: 1 }),
    });

    const { data: rejectedDrivers } = useQuery({
        queryKey: ['drivers', 'rejected-count'],
        queryFn: () => driversApi.getDrivers({ status: 'rejected', limit: 1 }),
    });

    // Approve mutation
    const approveMutation = useMutation({
        mutationFn: (email: string) => driversApi.approveDriver(email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            setSelectedDriver(null);
            showToast('Driver approved successfully!', 'success');
        },
        onError: (error: any) => {
            showToast(error.response?.data?.detail || 'Failed to approve driver', 'error');
        },
    });

    // Reject mutation
    const rejectMutation = useMutation({
        mutationFn: ({ email, reason, message }: { email: string; reason: string; message?: string }) =>
            driversApi.rejectDriver({ email, reason, message }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            setSelectedDriver(null);
            setDriverToReject(null);
            showToast('Driver rejected successfully', 'success');
        },
        onError: (error: any) => {
            showToast(error.response?.data?.detail || 'Failed to reject driver', 'error');
        },
    });

    const handleApprove = (email: string) => {
        approveMutation.mutate(email);
    };

    const handleRejectConfirm = (reason: string, message?: string) => {
        if (driverToReject) {
            rejectMutation.mutate({
                email: driverToReject.email,
                reason,
                message,
            });
        }
    };

    const tabs = [
        { id: 'all', label: 'All', count: allDrivers?.total },
        { id: 'pending', label: 'Pending', count: pendingDrivers?.total },
        { id: 'approved', label: 'Approved', count: approvedDrivers?.total },
        { id: 'rejected', label: 'Rejected', count: rejectedDrivers?.total },
    ];

    const drivers = driversData?.pages.flatMap((page) => page.drivers) || [];

    return (
        <div className="space-y-6 py-6">
            {/* Header - Top Left */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4"
            >
                <div className="h-14 w-1.5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                <div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                        Driver Management
                    </h1>
                    <p className="text-slate-400 font-medium text-sm mt-0.5">
                        Manage and verify driver applications
                    </p>
                </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative w-full group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="🔍 Search drivers by name, email, or phone..."
                        className="w-full pl-16 pr-8 py-5 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 text-white font-medium placeholder:text-slate-500 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 focus:outline-none transition-all shadow-xl text-base"
                    />
                </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="space-y-4">
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={(id) => setActiveTab(id as DriverStatus)}
                />
            </div>

            {/* Drivers Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-96 rounded-3xl bg-slate-800" />
                    ))}
                </div>
            ) : drivers.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-32 text-center border-dashed border-2 border-slate-700 bg-slate-800/30 rounded-3xl"
                >
                    <div className="bg-slate-800 p-6 rounded-full w-fit mx-auto mb-6 border border-slate-700">
                        <Car className="h-12 w-12 text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">No Records Found</h3>
                    <p className="text-slate-400 font-bold">The fleet database returned zero results for this sector.</p>
                </motion.div>
            ) : (
                <ErrorBoundary>
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {drivers.map((driver) => (
                            <DriverCard
                                key={driver.email}
                                driver={driver}
                                index={0} // Stagger index can be fixed or passed differently
                                onViewDocuments={() => setSelectedDriver(driver)}
                                onApprove={() => handleApprove(driver.email)}
                                onReject={() => setDriverToReject({ email: driver.email, name: driver.name })}
                            />
                        ))}
                    </motion.div>

                    {/* Loader for Infinite Scroll */}
                    <div ref={observerTarget} className="h-10 flex items-center justify-center w-full mt-4">
                        {isFetchingNextPage && <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />}
                    </div>
                </ErrorBoundary>
            )}

            {/* Document Viewer Modal */}
            {selectedDriver && (
                <DocumentViewerModal
                    driverEmail={selectedDriver.email}
                    status={selectedDriver.status}
                    onClose={() => setSelectedDriver(null)}
                    onApprove={() => handleApprove(selectedDriver.email)}
                    onReject={() => {
                        setDriverToReject({ email: selectedDriver.email, name: selectedDriver.name });
                    }}
                />
            )}

            {/* Rejection Modal */}
            {driverToReject && (
                <RejectionModal
                    driverName={driverToReject.name}
                    driverEmail={driverToReject.email}
                    onConfirm={handleRejectConfirm}
                    onClose={() => setDriverToReject(null)}
                />
            )}
        </div>
    );
};
