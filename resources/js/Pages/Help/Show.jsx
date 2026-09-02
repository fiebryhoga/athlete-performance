import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';
import { 
    ArrowLeft, 
    CheckCircle2, 
    BookOpen, 
    Layers, 
    Lightbulb, 
    Maximize2, 
    X, 
    ThumbsUp, 
    ThumbsDown, 
    Clock, 
    Eye,
    MessageCircle,
    ChevronRight,
    Sparkles
} from 'lucide-react';

export default function HelpShow({ guide, relatedGuides = [], userRole = 'athlete' }) {
    const steps = guide.steps || [];
    const [lightboxImage, setLightboxImage] = useState(null);
    const [feedbackSent, setFeedbackSent] = useState(null);

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

    const roleBadge = getRoleBadge(guide.target_role);

    const scrollToStep = (idx) => {
        const element = document.getElementById(`step-${idx + 1}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <AppLayout title={guide.title}>
            <Head title={`${guide.title} - Pusat Bantuan`} />

            <div className="space-y-4 pb-6">
                {/* STANDARD PAGE HEADER */}
                <PageHeader
                    title={guide.title}
                    description={guide.summary || 'Petunjuk tata cara lengkap penggunaan modul sistem.'}
                    badge={roleBadge.label}
                    icon={BookOpen}
                    actions={
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('help.index')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-200/90 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Pusat Bantuan</span>
                            </Link>
                        </div>
                    }
                />

                {/* TWO COLUMN / KANAN KIRI LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* LEFT COLUMN: FULL SCROLLABLE STEPS LIST (8 cols) */}
                    <div className="lg:col-span-8 space-y-4">
                        
                        {/* GUIDE SUMMARY / INTRO CARD */}
                        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-2xs space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">
                                <Layers className="w-3.5 h-3.5 text-orange-500" />
                                <span>Panduan Praktis ({steps.length} Langkah)</span>
                            </div>
                            {guide.content ? (
                                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                                    {guide.content}
                                </p>
                            ) : guide.summary ? (
                                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                                    {guide.summary}
                                </p>
                            ) : null}
                        </div>

                        {/* ALL STEPS (SCROLLABLE TIMELINE FORMAT) */}
                        {steps.length > 0 ? (
                            <div className="space-y-4">
                                {steps.map((step, idx) => (
                                    <div
                                        key={step.id || idx}
                                        id={`step-${idx + 1}`}
                                        className="bg-white border border-slate-200/80 rounded-lg p-4 sm:p-5 shadow-2xs space-y-3.5 scroll-mt-20"
                                    >
                                        {/* Step Title Header */}
                                        <div className="flex items-start gap-3 pb-2.5 border-b border-slate-100">
                                            <div className="w-7 h-7 rounded-md bg-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                                {idx + 1}
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                                                    Langkah {idx + 1}
                                                </span>
                                                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                                    {step.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Step Description */}
                                        {step.description && (
                                            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-10">
                                                {step.description}
                                            </div>
                                        )}

                                        {/* Step Image / Screenshot */}
                                        {step.image_path && (
                                            <div className="pl-10 pt-1">
                                                <div 
                                                    className="group relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50 cursor-pointer max-w-xl shadow-2xs"
                                                    onClick={() => setLightboxImage(step.image_path.startsWith('http') ? step.image_path : `/storage/${step.image_path}`)}
                                                >
                                                    <img
                                                        src={step.image_path.startsWith('http') ? step.image_path : `/storage/${step.image_path}`}
                                                        alt={step.title}
                                                        className="w-full max-h-80 object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-200"
                                                    />
                                                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                                                        <Maximize2 className="w-4 h-4" />
                                                        <span>Klik untuk memperbesar gambar</span>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1 italic">
                                                    *Klik pada gambar untuk memperbesar tampilan penuh
                                                </p>
                                            </div>
                                        )}

                                        {/* Step Tip Callout - Compact Neutral Note */}
                                        {step.tip && (
                                            <div className="ml-10 flex items-start gap-2 py-1.5 px-2.5 rounded-md bg-slate-50 border border-slate-200/80 text-xs">
                                                <Lightbulb className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                                                <div className="text-[11px] leading-relaxed">
                                                    <span className="font-bold text-slate-800 mr-1">Tips:</span>
                                                    <span className="text-slate-600">{step.tip}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-white border border-slate-200/80 rounded-lg space-y-2 shadow-2xs">
                                <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                                <p className="text-xs text-slate-500">
                                    Belum ada rincian langkah pada panduan ini.
                                </p>
                            </div>
                        )}

                        {/* FEEDBACK WIDGET */}
                        <div className="p-3.5 bg-white border border-slate-200/80 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                            <span className="text-xs font-semibold text-slate-700">
                                Apakah panduan langkah-langkah ini membantu Anda?
                            </span>
                            <div className="flex items-center gap-2">
                                {feedbackSent ? (
                                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Terima kasih atas masukan Anda!
                                    </span>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setFeedbackSent('yes')}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs"
                                        >
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                            <span>Ya, Membantu</span>
                                        </button>
                                        <button
                                            onClick={() => setFeedbackSent('no')}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all cursor-pointer shadow-2xs"
                                        >
                                            <ThumbsDown className="w-3.5 h-3.5" />
                                            <span>Belum Jelas</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: STICKY SIDEBAR (DAFTAR LANGKAH & RELATED) (4 cols) */}
                    <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
                        
                        {/* TABLE OF STEPS (CLICKABLE JUMP LINKS) */}
                        <div className="bg-white border border-slate-200/80 rounded-lg p-3.5 sm:p-4 space-y-2.5 shadow-2xs">
                            <h3 className="text-xs font-bold text-slate-900 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                                <span>Daftar Langkah</span>
                                <span className="text-[10px] font-semibold text-slate-400">
                                    {steps.length} Langkah
                                </span>
                            </h3>
                            <div className="space-y-1">
                                {steps.map((step, idx) => (
                                    <button
                                        key={step.id || idx}
                                        type="button"
                                        onClick={() => scrollToStep(idx)}
                                        className="w-full text-left p-2 rounded-md text-xs transition-all flex items-start gap-2 hover:bg-orange-50/50 hover:text-orange-700 text-slate-600 font-medium group cursor-pointer"
                                    >
                                        <span className="w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 bg-slate-100 text-slate-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                            {idx + 1}
                                        </span>
                                        <span className="line-clamp-2 leading-tight">
                                            {step.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RELATED GUIDES */}
                        {relatedGuides.length > 0 && (
                            <div className="bg-white border border-slate-200/80 rounded-lg p-3.5 sm:p-4 space-y-2.5 shadow-2xs">
                                <h3 className="text-xs font-bold text-slate-900 pb-1.5 border-b border-slate-100">
                                    Panduan Terkait
                                </h3>
                                <div className="space-y-1.5">
                                    {relatedGuides.map((rGuide) => (
                                        <Link
                                            key={rGuide.id}
                                            href={route('help.show', rGuide.slug)}
                                            className="block p-2.5 rounded-md border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 transition-all space-y-0.5 group"
                                        >
                                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                                                {rGuide.title}
                                            </h4>
                                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                                                <span>{rGuide.category?.name || 'Umum'}</span>
                                                <span className="font-bold text-orange-600 flex items-center">
                                                    Lihat <ChevronRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <PageFooter />
            </div>

            {/* LIGHTBOX ZOOM MODAL */}
            {lightboxImage && (
                <div 
                    className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100"
                    onClick={() => setLightboxImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setLightboxImage(null)}
                            className="absolute right-2.5 top-2.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <img
                            src={lightboxImage}
                            alt="Zoom"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg border border-slate-700 shadow-2xl bg-white"
                        />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
