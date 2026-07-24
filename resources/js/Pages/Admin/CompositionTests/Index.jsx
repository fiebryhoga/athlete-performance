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
            title={"Komposisi Tubuh"}
            description={"Kelola data komposisi tubuh, massa otot, dan persentase lemak klien."}
        >
            <Head title="Komposisi Tubuh" />

            <div className="pb-12 space-y-6">
                <PageHeader 
                    title="Komposisi Tubuh"
                    subtitle="Kelola data komposisi tubuh, massa otot, dan persentase lemak klien."
                    badge="Evaluasi"
                    icon={Scale}
                    searchPlaceholder="Cari nama klien..."
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    actions={
                        auth.user.role === 'superadmin' && (
                            <button
                                onClick={() => setIsBenchmarkModalOpen(true)}
                                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                            >
                                <Settings size={16} className="text-slate-500" />
                                Standar Evaluasi
                            </button>
                        )
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                    {filteredAthletes.map(athlete => (
                        <Link
                            key={athlete.id}
                            href={route('admin.composition-tests.show', athlete.id)}
                            className="relative bg-white rounded-xl border border-slate-200 p-5 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <div className="relative flex items-center gap-4 z-10">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                                    {athlete.photo_url ? (
                                        <img src={athlete.photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-bold text-orange-500">{getInitials(athlete.name)}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 text-base md:text-lg truncate group-hover:text-orange-500 transition-colors">
                                        {athlete.name}
                                    </h3>
                                    {athlete.latest_test ? (
                                        <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-emerald-100 inline-block truncate mt-1">
                                            Terakhir: {new Date(athlete.latest_test.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-block mt-1">
                                            Belum ada data
                                        </span>
                                    )}
                                </div>
                                
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shrink-0">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 mt-auto">
                                <div className="text-center">
                                    <div className="text-[10px] text-slate-400 font-medium mb-0.5">Total Tes</div>
                                    <div className="font-semibold text-slate-700 text-xs">
                                        {athlete.total_tests > 0 ? `${athlete.total_tests} Kali` : '-'}
                                    </div>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="text-[10px] text-slate-400 font-medium mb-0.5">Tes Terakhir</div>
                                    <div className="font-semibold text-slate-700 text-xs truncate px-1">
                                        {athlete.latest_test ? `${athlete.latest_test.weight || '-'} kg / ${athlete.latest_test.body_fat_percentage || '-'}%` : '-'}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {filteredAthletes.length === 0 && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <Search className="text-slate-300" size={24} />
                            </div>
                            <p className="text-slate-500 text-sm font-bold">Tidak ada klien yang cocok dengan pencarian Anda.</p>
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