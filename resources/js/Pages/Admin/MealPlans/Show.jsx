import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { ChevronLeft, Flame, Sparkles, Save, Trash2, Droplets, Target, RefreshCw, FileText, X, CheckCircle2 } from 'lucide-react';
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

    useEffect(() => { setStartDate(new Date().toISOString().split('T')[0]); }, []);

    const DIET_OPTIONS = [
        { label: 'Moderate Carb (30/35/35)', value: 'Moderate Carb' },
        { label: 'Lower Carb (40/40/20)', value: 'Lower Carb' },
        { label: 'Higher Carb (30/20/50)', value: 'Higher Carb' },
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

    // Calculate weekly totals for the displayed plan
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
            <div className="pb-12 space-y-6">

                {/* ── Header ── */}
                <div className="flex items-center gap-4">
                    {!isAthlete && (
                        <Link href={route('admin.meal-plans.index')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-orange-500 transition-colors shadow-sm">
                            <ChevronLeft size={20} />
                        </Link>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Flame className="text-orange-500" size={24} /> Rencana Makan</h1>
                        <p className="text-slate-500 text-sm mt-1">Manajemen nutrisi dan diet untuk atlet.</p>
                    </div>
                </div>

                <ProfileHeader player={player} />

                {/* ── Configurator ── */}
                {!isAthlete && !draftPlan && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-orange-50/80 to-transparent">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Sparkles className="text-orange-500" size={18} /> Meal Plan Generator</h3>
                            <p className="text-sm text-slate-500 mt-1">Atur preferensi dan generate menu 7 hari secara otomatis.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Program</label>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        {['cutting', 'maintenance', 'bulking'].map(g => (
                                            <button key={g} onClick={() => setSelectedGoal(g)} className={`flex-1 py-2.5 text-sm font-bold capitalize rounded-lg transition-all ${selectedGoal === g ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}>{g}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Mulai</label>
                                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border-slate-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 text-sm font-medium" />
                                </div>
                            </div>

                            {latestTest ? (
                                <div className="bg-orange-50 text-orange-800 text-sm p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                                    <Target className="w-5 h-5 shrink-0 text-orange-500 mt-0.5" />
                                    <div>Target kalori <strong className="capitalize">{selectedGoal}</strong>: <strong>{(targetCalories * 7).toLocaleString()} kcal/minggu</strong> ({targetCalories.toLocaleString()} kcal/hari).</div>
                                </div>
                            ) : (
                                <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100">Atlet ini belum memiliki data komposisi tubuh.</div>
                            )}

                            {startDate && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3">Distribusi Nutrisi Harian</label>
                                    <div className="space-y-2">
                                        {weekDays.map((day, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/80 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-[11px] font-black shadow-sm shadow-orange-500/20">{idx + 1}</div>
                                                    <p className="text-sm font-semibold text-slate-700">{day.label}</p>
                                                </div>
                                                <select value={dailySplits[idx]} onChange={e => handleSplitChange(idx, e.target.value)} className="border-slate-200 rounded-lg text-sm font-medium focus:border-orange-500 focus:ring-orange-500 w-full sm:w-60">
                                                    {DIET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 flex justify-end">
                                <button onClick={handleGenerate} disabled={!latestTest || !startDate} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2">
                                    <Sparkles size={18} /> Generate Meal Plan
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Draft Banner ── */}
                {isDraft && (
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center"><FileText className="text-orange-600" size={20} /></div>
                            <div>
                                <h3 className="font-bold text-orange-800 flex items-center gap-2">
                                    Draft Rencana Makan
                                    <span className="text-[9px] uppercase font-black bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full tracking-wide">Draft</span>
                                </h3>
                                <p className="text-sm text-orange-700/80 mt-0.5">Klik ↻ pada menu yang kurang cocok untuk alternatif lain.</p>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => setDraftPlan(null)} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-sm"><X size={14} /> Batal</button>
                            <button onClick={handleSavePlan} className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 text-sm"><Save size={16} /> Terapkan</button>
                        </div>
                    </div>
                )}

                {/* ── Plan Display ── */}
                {planToDisplay ? (
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="xl:col-span-1 space-y-4">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ringkasan</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{planToDisplay.notes || planToDisplay.overall_assessment}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-3 border border-orange-100">
                                        <p className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Kalori</p>
                                        <p className="text-xl font-black text-orange-600 mt-1">{planToDisplay.target_calories || '-'}</p>
                                        <p className="text-[10px] text-orange-400 font-medium">kcal/hari</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 border border-blue-100">
                                        <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">Protein</p>
                                        <p className="text-xl font-black text-blue-600 mt-1">{planToDisplay.protein_target || planToDisplay.macro_plan?.protein?.grams || '-'}</p>
                                        <p className="text-[10px] text-blue-400 font-medium">gram/hari</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-3 border border-emerald-100">
                                        <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Karbo</p>
                                        <p className="text-xl font-black text-emerald-600 mt-1">{planToDisplay.carbs_target || planToDisplay.macro_plan?.carbs?.grams || '-'}</p>
                                        <p className="text-[10px] text-emerald-400 font-medium">gram/hari</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-3 border border-amber-100">
                                        <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Lemak</p>
                                        <p className="text-xl font-black text-amber-600 mt-1">{planToDisplay.fats_target || planToDisplay.macro_plan?.fats?.grams || '-'}</p>
                                        <p className="text-[10px] text-amber-400 font-medium">gram/hari</p>
                                    </div>
                                </div>

                                {/* Weekly Total vs Target */}
                                {weeklyStats && (
                                    <div className={`rounded-xl p-3 border ${weeklyStats.total.calories <= weeklyTarget ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Total Mingguan</p>
                                            {weeklyStats.total.calories <= weeklyTarget && <CheckCircle2 size={14} className="text-emerald-500" />}
                                        </div>
                                        <p className={`text-lg font-black ${weeklyStats.total.calories <= weeklyTarget ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {weeklyStats.total.calories.toLocaleString()} <span className="text-xs font-medium text-slate-400">kcal</span>
                                        </p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">
                                            Target: {weeklyTarget.toLocaleString()} kcal
                                            <span className={`ml-1 font-bold ${weeklyStats.total.calories <= weeklyTarget ? 'text-emerald-500' : 'text-red-500'}`}>
                                                ({weeklyStats.total.calories <= weeklyTarget ? '✓ Sesuai' : '✗ Melebihi'})
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {(planToDisplay.hydration_plan || planToDisplay.hydration) && (() => {
                                    const h = planToDisplay.hydration_plan || planToDisplay.hydration;
                                    return (
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Droplets size={12} className="text-blue-400" /> Hidrasi</p>
                                            <p className="text-lg font-black text-blue-500">{h.daily_water_liters} L<span className="text-xs font-medium text-slate-400"> /hari</span></p>
                                            <div className="mt-2 space-y-1">
                                                {[h.pre_training, h.during_training, h.post_training].filter(Boolean).map((t, i) => (
                                                    <p key={i} className="text-[11px] text-slate-500">• {t}</p>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {!isAthlete && activePlan && !isDraft && (
                                <button onClick={() => handleDelete(activePlan.id)} className="w-full py-2.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 font-medium flex items-center justify-center gap-1.5 rounded-xl border border-transparent hover:border-red-100 transition-all">
                                    <Trash2 size={13} /> Hapus Rencana Ini
                                </button>
                            )}
                        </div>

                        {/* ── Weekly Schedule ── */}
                        <div className="xl:col-span-3 space-y-4">
                            <h3 className="text-lg font-bold text-slate-800">Jadwal Makan Mingguan</h3>

                            {(planToDisplay.weekly_plan || planToDisplay.weekly_meal_plan || []).map((day, dayIdx) => {
                                const dayTotals = weeklyStats?.perDay?.[dayIdx];
                                return (
                                    <div key={dayIdx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                                        {/* Day Header */}
                                        <div className="px-5 py-3 bg-gradient-to-r from-orange-50 via-orange-50/40 to-transparent border-b border-slate-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-[11px] font-black shadow-sm shadow-orange-500/30">{dayIdx + 1}</div>
                                                    <span className="text-sm font-bold text-slate-800">{day.day}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {day.splitType && <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full">{day.splitType}</span>}
                                                    {dayTotals && <span className="text-[10px] font-bold text-slate-400">{Math.round(dayTotals.calories)} kcal</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meals */}
                                        <div className="divide-y divide-slate-100/80">
                                            {day.meals.map((meal, mealIdx) => (
                                                <div key={mealIdx} className="flex group hover:bg-orange-50/20 transition-colors">
                                                    <div className="w-[76px] shrink-0 py-4 flex flex-col items-center justify-center border-r border-slate-100/80">
                                                        <span className="text-[11px] font-bold text-slate-700">{meal.time}</span>
                                                        <span className="text-[9px] text-slate-400 mt-0.5 font-medium leading-tight text-center">{meal.type}</span>
                                                    </div>
                                                    <div className="flex-1 py-3.5 px-4 min-w-0">
                                                        {meal.items && meal.items.length > 0 ? (
                                                            <div className="space-y-1.5">
                                                                {meal.items.map((item, iIdx) => (
                                                                    <div key={iIdx} className="flex items-baseline justify-between gap-3 group/item">
                                                                        <span className="text-[13px] text-slate-700 font-medium truncate">{item.displayName || item.name}</span>
                                                                        {isDraft && (
                                                                            <button onClick={() => handleRerollItem(dayIdx, mealIdx, iIdx)} title="Ganti bahan ini" className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-orange-500 transition-all p-0.5 -ml-1.5 -mr-1">
                                                                                <RefreshCw size={12} />
                                                                            </button>
                                                                        )}
                                                                        <div className="border-b border-dotted border-slate-200 flex-1 min-w-[20px] mb-1" />
                                                                        <span className="text-[11px] text-slate-400 font-medium shrink-0 tabular-nums">{item.scaledPortion}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-slate-700 font-medium">{meal.menu}</p>
                                                        )}
                                                        <div className="mt-2.5 pt-2 border-t border-dashed border-slate-100 flex items-center gap-1.5 text-[10px] font-semibold flex-wrap">
                                                            <span className="text-orange-500">{meal.calories} kcal</span>
                                                            <span className="text-slate-200">•</span>
                                                            <span className="text-blue-400">P {meal.protein}g</span>
                                                            <span className="text-slate-200">•</span>
                                                            <span className="text-emerald-400">C {meal.carbs}g</span>
                                                            <span className="text-slate-200">•</span>
                                                            <span className="text-amber-400">F {meal.fats}g</span>
                                                        </div>
                                                    </div>
                                                    {isDraft && (
                                                        <div className="shrink-0 flex items-center pr-3">
                                                            <button onClick={() => handleRerollMeal(dayIdx, mealIdx)} title="Ganti menu"
                                                                className="w-8 h-8 rounded-lg text-slate-300 hover:bg-orange-100 hover:text-orange-500 transition-all flex items-center justify-center">
                                                                <RefreshCw size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-20 flex flex-col items-center justify-center shadow-sm">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4"><Flame className="text-orange-300" size={32} /></div>
                        <h3 className="text-lg font-bold text-slate-800">Belum Ada Rencana Makan</h3>
                        <p className="text-slate-500 mt-1 max-w-sm text-center text-sm">{isAthlete ? 'Tunggu pelatih Anda membuat rencana makan.' : 'Gunakan Generator di atas untuk membuat jadwal khusus.'}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
