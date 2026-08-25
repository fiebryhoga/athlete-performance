import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';
import { Head, Link } from '@inertiajs/react';
import { Search, Filter, ChevronDown, Check, X, ArrowUpRight, Activity, HeartPulse } from 'lucide-react';

// --- CUSTOM SELECT COMPONENT ---
function CustomSelect({ label, value, options, onChange, placeholder = "Pilih..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    return (
        <div className="space-y-1 relative">
            {label && <label className="block text-[11px] font-bold text-slate-600">{label}</label>}
            <button type="button" onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 transition-all text-left shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500">
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5 transition-transform ${isOpen ? "rotate-180 text-orange-500" : ""}`} />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 w-full max-h-48 overflow-y-auto bg-white rounded-md shadow-xl border border-slate-200 p-1 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5 custom-scrollbar">
                        {options.map((opt) => {
                            const isSelected = String(opt.value) === String(value);
                            return (
                                <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors text-left ${isSelected ? "bg-orange-50 text-orange-700 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"}`}>
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1.5" />}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

function getInitials(name) {
    if (!name) return "??";
    const words = name.trim().split(" ");
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

export default function ClientIndex({ auth, athletes }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState("name_asc");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const sortOptions = [
        { value: "name_asc", label: "Nama (A - Z)" },
        { value: "name_desc", label: "Nama (Z - A)" },
    ];

    const filteredAthletes = useMemo(() => {
        return (athletes || [])
            .filter(athlete => {
                if (!searchTerm.trim()) return true;
                const q = searchTerm.toLowerCase();
                return athlete.name?.toLowerCase().includes(q) || athlete.sport?.name?.toLowerCase().includes(q);
            })
            .sort((a, b) => {
                if (sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
                if (sortBy === "name_desc") return (b.name || "").localeCompare(a.name || "");
                return 0;
            });
    }, [athletes, searchTerm, sortBy]);

    const activeFilterCount = sortBy !== "name_asc" ? 1 : 0;

    const resetFilters = () => {
        setSearchTerm("");
        setSortBy("name_asc");
    };

    return (
        <AppLayout title="Data Klien Wellness">
            <Head title="Wellness Klien" />

            <div className="space-y-4 pb-6">
                <PageHeader
                    title="Data Klien Wellness"
                    description="Pilih athlete untuk memantau data Wellness dan RPE harian mereka."
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative w-44 sm:w-52">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari athlete..."
                                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs" />
                                {searchTerm && (
                                    <button type="button" onClick={() => setSearchTerm("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                                {isFilterOpen && <div className="fixed inset-0 z-20 cursor-default" onClick={() => setIsFilterOpen(false)} />}
                                <button type="button" onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer">
                                    <Filter className="w-3.5 h-3.5 text-orange-500" />
                                    <span>Filter</span>
                                    {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black flex items-center justify-center">{activeFilterCount}</span>}
                                    <ChevronDown className={`w-3 h-3 text-orange-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isFilterOpen && (
                                    <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200/80 p-4 z-30 animate-in fade-in zoom-in-95 duration-100 space-y-3.5">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                <Filter className="w-3.5 h-3.5 text-orange-500" /> Filter Wellness
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                {activeFilterCount > 0 && <button type="button" onClick={resetFilters} className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer">Reset</button>}
                                                <button type="button" onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer" title="Tutup"><X className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                        <CustomSelect label="Urutkan" value={sortBy} options={sortOptions} onChange={setSortBy} />
                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                                            <button type="button" onClick={() => setIsFilterOpen(false)} className="px-3 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs cursor-pointer">Terapkan</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                />

                {filteredAthletes.length === 0 ? (
                    <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs"><Search className="w-5 h-5" /></div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-800">Tidak ada Athlete ditemukan</h4>
                            <p className="text-xs text-slate-400 font-medium max-w-sm">Ubah kata kunci pencarian Anda atau pastikan data athlete tersedia.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                        {filteredAthletes.map(athlete => {
                            const photo = athlete.profile_photo_url || athlete.profile_photo;
                            return (
                                <Link key={athlete.id} href={route('admin.wellness-rpe.athlete.show', athlete.id)}
                                    className="group relative bg-white rounded-md border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between overflow-hidden">
                                    <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-9 h-9 rounded-md border border-orange-200/60 shadow-2xs bg-orange-50/60 text-orange-600 font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden">
                                                {photo ? (
                                                    <img src={photo} alt={athlete.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="leading-none select-none">{getInitials(athlete.name)}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                <h3 className="font-bold text-slate-900 text-xs truncate group-hover:text-orange-600 transition-colors leading-tight">{athlete.name}</h3>
                                                <p className="text-[10.5px] text-slate-400 font-medium truncate">{athlete.sport?.name || 'Athlete'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
                                            <div className="p-1.5 bg-slate-50/80 rounded border border-slate-100 shadow-2xs">
                                                <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Update</span>
                                                <div className="mt-0.5">
                                                    <span className="text-[9.5px] font-medium text-slate-700 leading-tight block truncate">
                                                        {athlete.latest_wellness ? new Date(athlete.latest_wellness.record_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-1.5 bg-slate-50/80 rounded border border-slate-100 shadow-2xs">
                                                <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Score</span>
                                                <div className="flex items-baseline gap-0.5 mt-0.5">
                                                    <span className="text-[11px] font-bold text-slate-800 leading-tight">
                                                        {athlete.latest_wellness?.daily_wellness_score || '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-3 py-1.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <span className="text-[9.5px] font-medium text-slate-400">{athlete.sport?.name || 'Athlete'}</span>
                                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-600 group-hover:text-orange-600 transition-colors">
                                            Detail
                                            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                <PageFooter className="!mt-8 !pt-4 !pb-1" />
            </div>
        </AppLayout>
    );
}
