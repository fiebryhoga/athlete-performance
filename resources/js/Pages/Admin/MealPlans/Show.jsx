import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { ChevronLeft, Flame, Sparkles, Save, Trash2, Droplets, Target, RefreshCw, FileText, CheckCircle2, Info, Activity } from 'lucide-react';
import ProfileHeader from '../CompositionTests/Partials/ProfileHeader';
import { generateWeeklyMealPlan, rerollMeal, rerollMealItem } from '@/Utils/MealGenerator';

export default function Show({ player, history, latestTest }) {
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === 'athlete';

    const [draftPlan, setDraftPlan] = useState(null);
    const activePlan = history.length > 0 ? history[0] : null;

    const [selectedGoal, setSelectedGoal] = useState('maintenance');
    const [startDate, setStartDate] = useState('');
    const [dailySplits, setDailySplits] = useState(Array(7).fill('Moderate Carb'));
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => { setStartDate(new Date().toISOString().split('T')[0]); }, []);

    const DIET_OPTIONS = [
        { label: 'Moderate', value: 'Moderate Carb' },
        { label: 'Lower', value: 'Lower Carb' },
        { label: 'Higher', value: 'Higher Carb' },
    ];

    const getWeekDays = () => {
        if (!startDate) return [];
        const days = [], start = new Date(startDate);
        const names = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        for (let i = 0; i < 7; i++) {
            const c = new Date(start); c.setDate(start.getDate() + i);
            days.push({ index: i, date: c.toISOString().split('T')[0], label: `${names[c.getDay()]}, ${c.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}` });
        }
        return days;
    };
    const weekDays = getWeekDays();

    const getTargetCalories = () => {
        if (!latestTest) return 0;
        const m = Math.round((parseFloat(latestTest.bmr) || 0) * (parseFloat(latestTest.activity_level) || 1.2));
        if (selectedGoal === 'cutting') return m - 500;
        if (selectedGoal === 'bulking') return m + 500;
        return m;
    };
    const targetCalories = getTargetCalories();

    const handleSplitChange = (i, v) => { const s = [...dailySplits]; s[i] = v; setDailySplits(s); };

    const handleGenerate = () => {
        if (!latestTest) return alert('Atlet belum memiliki data Komposisi Tubuh.');
        const splits = dailySplits.map((split, i) => ({ date: weekDays[i]?.date, label: weekDays[i]?.label, split }));
        const weekly = generateWeeklyMealPlan(targetCalories, splits, selectedGoal);
        setDraftPlan({
            recommendation: selectedGoal, target_calories: targetCalories, weekly_meal_plan: weekly,
            macro_plan: {
                protein: { grams: Math.round((targetCalories * 0.30) / 4) },
                carbs: { grams: Math.round((targetCalories * 0.35) / 4) },
                fats: { grams: Math.round((targetCalories * 0.35) / 9) },
            },
            overall_assessment: `Rencana makan 7 hari untuk program ${selectedGoal} — target ${targetCalories} kcal/hari.`,
            hydration: {
                daily_water_liters: Math.round((parseFloat(latestTest.weight) || 70) * 0.04 * 10) / 10,
                pre_training: '500ml air, 2 jam sebelum latihan',
                during_training: '200ml setiap 15–20 menit',
                post_training: 'Ganti 150% cairan yang hilang',
            },
        });
        setActiveTab(0);
    };

    const handleRerollMeal = (dayIdx, mealIdx) => {
        setDraftPlan(prev => {
            const p = { ...prev }, w = [...p.weekly_meal_plan];
            const d = { ...w[dayIdx], meals: [...w[dayIdx].meals] };
            d.meals[mealIdx] = rerollMeal(d.meals[mealIdx]);
            w[dayIdx] = d; p.weekly_meal_plan = w;
            return p;
        });
    };

    const handleRerollItem = (dayIdx, mealIdx, itemIdx) => {
        setDraftPlan(prev => {
            const p = { ...prev }, w = [...p.weekly_meal_plan];
            const d = { ...w[dayIdx], meals: [...w[dayIdx].meals] };
            d.meals[mealIdx] = rerollMealItem(d.meals[mealIdx], itemIdx);
            w[dayIdx] = d; p.weekly_meal_plan = w;
            return p;
        });
    };

    const handleSavePlan = () => {
        if (!draftPlan) return;
        const clean = draftPlan.weekly_meal_plan.map(day => ({
            day: day.day, date: day.date, splitType: day.splitType,
            meals: day.meals.map(m => ({
                time: m.time, type: m.type, menu: m.menu, protein: m.protein, carbs: m.carbs, fats: m.fats, calories: m.calories,
                items: m.items?.map(i => ({ name: i.displayName || i.name, scaledPortion: i.scaledPortion, protein: i.protein, carbs: i.carbs, fats: i.fats, calories: i.calories })),
            })),
        }));
        router.post(route('admin.meal-plans.store'), {
            user_id: player.id, recommendation: draftPlan.recommendation, target_calories: draftPlan.target_calories,
            protein_target: draftPlan.macro_plan?.protein?.grams || 0, carbs_target: draftPlan.macro_plan?.carbs?.grams || 0, fats_target: draftPlan.macro_plan?.fats?.grams || 0,
            weekly_plan: clean, hydration_plan: draftPlan.hydration, supplements_plan: [], notes: draftPlan.overall_assessment, warnings: '',
        }, { onSuccess: () => setDraftPlan(null) });
    };

    const handleDelete = (id) => { if (confirm('Yakin ingin menghapus rencana makan ini?')) router.delete(route('admin.meal-plans.destroy', id)); };

    const planToDisplay = draftPlan || activePlan;
    const isDraft = !!draftPlan;

    const weeklyStats = useMemo(() => {
        if (!planToDisplay) return null;
        const days = planToDisplay.weekly_plan || planToDisplay.weekly_meal_plan || [];
        let cal = 0, p = 0, c = 0, f = 0;
        const perDay = days.map(day => {
            const d = { calories: 0, protein: 0, carbs: 0, fats: 0 };
            (day.meals || []).forEach(m => { d.calories += m.calories || 0; d.protein += m.protein || 0; d.carbs += m.carbs || 0; d.fats += m.fats || 0; });
            cal += d.calories; p += d.protein; c += d.carbs; f += d.fats;
            return d;
        });
        return { total: { calories: Math.round(cal), protein: Math.round(p), carbs: Math.round(c), fats: Math.round(f) }, perDay };
    }, [planToDisplay]);

    const weeklyTarget = (planToDisplay?.target_calories || targetCalories) * 7;

    return (
        <AppLayout title={`Rencana Makan ${player.name}`} description="Manajemen rencana makan atlet">
            <Head title={`Rencana Makan - ${player.name}`} />
            
            <div className="pb-24 space-y-8">
                {/* ── Header ── */}
                <div className="flex items-center gap-4">
                    {!isAthlete && (
                        <Link href={route('admin.meal-plans.index')} className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors shadow-sm hover:shadow">
                            <ChevronLeft size={20} />
                        </Link>
                    )}
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Rencana Makan</h1>
                        <p className="text-zinc-500 mt-1 text-sm font-medium">Manajemen nutrisi dan jadwal diet khusus atlet.</p>
                    </div>
                </div>

                <ProfileHeader player={player} />

                {/* ── Configurator ── */}
                {!isAthlete && !draftPlan && (
                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden mt-8">
                        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><UtensilsIcon size={18} /></div>
                                <div>
                                    <h3 className="text-base font-bold text-zinc-900">Meal Plan Generator</h3>
                                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Atur preferensi makro dan hasilkan menu otomatis.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Settings */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                                        <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-3">1. Target Program</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['cutting', 'maintenance', 'bulking'].map(g => (
                                                <button key={g} onClick={() => setSelectedGoal(g)} 
                                                    className={`py-2.5 px-2 rounded-xl text-[13px] font-bold transition-all border ${selectedGoal === g ? 'bg-white border-orange-500 text-orange-600 shadow-sm ring-1 ring-orange-500' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}>
                                                    <span className="capitalize">{g}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-3">2. Tanggal Mulai</label>
                                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} 
                                                className="w-full bg-white border border-zinc-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-700 transition-colors shadow-sm" />
                                        </div>
                                        <div className="w-36 shrink-0 bg-zinc-900 text-white rounded-xl flex flex-col items-center justify-center p-3 shadow-md">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Target Kalori</p>
                                            <p className="text-xl font-black text-orange-400">{targetCalories}</p>
                                            <p className="text-[9px] font-medium text-zinc-400 mb-2">kcal/hari</p>
                                            <div className="w-full h-px bg-zinc-800 mb-2"></div>
                                            <p className="text-sm font-bold text-white">{(targetCalories * 7).toLocaleString()}</p>
                                            <p className="text-[9px] font-medium text-zinc-500 mt-0.5">kcal/minggu</p>
                                        </div>
                                    </div>
                                    
                                    {!latestTest && (
                                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                                            <Info className="text-red-500 shrink-0 mt-0.5" size={18} />
                                            <p className="text-sm font-medium text-red-700">Atlet belum memiliki data Komposisi Tubuh. Anda harus melakukan tes terlebih dahulu untuk mengkalkulasi BMR dan TDEE.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Dist */}
                                <div className="lg:col-span-7 flex flex-col">
                                    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex-1 flex flex-col">
                                        <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4">3. Distribusi Nutrisi (7 Hari)</label>
                                        {startDate ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
                                                {weekDays.map((day, idx) => (
                                                    <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col items-center text-center shadow-sm">
                                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{day.label.split(',')[1]}</p>
                                                        <p className="text-[13px] font-black text-zinc-800 mt-0.5 mb-3">{day.label.split(',')[0]}</p>
                                                        <select value={dailySplits[idx]} onChange={e => handleSplitChange(idx, e.target.value)} 
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-bold text-zinc-700 py-1.5 px-1 text-center cursor-pointer focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                                                            {DIET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex-1 border border-dashed border-zinc-300 rounded-xl flex items-center justify-center bg-white">
                                                <p className="text-sm text-zinc-400 font-medium">Pilih tanggal mulai di sebelah kiri.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6">
                                        <button onClick={handleGenerate} disabled={!latestTest || !startDate} 
                                            className="w-full px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                                            <Target size={18} />
                                            Buat Rencana Makan Otomatis
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Plan Display ── */}
                {planToDisplay ? (
                    <div className="space-y-6">
                        
                        {/* Draft Banner */}
                        {isDraft && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg text-white">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg mt-1"><Info size={20} /></div>
                                    <div>
                                        <h3 className="text-base font-bold text-white flex items-center gap-2">Draft Rencana Makan <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-500 text-white uppercase tracking-wider">Unsaved</span></h3>
                                        <p className="text-sm font-medium text-zinc-400 mt-1">Periksa jadwal di bawah. Anda bisa me-reroll (↻) bahan spesifik sebelum menyimpannya.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto shrink-0">
                                    <button onClick={() => setDraftPlan(null)} className="flex-1 md:flex-none px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition-all text-sm">Batal</button>
                                    <button onClick={handleSavePlan} className="flex-1 md:flex-none px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"><Save size={16} /> Simpan Permanen</button>
                                </div>
                            </div>
                        )}

                        {/* Top Summaries */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-center shadow-sm text-center">
                                <h3 className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest mb-2">Target Kalori</h3>
                                <p className="text-2xl font-black text-zinc-900">{planToDisplay.target_calories || '-'}</p>
                                <p className="text-zinc-400 font-medium text-[10px]">kcal/hari</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-center shadow-sm text-center">
                                <h3 className="text-orange-500 font-bold text-[11px] uppercase tracking-widest mb-2">Protein</h3>
                                <p className="text-2xl font-black text-zinc-900">{planToDisplay.protein_target || planToDisplay.macro_plan?.protein?.grams || '-'}</p>
                                <p className="text-zinc-400 font-medium text-[10px]">g/hari</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-center shadow-sm text-center">
                                <h3 className="text-emerald-500 font-bold text-[11px] uppercase tracking-widest mb-2">Karbohidrat</h3>
                                <p className="text-2xl font-black text-zinc-900">{planToDisplay.carbs_target || planToDisplay.macro_plan?.carbs?.grams || '-'}</p>
                                <p className="text-zinc-400 font-medium text-[10px]">g/hari</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-center shadow-sm text-center">
                                <h3 className="text-amber-500 font-bold text-[11px] uppercase tracking-widest mb-2">Lemak</h3>
                                <p className="text-2xl font-black text-zinc-900">{planToDisplay.fats_target || planToDisplay.macro_plan?.fats?.grams || '-'}</p>
                                <p className="text-zinc-400 font-medium text-[10px]">g/hari</p>
                            </div>
                            <div className={`rounded-2xl border p-5 flex flex-col justify-center shadow-sm text-center ${weeklyStats?.total.calories <= weeklyTarget ? 'bg-zinc-50 border-zinc-200' : 'bg-red-50 border-red-200'}`}>
                                <h3 className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">Total Mingguan {weeklyStats?.total.calories <= weeklyTarget ? <CheckCircle2 size={12} className="text-zinc-400" /> : null}</h3>
                                <p className={`text-2xl font-black ${weeklyStats?.total.calories <= weeklyTarget ? 'text-zinc-900' : 'text-red-600'}`}>
                                    {weeklyStats?.total.calories.toLocaleString()}
                                </p>
                                <p className="text-zinc-400 font-medium text-[10px]">dari {weeklyTarget.toLocaleString()} kcal</p>
                            </div>
                        </div>

                        {/* Schedule Tabs */}
                        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="flex overflow-x-auto border-b border-zinc-200 hide-scrollbar bg-zinc-50/50">
                                {(planToDisplay.weekly_plan || planToDisplay.weekly_meal_plan || []).map((day, idx) => (
                                    <button key={idx} onClick={() => setActiveTab(idx)} 
                                        className={`flex-1 min-w-[120px] px-3 py-3.5 text-center border-b-[3px] transition-all ${activeTab === idx ? 'border-orange-500 bg-white' : 'border-transparent hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900'}`}>
                                        <p className={`text-[13px] font-bold ${activeTab === idx ? 'text-orange-600' : ''}`}>{day.day}</p>
                                        <p className="text-[10px] font-medium text-zinc-400 mt-0.5">{day.date}</p>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Tab Content */}
                            <div className="p-6 md:p-8 bg-white">
                                {(() => {
                                    const day = (planToDisplay.weekly_plan || planToDisplay.weekly_meal_plan || [])[activeTab];
                                    if (!day) return null;
                                    const dayTotals = weeklyStats?.perDay?.[activeTab];
                                    return (
                                        <div className="animate-in fade-in duration-300">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                                <div>
                                                    <h3 className="text-xl font-black text-zinc-900">{day.day}, <span className="text-zinc-400 font-semibold">{day.date}</span></h3>
                                                    {day.splitType && <span className="inline-block mt-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded">{day.splitType}</span>}
                                                </div>
                                                {dayTotals && (
                                                    <div className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center gap-2">
                                                        <span className="text-sm font-black text-zinc-900">{Math.round(dayTotals.calories).toLocaleString()} <span className="text-zinc-500 font-medium text-xs">kcal</span></span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                {day.meals.map((meal, mealIdx) => (
                                                    <div key={mealIdx} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 transition-all group flex flex-col md:flex-row gap-6 relative">
                                                        <div className="w-full md:w-32 shrink-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-zinc-200/70 md:pr-6">
                                                            <span className="block text-xl font-black text-zinc-900">{meal.time}</span>
                                                            <span className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{meal.type}</span>
                                                            <div className="mt-3 md:mt-4">
                                                                <span className="inline-block px-2 py-1 bg-white border border-zinc-200 text-zinc-700 rounded-md text-[11px] font-bold">
                                                                    {meal.calories} kcal
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex-1 min-w-0">
                                                            {meal.items && meal.items.length > 0 ? (
                                                                <div className="space-y-3">
                                                                    {meal.items.map((item, iIdx) => (
                                                                        <div key={iIdx} className="flex items-center justify-between gap-4 group/item">
                                                                            <div className="flex-1 min-w-0 flex items-center gap-3">
                                                                                <span className="text-[14px] text-zinc-900 font-semibold truncate">{item.displayName || item.name}</span>
                                                                                {isDraft && (
                                                                                    <button onClick={() => handleRerollItem(activeTab, mealIdx, iIdx)} title="Ganti bahan ini" 
                                                                                        className="opacity-0 group-hover/item:opacity-100 text-zinc-400 hover:text-orange-500 hover:bg-orange-50 rounded-md p-1 transition-all shrink-0">
                                                                                        <RefreshCw size={14} strokeWidth={2.5} />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                            <div className="border-b border-dashed border-zinc-300 flex-1 min-w-[20px]" />
                                                                            <span className="text-[12px] text-zinc-600 font-bold shrink-0 tabular-nums">{item.scaledPortion}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-[14px] text-zinc-900 font-semibold">{meal.menu}</p>
                                                            )}
                                                            <div className="mt-5 pt-4 border-t border-zinc-200/60 flex items-center gap-4 text-[11px] font-bold text-zinc-500">
                                                                <span><span className="text-orange-500 mr-1">•</span>P {meal.protein}g</span>
                                                                <span><span className="text-emerald-500 mr-1">•</span>C {meal.carbs}g</span>
                                                                <span><span className="text-amber-500 mr-1">•</span>F {meal.fats}g</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {isDraft && (
                                                            <div className="absolute top-4 right-4">
                                                                <button onClick={() => handleRerollMeal(activeTab, mealIdx)} title="Reroll set menu lengkap"
                                                                    className="w-8 h-8 rounded-lg bg-white border border-zinc-200 text-zinc-400 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100">
                                                                    <RefreshCw size={14} strokeWidth={2.5} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                        
                        {/* Notes Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                                <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Target size={14} /> Objektif Program</h4>
                                <p className="text-sm text-zinc-700 font-medium leading-relaxed">{planToDisplay.notes || planToDisplay.overall_assessment}</p>
                            </div>
                            
                            {(planToDisplay.hydration_plan || planToDisplay.hydration) && (
                                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                                    <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Droplets size={14} className="text-orange-500"/> Panduan Hidrasi &middot; {((planToDisplay.hydration_plan || planToDisplay.hydration).daily_water_liters)} L/hari</h4>
                                    <div className="space-y-2">
                                        {[((planToDisplay.hydration_plan || planToDisplay.hydration).pre_training), ((planToDisplay.hydration_plan || planToDisplay.hydration).during_training), ((planToDisplay.hydration_plan || planToDisplay.hydration).post_training)].filter(Boolean).map((t, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-zinc-600 font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {!isAthlete && activePlan && !isDraft && (
                            <div className="pt-4 pb-12 flex justify-center">
                                <button onClick={() => handleDelete(activePlan.id)} className="py-2.5 px-4 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-bold flex items-center justify-center gap-2 rounded-xl transition-all">
                                    <Trash2 size={14} /> Hapus Rencana Makan Ini
                                </button>
                            </div>
                        )}
                        
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-zinc-200 py-24 flex flex-col items-center justify-center shadow-sm mt-8">
                        <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center mb-6">
                            <Activity className="text-zinc-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900">Belum Ada Rencana Makan</h3>
                        <p className="text-zinc-500 mt-2 max-w-sm text-center text-sm font-medium">
                            {isAthlete 
                                ? 'Anda belum memiliki jadwal rencana makan. Silakan tunggu pelatih Anda.' 
                                : 'Gunakan generator di atas untuk menciptakan menu secara otomatis.'}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

// Minimal icon to replace standard Utensils if needed
function UtensilsIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
    )
}
