import React, { useState } from 'react';
import BodyHighlighter from '@/Components/BodyHighlighter';
import { Sparkles, Trash2, CheckCircle2, ChevronDown, ChevronUp, Layers } from 'lucide-react';

export const MUSCLE_GROUPS = [
    {
        id: 'chest',
        label: 'Dada (Chest)',
        category: 'Tubuh Atas',
        parts: ['Chest (L)', 'Chest (R)'],
    },
    {
        id: 'front_deltoids',
        label: 'Bahu Depan (Front Deltoids)',
        category: 'Tubuh Atas',
        parts: ['Front Deltoids (L)', 'Front Deltoids (R)'],
    },
    {
        id: 'back_deltoids',
        label: 'Bahu Belakang (Back Deltoids)',
        category: 'Tubuh Atas',
        parts: ['Back Deltoids (L)', 'Back Deltoids (R)'],
    },
    {
        id: 'triceps',
        label: 'Triceps (Lengan Belakang)',
        category: 'Lengan',
        parts: ['Triceps (L)', 'Triceps (R)'],
    },
    {
        id: 'biceps',
        label: 'Biceps (Lengan Depan)',
        category: 'Lengan',
        parts: ['Biceps (L)', 'Biceps (R)'],
    },
    {
        id: 'forearm',
        label: 'Forearm (Lengan Bawah)',
        category: 'Lengan',
        parts: ['Forearm (L)', 'Forearm (R)'],
    },
    {
        id: 'abs',
        label: 'Perut (Rectus Abdominis)',
        category: 'Core',
        parts: ['Rectus Abdominis (L)', 'Rectus Abdominis (R)'],
    },
    {
        id: 'obliques',
        label: 'Pinggang / Samping (Obliques)',
        category: 'Core',
        parts: ['Obliques (L)', 'Obliques (R)'],
    },
    {
        id: 'upper_back',
        label: 'Punggung Atas (Lats / Upper Back)',
        category: 'Punggung',
        parts: ['Upper Back (L)', 'Upper Back (R)'],
    },
    {
        id: 'lower_back',
        label: 'Punggung Bawah (Lower Back)',
        category: 'Punggung',
        parts: ['Lower Back (L)', 'Lower Back (R)'],
    },
    {
        id: 'trapezius',
        label: 'Pundak (Trapezius)',
        category: 'Punggung',
        parts: ['Trapezius (L)', 'Trapezius (R)'],
    },
    {
        id: 'gluteal',
        label: 'Bokong (Gluteal)',
        category: 'Tubuh Bawah',
        parts: ['Gluteal (L)', 'Gluteal (R)'],
    },
    {
        id: 'quadriceps',
        label: 'Paha Depan (Quadriceps)',
        category: 'Tubuh Bawah',
        parts: ['Quadriceps (L)', 'Quadriceps (R)'],
    },
    {
        id: 'hamstring',
        label: 'Paha Belakang (Hamstring)',
        category: 'Tubuh Bawah',
        parts: ['Hamstring (L)', 'Hamstring (R)'],
    },
    {
        id: 'abductors',
        label: 'Selangkangan (Abductors)',
        category: 'Tubuh Bawah',
        parts: ['Abductors (L)', 'Abductors (R)'],
    },
    {
        id: 'knees',
        label: 'Lutut (Knees)',
        category: 'Tubuh Bawah',
        parts: ['Knees (L)', 'Knees (R)'],
    },
    {
        id: 'calves',
        label: 'Betis (Calves)',
        category: 'Tubuh Bawah',
        parts: ['Calves (L)', 'Calves (R)'],
    },
    {
        id: 'ankles',
        label: 'Pergelangan Kaki (Ankles)',
        category: 'Tubuh Bawah',
        parts: ['Ankles (L)', 'Ankles (R)'],
    },
    {
        id: 'neck',
        label: 'Leher & Kepala (Neck & Head)',
        category: 'Lainnya',
        parts: ['Neck (L)', 'Neck (R)', 'Neck', 'Head'],
    },
];

