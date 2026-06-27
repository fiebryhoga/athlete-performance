import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, Settings, Scale, ChevronRight } from 'lucide-react';
// import BenchmarkSettingsModal from './Partials/BenchmarkSettingsModal'; // Assuming we don't have this or implement it later

export default function Index({ athletes, filters, benchmarks }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);

    const filteredAthletes = useMemo(() => {
        if (!searchQuery.trim()) return athletes;
        const q = searchQuery.toLowerCase();
        return athletes.filter(athlete => 
            athlete.name.toLowerCase().includes(q)
        );
    }, [searchQuery, athletes]);

    const getInitials = (name) => {
        if (!name) return '??';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return `${words[0][0]}${words[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <AdminLayout
            title={"Body Composition"}
            description={"Manage athlete body composition, muscle mass, and fat percentage data."}
        >
            <Head title="Body Composition" />

            <div className="pb-12 space-y-6">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="hidden md:block">
                        <h3 className="text-sm font-semibold text-zinc-900  flex items-center gap-2">
                            <Scale size={18} className="text-zinc-500" />
                            {"Register Body Composition"}
                        </h3>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-80 group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="text-zinc-400 group-focus-within:text-zinc-900  transition-colors" size={16} />
                            </div>
                            <input 
                                type="text" 
                                placeholder={"Search athlete..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white  border border-zinc-200  rounded-lg text-sm text-zinc-900  placeholder:text-zinc-500 focus:ring-1 focus:ring-zinc-900  focus:border-zinc-900  outline-none transition-all shadow-sm"
                            />
                        </div>

                        {/* <button
                            onClick={() => setIsBenchmarkModalOpen(true)}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto py-2 px-4 bg-zinc-900  border border-transparent text-zinc-50  rounded-lg text-sm font-semibold hover:bg-zinc-800  transition-colors shadow-sm"
                        >
                            <Settings size={16} />
                            {"Benchmarks"}
                        </button> */}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAthletes.map(athlete => (
                        <Link
                            key={athlete.id}
                            href={route('admin.composition-tests.show', athlete.id)}
                            className="group bg-white  border border-zinc-200  rounded-xl p-5 hover:border-zinc-400  transition-all duration-200 flex flex-col shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        {athlete.photo_url ? (
                                            <img 
                                                src={athlete.photo_url} 
                                                alt={athlete.name}
                                                className="w-12 h-12 rounded-full object-cover border border-zinc-200 "
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-zinc-100  flex items-center justify-center text-zinc-900  font-semibold border border-zinc-200  tracking-tight text-sm">
                                                {getInitials(athlete.name)}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white  rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900  group-hover:text-zinc-600  transition-colors text-sm">
                                            {athlete.name}
                                        </h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[10px] font-medium px-2 py-0.5 bg-zinc-100  text-zinc-600  rounded-md">
                                                Athlete
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="w-8 h-8 rounded-full bg-zinc-50  flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900  group-hover:text-white  transition-colors">
                                    <ChevronRight size={16} />
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-zinc-100 ">
                                {athlete.latest_test ? (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-medium text-zinc-500  uppercase tracking-wider">
                                                Latest Test
                                            </p>
                                            <p className="text-xs font-bold text-zinc-900  mt-1">
                                                {new Date(athlete.latest_test.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-medium text-zinc-500  uppercase tracking-wider">
                                                Records
                                            </p>
                                            <p className="text-xs font-bold text-zinc-900  mt-1 flex items-center justify-end gap-1">
                                                <Scale size={12} className="text-zinc-400" />
                                                {athlete.total_tests} Tests
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-2 px-3 bg-zinc-50  rounded-lg border border-dashed border-zinc-200 ">
                                        <span className="text-xs font-medium text-zinc-500  flex items-center gap-1.5">
                                            <Scale size={14} className="text-zinc-400" />
                                            No test records
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}

                    {filteredAthletes.length === 0 && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center bg-zinc-50/50  border border-dashed border-zinc-200  rounded-xl">
                            <Search className="text-zinc-300  mb-3" size={32} />
                            <p className="text-zinc-500  text-sm font-medium">No athletes found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Benchmark Modal */}
            {/* {isBenchmarkModalOpen && (
                <BenchmarkSettingsModal
                    isOpen={isBenchmarkModalOpen}
                    onClose={() => setIsBenchmarkModalOpen(false)}
                    currentBenchmarks={benchmarks}
                />
            )} */}
        </AdminLayout>
    );
}