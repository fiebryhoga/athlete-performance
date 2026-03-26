import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, ChevronRight, Activity, HeartPulse } from 'lucide-react';

export default function Index({ athletes }) {
    return (
        <AdminLayout title="Wellness & Training Load">
            <Head title="Wellness & Training Load" />

            <div className="mb-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                            <HeartPulse className="w-7 h-7 text-rose-500" />
                            Wellness & Training Load
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            Pantau tingkat kebugaran, RPE, dan ACWR (Acute:Chronic Workload Ratio) atlet.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {athletes.map((athlete) => (
                        <div key={athlete.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                        {athlete.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-[#00488b] transition-colors">{athlete.name}</h3>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                                            {athlete.sport?.name || 'Umum'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                <div className="text-xs font-bold text-slate-500">
                                    <span className="text-slate-800 text-lg">{athlete.total_records}</span> Data Load
                                </div>
                                <Link 
                                    href={route('admin.training-loads.show', athlete.id)}
                                    className="flex items-center gap-1 text-xs font-bold text-white bg-[#00488b] px-4 py-2 rounded-xl shadow-sm hover:bg-[#003666] hover:-translate-y-0.5 transition-all"
                                >
                                    Buka Dashboard <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}