export default function BodyPartSelector({
    value = [],
    onChange,
    label = 'Target Bagian Tubuh / Otot',
    description = 'Pilih bagian tubuh atau kelompok otot yang dilatih pada gerakan ini.',
}) {
    const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'presets'
    const selected = Array.isArray(value) ? value : [];

    const handleTogglePart = (partName) => {
        if (!partName) return;
        let newSelected;
        if (selected.includes(partName)) {
            newSelected = selected.filter((p) => p !== partName);
        } else {
            newSelected = [...selected, partName];
        }
        onChange(newSelected);
    };

    const handleToggleGroup = (group) => {
        const allIncluded = group.parts.every((p) => selected.includes(p));
        let newSelected;
        if (allIncluded) {
            // Remove all
            newSelected = selected.filter((p) => !group.parts.includes(p));
        } else {
            // Add missing
            const toAdd = group.parts.filter((p) => !selected.includes(p));
            newSelected = [...selected, ...toAdd];
        }
        onChange(newSelected);
    };

    const handleClearAll = () => {
        onChange([]);
    };

    return (
        <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/90 shadow-2xs">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200/70">
                <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Layers size={14} className="text-orange-500" />
                        <span>{label}</span>
                        {selected.length > 0 && (
                            <span className="px-1.5 py-0.2 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">
                                {selected.length} terpilih
                            </span>
                        )}
                    </h4>
                    {description && (
                        <p className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                            {description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {/* Mode Toggle */}
                    <div className="flex items-center bg-white p-0.5 rounded-md border border-slate-200 shadow-2xs text-[11px] font-bold">
                        <button
                            type="button"
                            onClick={() => setViewMode('visual')}
                            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                                viewMode === 'visual'
                                    ? 'bg-orange-500 text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Model Visual
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('presets')}
                            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                                viewMode === 'presets'
                                    ? 'bg-orange-500 text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Grup Otot
                        </button>
                    </div>

                    {selected.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[10.5px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded border border-rose-200/60 transition-colors cursor-pointer"
                            title="Bersihkan semua pilihan"
                        >
                            <Trash2 size={11} />
                            <span>Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Visual Anatomical View */}
            {viewMode === 'visual' && (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3 rounded-lg border border-slate-200/80">
                        {/* Anterior (Tampak Depan) */}
                        <div className="flex flex-col items-center">
                            <span className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Tampak Depan (Anterior)
                            </span>
                            <div className="w-full max-w-[200px] h-[340px] flex items-center justify-center p-2 rounded-lg bg-slate-50/50 border border-slate-100">
                                <BodyHighlighter
                                    type="anterior"
                                    selectedAreas={selected}
                                    onSelectArea={handleTogglePart}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium mt-1 text-center">
                                Klik pada otot untuk memilih / membatalkan
                            </p>
                        </div>

                        {/* Posterior (Tampak Belakang) */}
                        <div className="flex flex-col items-center">
                            <span className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Tampak Belakang (Posterior)
                            </span>
                            <div className="w-full max-w-[200px] h-[340px] flex items-center justify-center p-2 rounded-lg bg-slate-50/50 border border-slate-100">
                                <BodyHighlighter
                                    type="posterior"
                                    selectedAreas={selected}
                                    onSelectArea={handleTogglePart}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium mt-1 text-center">
                                Klik pada otot untuk memilih / membatalkan
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Muscle Group Quick Preset Buttons */}
            {viewMode === 'presets' && (
                <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 space-y-3">
                    {['Tubuh Atas', 'Lengan', 'Core', 'Punggung', 'Tubuh Bawah', 'Lainnya'].map((cat) => {
                        const groupsInCat = MUSCLE_GROUPS.filter((g) => g.category === cat);
                        if (groupsInCat.length === 0) return null;

                        return (
                            <div key={cat} className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {cat}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {groupsInCat.map((group) => {
                                        const countIncluded = group.parts.filter((p) => selected.includes(p)).length;
                                        const isAll = countIncluded === group.parts.length;
                                        const isPartial = countIncluded > 0 && !isAll;

                                        return (
                                            <button
                                                key={group.id}
                                                type="button"
                                                onClick={() => handleToggleGroup(group)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                                                    isAll
                                                        ? 'bg-orange-500 text-white border-orange-500 shadow-2xs font-bold'
                                                        : isPartial
                                                        ? 'bg-orange-50 text-orange-700 border-orange-300 font-bold'
                                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                                }`}
                                            >
                                                <span>{group.label}</span>
                                                {isAll && <CheckCircle2 size={11} className="shrink-0" />}
                                                {isPartial && (
                                                    <span className="text-[9px] bg-orange-200/80 px-1 py-0.2 rounded font-bold">
                                                        {countIncluded}/{group.parts.length}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Selected Badges Bar */}
            {selected.length > 0 ? (
                <div className="pt-2 border-t border-slate-200/70">
                    <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Otot Terpilih:
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {selected.map((part) => (
                            <span
                                key={part}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-800 border border-orange-200 rounded-md text-[10.5px] font-bold"
                            >
                                <span>{part}</span>
                                <button
                                    type="button"
                                    onClick={() => handleTogglePart(part)}
                                    className="text-orange-500 hover:text-orange-800 p-0.5 rounded cursor-pointer"
                                    title="Hapus"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-[10.5px] text-slate-400 font-medium italic pt-1">
                    Belum ada bagian tubuh yang dipilih. Klik pada gambar anatomi tubuh atau pilih grup otot di atas.
                </div>
            )}
        </div>
    );
}
