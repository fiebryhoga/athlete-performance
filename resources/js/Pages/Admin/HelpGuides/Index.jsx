import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';
import { 
    Plus, 
    Search, 
    BookOpen, 
    Layers, 
    Edit, 
    Trash2, 
    Eye, 
    CheckCircle2, 
    XCircle, 
    ExternalLink, 
    Filter, 
    X,
    ChevronDown,
    Check
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function HelpGuidesIndex({ guides, categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [targetRole, setTargetRole] = useState(filters.target_role || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (newFilters = {}) => {
        const query = {
            search,
            target_role: targetRole,
            category_id: categoryId,
            status,
            ...newFilters,
        };
        Object.keys(query).forEach(key => (!query[key] || query[key] === 'all') && delete query[key]);
        router.get(route('admin.help-guides.index'), query, { preserveState: true, preserveScroll: true });
    };

    const handleTogglePublish = (guide) => {
        router.post(route('admin.help-guides.toggle-publish', guide.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (guide) => {
        Swal.fire({
            title: 'Hapus Panduan?',
            text: `Apakah Anda yakin ingin menghapus panduan "${guide.title}"? Semua data langkah dan gambar terkait akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-xl',
                confirmButton: 'rounded-lg text-xs font-bold px-4 py-2',
                cancelButton: 'rounded-lg text-xs font-bold px-4 py-2'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.help-guides.destroy', guide.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Panduan telah dihapus.',
                            icon: 'success',
                            confirmButtonColor: '#ea580c',
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    }
                });
            }
        });
    };

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
        <AppLayout title="Kelola Panduan">
            <Head title="Kelola Panduan - Superadmin" />

            <div className="space-y-4 pb-6">
                {/* STANDARD PAGE HEADER */}
                <PageHeader
                    title="Kelola Panduan"
                    description="Kelola tata cara penggunaan fitur web terstruktur (langkah demi langkah & gambar) untuk Coach dan Client."
                    icon={BookOpen}
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={route('help.index')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Lihat Pusat Bantuan</span>
                            </Link>
                            <Link
                                href={route('admin.help-guides.create')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Panduan</span>
                            </Link>
                        </div>
                    }
                />

                {/* COMPACT TOOLBAR / FILTERS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200/90 shadow-2xs">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter({ search })}
                            placeholder="Cari judul panduan..."
                            className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs text-slate-800"
                        />
                        {search && (
                            <button 
                                type="button" 
                                onClick={() => { setSearch(''); handleFilter({ search: '' }); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Filter Selects */}
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={targetRole}
                            onChange={(e) => {
                                setTargetRole(e.target.value);
                                handleFilter({ target_role: e.target.value });
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none shadow-2xs"
                        >
                            <option value="">Semua Peran</option>
                            <option value="athlete">Khusus Klien / Atlet</option>
                            <option value="coach">Khusus Pelatih / Coach</option>
                            <option value="all">Semua Peran (Umum)</option>
                        </select>

                        <select
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                handleFilter({ category_id: e.target.value });
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none shadow-2xs"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                handleFilter({ status: e.target.value });
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none shadow-2xs"
                        >
                            <option value="">Semua Status</option>
                            <option value="published">Publish</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                {/* STANDARD TABLE */}
                <div className="bg-white border border-slate-200/80 rounded-lg shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase">
                                <tr>
                                    <th className="px-4 py-2.5">Judul Panduan</th>
                                    <th className="px-4 py-2.5">Kategori</th>
                                    <th className="px-4 py-2.5">Target Peran</th>
                                    <th className="px-4 py-2.5 text-center">Langkah</th>
                                    <th className="px-4 py-2.5 text-center">Dilihat</th>
                                    <th className="px-4 py-2.5 text-center">Status</th>
                                    <th className="px-4 py-2.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {guides.data && guides.data.length > 0 ? (
                                    guides.data.map((guide) => {
                                        const roleBadge = getRoleBadge(guide.target_role);
                                        return (
                                            <tr key={guide.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="space-y-0.5">
                                                        <div className="font-bold text-slate-900 text-xs">
                                                            {guide.title}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-md">
                                                            {guide.summary || '-'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-700">
                                                    {guide.category?.name || 'Umum'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${roleBadge.color}`}>
                                                        {roleBadge.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center font-bold text-slate-700">
                                                    {guide.steps_count || 0}
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-400">
                                                    {guide.views_count || 0}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => handleTogglePublish(guide)}
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                                                            guide.is_published
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        {guide.is_published ? (
                                                            <>
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                <span>Publish</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-3 h-3" />
                                                                <span>Draft</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={route('help.show', guide.slug)}
                                                            title="Lihat Tampilan Panduan"
                                                            className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Link>
                                                        <Link
                                                            href={route('admin.help-guides.edit', guide.id)}
                                                            title="Edit Panduan"
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(guide)}
                                                            title="Hapus Panduan"
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-slate-400 text-xs">
                                            Tidak ada data panduan ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {guides.links && guides.links.length > 3 && (
                        <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>
                                Menampilkan {guides.from || 0} - {guides.to || 0} dari {guides.total || 0} data
                            </span>
                            <div className="flex items-center gap-1">
                                {guides.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                                            link.active
                                                ? 'bg-orange-500 text-white font-bold'
                                                : link.url
                                                ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                                : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <PageFooter />
            </div>
        </AppLayout>
    );
}
