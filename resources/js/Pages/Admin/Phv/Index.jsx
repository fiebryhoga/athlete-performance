import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Layout/PageHeader';
import { HeartPulse, UserCircle, Activity, ChevronRight } from 'lucide-react';

export default function Index({ auth, athletes }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAthletes = athletes.filter(athlete => 
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout user={auth.user}>
            <Head title="Kalkulator PHV" />

            <div className="pb-8">
                <div className="mx-auto">
                    
                    <PageHeader 
                        title="Penilaian PHV" 
                        subtitle="Pilih profil atlet untuk melihat riwayat atau mencatat pengukuran Peak Height Velocity baru." 
                        icon={HeartPulse}
                        badge="Manajemen"
                        searchPlaceholder="Cari nama atlet..."
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                    />

                    {filteredAthletes.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
                            Tidak ada profil atlet ditemukan.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAthletes.map((athlete) => {
                                const latest = athlete.phv_assessments?.[0];
                                return (
                                    <Link 
                                        key={athlete.id} 
                                        href={route('admin.phv-calculator.show', athlete.id)}
                                        className="group bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-orange-500 hover:shadow-md transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden flex-shrink-0">
                                                    {athlete.profile_photo_url ? (
                                                        <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserCircle className="w-8 h-8" />
                                                    )}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h3 className="font-bold text-slate-800 text-lg truncate group-hover:text-orange-500 transition-colors">{athlete.name}</h3>
                                                    <p className="text-sm text-slate-500 capitalize flex items-center gap-2">
                                                        {athlete.gender === 'female' ? 'Perempuan' : 'Laki-laki'} 
                                                        {athlete.age && <span className="bg-slate-100 px-2 rounded-full text-xs font-bold text-slate-600">{Math.round(athlete.age)} Thn</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100">
                                                {latest ? (
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-slate-500">Update Terakhir</span>
                                                            <span className="font-bold text-slate-700">
                                                                {new Date(latest.assessment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-slate-500">Maturity Offset</span>
                                                            <span className="font-bold text-slate-700">{Number(latest.maturity_offset).toFixed(1)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-slate-500">Status</span>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-widest">
                                                                {latest.maturity_status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-6 flex flex-col items-center justify-center text-slate-400 text-sm">
                                                        <Activity className="w-6 h-6 mb-2 opacity-50" />
                                                        <span>Belum ada data evaluasi</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-orange-500 font-bold text-sm">
                                            <span>Lihat Riwayat Lengkap</span>
                                            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
