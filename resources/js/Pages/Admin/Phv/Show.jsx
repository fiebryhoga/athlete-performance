import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Layout/PageHeader';
import { HeartPulse, Plus, Edit, Trash2, Calendar, Activity, Info } from 'lucide-react';

export default function Show({ auth, athlete, assessments }) {
    
    const [isDeleting, setIsDeleting] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data penilaian ini?')) {
            setIsDeleting(id);
            router.delete(route('admin.phv-calculator.destroy', id), {
                preserveScroll: true,
                onFinish: () => setIsDeleting(null)
            });
        }
    };

    const latest = assessments.length > 0 ? assessments[0] : null;

    return (
        <AppLayout user={auth.user}>
            <Head title={`Riwayat PHV - ${athlete.name}`} />

            <div className="pb-8">
                <div className="mx-auto">
                    
                    <PageHeader 
                        title={`Riwayat PHV: ${athlete.name}`} 
                        subtitle={`Pantau riwayat Peak Height Velocity dan status kematangan fisik atlet.`} 
                        icon={HeartPulse}
                        badge="Tools"
                        actions={
                            <div className="flex flex-wrap gap-3">
                                <Link href={route('admin.phv-calculator.index')} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200 transition-colors">
                                    Kembali
                                </Link>
                                <Link 
                                    href={route('admin.phv-calculator.create', athlete.id)}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-orange-500/20"
                                >
                                    <Plus className="w-4 h-4" /> Catat Penilaian Baru
                                </Link>
                            </div>
                        }
                    />

                    {latest && (
                        <div className="mb-6 bg-white rounded-xl shadow-sm border border-orange-500/20 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 pointer-events-none"></div>
                            
                            <div className="p-6 md:p-8 relative z-10">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                                    <Activity className="text-orange-500 w-6 h-6" />
                                    Latest PHV Result
                                    <span className="text-sm font-medium text-slate-500 ml-2 bg-slate-100 px-3 py-1 rounded-full">
                                        {new Date(latest.assessment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row gap-6 justify-between items-center bg-slate-50/80 rounded-xl p-6 border border-slate-200">
                                        <div className="text-center w-full sm:w-1/2">
                                            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">
                                                <Activity className="w-4 h-4" /> Maturity
                                            </div>
                                            <div className="flex items-baseline justify-center gap-2">
                                                <span className="text-5xl font-bold text-slate-800">
                                                    {Number(latest.maturity_offset).toFixed(1)}
                                                </span>
                                            </div>
                                            <span className="text-slate-500 font-medium text-sm">years from PHV</span>
                                        </div>
                                        
                                        <div className="h-16 w-px bg-slate-300 hidden sm:block"></div>
                                        
                                        <div className="text-center w-full sm:w-1/2">
                                            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">
                                                <Info className="w-4 h-4" /> Age at PHV
                                            </div>
                                            <div className="flex items-baseline justify-center gap-2">
                                                <span className="text-4xl font-bold text-slate-800">{latest.phv_age}</span>
                                                <span className="text-slate-500 font-medium">years</span>
                                            </div>
                                            <span className="text-xs font-bold px-2 py-1 bg-slate-200 text-slate-700 rounded mt-2 inline-block uppercase tracking-widest">
                                                {latest.maturity_status} MATURER
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                                            <span className="text-slate-500 text-sm font-bold mb-2">Predicted Growth Remain</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-slate-800">{latest.remaining_growth}</span>
                                                <span className="text-slate-500 font-medium">cm</span>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                                            <span className="text-slate-500 text-sm font-bold mb-2">Predicted Adult Height</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-slate-800">{latest.predicted_adult_height}</span>
                                                <span className="text-slate-500 font-medium">cm</span>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                                            <span className="text-slate-500 text-sm font-bold mb-2">Current % Adult Height</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-slate-800">{latest.adult_height_percentage}</span>
                                                <span className="text-slate-500 font-medium">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                History List
                            </h3>
                            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                Total: {assessments.length} Data
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Tanggal Asesmen</th>
                                        <th className="px-6 py-4 text-center">Usia</th>
                                        <th className="px-6 py-4 text-center">Maturity Offset</th>
                                        <th className="px-6 py-4 text-center">Age at PHV & Status</th>
                                        <th className="px-6 py-4 text-center">Predicted Growth Remain</th>
                                        <th className="px-6 py-4 text-center">Predicted Adult Height</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {assessments.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">
                                                {new Date(item.assessment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium whitespace-nowrap">
                                                {Math.round(item.age)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-bold text-slate-700 whitespace-nowrap">
                                                    {Number(item.maturity_offset).toFixed(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-bold text-slate-800">{item.phv_age}</span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 uppercase tracking-widest">
                                                        {item.maturity_status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium whitespace-nowrap">
                                                {item.remaining_growth} cm
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium whitespace-nowrap">
                                                {item.predicted_adult_height} cm
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        href={route('admin.phv-calculator.edit', item.id)}
                                                        className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        disabled={isDeleting === item.id}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {assessments.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <HeartPulse className="w-10 h-10 text-slate-300 mb-3" />
                                                    <p className="font-medium">Belum ada riwayat pengukuran PHV.</p>
                                                    <p className="text-sm mt-1 mb-4">Silakan catat penilaian pertama untuk atlet ini.</p>
                                                    <Link 
                                                        href={route('admin.phv-calculator.create', athlete.id)}
                                                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors"
                                                    >
                                                        Mulai Penilaian
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
