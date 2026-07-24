import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Search, Flame, ChevronRight } from 'lucide-react';
import PageHeader from '@/Components/Layout/PageHeader';

export default function Index({ athletes, filters }) {
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === 'athlete';

    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

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
            title={"Rencana Makan"}
            description={"Kelola rencana makan atlet yang dihasilkan oleh AI."}
        >
            <Head title="Rencana Makan" />

            <div className="pb-12 space-y-6">
                <PageHeader 
                    title="Rencana Makan"
                    subtitle="Kelola rencana makan atlet yang dihasilkan oleh AI."
                    badge="Nutrisi & Diet"
                    icon={Flame}
                    searchPlaceholder="Cari atlet..."
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {filteredAthletes.map(athlete => (
                        <Link
                            key={athlete.id}
                            href={route('admin.meal-plans.show', athlete.id)}
                            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-500 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl hover:shadow-orange-500/10"
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
                                            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 font-bold border border-orange-100 text-lg shadow-sm">
                                                {getInitials(athlete.name)}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 group-hover:text-orange-500 transition-colors text-base truncate max-w-[140px] sm:max-w-[160px]">
                                            {athlete.name}
                                        </h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                                                Athlete
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                                    <ChevronRight size={18} />
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-slate-100">
                                {athlete.latest_plan ? (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400">
                                                Dibuat Pada
                                            </p>
                                            <p className="text-sm font-bold text-slate-800 mt-1">
                                                {new Date(athlete.latest_plan.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400">
                                                Total
                                            </p>
                                            <p className="text-sm font-bold text-orange-500 mt-1 flex items-center justify-end gap-1.5">
                                                <Flame size={14} className="text-orange-500" />
                                                {athlete.total_plans} Rencana
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-3 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                                            <Flame size={14} className="text-slate-400" />
                                            Belum ada rencana makan
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
        </AppLayout>
    );
}