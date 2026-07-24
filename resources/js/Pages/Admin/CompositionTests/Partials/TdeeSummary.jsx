import React, { useState, useMemo } from 'react';
import { Info, Calculator, Utensils, ArrowRight } from 'lucide-react';

const ACTIVITY_MULTIPLIERS = [
    { label: 'Tingkat Metabolisme Basal (BMR)', value: 1 },
    { label: 'Tidak Aktif (Sedentary)', value: 1.2 },
    { label: 'Olahraga Ringan', value: 1.375 },
    { label: 'Olahraga Sedang', value: 1.55 },
    { label: 'Olahraga Berat', value: 1.725 },
    { label: 'Atlet (Sangat Aktif)', value: 1.9 },
];

const MACRO_SPLITS = [
    { name: 'Karbo Sedang (Moderate)', ratios: [0.30, 0.35, 0.35], desc: '30/35/35' },
    { name: 'Karbo Rendah (Lower)', ratios: [0.40, 0.40, 0.20], desc: '40/40/20' },
    { name: 'Karbo Tinggi (Higher)', ratios: [0.30, 0.20, 0.50], desc: '30/20/50' },
];

export default function TdeeSummary({ test }) {
    const [activeTab, setActiveTab] = useState('maintenance'); // 'maintenance' | 'cutting' | 'bulking'

    const analysis = useMemo(() => {
        if (!test || !test.bmr) return null;
        const bmr = parseFloat(test.bmr) || 0;
        const activityLevel = parseFloat(test.activity_level) || 1.2;
        const maintenance = Math.round(bmr * activityLevel);

        return { bmr, maintenance, activityLevel };
    }, [test]);

    if (!analysis) return null;

    const { bmr, maintenance } = analysis;
    const maintenanceWeekly = maintenance * 7;

    const getGoalCalories = (goal) => {
        if (goal === 'cutting') return maintenance - 500;
        if (goal === 'bulking') return maintenance + 500;
        return maintenance;
    };

    const goalCalories = getGoalCalories(activeTab);

    const getGoalDescription = (goal) => {
        if (goal === 'cutting') return `(-500 kkal dari batas harian)`;
        if (goal === 'bulking') return `(+500 kkal dari batas harian)`;
        return `(kalori harian normal)`;
    };

    const calculateMacros = (cals, ratios) => {
        const [pRatio, fRatio, cRatio] = ratios;
        return {
            protein: Math.round((cals * pRatio) / 4),
            fats: Math.round((cals * fRatio) / 9),
            carbs: Math.round((cals * cRatio) / 4),
        };
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Summary & Table */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300">
                        <h3 className="text-zinc-500 font-bold capitalize text-sm mb-4">Target Kalori {activeTab}</h3>
                        
                        <div className="flex items-baseline justify-center gap-2 mb-2">
                            <span className="text-4xl font-black text-zinc-900 tracking-tight">{goalCalories.toLocaleString()}</span>
                        </div>
                        <span className="text-zinc-500 font-semibold mb-6">kalori per hari</span>
                        
                        <div className="flex items-center gap-2 text-zinc-900 font-bold text-xl mb-1">
                            {(goalCalories * 7).toLocaleString()} 
                        </div>
                        <span className="text-zinc-500 font-medium text-sm">kalori per minggu</span>
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
                        <div className="flex items-center gap-2 mb-3">
                            <Info className="w-5 h-5 text-blue-500" />
                            <h4 className="font-bold text-zinc-900">Estimasi Katch-McArdle</h4>
                        </div>
                        <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                            Berdasarkan data Anda, estimasi terbaik untuk target kalori {activeTab} Anda adalah <span className="font-bold text-zinc-900">{goalCalories.toLocaleString()} kalori</span> per hari. Tabel di bawah menunjukkan target harian jika tingkat aktivitas Anda berbeda.
                        </p>

                        <div className="space-y-2">
                            {ACTIVITY_MULTIPLIERS.map((act, idx) => {
                                const baseMaintenance = Math.round(bmr * act.value);
                                let cals = baseMaintenance;
                                if (act.label !== 'Tingkat Metabolisme Basal (BMR)') {
                                    if (activeTab === 'cutting') cals -= 500;
                                    if (activeTab === 'bulking') cals += 500;
                                }
                                return (
                                    <div key={idx} className="flex justify-between items-center py-2.5 border-b border-zinc-200/60 last:border-0 transition-colors">
                                        <span className="text-sm font-semibold text-zinc-700">{act.label}</span>
                                        <span className="text-sm font-bold text-zinc-900">{cals.toLocaleString()} <span className="text-zinc-400 font-normal text-xs">kkal/hari</span></span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Side: Macros & Goals */}
                <div className="lg:col-span-7">
                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                        
                        {/* Tabs */}
                        <div className="flex border-b border-zinc-200">
                            {['maintenance', 'cutting', 'bulking'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-4 text-sm font-bold capitalize transition-colors relative ${
                                        activeTab === tab 
                                        ? 'text-blue-600 bg-blue-50/50' 
                                        : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-zinc-900 mb-2 capitalize flex items-center gap-2">
                                    <Utensils className="w-5 h-5 text-zinc-400" />
                                    Makronutrisi ({activeTab})
                                </h3>
                                <p className="text-zinc-600 text-sm leading-relaxed">
                                    <span className="font-semibold text-zinc-800">30/35/35</span> berarti 30% Protein, 35% Lemak, 35% Karbohidrat. Nilai ini dihitung berdasarkan target kalori {activeTab} Anda sebesar <span className="font-bold text-zinc-900">{goalCalories.toLocaleString()}</span> per hari <span className="text-zinc-500">{getGoalDescription(activeTab)}</span>.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {MACRO_SPLITS.map((split, idx) => {
                                    const macros = calculateMacros(goalCalories, split.ratios);
                                    return (
                                        <div key={idx} className="bg-zinc-50 rounded-xl p-5 border border-zinc-200/70">
                                            <h4 className="font-bold text-zinc-900 mb-4">{split.name} <span className="text-zinc-500 font-medium text-sm ml-1">({split.desc})</span></h4>
                                            
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-zinc-500 capitalize mb-1">Protein</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xl font-black text-blue-600">{macros.protein}</span>
                                                        <span className="text-sm font-bold text-zinc-400">g</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-zinc-500 capitalize mb-1">Lemak</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xl font-black text-amber-500">{macros.fats}</span>
                                                        <span className="text-sm font-bold text-zinc-400">g</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-zinc-500 capitalize mb-1">Karbohidrat</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xl font-black text-emerald-500">{macros.carbs}</span>
                                                        <span className="text-sm font-bold text-zinc-400">g</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
