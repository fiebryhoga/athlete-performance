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
                            {!isAthlete && activeTab === 'analysis' && (
                                <Link 
                                    href={route('admin.athletes.dpa.index')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                                >
                                    <ChevronLeft size={14} />
                                    <span>Daftar Klien</span>
                                </Link>
                            )}

                            {activeTab === 'input' ? (
                                <button 
                                    type="button"
                                    onClick={cancelEdit}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                                >
                                    <Activity size={13.5} className="text-orange-600" />
                                    <span>Kembali ke Analisis</span>
                                </button>
                            ) : (
                                canCreate && (
                                    <button 
                                        type="button"
                                        onClick={() => { setActiveTab('input'); setIsEditMode(false); reset(); }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                                    >
                                        <Plus size={13.5} />
                                        <span>Input Evaluasi</span>
                                    </button>
                                )
                            )}
                        </div>
                    }
                />

                {activeTab === 'analysis' && (
                    <div>
                        {analysis ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                                {/* ═══════════════════════════════════════
                                    KOLOM KIRI (LEBAR): Analisis Kompensasi Spesifik & Protokol Latihan Korektif
                                   ═══════════════════════════════════════ */}
                                <div className="order-1 lg:col-span-8 xl:col-span-9 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                            <Target size={14} className="text-orange-500" />
                                            <span>Analisis Kompensasi Spesifik</span>
                                        </h3>
                                        <span className="text-xs font-medium text-slate-400">
                                            {analysis.compensations.length} Temuan
                                        </span>
                                    </div>
                                    
                                    {analysis.compensations.map((comp, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden hover:border-slate-300/80 transition-all">
                                            {/* Compensation Header */}
                                            <div className="px-4 py-3 bg-gradient-to-r from-slate-50/80 via-slate-50/40 to-white border-b border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider">
                                                        {comp.category}
                                                    </span>
                                                    <span className="text-slate-300 font-bold">•</span>
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                                        {comp.name}
                                                    </h4>
                                                </div>
                                            </div>
                                            
                                            <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
                                                {/* Left Sub-Column: Visual Image & Imbalances Info */}
                                                <div className="lg:col-span-4 space-y-3 lg:border-r border-slate-100 lg:pr-4">
                                                    {comp.image_path && (
                                                        <div className="bg-slate-50/60 border border-slate-200/70 rounded-md p-2 shadow-2xs flex items-center justify-center overflow-hidden">
                                                            <img 
                                                                src={`/storage/${comp.image_path}`} 
                                                                alt={comp.name} 
                                                                className="w-full h-36 object-contain rounded"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        {/* Overactive */}
                                                        <div className="bg-slate-50/60 rounded-md p-2.5 border border-slate-100/90 space-y-1">
                                                            <div className="flex items-center gap-1.5 text-slate-800">
                                                                <Flame size={12} className="text-rose-500 shrink-0" />
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Otot Overactive</span>
                                                            </div>
                                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                                                {splitItems(comp.overactive_muscles).join(', ') || '-'}
                                                            </p>
                                                        </div>

                                                        {/* Underactive */}
                                                        <div className="bg-slate-50/60 rounded-md p-2.5 border border-slate-100/90 space-y-1">
                                                            <div className="flex items-center gap-1.5 text-slate-800">
                                                                <Dumbbell size={12} className="text-emerald-500 shrink-0" />
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Otot Underactive</span>
                                                            </div>
                                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                                                {splitItems(comp.underactive_muscles).join(', ') || '-'}
                                                            </p>
                                                        </div>

                                                        {/* Potensi Cedera */}
                                                        <div className="bg-slate-50/60 rounded-md p-2.5 border border-slate-100/90 space-y-1">
                                                            <div className="flex items-center gap-1.5 text-slate-800">
                                                                <ShieldAlert size={12} className="text-amber-500 shrink-0" />
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Potensi Cedera</span>
                                                            </div>
                                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                                                {splitItems(comp.possible_injuries).join(', ') || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Sub-Column: Corrective Exercises 4-Phase */}
                                                <div className="lg:col-span-8 space-y-3">
                                                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                                                        <Zap size={13.5} className="text-orange-500" />
                                                        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                                            Protokol Latihan Korektif (4 Fase)
                                                        </h5>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {/* Phase 1: Inhibit */}
                                                        <div className="bg-slate-50/50 border border-slate-200/70 rounded-md p-3 hover:border-slate-300 transition-all flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
                                                                    <span className="w-5 h-5 rounded-md bg-orange-100/80 text-orange-700 text-[10.5px] font-black flex items-center justify-center shrink-0 border border-orange-200/60">
                                                                        1
                                                                    </span>
                                                                    <div>
                                                                        <h6 className="text-xs font-bold text-slate-800">Inhibit</h6>
                                                                        <span className="text-[10px] font-medium text-slate-400">Self-Myofascial Release (SMR)</span>
                                                                    </div>
                                                                </div>
                                                                <ul className="space-y-1.5 text-xs text-slate-700 mt-2.5">
                                                                    {splitItems(comp.exercises_smr).map((m, i) => (
                                                                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0" />
                                                                            <span className="font-medium text-slate-700">{m}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            {comp.image_smr && (
                                                                <img src={`/storage/${comp.image_smr}`} alt="SMR" className="mt-2.5 w-full max-h-32 object-contain rounded-md border border-slate-200 bg-white" />
                                                            )}
                                                        </div>

                                                        {/* Phase 2: Lengthen */}
                                                        <div className="bg-slate-50/50 border border-slate-200/70 rounded-md p-3 hover:border-slate-300 transition-all flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
                                                                    <span className="w-5 h-5 rounded-md bg-orange-100/80 text-orange-700 text-[10.5px] font-black flex items-center justify-center shrink-0 border border-orange-200/60">
                                                                        2
                                                                    </span>
                                                                    <div>
                                                                        <h6 className="text-xs font-bold text-slate-800">Lengthen</h6>
                                                                        <span className="text-[10px] font-medium text-slate-400">Peregangan Statis/Dinamis</span>
                                                                    </div>
                                                                </div>
                                                                <ul className="space-y-1.5 text-xs text-slate-700 mt-2.5">
                                                                    {splitItems(comp.exercises_stretching).map((m, i) => (
                                                                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0" />
                                                                            <span className="font-medium text-slate-700">{m}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            {comp.image_stretching && (
                                                                <img src={`/storage/${comp.image_stretching}`} alt="Stretch" className="mt-2.5 w-full max-h-32 object-contain rounded-md border border-slate-200 bg-white" />
                                                            )}
                                                        </div>

                                                        {/* Phase 3: Activate */}
                                                        <div className="bg-slate-50/50 border border-slate-200/70 rounded-md p-3 hover:border-slate-300 transition-all flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
                                                                    <span className="w-5 h-5 rounded-md bg-orange-100/80 text-orange-700 text-[10.5px] font-black flex items-center justify-center shrink-0 border border-orange-200/60">
                                                                        3
                                                                    </span>
                                                                    <div>
                                                                        <h6 className="text-xs font-bold text-slate-800">Activate</h6>
                                                                        <span className="text-[10px] font-medium text-slate-400">Aktivasi Isometrik / Posisi</span>
                                                                    </div>
                                                                </div>
                                                                <ul className="space-y-1.5 text-xs text-slate-700 mt-2.5">
                                                                    {splitItems(comp.exercises_isometrics).map((m, i) => (
                                                                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0" />
                                                                            <span className="font-medium text-slate-700">{m}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            {comp.image_isometrics && (
                                                                <img src={`/storage/${comp.image_isometrics}`} alt="Activate" className="mt-2.5 w-full max-h-32 object-contain rounded-md border border-slate-200 bg-white" />
                                                            )}
                                                        </div>

                                                        {/* Phase 4: Integrate */}
                                                        <div className="bg-slate-50/50 border border-slate-200/70 rounded-md p-3 hover:border-slate-300 transition-all flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
                                                                    <span className="w-5 h-5 rounded-md bg-orange-100/80 text-orange-700 text-[10.5px] font-black flex items-center justify-center shrink-0 border border-orange-200/60">
                                                                        4
                                                                    </span>
                                                                    <div>
                                                                        <h6 className="text-xs font-bold text-slate-800">Integrate</h6>
                                                                        <span className="text-[10px] font-medium text-slate-400">Integrasi Pola Gerak Dinamis</span>
                                                                    </div>
                                                                </div>
                                                                <ul className="space-y-1.5 text-xs text-slate-700 mt-2.5">
                                                                    {splitItems(comp.exercises_integrated).map((m, i) => (
                                                                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0" />
                                                                            <span className="font-medium text-slate-700">{m}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            {comp.image_integrated && (
                                                                <img src={`/storage/${comp.image_integrated}`} alt="Integrate" className="mt-2.5 w-full max-h-32 object-contain rounded-md border border-slate-200 bg-white" />
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

                                {/* ═══════════════════════════════════════
                                    KOLOM KANAN: Profil Ketidakseimbangan, Catatan Klinis & Riwayat Evaluasi
                                   ═══════════════════════════════════════ */}
                                <div className="order-2 lg:col-span-4 xl:col-span-3 space-y-4">
                                    {/* ─── 1. OVERALL MUSCLE IMBALANCE PROFILE ─── */}
                                    <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                        <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                                    <Activity size={14} className="text-orange-500" />
                                                    <span>Profil Ketidakseimbangan</span>
                                                </h3>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                    Agregasi temuan kompensasi terdeteksi
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-3.5 sm:p-4 space-y-4">
                                            {/* Overactive Muscles */}
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                                                    <div className="flex items-center gap-1.5">
                                                        <Flame size={13.5} className="text-rose-500" />
                                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Otot Overactive</h4>
                                                    </div>
                                                    <span className="text-[11px] font-medium text-slate-400">
                                                        {analysis.overactive.length} otot
                                                    </span>
                                                </div>
                                                <div className="pt-0.5">
                                                    {analysis.overactive.length > 0 ? (
                                                        <ul className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                                            {analysis.overactive.map((m, idx) => (
                                                                <li key={idx} className="flex items-baseline gap-2 text-xs py-0.5 text-slate-700">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                                                    <span className="font-medium leading-tight">{m}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs italic">Tidak ada kompensasi overactive</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Underactive Muscles */}
                                            <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                                                    <div className="flex items-center gap-1.5">
                                                        <Dumbbell size={13.5} className="text-emerald-500" />
                                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Otot Underactive</h4>
                                                    </div>
                                                    <span className="text-[11px] font-medium text-slate-400">
                                                        {analysis.underactive.length} otot
                                                    </span>
                                                </div>
                                                <div className="pt-0.5">
                                                    {analysis.underactive.length > 0 ? (
                                                        <ul className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                                            {analysis.underactive.map((m, idx) => (
                                                                <li key={idx} className="flex items-baseline gap-2 text-xs py-0.5 text-slate-700">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                                    <span className="font-medium leading-tight">{m}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs italic">Tidak ada kompensasi underactive</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Possible Injuries */}
                                            <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                                                    <div className="flex items-center gap-1.5">
                                                        <ShieldAlert size={13.5} className="text-amber-500" />
                                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Risiko Cedera</h4>
                                                    </div>
                                                    <span className="text-[11px] font-medium text-slate-400">
                                                        {analysis.injuries.length} risiko
                                                    </span>
                                                </div>
                                                <div className="pt-0.5">
                                                    {analysis.injuries.length > 0 ? (
                                                        <ul className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                                            {analysis.injuries.map((m, idx) => (
                                                                <li key={idx} className="flex items-baseline gap-2 text-xs py-0.5 text-slate-700">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                                                    <span className="font-medium leading-tight">{m}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs italic">Tidak ada risiko cedera terdeteksi</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ─── 2. CLINICAL NOTES ─── */}
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

                                    {/* ─── 3. EVALUATION HISTORY ─── */}
                                    <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                        <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <History size={14} className="text-slate-500" />
                                                <h3 className="text-xs font-bold text-slate-900">Riwayat Evaluasi DPA</h3>
                                            </div>
                                            <span className="text-[10.5px] font-bold text-slate-400">
                                                {assessments.length} Sesi
                                            </span>
                                        </div>
                                        
                                        <div className="divide-y divide-slate-100 text-xs max-h-80 overflow-y-auto custom-scrollbar">
                                            {assessments.length > 0 ? assessments.map((item, idx) => (
                                                <div key={idx} className="p-3 sm:px-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                    <div>
                                                        <p className="font-bold text-slate-900">
                                                            {new Date(item.assessment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                                </div>
                            </div>
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
