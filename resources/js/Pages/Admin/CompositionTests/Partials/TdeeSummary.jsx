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
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-slate-200 bg-slate-50/50 gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md">
                        <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Target Kalori & Makro</h3>
                        <p className="text-xs text-slate-500">Estimasi Katch-McArdle</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
                    {['maintenance', 'cutting', 'bulking'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 sm:flex-none px-4 py-1.5 text-[11px] font-bold capitalize rounded-md transition-all ${
                                activeTab === tab 
                                ? 'bg-white text-orange-600 shadow-sm border border-slate-200/50' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                
                {/* Left Side: Summary & Table */}
                <div className="md:col-span-5 p-4 sm:p-5 flex flex-col h-full bg-slate-50/30">
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Harian</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-900">{goalCalories.toLocaleString()}</span>
                                <span className="text-xs font-semibold text-slate-500">kkal</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Mingguan</div>
                            <div className="text-sm font-bold text-slate-700">{(goalCalories * 7).toLocaleString()} kkal</div>
                        </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                        Estimasi Berdasarkan Aktivitas
                    </div>
                    
                    <div className="flex-1 space-y-0.5">
                        {ACTIVITY_MULTIPLIERS.map((act, idx) => {
                            const baseMaintenance = Math.round(bmr * act.value);
                            let cals = baseMaintenance;
                            if (act.label !== 'Tingkat Metabolisme Basal (BMR)') {
                                if (activeTab === 'cutting') cals -= 500;
                                if (activeTab === 'bulking') cals += 500;
                            }
                            return (
                                <div key={idx} className="flex justify-between items-center py-2 px-2.5 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                                    <span className="text-[11px] font-medium text-slate-600">{act.label}</span>
                                    <span className="text-xs font-bold text-slate-900">{cals.toLocaleString()}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Macros */}
                <div className="md:col-span-7 p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Utensils className="w-3.5 h-3.5 text-orange-500" />
                        <h4 className="text-xs font-bold text-slate-900">Distribusi Makronutrisi <span className="text-slate-500 font-normal ml-1">({activeTab})</span></h4>
                    </div>

                    <div className="space-y-3">
                        {MACRO_SPLITS.map((split, idx) => {
                            const macros = calculateMacros(goalCalories, split.ratios);
                            return (
                                <div key={idx} className="border border-slate-200 rounded-lg p-3 hover:border-orange-200 transition-colors bg-white">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-900">{split.name}</span>
                                            <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">{split.desc}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-slate-50 rounded border border-slate-100 p-2 text-center">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Protein</div>
                                            <div className="text-sm font-bold text-slate-800">{macros.protein}<span className="text-[10px] text-slate-500 ml-0.5">g</span></div>
                                        </div>
                                        <div className="bg-slate-50 rounded border border-slate-100 p-2 text-center">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Lemak</div>
                                            <div className="text-sm font-bold text-slate-800">{macros.fats}<span className="text-[10px] text-slate-500 ml-0.5">g</span></div>
                                        </div>
                                        <div className="bg-slate-50 rounded border border-slate-100 p-2 text-center">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Karbo</div>
                                            <div className="text-sm font-bold text-slate-800">{macros.carbs}<span className="text-[10px] text-slate-500 ml-0.5">g</span></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
