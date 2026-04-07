import { BrainCircuit, Droplets, Dumbbell, HeartPulse, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

export default function SmartInsights({ history, athlete, benchmarks }) {
    const generateInsights = () => {
        if (!history || history.length === 0) return [];
        const latest = history[0];
        const insights = [];

        
        if (latest.weight && latest.body_fat_percentage) {
            const ffm = latest.weight - (latest.weight * (latest.body_fat_percentage / 100));
            insights.push({ 
                icon: Dumbbell, 
                iconColor: 'text-[#ff4d00]', 
                iconBg: 'bg-[#FFCE99]/30', 
                borderColor: 'border-[#FFCE99]',
                title: 'Fat-Free Mass (FFM)', 
                desc: `Massa tubuh bebas lemak berada di angka ${ffm.toFixed(1)} kg. Fokus pertahankan atau tingkatkan angka ini.` 
            });
        }

        
        if (latest.total_body_water) {
            const isFemale = athlete?.gender === 'P';
            const minTbw = isFemale ? 45 : 50;
            const maxTbw = isFemale ? 60 : 65;

            if (latest.total_body_water < minTbw) {
                insights.push({ 
                    icon: Droplets, 
                    iconColor: 'text-[#FF9644]', 
                    iconBg: 'bg-[#FFCE99]/30', 
                    borderColor: 'border-[#FFCE99]',
                    title: 'Indikasi Dehidrasi', 
                    desc: `Kadar air ${latest.total_body_water}% (Di bawah standar ${minTbw}%). Perbanyak asupan cairan harian Anda.` 
                });
            } else if (latest.total_body_water <= maxTbw) {
                insights.push({ 
                    icon: Droplets, 
                    iconColor: 'text-[#ACBFA4]', 
                    iconBg: 'bg-[#E2E8CE]/50', 
                    borderColor: 'border-[#ACBFA4]/60',
                    title: 'Hidrasi Optimal', 
                    desc: `Tingkat cairan tubuh (${latest.total_body_water}%) sangat baik. Pertahankan pola minum Anda.` 
                });
            }
        }

        
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

        
        if (history.length > 1) {
            const prev = history[1];
            if (latest.muscle_mass > prev.muscle_mass && latest.body_fat_percentage < prev.body_fat_percentage) {
                insights.push({ 
                    icon: TrendingUp, 
                    iconColor: 'text-[#ACBFA4]', 
                    iconBg: 'bg-[#E2E8CE]/50', 
                    borderColor: 'border-[#ACBFA4]/60',
                    title: 'Rekomposisi Sukses', 
                    desc: `Luar biasa! Otot Anda naik dan lemak menyusut dibandingkan hasil tes sebelumnya.` 
                });
            } else if (latest.muscle_mass < prev.muscle_mass && latest.body_fat_percentage > prev.body_fat_percentage) {
                insights.push({ 
                    icon: TrendingDown, 
                    iconColor: 'text-[#FF9644]', 
                    iconBg: 'bg-[#FFCE99]/30', 
                    borderColor: 'border-[#FFCE99]',
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
        <div className="bg-white rounded-lg border border-[#BFC9D1]/50 shadow-sm p-5 md:p-8 animate-in fade-in duration-500 relative overflow-hidden">
            
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EAEFEF] rounded-full blur-3xl opacity-50 pointer-events-none -mt-10 -mr-10"></div>

            <div className="flex items-center gap-3 mb-5 md:mb-6 relative z-10">
                <div className="p-2 md:p-2.5 bg-[#EAEFEF] rounded-lg border border-[#BFC9D1]/50 text-[#ff4d00]">
                    <BrainCircuit className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-black text-[#262626] flex items-center gap-1.5 tracking-tight uppercase">
                        Smart Insights <Sparkles className="w-4 h-4 text-[#FFC300]"/>
                    </h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                        Analisis otomatis berbasis data komposisi tubuh terakhir.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5 relative z-10">
                {insights.map((insight, i) => (
                    <div 
                        key={i} 
                        className={`p-4 md:p-5 rounded-lg bg-white border ${insight.borderColor} flex flex-col gap-3 md:gap-4 shadow-sm hover:shadow-md transition-shadow group`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ${insight.iconBg} ${insight.iconColor}`}>
                                <insight.icon className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <h4 className="text-[11px] md:text-xs font-black text-[#262626] uppercase tracking-widest leading-tight">
                                {insight.title}
                            </h4>
                        </div>
                        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                            {insight.desc}
                        </p>
                    </div>
                ))}
            </div>
            
        </div>
    );
}