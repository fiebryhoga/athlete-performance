import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, Plus, History, Activity, Edit, Trash2, Download, AlertTriangle, ShieldAlert, Dumbbell, MoveRight, Zap, Target, ArrowRight, FileText } from 'lucide-react';
import PageHeader from "@/Components/Layout/PageHeader";

import AssessmentForm from './Partials/AssessmentForm';

export default function DpaShow({ auth, player, assessments, compensations }) {
    const t = (text) => text;
    const isAuthorized = auth?.user?.role === 'superadmin' || auth?.user?.role === 'coach';
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
        if (confirm('Are you sure you want to delete this DPA assessment data?')) {
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
        const comps = latest.details.map(d => d.compensation).filter(Boolean);
        
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
        <AppLayout title={`DPA - ${player.name}`}>
            <Head title={`DPA - ${player.name}`} />

            <div className="space-y-6">
                
            <PageHeader 
                title={player.name}
                subtitle={`Position: ${player.position || 'Player'}`}
                badge="DPA Analysis"
                actions={
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                            <button 
                                onClick={cancelEdit}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-200 ease-out ${
                                    activeTab === 'analysis' 
                                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50 ' 
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                            >
                                <Activity size={14} /> {t("Analysis")}
                            </button>
                            {canCreate && (
                                <button 
                                    onClick={() => { setActiveTab('input'); setIsEditMode(false); reset(); }}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-200 ease-out ${
                                        activeTab === 'input' && !isEditMode 
                                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50 ' 
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                    }`}
                                >
                                    <Plus size={14} strokeWidth={3} /> {t("Input Assessment")}
                                </button>
                            )}
                        </div>
                    </div>
                }
            />

                {activeTab === 'analysis' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {analysis ? (
                            <>
                                {/* OVERALL ANALYSIS */}
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                    <div className="border-b border-slate-200 p-5 bg-slate-50 ">
                                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                            <Activity size={18} className="text-slate-500" /> {t("Overall Imbalance Profile")}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">{t("Aggregated muscles and injury risks across all detected compensations.")}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 ">
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 ">
                                                    <Activity size={14} />
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{t("Overactive")}</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {analysis.overactive.map((m, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 ">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                                                        {m}
                                                    </li>
                                                ))}
                                                {analysis.overactive.length === 0 && <span className="text-slate-400 text-sm italic">{t("None")}</span>}
                                            </ul>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 ">
                                                    <Dumbbell size={14} />
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{t("Underactive")}</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {analysis.underactive.map((m, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 ">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                                                        {m}
                                                    </li>
                                                ))}
                                                {analysis.underactive.length === 0 && <span className="text-slate-400 text-sm italic">{t("None")}</span>}
                                            </ul>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 ">
                                                    <ShieldAlert size={14} />
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{t("Risks")}</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {analysis.injuries.map((m, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 ">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                                                        {m}
                                                    </li>
                                                ))}
                                                {analysis.injuries.length === 0 && <span className="text-slate-400 text-sm italic">{t("None")}</span>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* PER COMPENSATION ANALYSIS */}
                                <div className="space-y-6">
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 px-2">
                                        <Target size={18} className="text-slate-500" /> {t("Specific Compensations Analysis")}
                                    </h3>
                                    
                                    {analysis.compensations.map((comp, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                            <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{comp.category}</span>
                                                    <h4 className="text-lg font-bold text-slate-900 mt-1">{comp.name}</h4>
                                                </div>
                                            </div>
                                            
                                            <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                {/* Imbalances for this comp */}
                                                <div className="lg:col-span-4 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-8">
                                                    {comp.image_path && (
                                                        <div className="bg-white border border-slate-200/80 rounded-xl p-2 shadow-sm">
                                                            <img 
                                                                src={`/storage/${comp.image_path}`} 
                                                                alt={comp.name} 
                                                                className="w-full h-48 object-contain rounded-lg"
                                                            />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h5 className="text-xs font-bold text-slate-800 uppercase mb-3">{t("Overactive")}</h5>
                                                        <ul className="space-y-1.5 text-sm text-slate-600 ">
                                                            {splitItems(comp.overactive_muscles).map((m, i) => (
                                                                <li key={i} className="flex gap-2"><span className="text-slate-400">-</span> {m}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-xs font-bold text-slate-800 uppercase mb-3">{t("Underactive")}</h5>
                                                        <ul className="space-y-1.5 text-sm text-slate-600 ">
                                                            {splitItems(comp.underactive_muscles).map((m, i) => (
                                                                <li key={i} className="flex gap-2"><span className="text-slate-400">-</span> {m}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-xs font-bold text-slate-800 uppercase mb-3">{t("Possible Injuries")}</h5>
                                                        <ul className="space-y-1.5 text-sm text-slate-600 ">
                                                            {splitItems(comp.possible_injuries).map((m, i) => (
                                                                <li key={i} className="flex gap-2"><span className="text-slate-400">-</span> {m}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Corrective Exercises for this comp */}
                                                <div className="lg:col-span-8 space-y-6">
                                                    <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                        <Zap size={16} className="text-slate-500" /> {t("Corrective Exercise Continuum")}
                                                    </h5>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        {/* Phase 1 */}
                                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="w-5 h-5 rounded bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">1</span>
                                                                <h6 className="text-xs font-bold text-slate-800 uppercase">{t("Inhibit (SMR)")}</h6>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {splitItems(comp.exercises_smr).map((m, i) => (
                                                                    <li key={i} className="text-sm text-slate-600 ">
                                                                        {m}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {comp.image_smr && (
                                                                <img src={`/storage/${comp.image_smr}`} alt="SMR" className="mt-4 w-full h-auto object-contain rounded-lg border border-slate-200 " />
                                                            )}
                                                        </div>

                                                        {/* Phase 2 */}
                                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="w-5 h-5 rounded bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">2</span>
                                                                <h6 className="text-xs font-bold text-slate-800 uppercase">{t("Lengthen (Stretch)")}</h6>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {splitItems(comp.exercises_stretching).map((m, i) => (
                                                                    <li key={i} className="text-sm text-slate-600 ">
                                                                        {m}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {comp.image_stretching && (
                                                                <img src={`/storage/${comp.image_stretching}`} alt="Stretch" className="mt-4 w-full h-auto object-contain rounded-lg border border-slate-200 " />
                                                            )}
                                                        </div>

                                                        {/* Phase 3 */}
                                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="w-5 h-5 rounded bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">3</span>
                                                                <h6 className="text-xs font-bold text-slate-800 uppercase">{t("Activate")}</h6>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {splitItems(comp.exercises_isometrics).map((m, i) => (
                                                                    <li key={i} className="text-sm text-slate-600 ">
                                                                        {m}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {comp.image_isometrics && (
                                                                <img src={`/storage/${comp.image_isometrics}`} alt="Activate" className="mt-4 w-full h-auto object-contain rounded-lg border border-slate-200 " />
                                                            )}
                                                        </div>

                                                        {/* Phase 4 */}
                                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="w-5 h-5 rounded bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">4</span>
                                                                <h6 className="text-xs font-bold text-slate-800 uppercase">{t("Integrate")}</h6>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {splitItems(comp.exercises_integrated).map((m, i) => (
                                                                    <li key={i} className="text-sm text-slate-600 ">
                                                                        {m}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {comp.image_integrated && (
                                                                <img src={`/storage/${comp.image_integrated}`} alt="Integrate" className="mt-4 w-full h-auto object-contain rounded-lg border border-slate-200 " />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {analysis.compensations.length === 0 && (
                                        <div className="p-10 text-center flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                                            <Activity size={32} className="text-slate-300 mb-3" />
                                            <p className="text-sm font-bold text-slate-900 ">{t("No Compensations")}</p>
                                            <p className="text-xs text-slate-500 mt-1">{t("Player shows excellent postural alignment.")}</p>
                                        </div>
                                    )}
                                </div>

                                {/* ASSESSMENT NOTES */}
                                {latest.notes && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-sm p-6 mt-8">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 ">
                                                <FileText size={14} />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 ">{t("Clinical Notes / Remarks")}</h3>
                                        </div>
                                        <div 
                                            className="text-sm text-slate-600 leading-relaxed pl-1 prose prose-slate max-w-none"
                                            dangerouslySetInnerHTML={{ __html: latest.notes }}
                                        />
                                    </div>
                                )}

                                {/* ASSESSMENT RECORDS */}
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-8">
                                    <div className="p-5 border-b border-slate-200 bg-slate-50 ">
                                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                            <History size={18} className="text-slate-500" /> {t("Assessment Records")}
                                        </h3>
                                    </div>
                                    
                                    <div className="divide-y divide-slate-100 ">
                                        {assessments.length > 0 ? assessments.map((item, idx) => (
                                            <div key={idx} className="p-4 md:px-6 flex items-center justify-between hover:bg-slate-50/50 :bg-orange-500/30 transition-colors group">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 ">
                                                        {new Date(item.assessment_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                    <div className="text-xs text-slate-500 mt-0.5">
                                                        {item.details.length} Compensations detected
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    {canUpdate && (
                                                        <button onClick={() => handleEdit(item)} className="p-2 bg-white text-slate-600 border border-slate-200 rounded-lg shadow-sm hover:text-slate-900 :text-white transition-colors">
                                                            <Edit size={14} />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-slate-600 border border-slate-200 rounded-lg shadow-sm hover:text-rose-600 :text-rose-500 transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-10 text-center flex flex-col items-center justify-center">
                                                <History size={24} className="text-slate-300 mb-2" />
                                                <p className="text-xs font-bold text-slate-500 ">{t("No Records")}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-10 text-center flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl shadow-sm h-full">
                                <Activity size={32} className="text-slate-300 mb-3" />
                                <p className="text-sm font-bold text-slate-900 ">{t("No Analysis Available")}</p>
                                <p className="text-xs text-slate-500 mt-1">{t("Please add a new DPA assessment first.")}</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'input' && (
                    <AssessmentForm 
                        compensations={compensations}
                        data={data} setData={setData} 
                        submit={submit} processing={processing} 
                        isEditMode={isEditMode} cancelEdit={cancelEdit} 
                    />
                )}
            </div>
        </AppLayout>
    );
}
