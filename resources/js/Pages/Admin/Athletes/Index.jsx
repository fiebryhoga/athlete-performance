import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, Link, usePage } from '@inertiajs/react';
import { 
    Search, Users, ChevronRight, Activity, Target, Flame, Info, 
    Ruler, Weight, Zap, Scale, TrendingUp, Sparkles, Trophy, HeartPulse, Battery, Layers, CheckCircle2
} from 'lucide-react';
import PageHeader from '@/Components/Layout/PageHeader';

export default function Index({ athletes = [], summary = {}, sports = [], filters = {} }) {
    const { auth } = usePage().props;
    const isSuperadmin = auth?.user?.role === 'superadmin';
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedSport, setSelectedSport] = useState('ALL');
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('admin.athletes.index'),
                { search: searchTerm },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleCardClick = (id) => {
        router.get(route('admin.athletes.show', id));
    };

    const filteredAthletes = athletes.filter(athlete => {
        if (selectedSport === 'ALL') return true;
        return athlete.sport_id === parseInt(selectedSport);
    });

    return (
        <AppLayout title="Profilling Atlet & Analisis Komprehensif">
            <Head title="Profilling Atlet" />

            <div className="w-full max-w-[1400px] mx-auto pb-16 px-3 sm:px-6 lg:px-8 animate-in fade-in duration-500">
                
                {/* ─── PAGE HEADER & SEARCH ─── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                <Users className="w-3.5 h-3.5" /> Profiling & Client Analytics
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                            Direktori Profiling Atlet
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1">
                            Pusat analisis data terpadu: Performa Fisik, PHV, Komposisi Tubuh, Wellness & DPA.
                        </p>
                    </div>

                    {/* Search Input Bar */}
                    <div className="w-full md:w-80 relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari nama atau username..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition-all"
                        />
                    </div>
                </div>

                {/* ─── SUMMARY KPI WIDGETS ─── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Klien</span>
                            <div className="p-2 rounded-xl bg-orange-50 text-orange-500"><Users className="w-4 h-4" /></div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{summary?.total || athletes.length}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Atlet aktif terdaftar</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tes Fisik Selesai</span>
                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-500"><Target className="w-4 h-4" /></div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{summary?.tested_count || 0}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Memiliki riwayat skor tes</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asesmen PHV</span>
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-500"><Activity className="w-4 h-4" /></div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">{summary?.phv_count || 0}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Maturitas & lonjakan tinggi</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Komposisi Tubuh</span>
                            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500"><Scale className="w-4 h-4" /></div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">{summary?.comp_count || 0}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Massa otot & lemak tubuh</p>
                    </div>
                </div>

                {/* ─── SPORT FILTER PILLS ─── */}
                {sports && sports.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-3 mb-6">
                        <button
                            onClick={() => setSelectedSport('ALL')}
                            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                                selectedSport === 'ALL'
                                    ? 'bg-slate-800 text-white shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            Semua Cabor ({athletes.length})
                        </button>
                        {sports.map(sport => {
                            const count = athletes.filter(a => a.sport_id === sport.id).length;
                            return (
                                <button
                                    key={sport.id}
                                    onClick={() => setSelectedSport(sport.id.toString())}
                                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1.5 transition-all ${
                                        selectedSport === sport.id.toString()
                                            ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    <span>{sport.name}</span>
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                        selectedSport === sport.id.toString() ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ─── ATHLETE CARDS GRID ─── */}
                {filteredAthletes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                        {filteredAthletes.map((athlete) => {
                            const isFemale = athlete.gender === 'P' || athlete.gender === 'female' || athlete.gender === 'Perempuan';
                            const initial = athlete.name ? athlete.name.charAt(0).toUpperCase() : '-';
                            const hasPHV = !!athlete.latest_phv;
                            const hasComp = !!athlete.latest_composition;
                            const hasWellness = !!athlete.latest_wellness;
                            const hasScore = athlete.latest_test_score !== null && athlete.latest_test_score !== undefined;

                            return (
                                <div 
                                    key={athlete.id} 
                                    onClick={() => handleCardClick(athlete.id)}
                                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                                >
                                    {/* Top decorative gradient glow */}
                                    <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                    <div>
                                        {/* Header Row: Avatar, Name, Sport */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-xl font-black shadow-md border-2 border-white shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                                                {athlete.profile_photo_url ? (
                                                    <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    initial
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 truncate">
                                                        {athlete.sport ? athlete.sport.name : 'Tanpa Cabor'}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                        {isFemale ? 'Perempuan' : 'Laki-laki'}
                                                    </span>
                                                </div>
                                                <h3 className="font-extrabold text-slate-800 text-base truncate group-hover:text-orange-600 transition-colors">
                                                    {athlete.name}
                                                </h3>
                                                <p className="text-xs text-slate-400 font-mono">@{athlete.username || 'athlete'}</p>
                                            </div>
                                        </div>

                                        {/* Multi-Domain Status Matrix Chips */}
                                        <div className="space-y-2 mb-4">
                                            {/* Tes Fisik Terakhir */}
                                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                                                    <Target className="w-3.5 h-3.5 text-orange-500" /> Skor Tes Fisik
                                                </span>
                                                {hasScore ? (
                                                    <span className="font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                                        {athlete.latest_test_score}%
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400 italic">Belum ada tes</span>
                                                )}
                                            </div>

                                            {/* PHV Phase & Offset */}
                                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                                                    <Activity className="w-3.5 h-3.5 text-emerald-500" /> Status PHV
                                                </span>
                                                {hasPHV ? (
                                                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-[11px]">
                                                        {Number(athlete.latest_phv.maturity_offset).toFixed(1)} thn ({athlete.latest_phv.phv_status || 'Circa-PHV'})
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400 italic">Belum diukur</span>
                                                )}
                                            </div>

                                            {/* Body Composition */}
                                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                                                    <Scale className="w-3.5 h-3.5 text-indigo-500" /> Komposisi Lemak
                                                </span>
                                                {hasComp ? (
                                                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-[11px]">
                                                        {athlete.latest_composition.body_fat_percentage ?? '-'}% BF
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400 italic">Belum ada data</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer: Biometrics & CTA */}
                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                                            <div className="p-1.5 bg-slate-50 rounded-lg">
                                                <span className="text-[10px] text-slate-400 block">Usia</span>
                                                <strong className="text-slate-700 font-bold">{athlete.age ? `${athlete.age} thn` : '-'}</strong>
                                            </div>
                                            <div className="p-1.5 bg-slate-50 rounded-lg">
                                                <span className="text-[10px] text-slate-400 block">Tinggi</span>
                                                <strong className="text-slate-700 font-bold">{athlete.height ? `${athlete.height} cm` : '-'}</strong>
                                            </div>
                                            <div className="p-1.5 bg-slate-50 rounded-lg">
                                                <span className="text-[10px] text-slate-400 block">Berat</span>
                                                <strong className="text-slate-700 font-bold">{athlete.weight ? `${athlete.weight} kg` : '-'}</strong>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs font-bold text-orange-500 group-hover:text-orange-600">
                                            <span>Buka Analisis Profiling Lengkap</span>
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                            <Users className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-1">Tidak Ada Klien Ditemukan</h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                            Tidak ada data klien yang cocok dengan pencarian atau filter cabor yang dipilih.
                        </p>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}