import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Plus, 
    History, 
    Activity, 
    Edit, 
    Trash2, 
    ShieldAlert, 
    Dumbbell, 
    Zap, 
    Target, 
    FileText,
    Flame,
    CheckCircle2
} from 'lucide-react';
import PageHeader from "@/Components/Common/PageHeader";
import AssessmentForm from './Partials/AssessmentForm';

export default function DpaShow({ auth, player, assessments = [], compensations = [] }) {
    const isAuthorized = auth?.user?.role === 'superadmin' || auth?.user?.role === 'coach';
    const isAthlete = auth?.user?.role === 'athlete';
    const canCreate = isAuthorized;
    const canUpdate = isAuthorized;
    const canDelete = isAuthorized;

    const [activeTab, setActiveTab] = useState('analysis');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, processing, reset } = useForm({
        assessment_date: new Date().toISOString().split('T')[0],
        notes: '',
        compensations: []
    });

    const handleEdit = (item) => {
        setIsEditMode(true);
        setEditId(item.id);
        setData({
            assessment_date: item.assessment_date ? item.assessment_date.split('T')[0] : '',
            notes: item.notes || '',
            compensations: item.details.map(d => d.dpa_compensation_id)
        });
        setActiveTab('input');
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data evaluasi DPA ini?')) {
            router.delete(route('admin.athletes.dpa.destroy', id), { preserveScroll: true });
        }
    };

    const cancelEdit = () => {
        setIsEditMode(false);
        setEditId(null);
        reset();
        setActiveTab('analysis');
    };

    const submit = (e) => {
        e.preventDefault();
        const action = isEditMode ? put : post;
        const currentRoute = isEditMode ? route('admin.athletes.dpa.update', editId) : route('admin.athletes.dpa.store', player.id);
        
        action(currentRoute, {
            onSuccess: () => cancelEdit()
        });
    };

    const latest = assessments[0] || null;

    // Derived analysis
    const analysis = useMemo(() => {
        if (!latest) return null;
        const comps = latest.details.map(d => d.compensation).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
        
        const result = {
            compensations: comps,
            overactive: [],
            underactive: [],
            injuries: []
        };

        const addItems = (source, target) => {
            if (!source) return;
            const items = source.split(/[\n,]/).map(s => s.trim().replace(/^-\s*/, '')).filter(Boolean);
            items.forEach(item => {
                if (!target.includes(item)) target.push(item);
            });
        };

        comps.forEach(c => {
            addItems(c.overactive_muscles, result.overactive);
            addItems(c.underactive_muscles, result.underactive);
            addItems(c.possible_injuries, result.injuries);
        });

        return result;
    }, [latest]);

    const splitItems = (str) => {
        if (!str) return [];
        return str.split(/[\n,]/).map(s => s.trim().replace(/^-\s*/, '')).filter(Boolean);
    };

    return (
        <AppLayout title={`Analisis DPA - ${player.name}`}>
            <Head title={`DPA - ${player.name}`} />

            <div className="space-y-4 pb-16">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader 
                    title={`Analisis DPA: ${player.name}`}
                    description={`Evaluasi Dynamic Posture Assessment, ketidakseimbangan otot, dan rekomendasi latihan korektif.`}
                    actions={
                        <div className="flex items-center gap-2">
                            {!isAthlete && (
                                <Link 
                                    href={route('admin.athletes.dpa.index')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                                >
                                    <ChevronLeft size={14} />
                                    <span>Daftar Klien</span>
                                </Link>
                            )}

                            {isAuthorized && (
                                <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
                                    <button 
                                        type="button"
                                        onClick={cancelEdit}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                            activeTab === 'analysis' 
                                                ? 'bg-orange-500 text-white shadow-2xs' 
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Activity size={13} />
                                        <span>Analisis</span>
                                    </button>

                                    {canCreate && (
                                        <button 
                                            type="button"
                                            onClick={() => { setActiveTab('input'); setIsEditMode(false); reset(); }}
                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                                activeTab === 'input' && !isEditMode 
                                                    ? 'bg-orange-500 text-white shadow-2xs' 
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <Plus size={13} />
                                            <span>Input Evaluasi</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    }
                />

                {activeTab === 'analysis' && (
                    <div className="space-y-4">
                        {analysis ? (
                            <>
                                {/* ─── 2. OVERALL MUSCLE IMBALANCE PROFILE ─── */}
                                <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                    <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                                <Activity size={14} className="text-orange-500" />
                                                <span>Profil Ketidakseimbangan Keseluruhan</span>
                                            </h3>
                                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                Agregasi otot overactive, underactive, dan potensi risiko cedera dari kompensasi terdeteksi.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-3.5 sm:p-4 gap-4 md:gap-0">
                                        {/* Overactive Muscles */}
                                        <div className="md:pr-4 space-y-2.5">
                                            <div className="flex items-center gap-1.5">
                                                <Flame size={14} className="text-rose-500" />
                                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Otot Overactive</h4>
                                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 ml-auto">
                                                    {analysis.overactive.length}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {analysis.overactive.map((m, idx) => (
                                                    <span key={idx} className="inline-block px-2 py-0.5 text-xs font-medium text-rose-800 bg-rose-50/80 border border-rose-200/80 rounded">
                                                        {m}
                                                    </span>
                                                ))}
                                                {analysis.overactive.length === 0 && (
                                                    <span className="text-slate-400 text-xs italic">Tidak ada kompensasi overactive</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Underactive Muscles */}
                                        <div className="md:px-4 space-y-2.5">
                                            <div className="flex items-center gap-1.5">
                                                <Dumbbell size={14} className="text-emerald-500" />
                                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Otot Underactive</h4>
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 ml-auto">
                                                    {analysis.underactive.length}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {analysis.underactive.map((m, idx) => (
                                                    <span key={idx} className="inline-block px-2 py-0.5 text-xs font-medium text-emerald-800 bg-emerald-50/80 border border-emerald-200/80 rounded">
                                                        {m}
                                                    </span>
                                                ))}
                                                {analysis.underactive.length === 0 && (
                                                    <span className="text-slate-400 text-xs italic">Tidak ada kompensasi underactive</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Possible Injuries */}
                                        <div className="md:pl-4 space-y-2.5">
                                            <div className="flex items-center gap-1.5">
                                                <ShieldAlert size={14} className="text-amber-500" />
                                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Risiko Cedera</h4>
                                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 ml-auto">
                                                    {analysis.injuries.length}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {analysis.injuries.map((m, idx) => (
                                                    <span key={idx} className="inline-block px-2 py-0.5 text-xs font-medium text-amber-800 bg-amber-50/80 border border-amber-200/80 rounded">
                                                        {m}
                                                    </span>
                                                ))}
                                                {analysis.injuries.length === 0 && (
                                                    <span className="text-slate-400 text-xs italic">Tidak ada risiko cedera terdeteksi</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ─── 3. SPECIFIC COMPENSATION BREAKDOWN ─── */}
                                <div className="space-y-3">
                                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                        <Target size={14} className="text-orange-500" />
                                        <span>Analisis Kompensasi Spesifik</span>
                                    </h3>
                                    
                                    {analysis.compensations.map((comp, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                            {/* Compensation Header */}
                                            <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.2 rounded border border-orange-200 uppercase tracking-wider">
                                                        {comp.category}
                                                    </span>
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                                        {comp.name}
                                                    </h4>
                                                </div>
                                            </div>
                                            
                                            <div className="p-3.5 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
                                                {/* Left Column: Visual Image & Imbalances */}
                                                <div className="lg:col-span-4 space-y-3 lg:border-r border-slate-100 lg:pr-4">
                                                    {comp.image_path && (
                                                        <div className="bg-white border border-slate-200/80 rounded-md p-1.5 shadow-2xs">
                                                            <img 
                                                                src={`/storage/${comp.image_path}`} 
                                                                alt={comp.name} 
                                                                className="w-full h-40 object-contain rounded"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Otot Overactive</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {splitItems(comp.overactive_muscles).map((m, i) => (
                                                                <span key={i} className="inline-block px-1.5 py-0.2 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                                                                    {m}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Otot Underactive</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {splitItems(comp.underactive_muscles).map((m, i) => (
                                                                <span key={i} className="inline-block px-1.5 py-0.2 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                    {m}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Potensi Cedera</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {splitItems(comp.possible_injuries).map((m, i) => (
                                                                <span key={i} className="inline-block px-1.5 py-0.2 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                                    {m}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Column: Corrective Exercises 4-Phase */}
                                                <div className="lg:col-span-8 space-y-2.5">
                                                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                        <Zap size={13} className="text-orange-500" />
                                                        <span>Protokol Latihan Korektif (4 Fase)</span>
                                                    </h5>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                        {/* Phase 1: Inhibit */}
                                                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-md p-3 space-y-1.5">
                                                            <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-1">
                                                                <span className="w-4 h-4 rounded bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">1</span>
                                                                <h6 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Inhibit (SMR)</h6>
                                                            </div>
                                                            <ul className="space-y-1 text-xs text-slate-600">
                                                                {splitItems(comp.exercises_smr).map((m, i) => (
                                                                    <li key={i} className="flex items-start gap-1">
                                                                        <span className="text-orange-500 font-bold">•</span>
                                                                        <span>{m}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {comp.image_smr && (
                                                                <img src={`/storage/${comp.image_smr}`} alt="SMR" className="mt-2 w-full h-auto object-contain rounded border border-slate-200" />
                                                            )}
                                                        </div>

                                                        {/* Phase 2: Lengthen */}
                                                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-md p-3 space-y-1.5">
                                                            <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-1">
                                                                <span className="w-4 h-4 rounded bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">2</span>
                                                                <h6 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Lengthen (Peregangan)</h6>
                                                            </div>
                                                            <ul className="space-y-1 text-xs text-slate-600">
                                                                {splitItems(comp.exercises_stretching).map((m, i) => (
                                                                    <li key={i} className="flex items-start gap-1">
                                                                        <span className="text-orange-500 font-bold">•</span>
                                                                        <span>{m}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {comp.image_stretching && (
                                                                <img src={`/storage/${comp.image_stretching}`} alt="Stretch" className="mt-2 w-full h-auto object-contain rounded border border-slate-200" />
                                                            )}
                                                        </div>

                                                        {/* Phase 3: Activate */}
                                                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-md p-3 space-y-1.5">
                                                            <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-1">
                                                                <span className="w-4 h-4 rounded bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">3</span>
                                                                <h6 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Activate (Aktivasi)</h6>
                                                            </div>
                                                            <ul className="space-y-1 text-xs text-slate-600">
                                                                {splitItems(comp.exercises_isometrics).map((m, i) => (
                                                                    <li key={i} className="flex items-start gap-1">
                                                                        <span className="text-orange-500 font-bold">•</span>
                                                                        <span>{m}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {comp.image_isometrics && (
                                                                <img src={`/storage/${comp.image_isometrics}`} alt="Activate" className="mt-2 w-full h-auto object-contain rounded border border-slate-200" />
                                                            )}
                                                        </div>

                                                        {/* Phase 4: Integrate */}
                                                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-md p-3 space-y-1.5">
                                                            <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-1">
                                                                <span className="w-4 h-4 rounded bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">4</span>
                                                                <h6 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Integrate (Integrasi)</h6>
                                                            </div>
                                                            <ul className="space-y-1 text-xs text-slate-600">
                                                                {splitItems(comp.exercises_integrated).map((m, i) => (
                                                                    <li key={i} className="flex items-start gap-1">
                                                                        <span className="text-orange-500 font-bold">•</span>
                                                                        <span>{m}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {comp.image_integrated && (
                                                                <img src={`/storage/${comp.image_integrated}`} alt="Integrate" className="mt-2 w-full h-auto object-contain rounded border border-slate-200" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {analysis.compensations.length === 0 && (
                                        <div className="p-8 text-center bg-white border border-slate-200/80 rounded-md shadow-2xs space-y-1">
                                            <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-1.5" />
                                            <p className="text-xs sm:text-sm font-bold text-slate-900">Tidak Ada Kompensasi Gerakan</p>
                                            <p className="text-xs text-slate-500">Postur dan mekanika gerak atlet dinilai sangat optimal.</p>
                                        </div>
                                    )}
                                </div>

                                {/* ─── 4. CLINICAL NOTES ─── */}
                                {latest.notes && (
                                    <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs p-4 space-y-2">
                                        <div className="flex items-center gap-1.5">
                                            <FileText size={14} className="text-slate-500" />
                                            <h3 className="text-xs font-bold text-slate-900">Catatan Klinis & Observasi</h3>
                                        </div>
                                        <div 
                                            className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 prose prose-slate max-w-none"
                                            dangerouslySetInnerHTML={{ __html: latest.notes }}
                                        />
                                    </div>
                                )}

                                {/* ─── 5. EVALUATION HISTORY ─── */}
                                <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                    <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <History size={14} className="text-slate-500" />
                                            <h3 className="text-xs font-bold text-slate-900">Riwayat Evaluasi DPA</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="divide-y divide-slate-100 text-xs">
                                        {assessments.length > 0 ? assessments.map((item, idx) => (
                                            <div key={idx} className="p-3 sm:px-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                <div>
                                                    <p className="font-bold text-slate-900">
                                                        {new Date(item.assessment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                                        {item.details.length} kompensasi terdeteksi
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {canUpdate && (
                                                        <button 
                                                            onClick={() => handleEdit(item)} 
                                                            className="p-1.5 bg-white text-slate-600 border border-slate-200 rounded hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                                                            title="Edit Evaluasi"
                                                        >
                                                            <Edit size={13} />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button 
                                                            onClick={() => handleDelete(item.id)} 
                                                            className="p-1.5 bg-white text-slate-600 border border-slate-200 rounded hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                            title="Hapus Evaluasi"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-6 text-center text-slate-400 text-xs font-medium">
                                                Belum ada riwayat evaluasi.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center bg-white border border-slate-200/80 rounded-md shadow-2xs space-y-2">
                                <Activity size={28} className="text-slate-300 mx-auto" />
                                <h3 className="text-xs sm:text-sm font-bold text-slate-800">Belum Ada Data Analisis DPA</h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Silakan tambahkan evaluasi DPA pertama untuk pemain ini dengan mengklik tombol "Input Evaluasi".
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'input' && (
                    <AssessmentForm 
                        compensations={compensations}
                        data={data} 
                        setData={setData} 
                        submit={submit} 
                        processing={processing} 
                        isEditMode={isEditMode} 
                        cancelEdit={cancelEdit} 
                    />
                )}
            </div>
        </AppLayout>
    );
}
