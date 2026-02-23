// Auto-deploy verified: Surge.sh
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MapPin,
    Calendar,
    Clock,
    Users,
    Phone,
    Car,
    X,
    ChevronRight,
    Navigation,
    Filter,
    DollarSign,
    Armchair,
    UserCheck
} from 'lucide-react';
import { adminApi } from '../api/admin';
import { Ride } from '../types';
import { Skeleton } from '../components/ui/Skeleton';

export const RidesPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['rides', page, search, statusFilter, typeFilter],
        queryFn: () => adminApi.getRides({
            page,
            limit: 12,
            search,
            status: statusFilter,
            ride_type: typeFilter
        })
    });

    const handleViewDetails = (ride: Ride) => {
        setSelectedRide(ride);
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-3xl border border-rose-500/20">
                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-white font-medium mb-1">Failed to load rides</h3>
                <p className="text-slate-400 text-sm">Please check your connection and try again</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Ride Management</h1>
                    <p className="text-slate-400 text-sm">Monitor and manage all posted rides</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search rides..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64 transition-all shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 bg-slate-800 border border-slate-700 rounded-xl pr-8 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer"
                    >
                        <option value="all">All Types</option>
                        <option value="passenger">Passenger</option>
                        <option value="driver">Driver</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-3xl bg-slate-800" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data?.rides?.map((ride) => (
                        <motion.div
                            key={ride._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800 border border-slate-700/50 rounded-3xl p-5 hover:border-blue-500/30 hover:bg-slate-800/80 transition-all duration-300 group shadow-lg"
                        >
                            {/* Header: User Info */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 font-bold shadow-sm">
                                        {ride.poster_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-sm truncate max-w-[120px]">
                                            {ride.poster_name}
                                        </h3>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${ride.ride_type === 'driver'
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {ride.ride_type}
                                        </span>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${ride.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                    ride.status === 'completed' ? 'bg-slate-700 text-slate-400' :
                                        'bg-rose-500/20 text-rose-400'
                                    }`}>
                                    {ride.status}
                                </div>
                            </div>

                            {/* Minimal Route Info */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="truncate text-slate-300">{ride.pickup_address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <span className="truncate text-slate-300">{ride.dropoff_address}</span>
                                </div>
                            </div>

                            {/* Fare & Seats Quick Info */}
                            <div className="flex items-center flex-wrap gap-2 mb-4">
                                {ride.fare_per_seat != null && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400 text-xs font-semibold">Rs {ride.fare_per_seat}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <Armchair className="w-3.5 h-3.5 text-blue-400" />
                                    <span className="text-blue-400 text-xs font-semibold">{ride.available_seats ?? ride.number_of_seats} / {ride.number_of_seats}</span>
                                </div>
                                {(ride.number_of_seats - (ride.available_seats ?? ride.number_of_seats)) > 0 && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-amber-400 text-xs font-semibold">{ride.number_of_seats - (ride.available_seats ?? ride.number_of_seats)} reserved</span>
                                    </div>
                                )}
                            </div>

                            {/* View Button */}
                            <button
                                onClick={() => handleViewDetails(ride)}
                                className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-300 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                View Details
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Data empty state */}
            {!isLoading && (!data?.rides || data?.rides.length === 0) && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-white font-medium mb-1">No rides found</h3>
                    <p className="text-slate-500 text-sm">Try adjusting your filters</p>
                </div>
            )}

            {/* Details Modal */}
            <AnimatePresence>
                {selectedRide && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRide(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-700"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 font-bold text-xl">
                                        {selectedRide.poster_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">{selectedRide.poster_name}</h2>
                                        <div className="flex items-center gap-3 text-sm text-slate-400">
                                            <span>{selectedRide.ride_type === 'driver' ? 'Driver' : 'Passenger'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedRide(null)}
                                    className="p-2 rounded-full hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 grid gap-8">
                                {/* Trip Details + Seat & Fare Side by Side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left: Route Details */}
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                                            <Navigation className="w-4 h-4" />
                                            Trip Details
                                        </h3>
                                        <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                                            <div className="relative">
                                                <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-slate-900 shadow-sm" />
                                                <label className="text-xs text-slate-500 font-medium uppercase mb-1 block">Pick-up</label>
                                                <p className="text-white font-medium text-lg leading-tight mb-1">{selectedRide.pickup_address}</p>
                                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{selectedRide.pickup_date}</span>
                                                    <Clock className="w-4 h-4 ml-2" />
                                                    <span>{selectedRide.pickup_time}</span>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-slate-900 shadow-sm" />
                                                <label className="text-xs text-slate-500 font-medium uppercase mb-1 block">Drop-off</label>
                                                <p className="text-white font-medium text-lg leading-tight mb-1">{selectedRide.dropoff_address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Seat & Fare 2x2 Grid */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                                            <Armchair className="w-4 h-4" />
                                            Seat & Fare
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedRide.fare_per_seat != null && (
                                                <div className="bg-slate-800 rounded-2xl p-4 border border-emerald-500/20">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                                                        </div>
                                                        <span className="text-slate-500 text-xs font-medium">Fare / Seat</span>
                                                    </div>
                                                    <p className="text-emerald-400 font-bold text-lg">Rs {selectedRide.fare_per_seat}</p>
                                                </div>
                                            )}
                                            <div className="bg-slate-800 rounded-2xl p-4 border border-indigo-500/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-7 h-7 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                                                    </div>
                                                    <span className="text-slate-500 text-xs font-medium">Total Seats</span>
                                                </div>
                                                <p className="text-indigo-400 font-bold text-lg">{selectedRide.number_of_seats}</p>
                                            </div>
                                            <div className="bg-slate-800 rounded-2xl p-4 border border-blue-500/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-7 h-7 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                        <Armchair className="w-3.5 h-3.5 text-blue-400" />
                                                    </div>
                                                    <span className="text-slate-500 text-xs font-medium">Available</span>
                                                </div>
                                                <p className="text-blue-400 font-bold text-lg">{selectedRide.available_seats ?? selectedRide.number_of_seats}</p>
                                            </div>
                                            <div className="bg-slate-800 rounded-2xl p-4 border border-amber-500/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                                        <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                                                    </div>
                                                    <span className="text-slate-500 text-xs font-medium">Reserved</span>
                                                </div>
                                                <p className="text-amber-400 font-bold text-lg">{selectedRide.number_of_seats - (selectedRide.available_seats ?? selectedRide.number_of_seats)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Info (Driver Only) */}
                                {selectedRide.ride_type === 'driver' && selectedRide.vehicle_info && (
                                    <div className="bg-amber-500/10 rounded-2xl p-5 border border-amber-500/20">
                                        <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                                            <Car className="w-4 h-4" />
                                            Vehicle Details
                                        </h3>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                            <div>
                                                <span className="text-xs text-amber-500/70 block">Brand & Model</span>
                                                <p className="text-amber-200 font-medium">{selectedRide.vehicle_info.brand} {selectedRide.vehicle_info.model}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-amber-500/70 block">Year</span>
                                                <p className="text-amber-200 font-medium">{selectedRide.vehicle_info.year}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-amber-500/70 block">Color</span>
                                                <p className="text-amber-200 font-medium">{selectedRide.vehicle_info.color}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-amber-500/70 block">Plate Number</span>
                                                <span className="inline-block bg-amber-900/40 border border-amber-500/30 px-2 py-0.5 rounded text-sm text-amber-300 font-mono">
                                                    {selectedRide.vehicle_info.plate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
