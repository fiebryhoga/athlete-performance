import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Plus, Edit, Trash2, Image as ImageIcon, Activity } from "lucide-react";
import PageHeader from "@/Components/Layout/PageHeader";

export default function DpaIndex({ auth, compensations }) {
    const t = (text) => text;
    const isAuthorized = auth?.user?.role === 'superadmin' || auth?.user?.role === 'coach';
    const canCreate = isAuthorized;
    const canUpdate = isAuthorized;
    const canDelete = isAuthorized;

    const categories = [
        "Posterior View",
        "Lateral View",
        "Anterior View",
        "Single Leg",
    ];

    const handleDelete = (item) => {
        if (confirm("Are you sure you want to delete this DPA compensation?")) {
            router.delete(route("admin.dpa-compensations.destroy", item.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout title="DPA Compensations">
            <Head title="DPA Benchmark Settings" />

            <div className="w-full pb-12 space-y-6">
            <PageHeader 
                title={t("Compensation Directory")}
                subtitle={t("Browse and organize postural compensations by category")}
                badge="Master DPA"
                icon={Activity}
                actions={
                    canCreate && (
                        <Link
                            href={route('admin.dpa-compensations.create')}
                            className="bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} strokeWidth={2} /> {t("Add Compensation")}
                        </Link>
                    )
                }
            />

                <div className="space-y-12">
                    {categories.map((category) => {
                        const catItems = compensations.filter(
                            (c) => c.category === category,
                        );

                        return (
                            <div
                                key={category}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                            >
                                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-200 ">
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                        {category}
                                    </h3>
                                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200 shadow-sm">
                                        {catItems.length} Compensations
                                    </span>
                                </div>

                                {catItems.length === 0 ? (
                                    <div className="text-center p-8 bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center">
                                        <div className="p-3 bg-white rounded-full border border-slate-200 shadow-sm mb-3">
                                            <ImageIcon
                                                size={20}
                                                className="text-slate-400"
                                            />
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium">
                                            No compensations added for{" "}
                                            {category} yet.
                                        </p>
                                        {canCreate && (
                                            <Link
                                                href={route('admin.dpa-compensations.create')}
                                                className="mt-3 text-xs font-bold text-slate-900 hover:underline"
                                            >
                                                Add one now &rarr;
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {catItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-white [#09090b] border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 :border-slate-700 transition-all duration-200 flex flex-col group relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-4 flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    {canUpdate && (
                                                        <Link
                                                            href={route('admin.dpa-compensations.edit', item.id)}
                                                            className="p-1.5 bg-white/80 [#09090b]/80 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-slate-900 :text-slate-100 rounded-lg transition-colors shadow-sm"
                                                        >
                                                            <Edit size={14} />
                                                        </Link>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(item)
                                                            }
                                                            className="p-1.5 bg-white/80 [#09090b]/80 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-rose-600 :text-rose-400 rounded-lg transition-colors shadow-sm"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex items-start gap-4 mb-5 pr-16">
                                                    {item.image_path ? (
                                                        <img
                                                            src={`/storage/${item.image_path}`}
                                                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 bg-white"
                                                            alt={item.name}
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300 shrink-0 shadow-sm">
                                                            <ImageIcon
                                                                size={24}
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-base leading-tight mb-1">
                                                            {item.name}
                                                        </h4>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3 flex-1 bg-slate-50/50 -mx-5 -mb-5 p-5 border-t border-slate-100 mt-auto">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                            {t("Overactive Muscles")}
                                                        </span>
                                                        <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                                                            {item.overactive_muscles || (
                                                                <span className="text-slate-400 italic">
                                                                    None
                                                                    specified
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                            {t("Underactive Muscles")}
                                                        </span>
                                                        <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                                                            {item.underactive_muscles || (
                                                                <span className="text-slate-400 italic">
                                                                    None
                                                                    specified
                                                                </span>
                                                            )}
                                                        </p>
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
            </div>
        </AppLayout>
    );
}
