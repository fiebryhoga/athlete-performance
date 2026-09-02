import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';
import { 
    Search, 
    BookOpen, 
    HeartPulse, 
    CalendarDays, 
    UtensilsCrossed, 
    Timer, 
    UserCog, 
    Building2, 
    HelpCircle, 
    ArrowRight, 
    Sparkles, 
    Compass, 
    CheckCircle2, 
    Layers, 
    ShieldCheck, 
    User, 
    Flame,
    MessageCircle,
    ChevronRight,
    X,
    ExternalLink
} from 'lucide-react';

const ICON_MAP = {
    HeartPulse,
    CalendarDays,
    UtensilsCrossed,
    Timer,
    UserCog,
    Building2,
    BookOpen,
    HelpCircle,
};

export default function HelpIndex({ guides = [], categories = [], popularGuides = [], filters = {}, userRole = 'athlete' }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [activeCategory, setActiveCategory] = useState(filters.category || 'all');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState(filters.role || 'all');

    const filteredGuides = useMemo(() => {
        return guides.filter(guide => {
            if (activeCategory !== 'all' && guide.category?.slug !== activeCategory) {
                return false;
            }
            if (userRole === 'superadmin' && selectedRoleFilter !== 'all') {
                if (guide.target_role !== selectedRoleFilter && guide.target_role !== 'all') {
                    return false;
                }
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = guide.title?.toLowerCase().includes(q);
                const matchSummary = guide.summary?.toLowerCase().includes(q);
                const matchCategory = guide.category?.name?.toLowerCase().includes(q);
                const matchSteps = guide.steps?.some(s => 
                    s.title?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
                );
                return matchTitle || matchSummary || matchCategory || matchSteps;
            }
            return true;
        });
    }, [guides, activeCategory, selectedRoleFilter, searchQuery, userRole]);

    const getRoleBadge = (role) => {
        switch(role) {
            case 'athlete':
                return { label: 'Klien / Atlet', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
            case 'coach':
                return { label: 'Pelatih / Coach', color: 'bg-blue-50 text-blue-700 border-blue-200' };
            default:
                return { label: 'Semua Peran', color: 'bg-slate-100 text-slate-700 border-slate-200' };
        }
    };

    return (
        <AppLayout title="Pusat Bantuan">
            <Head title="Pusat Bantuan & Panduan" />

            <div className="space-y-4 pb-6">
                {/* STANDARD PAGE HEADER */}
                <PageHeader
                    title="Pusat Bantuan"
                    description={
                        userRole === 'coach'
                            ? 'Panduan dan tata cara penggunaan fitur pelatih untuk merancang program, penilaian fisik, dan monitoring atlet.'
                            : userRole === 'athlete'
                            ? 'Panduan mudah bagi klien/atlet untuk mengisi wellness, feedback latihan, tracking nutrisi, dan profiling.'
                            : 'Panduan tata cara penggunaan seluruh modul sistem OTS Performance.'
                    }
                    icon={HelpCircle}
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search bar in header */}
                            <div className="relative w-48 sm:w-64">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari tutorial / panduan..."
                                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs text-slate-800"
                                />
                                {searchQuery && (
                                    <button 
                                        type="button" 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {userRole === 'superadmin' && (
                                <Link
                                    href={route('admin.help-guides.index')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700"
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Kelola Panduan</span>
                                </Link>
                            )}
                        </div>
                    }
                />

                {/* SUPERADMIN ROLE SWITCHER */}
                {userRole === 'superadmin' && (
                    <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs text-xs">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold">
                            <ShieldCheck className="w-4 h-4 text-orange-500" />
                            <span>Preview Tampilan Berdasarkan Peran:</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {['all', 'coach', 'athlete'].map((roleKey) => (
                                <button
                                    key={roleKey}
                                    onClick={() => setSelectedRoleFilter(roleKey)}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                                        selectedRoleFilter === roleKey
                                            ? 'bg-orange-500 text-white shadow-xs'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {roleKey === 'all' ? 'Semua Target' : roleKey === 'coach' ? 'Khusus Pelatih' : 'Khusus Klien/Atlet'}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* TWO COLUMN / KANAN KIRI LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* LEFT COLUMN: GUIDES & CATEGORIES (8 cols) */}
                    <div className="lg:col-span-8 space-y-4">
                        
                        {/* CATEGORY TABS */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md shrink-0 transition-all cursor-pointer ${
                                    activeCategory === 'all'
                                        ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-2xs border border-orange-600'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs'
                                }`}
                            >
                                <Compass className="w-3.5 h-3.5" />
                                <span>Semua Kategori</span>
                            </button>

                            {categories.map((cat) => {
                                const IconComponent = ICON_MAP[cat.icon] || BookOpen;
                                const isActive = activeCategory === cat.slug;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.slug)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md shrink-0 transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-2xs border border-orange-600'
                                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs'
                                        }`}
                                    >
                                        <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                                        <span>{cat.name}</span>
                                        {cat.guides_count !== undefined && (
                                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                                isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {cat.guides_count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* POPULAR GUIDES SECTION */}
                        {!searchQuery && activeCategory === 'all' && popularGuides.length > 0 && (
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                                    <span>Sering Dicari</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {popularGuides.map((guide) => {
                                        const roleBadge = getRoleBadge(guide.target_role);
                                        return (
                                            <Link
                                                key={guide.id}
                                                href={route('help.show', guide.slug)}
                                                className="group flex flex-col justify-between p-3.5 bg-white border border-slate-200 rounded-lg hover:border-orange-300 hover:shadow-xs transition-all"
                                            >
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleBadge.color}`}>
                                                            {roleBadge.label}
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                                            <Layers className="w-3 h-3 text-orange-500" />
                                                            {guide.steps_count || 0} Langkah
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                                                        {guide.title}
                                                    </h3>
                                                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                                        {guide.summary}
                                                    </p>
                                                </div>
                                                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                                                    <span>Baca Panduan</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* GUIDES LIST */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                                    <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                                    <span>Daftar Panduan ({filteredGuides.length})</span>
                                </div>
                            </div>

                            {filteredGuides.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {filteredGuides.map((guide) => {
                                        const roleBadge = getRoleBadge(guide.target_role);
                                        const IconComponent = (guide.category && ICON_MAP[guide.category.icon]) || BookOpen;

                                        return (
                                            <Link
                                                key={guide.id}
                                                href={route('help.show', guide.slug)}
                                                className="group flex flex-col justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-orange-300 hover:shadow-xs transition-all"
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-5 h-5 rounded bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/60 shrink-0">
                                                                <IconComponent className="w-3 h-3" />
                                                            </div>
                                                            <span className="text-[11px] font-bold text-slate-500">
                                                                {guide.category?.name || 'Umum'}
                                                            </span>
                                                        </div>
                                                        <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded border ${roleBadge.color}`}>
                                                            {roleBadge.label}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                                                        {guide.title}
                                                    </h3>

                                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                        {guide.summary}
                                                    </p>
                                                </div>

                                                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                                                    <span className="text-slate-500 font-medium text-[11px] flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                        {guide.steps_count || guide.steps?.length || 0} Langkah Praktis
                                                    </span>
                                                    <span className="font-bold text-orange-600 flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition-transform">
                                                        Buka <ChevronRight className="w-3.5 h-3.5" />
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-2 shadow-2xs">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-800">
                                        Tidak ada panduan yang cocok
                                    </h4>
                                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                                        Coba kata kunci pencarian lain atau pilih kategori yang berbeda.
                                    </p>
                                    <button
                                        onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                                        className="px-2.5 py-1 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors cursor-pointer"
                                    >
                                        Reset Filter
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SIDEBAR INFO & SUPPORT (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        
                        {/* SIDEBAR CARD 1: RINGKASAN MODUL & PERAN */}
                        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                                <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/60">
                                    <User className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Panduan Sesuai Peran Anda
                                    </h3>
                                    <span className="text-[10px] font-semibold text-slate-400 capitalize">
                                        {userRole} Portal
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {userRole === 'coach'
                                    ? 'Sebagai Pelatih, Anda memiliki akses membuat dan mengevaluasi sesi latihan atlet, mengisi tes performa, dan mencatat absensi.'
                                    : userRole === 'athlete'
                                    ? 'Sebagai Atlet/Klien, Anda dapat memantau jadwal latihan, mengisi kuesioner wellness harian, serta melihat grafik perkembangan fisik.'
                                    : 'Sebagai Superadmin, Anda dapat mengelola seluruh data sistem dan membuat panduan baru untuk pengguna.'}
                            </p>
                        </div>
                    </div>
                </div>

                <PageFooter />
            </div>
        </AppLayout>
    );
}
