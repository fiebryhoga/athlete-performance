import React, { useState, useMemo } from 'react';
import {
    Flame, Utensils, Target, TrendingDown, TrendingUp, Minus,
    Calendar, ChevronDown, ChevronUp, Dumbbell,
    Droplets, Apple, Beef, Wheat, Scale, Zap, ArrowRight,
    CheckCircle2, AlertTriangle, Info, Clock, HeartPulse, Brain, Bone, Activity
} from 'lucide-react';
import { generateBreakfast, generateMainMeal, generateSnack } from '@/Data/IndonesianFoods';

const ACTIVITY_LABELS = {
    1.2: 'Tidak Aktif (Jarang Bergerak)',
    1.375: 'Ringan (Olahraga 1-3x/minggu)',
    1.55: 'Sedang (Olahraga 3-5x/minggu)',
    1.725: 'Berat (Olahraga 6-7x/minggu)',
    1.9: 'Atlet (Latihan 2x/hari)',
};

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function TdeeSummary({ test, player }) {
    const [activeGoal, setActiveGoal] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);
    const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);

    const analysis = useMemo(() => {
        if (!test || !test.activity_level || !test.bmr) return null;

        const weight = parseFloat(test.weight) || 0;
        const height = parseFloat(test.height) || 0;
        const age = parseFloat(test.age) || 0;
        const bf = parseFloat(test.body_fat_percentage) || 0;
        const muscleMass = parseFloat(test.muscle_mass) || 0;
        const bmr = parseFloat(test.bmr) || 0;
        const activityLevel = parseFloat(test.activity_level) || 1.55;
        const tdee = test.tdee || Math.round(bmr * activityLevel);
        const bmi = parseFloat(test.bmi) || 0;
        const isMale = player?.gender === 'male' || player?.gender === 'L' || !player?.gender;

        // === 1. SMART INSIGHTS GENERATION ===
        const insights = [];

        // Body Fat & Muscle
        if (bf > 0) {
            const idealBfMax = isMale ? 15 : 22;
            const obeseBf = isMale ? 25 : 32;
            if (bf >= obeseBf) {
                insights.push({ icon: AlertTriangle, title: 'Risiko Lemak Berlebih', desc: `Persentase lemak tubuh Anda (${bf.toFixed(1)}%) berada pada tingkat bahaya. Ini menurunkan ketangkasan dan menambah beban pada persendian Anda. Fokus pada defisit kalori agresif.`, color: 'red' });
            } else if (bf > idealBfMax) {
                insights.push({ icon: Info, title: 'Lemak Di Atas Standar Atlet', desc: `Persentase lemak (${bf.toFixed(1)}%) masih bisa diturunkan untuk mencapai performa atletik puncak. Targetkan turun 3-5%.`, color: 'amber' });
            } else {
                insights.push({ icon: CheckCircle2, title: 'Lemak Tubuh Sangat Ideal', desc: `Kondisi lemak ${bf.toFixed(1)}% sangat optimal untuk daya ledak (explosiveness) dan kelincahan di lapangan.`, color: 'emerald' });
            }
        }

        if (muscleMass > 0 && weight > 0) {
            const muscleRatio = (muscleMass / weight) * 100;
            const idealMuscleMin = isMale ? 40 : 30;
            if (muscleRatio < idealMuscleMin) {
                insights.push({ icon: Dumbbell, title: 'Massa Otot Kurang', desc: `Rasio otot Anda (${muscleRatio.toFixed(1)}%) tergolong rendah untuk atlet. Risiko cedera lebih tinggi. Wajib tambah porsi protein dan latihan beban.`, color: 'amber' });
            } else {
                insights.push({ icon: CheckCircle2, title: 'Massa Otot Kuat', desc: `Rasio otot (${muscleRatio.toFixed(1)}%) sangat baik. Anda memiliki fondasi tenaga dan perlindungan sendi yang kuat.`, color: 'emerald' });
            }
        }

        // Visceral Fat
        const visceralFat = parseFloat(test.visceral_fat);
        if (visceralFat > 0) {
            if (visceralFat >= 10) {
                insights.push({ icon: HeartPulse, title: 'Bahaya Lemak Visceral', desc: `Level lemak visceral Anda (${visceralFat}) sangat tinggi! Lemak ini menyelimuti organ dalam dan menghambat sirkulasi darah serta memicu inflamasi. Kurangi gula dan karbohidrat sederhana segera!`, color: 'red' });
            } else if (visceralFat > 5) {
                insights.push({ icon: HeartPulse, title: 'Lemak Organ Dalam Normal', desc: `Visceral fat di angka ${visceralFat} masih tergolong aman, tapi perlu dijaga agar tidak naik.`, color: 'emerald' });
            }
        }

        // Hydration (Total Body Water)
        const tbw = parseFloat(test.total_body_water);
        if (tbw > 0 && weight > 0) {
            const waterRatio = (tbw / weight) * 100;
            const minWater = isMale ? 50 : 45;
            if (waterRatio < minWater) {
                insights.push({ icon: Droplets, title: 'Dehidrasi Kronis', desc: `Rasio cairan tubuh Anda hanya ${waterRatio.toFixed(1)}% (Target: >${minWater}%). Ini sangat menurunkan performa, fokus, dan memperlambat pemulihan otot. Segera tingkatkan asupan air dan elektrolit!`, color: 'red' });
            } else {
                insights.push({ icon: CheckCircle2, title: 'Hidrasi Optimal', desc: `Cairan tubuh (${waterRatio.toFixed(1)}%) sangat tercukupi. Sirkulasi oksigen ke otot berjalan dengan lancar.`, color: 'blue' });
            }
        }

        // Metabolic Age vs Chronological Age
        const metAge = parseFloat(test.metabolic_age);
        if (metAge > 0 && age > 0) {
            if (metAge > age + 3) {
                insights.push({ icon: Brain, title: 'Metabolisme Melambat', desc: `Usia sel tubuh Anda (${metAge} tahun) lebih tua dari usia asli Anda (${age} tahun). Tingkatkan aktivitas kardio dan metabolisme tubuh!`, color: 'red' });
            } else if (metAge < age) {
                insights.push({ icon: Zap, title: 'Metabolisme Superior', desc: `Hebat! Usia metabolik Anda (${metAge} tahun) lebih muda dari usia asli. Pembakaran kalori tubuh Anda bekerja sangat efisien.`, color: 'emerald' });
            }
        }

        // Phase Angle (Cellular Health)
        const phaseAngle = parseFloat(test.phase_angle);
        if (phaseAngle > 0) {
            if (phaseAngle < 5.0) {
                insights.push({ icon: Activity, title: 'Kelelahan Sel (Fatigue)', desc: `Phase Angle rendah (${phaseAngle}°). Dinding sel Anda kurang kuat menyerap nutrisi. Ini pertanda kelelahan hebat (overtraining) atau kurang istirahat/nutrisi mikro.`, color: 'red' });
            } else if (phaseAngle >= 7.0) {
                insights.push({ icon: Activity, title: 'Integritas Sel Sangat Baik', desc: `Phase Angle ${phaseAngle}° menandakan kesehatan membran sel yang sangat kuat. Pemulihan Anda berjalan maksimal.`, color: 'emerald' });
            }
        }

        // Bone Mass
        const bone = parseFloat(test.bone_mass);
        if (bone > 0) {
            if (bone < 2.5) {
                insights.push({ icon: Bone, title: 'Kepadatan Tulang Perlu Perhatian', desc: `Massa tulang (${bone}kg) agak rentan. Pastikan asupan Kalsium, Vitamin D3, dan latihan menahan beban (weight-bearing) untuk mencegah cedera tulang.`, color: 'amber' });
            }
        }

        // === RULE-BASED RECOMMENDATION ===
        let recommendation = 'maintenance';
        let score = 0;

        if (bmi >= 25 || bf >= (isMale ? 20 : 28)) recommendation = 'cutting';
        else if (bmi < 18.5) recommendation = 'bulking';
        else if (muscleMass > 0 && (muscleMass / weight * 100) < (isMale ? 40 : 30)) recommendation = 'bulking';

        const getMacros = (cals, goal) => {
            const pPerKg = goal === 'cutting' ? 2.2 : goal === 'bulking' ? 2.0 : 1.8;
            const proteinG = Math.round(weight * pPerKg);
            const proteinCals = proteinG * 4;
            const fatPct = goal === 'cutting' ? 0.30 : goal === 'bulking' ? 0.25 : 0.28;
            const fatCals = Math.round(cals * fatPct);
            const fatG = Math.round(fatCals / 9);
            const carbCals = Math.max(0, cals - proteinCals - fatCals);
            const carbG = Math.round(carbCals / 4);
            return {
                cals,
                protein: { grams: proteinG, cals: proteinCals, pct: Math.round((proteinCals / cals) * 100) },
                fats: { grams: fatG, cals: fatCals, pct: Math.round((fatCals / cals) * 100) },
                carbs: { grams: carbG, cals: carbCals, pct: Math.round((carbCals / cals) * 100) },
                perKgProtein: pPerKg,
            };
        };

        const goals = {
            cutting: {
                label: 'Defisit Kalori (Cutting)', sublabel: '−500 kcal/hari', icon: TrendingDown, color: 'blue',
                macros: getMacros(Math.round(tdee - 500), 'cutting'), weeklyResult: 'Turun ~0.45 kg/minggu',
                description: 'Program defisit kalori terkontrol untuk membakar lemak tubuh tanpa mengorbankan terlalu banyak massa otot. Asupan protein ditingkatkan untuk menjaga otot.'
            },
            maintenance: {
                label: 'Pemeliharaan (Maintenance)', sublabel: 'Sesuai TDEE', icon: Minus, color: 'emerald',
                macros: getMacros(tdee, 'maintenance'), weeklyResult: 'Berat stabil',
                description: 'Mempertahankan berat dan komposisi tubuh saat ini. Sangat ideal diterapkan selama musim kompetisi (In-Season) agar performa tetap maksimal.'
            },
            bulking: {
                label: 'Surplus Kalori (Bulking)', sublabel: '+350 kcal/hari', icon: TrendingUp, color: 'amber',
                macros: getMacros(Math.round(tdee + 350), 'bulking'), weeklyResult: 'Naik ~0.3 kg/minggu',
                description: 'Program surplus kalori ringan (Lean Bulk) untuk membangun massa otot secara bertahap sambil meminimalkan penumpukan lemak berlebih.'
            },
        };

        const waterLiters = Math.round((weight * 0.035 + (activityLevel > 1.55 ? 0.5 : 0)) * 10) / 10;

        const generateWeeklyPlan = (goalMacros) => {
            const { protein, fats, carbs, cals } = goalMacros;
            const baseSeed = test.id || 999;

            return DAYS.map((day, dayIdx) => {
                // Generate 5 base meals deterministically using a seed based on test ID and day index
                const daySeed = baseSeed + (dayIdx * 10);
                const baseMeals = [
                    { type: 'breakfast', label: 'Sarapan', time: '07:00', ...generateBreakfast(daySeed + 1) },
                    { type: 'snack1', label: 'Cemilan Pagi', time: '10:00', ...generateSnack(daySeed + 2) },
                    { type: 'lunch', label: 'Makan Siang', time: '13:00', ...generateMainMeal(daySeed + 3) },
                    { type: 'snack2', label: 'Cemilan Sore', time: '16:00', ...generateSnack(daySeed + 4) },
                    { type: 'dinner', label: 'Makan Malam', time: '19:00', ...generateMainMeal(daySeed + 5) },
                ];

                // Calculate base totals
                const baseTotal = baseMeals.reduce((acc, m) => ({
                    p: acc.p + m.baseProtein,
                    c: acc.c + m.baseCarbs,
                    f: acc.f + m.baseFats
                }), { p: 0, c: 0, f: 0 });

                // Scaling factors to match target macros perfectly
                const pScale = protein.grams / (baseTotal.p || 1);
                const cScale = carbs.grams / (baseTotal.c || 1);
                const fScale = fats.grams / (baseTotal.f || 1);

                const meals = baseMeals.map(m => {
                    const scaledP = Math.round(m.baseProtein * pScale);
                    const scaledC = Math.round(m.baseCarbs * cScale);
                    const scaledF = Math.round(m.baseFats * fScale);
                    const finalCals = Math.round((scaledP * 4) + (scaledC * 4) + (scaledF * 9));
                    const multiplier = finalCals / (m.baseCals || 1);
                    return {
                        ...m,
                        protein: scaledP,
                        carbs: scaledC,
                        fats: scaledF,
                        calories: finalCals,
                        multiplier: multiplier
                    };
                });

                const dayTotal = meals.reduce((acc, m) => ({
                    protein: acc.protein + m.protein,
                    carbs: acc.carbs + m.carbs,
                    fats: acc.fats + m.fats,
                    calories: acc.calories + m.calories
                }), { protein: 0, carbs: 0, fats: 0, calories: 0 });

                return { day, meals, total: dayTotal };
            });
        };

        const mealTimings = [
            { time: '07:00', label: 'Sarapan Pagi', pct: 25 },
            { time: '10:00', label: 'Cemilan Pagi', pct: 10 },
            { time: '13:00', label: 'Makan Siang', pct: 30 },
            { time: '16:00', label: 'Cemilan Sore', pct: 10 },
            { time: '19:00', label: 'Makan Malam', pct: 25 },
        ];

        return { bmr, tdee, tdeeWeekly: tdee * 7, activityLevel, weight, height, age, bf, bmi, recommendation, insights, goals, waterLiters, mealTimings, generateWeeklyPlan };
    }, [test, player]);

    useMemo(() => {
        if (analysis && !activeGoal) setActiveGoal(analysis.recommendation);
    }, [analysis]);

    if (!analysis) return null;

    const currentGoal = analysis.goals[activeGoal || 'maintenance'];
    const weeklyPlan = showWeeklyPlan ? analysis.generateWeeklyPlan(currentGoal.macros) : [];

    const goalColors = {
        cutting: { activeBg: 'bg-blue-600', activeText: 'text-white', badge: 'bg-blue-100 text-blue-700', gradFrom: 'from-blue-600', gradTo: 'to-blue-800' },
        maintenance: { activeBg: 'bg-emerald-600', activeText: 'text-white', badge: 'bg-emerald-100 text-emerald-700', gradFrom: 'from-emerald-600', gradTo: 'to-emerald-800' },
        bulking: { activeBg: 'bg-amber-600', activeText: 'text-white', badge: 'bg-amber-100 text-amber-700', gradFrom: 'from-amber-600', gradTo: 'to-amber-800' },
    };
    const gc = goalColors[activeGoal || 'maintenance'];

    return (
        <div className="space-y-6">
            {/* ===== SECTION: SMART INSIGHTS ===== */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">Smart Insights</h2>
                        <p className="text-xs text-slate-500 font-medium">Analisis cerdas dan deteksi masalah dari seluruh matrik komposisi tubuh</p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.insights.length > 0 ? analysis.insights.map((insight, i) => (
                            <InsightCard key={i} {...insight} />
                        )) : (
                            <div className="col-span-full p-6 text-center text-slate-500 font-medium">
                                Data komposisi tubuh tidak cukup lengkap untuk generate insight (masukkan BIA data yang lebih lengkap).
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== SECTION: HEADER & ASSESSMENT ===== */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">Strategi Diet Utama</h2>
                    </div>
                </div>

                <div className="p-5">
                    <div className={`p-6 rounded-2xl bg-gradient-to-r ${gc.gradFrom} ${gc.gradTo} text-white relative overflow-hidden shadow-sm`}>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-8 -mb-8" />
                        <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Sangat Direkomendasikan</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-1 tracking-tight">
                                    {analysis.recommendation === 'cutting' ? 'Fokus Penurunan Lemak (Cutting)' : analysis.recommendation === 'bulking' ? 'Fokus Peningkatan Otot (Bulking)' : 'Fokus Pemeliharaan (Maintenance)'}
                                </h3>
                                <p className="text-sm text-white/90 max-w-xl leading-relaxed mt-2 font-medium">
                                    {analysis.recommendation === 'cutting' && 'Berdasarkan data InBody, target utama Anda saat ini adalah membakar cadangan lemak berlebih sambil sebisa mungkin mempertahankan massa otot yang ada.'}
                                    {analysis.recommendation === 'maintenance' && 'Komposisi tubuh Anda sudah seimbang. Pertahankan asupan kalori Anda untuk menjaga bentuk badan dan mendukung performa olahraga secara berkelanjutan.'}
                                    {analysis.recommendation === 'bulking' && 'Untuk mencapai proporsi atlet yang ideal, disarankan untuk menambah massa otot melalui asupan kalori surplus. Tingkatkan porsi protein dan porsi karbohidrat sehat.'}
                                </p>
                            </div>
                            <div className="shrink-0 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center min-w-[150px]">
                                <span className="block text-[11px] text-white/80 font-bold uppercase mb-1">Target Kalori</span>
                                <span className="block text-4xl font-bold tabular-nums">{analysis.goals[analysis.recommendation].macros.cals}</span>
                                <span className="block text-xs text-white/80 font-medium mt-1">kcal / hari</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== SECTION: TDEE OVERVIEW ===== */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 bg-slate-900 p-6 rounded-2xl shadow-sm text-slate-50 flex flex-col justify-center relative overflow-hidden">
                    <Flame className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 text-white pointer-events-none" />
                    <h4 className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider relative z-10">TDEE (Total Energi Harian)</h4>
                    <div className="flex items-end gap-2 relative z-10 mt-1">
                        <span className="text-5xl lg:text-6xl font-black tabular-nums tracking-tighter leading-none text-white">{analysis.tdee.toLocaleString()}</span>
                        <span className="text-sm font-bold text-slate-400 mb-1.5 leading-tight">kcal<br />/ hari</span>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 relative z-10">
                        <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">BMR (Metabolisme Dasar)</span>
                            <p className="text-xl font-bold tabular-nums text-slate-200 mt-1">{analysis.bmr.toLocaleString()} <span className="text-xs text-slate-500 font-medium">kcal</span></p>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Energi Mingguan</span>
                            <p className="text-xl font-bold tabular-nums text-slate-200 mt-1">{analysis.tdeeWeekly.toLocaleString()} <span className="text-xs text-slate-500 font-medium">kcal</span></p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 relative z-10">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tingkat Aktivitas Saat Ini</span>
                        <div className="inline-flex items-center bg-slate-800 rounded-lg px-3 py-1.5">
                            <span className="text-sm font-bold text-slate-200">{ACTIVITY_LABELS[analysis.activityLevel] || `Faktor ×${analysis.activityLevel}`}</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <QuickStat icon={Droplets} label="Kebutuhan Air" value={`${analysis.waterLiters} L`} sub="minimal per hari" color="blue" />
                    <QuickStat icon={Beef} label="Kebutuhan Protein" value={`${currentGoal.macros.perKgProtein}g`} sub="per kg berat badan" color="rose" />
                    <QuickStat icon={Scale} label="Target Kalori" value={currentGoal.macros.cals.toLocaleString()} sub="kcal per hari" color="amber" />
                    <QuickStat icon={Zap} label="Estimasi Hasil" value={currentGoal.weeklyResult} sub="perubahan per minggu" color="emerald" />
                </div>
            </div>

            {/* ===== SECTION: GOAL SELECTOR + MACROS ===== */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-3 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex gap-2">
                        {Object.entries(analysis.goals).map(([key, goal]) => {
                            const isActive = activeGoal === key;
                            const color = goalColors[key];
                            const Icon = goal.icon;
                            const isRecommended = key === analysis.recommendation;
                            return (
                                <button key={key} onClick={() => setActiveGoal(key)}
                                    className={`flex-1 flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-xl transition-all relative ${isActive ? `${color.activeBg} ${color.activeText} shadow-md scale-[1.02]` : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    <Icon className="w-5 h-5 mb-0.5" />
                                    <span className="text-sm font-bold hidden sm:block">{goal.label}</span>
                                    <span className="text-xs font-bold sm:hidden">{key === 'cutting' ? 'Defisit' : key === 'bulking' ? 'Surplus' : 'Pemeliharaan'}</span>
                                    <span className={`text-[10px] font-semibold opacity-80`}>{goal.sublabel}</span>
                                    {isRecommended && (
                                        <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm ${isActive ? 'bg-white text-slate-900' : color.badge}`}>
                                            Disarankan ★
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="px-6 pt-6 pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{currentGoal.label}</h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">{currentGoal.description}</p>
                        </div>
                        <div className="bg-slate-100 px-4 py-2 rounded-xl text-center shrink-0">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase">Jatah Kalori</span>
                            <span className="block text-2xl font-bold text-slate-900">{currentGoal.macros.cals.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    {/* Visual Bar */}
                    <div className="h-5 rounded-full overflow-hidden flex mb-6 shadow-inner bg-slate-100">
                        <div className="bg-rose-500 transition-all duration-700 flex items-center justify-center" style={{ width: `${currentGoal.macros.protein.pct}%` }}>
                            <span className="text-[10px] font-bold text-white drop-shadow-md">{currentGoal.macros.protein.pct}%</span>
                        </div>
                        <div className="bg-amber-400 transition-all duration-700 flex items-center justify-center" style={{ width: `${currentGoal.macros.fats.pct}%` }}>
                            <span className="text-[10px] font-bold text-amber-900 drop-shadow-sm">{currentGoal.macros.fats.pct}%</span>
                        </div>
                        <div className="bg-sky-500 transition-all duration-700 flex items-center justify-center" style={{ width: `${currentGoal.macros.carbs.pct}%` }}>
                            <span className="text-[10px] font-bold text-white drop-shadow-md">{currentGoal.macros.carbs.pct}%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MacroDetailCard icon={Beef} label="Protein" grams={currentGoal.macros.protein.grams} cals={currentGoal.macros.protein.cals} pct={currentGoal.macros.protein.pct} color="rose"
                            perKg={currentGoal.macros.perKgProtein} weight={analysis.weight}
                            tip="Esensial untuk pemulihan dan pembentukan sel otot setelah sesi latihan berat." />
                        <MacroDetailCard icon={Droplets} label="Lemak (Fats)" grams={currentGoal.macros.fats.grams} cals={currentGoal.macros.fats.cals} pct={currentGoal.macros.fats.pct} color="amber"
                            tip="Krusial untuk produksi hormon testosteron, penyerapan vitamin, dan pelumas sendi." />
                        <MacroDetailCard icon={Wheat} label="Karbohidrat" grams={currentGoal.macros.carbs.grams} cals={currentGoal.macros.carbs.cals} pct={currentGoal.macros.carbs.pct} color="sky"
                            tip="Sumber energi utama tubuh. Penting untuk mengisi ulang glikogen otot yang terkuras." />
                    </div>
                </div>

                {/* Meal Timing */}
                <div className="px-6 pb-6 border-t border-slate-100 pt-5">
                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" /> Rekomendasi Waktu Makan (Pembagian Kalori)
                    </h4>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
                        {analysis.mealTimings.map((meal, idx) => (
                            <React.Fragment key={idx}>
                                <div className="flex-shrink-0 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl p-3 border border-slate-200 text-center min-w-[110px]">
                                    <span className="text-xs font-bold text-slate-400 uppercase bg-white px-2 py-0.5 rounded-md border border-slate-100">{meal.time}</span>
                                    <p className="text-sm font-bold text-slate-800 mt-2">{meal.label}</p>
                                    <p className="text-[11px] font-bold text-slate-500 mt-1">
                                        {meal.pct}% = <span className="text-indigo-600">{Math.round(currentGoal.macros.cals * meal.pct / 100)} kcal</span>
                                    </p>
                                </div>
                                {idx < analysis.mealTimings.length - 1 && (
                                    <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== SECTION: INDONESIAN WEEKLY MEAL PLAN ===== */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <button onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
                            <Utensils className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                Menu Makanan Seminggu
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${gc.badge}`}>
                                    Lokal Indonesia
                                </span>
                            </h3>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">Generate otomatis jadwal makan 5x sehari bervariasi tinggi sesuai dengan kalori dan makro diet Anda.</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        {showWeeklyPlan ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
                    </div>
                </button>

                {showWeeklyPlan && (
                    <div className="px-4 pb-4 space-y-3 bg-slate-50/50 pt-2 border-t border-slate-100">
                        {weeklyPlan.map((day, dayIdx) => (
                            <div key={dayIdx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
                                <button onClick={() => setExpandedDay(expandedDay === dayIdx ? null : dayIdx)}
                                    className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gc.gradFrom} ${gc.gradTo} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                                            {day.day.substring(0, 3)}
                                        </div>
                                        <div className="text-left">
                                            <span className="text-base font-bold text-slate-900">{day.day}</span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{day.total.calories} kcal</span>
                                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">Pro: {day.total.protein}g</span>
                                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">Lem: {day.total.fats}g</span>
                                                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">Kar: {day.total.carbs}g</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block">
                                        {expandedDay === dayIdx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                    </div>
                                </button>

                                {expandedDay === dayIdx && (
                                    <div className="px-5 pb-5 pt-1 space-y-2">
                                        {(day.meals || []).map((meal, mealIdx) => (
                                            <div key={mealIdx} className="flex flex-col lg:flex-row lg:items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white transition-colors">
                                                <div className="w-28 shrink-0 flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">{meal.time}</span>
                                                    <span className="text-[11px] font-bold text-slate-700">{meal.label}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {meal.name}
                                                        <span className="inline-block ml-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded" title="Faktor pengali porsi dari database standar untuk mencapai target kalori harian">
                                                            Porsi: x{meal.multiplier.toFixed(1)}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-2 shrink-0">
                                                    <span className="text-xs font-bold text-slate-600 tabular-nums bg-white border border-slate-200 px-2 py-1 rounded-lg w-20 text-center">{meal.calories} kcal</span>
                                                    <div className="flex gap-1">
                                                        <span className="text-[10px] font-bold text-rose-600 tabular-nums bg-rose-50 border border-rose-100 px-1.5 py-1 rounded w-12 text-center" title="Protein">P {meal.protein}</span>
                                                        <span className="text-[10px] font-bold text-amber-600 tabular-nums bg-amber-50 border border-amber-100 px-1.5 py-1 rounded w-12 text-center" title="Lemak">L {meal.fats}</span>
                                                        <span className="text-[10px] font-bold text-sky-600 tabular-nums bg-sky-50 border border-sky-100 px-1.5 py-1 rounded w-12 text-center" title="Karbohidrat">K {meal.carbs}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ===== SECTION: SUPPLEMENTARY TIPS ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <TipCard icon={Droplets} title="Panduan Hidrasi"
                    tips={[`Minum minimal ${analysis.waterLiters} liter air per hari`, 'Tambah 500ml setiap 1 jam latihan intens', 'Konsumsi isotonik (elektrolit) saat bertanding']}
                    color="blue" />
                <TipCard icon={Dumbbell} title="Nutrisi Latihan"
                    tips={['Makan 30-40g karbohidrat 1 jam sebelum latihan', 'Konsumsi 20-30g protein sesaat setelah latihan (jendela anabolik)', 'Pertimbangkan suplemen Creatine 3-5g/hari']}
                    color="purple" />
                <TipCard icon={Apple} title="Pemulihan (Recovery)"
                    tips={['Tidur berkualitas 7-9 jam setiap malam', 'Konsumsi susu tinggi kasein sebelum tidur lambat serap', 'Asupan Omega-3 (Ikan/Suplemen) kurangi peradangan']}
                    color="emerald" />
            </div>
        </div>
    );
}

function InsightCard({ icon: Icon, title, desc, color }) {
    const colorMap = {
        red: 'bg-red-50 border-red-100 text-red-600 title-red-900',
        amber: 'bg-amber-50 border-amber-100 text-amber-600 title-amber-900',
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600 title-emerald-900',
        blue: 'bg-blue-50 border-blue-100 text-blue-600 title-blue-900',
    };
    const c = colorMap[color];
    
    return (
        <div className={`p-4 rounded-xl border ${c.split(' ')[0]} ${c.split(' ')[1]} flex items-start gap-4 transition-all hover:shadow-md`}>
            <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100`}>
                <Icon className={`w-5 h-5 ${c.split(' ')[2]}`} />
            </div>
            <div>
                <h4 className={`text-sm font-bold mb-1 ${c.split(' ')[3].replace('title-', 'text-')}`}>{title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{desc}</p>
            </div>
        </div>
    );
}

function QuickStat({ icon: Icon, label, value, sub, color }) {
    const colors = { blue: 'bg-blue-50 text-blue-600 border-blue-100', rose: 'bg-rose-50 text-rose-600 border-rose-100', amber: 'bg-amber-50 text-amber-600 border-amber-100', emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    return (
        <div className={`bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
            <div className={`absolute top-0 w-full h-1 ${colors[color].replace('text-', 'bg-').split(' ')[0]} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-xl font-black text-slate-900 tabular-nums mt-1">{value}</span>
            <span className="text-[10px] font-semibold text-slate-500 mt-1">{sub}</span>
        </div>
    );
}

function MacroDetailCard({ icon: Icon, label, grams, cals, pct, color, perKg, weight, tip }) {
    const colorMap = {
        rose: { bg: 'bg-rose-50/50', border: 'border-rose-100', icon: 'bg-rose-100 text-rose-600', badge: 'bg-rose-500 text-white shadow-sm' },
        amber: { bg: 'bg-amber-50/50', border: 'border-amber-100', icon: 'bg-amber-100 text-amber-600', badge: 'bg-amber-500 text-white shadow-sm' },
        sky: { bg: 'bg-sky-50/50', border: 'border-sky-100', icon: 'bg-sky-100 text-sky-600', badge: 'bg-sky-500 text-white shadow-sm' },
    };
    const c = colorMap[color];
    return (
        <div className={`rounded-2xl border ${c.border} p-5 ${c.bg} flex flex-col hover:bg-white hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
                    <span className="text-base font-bold text-slate-900">{label}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${c.badge}`}>{pct}%</span>
            </div>
            <div className="flex items-end gap-1.5 mb-1">
                <span className="text-4xl font-black tabular-nums text-slate-900 leading-none tracking-tighter">{grams}</span>
                <span className="text-sm font-bold text-slate-500 mb-1">g</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md tabular-nums">{cals} kcal</span>
                {perKg && weight > 0 && <span className="text-[10px] font-bold text-slate-500">{perKg}g / kg bb</span>}
            </div>
            <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium border-t border-slate-200/60 pt-3">{tip}</p>
        </div>
    );
}

function TipCard({ icon: Icon, title, tips, color }) {
    const colorMap = { blue: 'from-blue-500 to-blue-600 shadow-blue-200', purple: 'from-violet-500 to-purple-600 shadow-violet-200', emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200' };
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-md flex items-center justify-center`}><Icon className="w-4 h-4 text-white" /></div>
                <h4 className="text-sm font-bold text-slate-900">{title}</h4>
            </div>
            <div className="p-5 space-y-3">
                {tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[9px] font-black text-slate-400">{idx + 1}</span>
                        </div>
                        <span className="text-xs text-slate-700 leading-relaxed font-semibold">{tip}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
