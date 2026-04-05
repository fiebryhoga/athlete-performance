import { BrainCircuit, Droplets, Dumbbell, HeartPulse, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

export default function SmartInsights({ history, athlete, benchmarks }) {
    const generateInsights = () => {
        if (!history || history.length === 0) return [];
        const latest = history[0];
        const insights = [];

        // 1. FAT-FREE MASS (FFM)
        if (latest.weight && latest.body_fat_percentage) {
            const ffm = latest.weight - (latest.weight * (latest.body_fat_percentage / 100));
            insights.push({ 
                icon: Dumbbell, 
                iconColor: 'text-[#00488b]', 
                iconBg: 'bg-blue-50', 
                borderColor: 'border-blue-100',
                title: 'Fat-Free Mass (FFM)', 
                desc: `Massa tubuh bebas lemak berada di angka ${ffm.toFixed(1)} kg. Fokus pertahankan atau tingkatkan angka ini.` 
            });
        }

        // 2. HYDRATION (Berdasarkan Excel: Pria 50-65, Wanita 45-60)
        if (latest.total_body_water) {
            const isFemale = athlete?.gender === 'P';
            const minTbw = isFemale ? 45 : 50;
            const maxTbw = isFemale ? 60 : 65;

            if (latest.total_body_water < minTbw) {
                insights.push({ 
                    icon: Droplets, 
                    iconColor: 'text-amber-500', 
                    iconBg: 'bg-amber-50', 
                    borderColor: 'border-amber-200',
                    title: 'Indikasi Dehidrasi', 
                    desc: `Kadar air ${latest.total_body_water}% (Di bawah standar ${minTbw}%). Perbanyak asupan cairan harian Anda.` 
                });
            } else if (latest.total_body_water <= maxTbw) {
                insights.push({ 
                    icon: Droplets, 
                    iconColor: 'text-sky-500', 
                    iconBg: 'bg-sky-50', 
                    borderColor: 'border-sky-200',
                    title: 'Hidrasi Optimal', 
                    desc: `Tingkat cairan tubuh (${latest.total_body_water}%) sangat baik. Pertahankan pola minum Anda.` 
                });
            }
        }

        // 3. VISCERAL FAT WARNING
        if (latest.visceral_fat) {
            const highLimit = benchmarks?.visceral_fat?.high || 10; 
            if (latest.visceral_fat >= highLimit) {
                insights.push({ 
                    icon: HeartPulse, 
                    iconColor: 'text-rose-500', 
                    iconBg: 'bg-rose-50', 
                    borderColor: 'border-rose-200',
                    title: 'Risiko Metabolik!', 
                    desc: `Lemak visceral menyentuh angka ${latest.visceral_fat}. Evaluasi defisit kalori dan kardio.` 
                });
            }
        }

        // 4. TREND ANALYSIS (Recomposition vs Muscle Loss)
        if (history.length > 1) {
            const prev = history[1];
            if (latest.muscle_mass > prev.muscle_mass && latest.body_fat_percentage < prev.body_fat_percentage) {
                insights.push({ 
                    icon: TrendingUp, 
                    iconColor: 'text-emerald-500', 
                    iconBg: 'bg-emerald-50', 
                    borderColor: 'border-emerald-200',
                    title: 'Rekomposisi Sukses', 
                    desc: `Luar biasa! Otot Anda naik dan lemak menyusut dibandingkan hasil tes sebelumnya.` 
                });
            } else if (latest.muscle_mass < prev.muscle_mass && latest.body_fat_percentage > prev.body_fat_percentage) {
                insights.push({ 
                    icon: TrendingDown, 
                    iconColor: 'text-orange-500', 
                    iconBg: 'bg-orange-50', 
                    borderColor: 'border-orange-200',
                    title: 'Peringatan Penyusutan', 
                    desc: `Massa otot turun & lemak naik. Cek kembali asupan protein dan intensitas latihan beban.` 
                });
            }
        }

        return insights;
    };

    const insights = generateInsights();

    if (insights.length === 0) return null;

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 md:p-8 animate-in fade-in duration-500">
            
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[#00488b]">
                    <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg  font-bold text-slate-800 flex items-center gap-1.5 tracking-tight">
                        Smart Insights <Sparkles className="w-4 h-4 text-amber-400"/>
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">Analisis otomatis berdasarkan rekaman komposisi tubuh terakhir.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                {insights.map((insight, i) => (
                    <div 
                        key={i} 
                        className={`p-5 rounded-lg bg-white border ${insight.borderColor} flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow group`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${insight.iconBg} ${insight.iconColor}`}>
                                <insight.icon className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm  font-bold text-slate-800 leading-tight">
                                {insight.title}
                            </h4>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            {insight.desc}
                        </p>
                    </div>
                ))}
            </div>
            
        </div>
    );
}