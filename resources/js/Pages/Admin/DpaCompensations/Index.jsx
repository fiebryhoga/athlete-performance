import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Plus, Edit, Trash2, Image as ImageIcon, Activity, Search, X, ArrowUpRight } from "lucide-react";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";

export default function DpaIndex({ auth, compensations }) {
    const t = (text) => text;
    const isAuthorized = auth?.user?.role === 'superadmin' || auth?.user?.role === 'coach';
    const canCreate = isAuthorized;
    const canUpdate = isAuthorized;
    const canDelete = isAuthorized;

    const [searchTerm, setSearchTerm] = useState("");

    const categories = [
        "Posterior View",
        "Lateral View",
        "Anterior View",
        "Single Leg",
    ];

    const handleDelete = (item) => {
        if (confirm("Are you sure you want to delete this DPA compensation?")) {
            router.delete(route("admin.dpa-compensations.destroy", item.id), { preserveScroll: true });
        }
    };

    const filteredCompensations = (compensations || []).filter(c => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return c.name?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
    });

    return (
        <AppLayout title="DPA Compensations">
            <Head title="DPA Compensations" />

            <div className="space-y-4 pb-6">
                <PageHeader
                    title="Compensation Directory"
                    description="Browse and organize postural compensations by category."
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative w-44 sm:w-52">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari kompensasi..."
                                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs" />
                                {searchTerm && (
                                    <button type="button" onClick={() => setSearchTerm("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>
                                )}
                            </div>

                            {canCreate && (
                                <Link href={route('admin.dpa-compensations.create')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700 cursor-pointer">
                                    <Plus className="w-3.5 h-3.5" /> Tambah
                                </Link>
                            )}
                        </div>
                    }
                />

                <div className="space-y-8">
                    {categories.map((category) => {
                        const catItems = filteredCompensations.filter((c) => c.category === category);

                        return (
                            <div key={category}>
                                <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-slate-200">
                                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">{category}</h3>
                                    <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200/60">
                                        {catItems.length}
                                    </span>
                                </div>

                                {catItems.length === 0 ? (
                                    <div className="py-10 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs">
                                            <ImageIcon className="w-4 h-4" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">No compensations added for {category} yet.</p>
                                        {canCreate && (
                                            <Link href={route('admin.dpa-compensations.create')} className="text-[11px] font-bold text-orange-600 hover:underline">
                                                Add one now &rarr;
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                                        {catItems.map((item) => (
                                            <div key={item.id}
                                                className="group relative bg-white rounded-md border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between overflow-hidden">
                                                <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                                                    {/* Identity Row */}
                                                    <div className="flex items-start gap-2.5">
                                                        <div className="w-9 h-9 rounded-md border border-orange-200/60 shadow-2xs bg-orange-50/60 text-orange-600 font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden">
                                                            {item.image_path ? (
                                                                <img src={`/storage/${item.image_path}`} className="w-full h-full object-cover" alt={item.name} />
                                                            ) : (
                                                                <ImageIcon className="w-4 h-4" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1 space-y-0.5">
                                                            <h3 className="font-bold text-slate-900 text-xs truncate group-hover:text-orange-600 transition-colors leading-tight">{item.name}</h3>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.category}</p>
                                                        </div>
                                                    </div>

                                                    {/* Muscle Info Tiles */}
                                                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                                        <div className="p-1.5 bg-slate-50/80 rounded border border-slate-100 shadow-2xs">
                                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Overactive</span>
                                                            <p className="text-[9.5px] font-medium text-slate-700 leading-tight mt-0.5 line-clamp-2">
                                                                {item.overactive_muscles || <span className="text-slate-400 italic">None specified</span>}
                                                            </p>
                                                        </div>
                                                        <div className="p-1.5 bg-slate-50/80 rounded border border-slate-100 shadow-2xs">
                                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Underactive</span>
                                                            <p className="text-[9.5px] font-medium text-slate-700 leading-tight mt-0.5 line-clamp-2">
                                                                {item.underactive_muscles || <span className="text-slate-400 italic">None specified</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card Footer */}
                                                <div className="px-3 py-1.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                                                    <span className="text-[9.5px] font-medium text-slate-400">{item.category}</span>
                                                    <div className="flex items-center gap-1.5">
                                                        {canUpdate && (
                                                            <Link href={route('admin.dpa-compensations.edit', item.id)} className="text-slate-400 hover:text-orange-500 transition-colors p-0.5" title="Edit">
                                                                <Edit className="w-3 h-3" />
                                                            </Link>
                                                        )}
                                                        {canDelete && (
                                                            <button onClick={() => handleDelete(item)} className="text-slate-400 hover:text-rose-500 transition-colors p-0.5" title="Hapus">
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <PageFooter className="!mt-8 !pt-4 !pb-1" />
            </div>
        </AppLayout>
    );
}
