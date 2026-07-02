import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Search, Settings, Scale, ChevronRight } from 'lucide-react';
import PageHeader from '@/Components/Layout/PageHeader';
import BenchmarkSettingsModal from './Partials/BenchmarkSettingsModal';

export default function Index({ athletes, filters, benchmarks }) {
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === 'athlete';

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
        <AppLayout
            title={"Body Composition"}
            description={"Manage athlete body composition, muscle mass, and fat percentage data."}
        >
            <Head title="Body Composition" />

            <div className="pb-12 space-y-6">
                <PageHeader 
                    title="Body Composition"
                    subtitle="Manage athlete body composition, muscle mass, and fat percentage data."
                    badge="Evaluation"
                    icon={Scale}
                    searchPlaceholder="Search athlete..."
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    actions={
                        !isAthlete && (
                            <button
                                onClick={() => setIsBenchmarkModalOpen(true)}
                                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                            >
                                <Settings size={16} className="text-slate-500" />
                                Benchmarks
                            </button>
                        )
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {filteredAthletes.map(athlete => (
                        <Link
                            key={athlete.id}
                            href={route('admin.composition-tests.show', athlete.id)}
                            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#ff4d00] transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl hover:shadow-[#ff4d00]/10"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        {athlete.photo_url ? (
                                            <img 
                                                src={athlete.photo_url} 
                                                alt={athlete.name}
                                                className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-[#ff4d00] font-bold border border-orange-100 text-lg shadow-sm">
                                                {getInitials(athlete.name)}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 group-hover:text-[#ff4d00] transition-colors text-base truncate max-w-[140px] sm:max-w-[160px]">
                                            {athlete.name}
                                        </h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                                                Athlete
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#ff4d00] group-hover:text-white transition-colors duration-300 shadow-sm">
                                    <ChevronRight size={18} />
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100">
                                {athlete.latest_test ? (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400">
                                                Latest Test
                                            </p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">
                                                {new Date(athlete.latest_test.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400">
                                                Records
                                            </p>
                                            <p className="text-sm font-bold text-[#ff4d00] mt-1 flex items-center justify-end gap-1.5">
                                                <Scale size={14} className="text-[#ff4d00]" />
                                                {athlete.total_tests} Tests
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-3 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                                            <Scale size={14} className="text-slate-400" />
                                            No test records
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}

                    {filteredAthletes.length === 0 && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <Search className="text-slate-300" size={24} />
                            </div>
                            <p className="text-slate-500 text-sm font-bold">No athletes found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Benchmark Modal */}
            {isBenchmarkModalOpen && (
                <BenchmarkSettingsModal
                    isOpen={isBenchmarkModalOpen}
                    onClose={() => setIsBenchmarkModalOpen(false)}
                    currentBenchmarks={benchmarks}
                />
            )}
        </AppLayout>
    );
}