import React from "react";
import {
    Lightbulb,
    AlertTriangle,
    CheckCircle2,
    Info,
    Droplets,
    Zap,
    Activity,
    HeartPulse,
    Brain,
} from "lucide-react";

export default function SmartInsights({ test, player, benchmarks }) {
    if (!test) return null;

    const insights = [];
    const isMale =
        player?.gender === "male" || player?.gender === "L" || !player?.gender;

    const bmi = parseFloat(test.bmi);
    if (bmi) {
        if (bmi < 18.5) {
            insights.push({
                type: "warning",
                icon: Activity,
                title: "Kekurangan Berat Badan (BMI)",
                desc: "BMI di bawah batas normal. Diperlukan surplus kalori dan latihan hipertrofi untuk meningkatkan massa otot.",
            });
        } else if (bmi >= 18.5 && bmi < 25) {
            insights.push({
                type: "info",
                icon: CheckCircle2,
                title: "BMI Proporsional",
                desc: "Rasio berat dan tinggi badan berada dalam batas ideal dan sehat.",
            });
        } else if (bmi >= 25 && bmi < 30) {
            insights.push({
                type: "warning",
                icon: Activity,
                title: "Kelebihan Berat Badan (BMI)",
                desc: "BMI tinggi. Pastikan berat ini berasal dari massa otot (wajar untuk atlet), bukan penumpukan lemak.",
            });
        } else if (bmi >= 30) {
            insights.push({
                type: "danger",
                icon: AlertTriangle,
                title: "Indikasi Obesitas (BMI)",
                desc: "Tingkat BMI sangat tinggi. Segera perbaiki pola makan dan jalani program defisit kalori.",
            });
        }
    }

    const bf = parseFloat(test.body_fat_percentage);
    if (bf) {
        const bfRef = isMale
            ? benchmarks?.body_fat?.male
            : benchmarks?.body_fat?.female;
        if (bfRef) {
            if (bf >= bfRef.obese?.min) {
                insights.push({
                    type: "danger",
                    icon: HeartPulse,
                    title: "Lemak Sangat Tinggi",
                    desc: "Risiko membebani sendi lutut/pergelangan kaki dan secara drastis mengurangi kelincahan.",
                });
            } else if (
                bf >= bfRef.acceptable?.min &&
                bf <= bfRef.acceptable?.max
            ) {
                insights.push({
                    type: "warning",
                    icon: HeartPulse,
                    title: "Kadar Lemak Rata-rata",
                    desc: "Normal untuk non-atlet, tetapi perlu dikurangi 3-5% untuk mencapai level kompetitif.",
                });
            } else if (bf >= bfRef.fitness?.min && bf <= bfRef.athlete?.max) {
                insights.push({
                    type: "success",
                    icon: CheckCircle2,
                    title: "Lemak Tubuh Ideal Atlet",
                    desc: "Komposisi otot dan lemak optimal. Rasio tenaga terhadap berat (power-to-weight) berada di kondisi puncak.",
                });
            } else if (bf <= bfRef.essential?.max) {
                insights.push({
                    type: "info",
                    icon: Info,
                    title: "Lemak Esensial",
                    desc: "Persentase lemak sangat rendah. Waspadai penurunan sistem imun atau gangguan hormonal jika dipertahankan terlalu lama.",
                });
            }
        }
    }

    const tbw = parseFloat(test.total_body_water);
    if (tbw) {
        const minTbw = isMale ? 50 : 45;
        if (tbw < minTbw) {
            insights.push({
                type: "danger",
                icon: Droplets,
                title: "Dehidrasi Klinis",
                desc: `Total air dalam tubuh (${tbw}%) kurang. Sangat rentan mengalami kram otot. Tingkatkan asupan cairan dan elektrolit.`,
            });
        } else if (tbw >= minTbw && tbw <= 65) {
            insights.push({
                type: "success",
                icon: Droplets,
                title: "Hidrasi Optimal",
                desc: "Sel-sel otot terhidrasi dengan baik, sangat mendukung kelenturan dan daya tahan selama pertandingan.",
            });
        } else {
            insights.push({
                type: "info",
                icon: Droplets,
                title: "Hidrasi Tinggi",
                desc: "Total air dalam tubuh cukup tinggi. Umumnya menandakan massa otot yang besar karena otot menyimpan banyak air.",
            });
        }
    }

    const visc = parseFloat(test.visceral_fat);
    if (visc) {
        if (visc < 10) {
            insights.push({
                type: "info",
                icon: CheckCircle2,
                title: "Lemak Organ Aman",
                desc: `Lemak viseral di Level ${visc} sangat sehat. Organ dalam (jantung/paru-paru) terbebas dari tumpukan lemak jahat.`,
            });
        } else if (visc >= 10 && visc < 15) {
            insights.push({
                type: "warning",
                icon: HeartPulse,
                title: "Lemak Organ Meningkat",
                desc: "Penumpukan lemak organ mulai terjadi. Batasi asupan gula sederhana/gorengan dan tingkatkan intensitas kardio.",
            });
        } else if (visc >= 15) {
            insights.push({
                type: "danger",
                icon: AlertTriangle,
                title: "Lemak Organ Berbahaya",
                desc: "Level lemak organ berada di zona merah. Hal ini akan sangat menghambat kapasitas VO2Max dan stamina pemain.",
            });
        }
    }

    const actualAge = parseFloat(test.age) || parseFloat(player.age);
    const metAge = parseFloat(test.metabolic_age);
    if (actualAge && metAge) {
        if (metAge > actualAge + 2) {
            insights.push({
                type: "warning",
                icon: Zap,
                title: "Penurunan Metabolisme",
                desc: `Usia seluler (${metAge} th) terdeteksi lebih tua dari usia sebenarnya. Perbaiki pola istirahat, nutrisi, dan kurangi stres.`,
            });
        } else if (metAge < actualAge) {
            insights.push({
                type: "success",
                icon: Zap,
                title: "Metabolisme Prima",
                desc: `Luar biasa! Usia biologis sel (${metAge} th) lebih muda dari usia sebenarnya. Pemulihan fisik akan berjalan sangat cepat.`,
            });
        } else {
            insights.push({
                type: "info",
                icon: CheckCircle2,
                title: "Metabolisme Stabil",
                desc: "Usia seluler sesuai dengan usia sebenarnya. Fungsi regenerasi otot berjalan normal.",
            });
        }
    }

    const pa = parseFloat(test.phase_angle);
    if (pa) {
        if (pa < 5.5) {
            insights.push({
                type: "danger",
                icon: Zap,
                title: "Indikasi Overtraining",
                desc: "Phase Angle sangat rendah. Membran sel rusak/meradang. Wajib pemulihan penuh selama 48-72 jam.",
            });
        } else if (pa >= 5.5 && pa < 7.0) {
            insights.push({
                type: "info",
                icon: Activity,
                title: "Integritas Sel Normal",
                desc: "Kondisi kesehatan dan daya tahan sel otot berada dalam batas wajar.",
            });
        } else if (pa >= 7.0) {
            insights.push({
                type: "success",
                icon: CheckCircle2,
                title: "Sel Sangat Kuat",
                desc: "Phase angle tinggi. Sel-sel tubuh sangat bugar dan siap menerima beban latihan intensitas maksimal.",
            });
        }
    }

    if (insights.length === 0) {
        insights.push({
            type: "info",
            icon: Lightbulb,
            title: "Belum Ada Kesimpulan",
            desc: "Silakan lengkapi form komposisi tubuh untuk mendapatkan rangkuman kesehatan otomatis.",
        });
    }

    const getStyles = (type) => {
        switch (type) {
            case "danger":
                return {
                    bg: "bg-red-50 ",
                    border: "border-red-100 ",
                    iconBg: "bg-red-100 ",
                    iconColor: "text-red-600 ",
                    titleColor: "text-red-900 ",
                };
            case "warning":
                return {
                    bg: "bg-amber-50 ",
                    border: "border-amber-100 ",
                    iconBg: "bg-amber-100 ",
                    iconColor: "text-amber-600 ",
                    titleColor: "text-amber-900 ",
                };
            case "success":
                return {
                    bg: "bg-emerald-50 ",
                    border: "border-emerald-100 ",
                    iconBg: "bg-emerald-100 ",
                    iconColor: "text-emerald-600 ",
                    titleColor: "text-emerald-900 ",
                };
            case "info":
            default:
                return {
                    bg: "bg-zinc-50 ",
                    border: "border-zinc-200 ",
                    iconBg: "bg-zinc-200 ",
                    iconColor: "text-zinc-600 ",
                    titleColor: "text-zinc-900 ",
                };
        }
    };

    return (
        <div className="bg-white  border border-zinc-200  rounded-xl flex flex-col h-full shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-5 border-b border-zinc-200  flex items-center justify-between bg-zinc-50/50  transition-colors">
                <div className="space-y-1">
                    <h3 className="text-base font-semibold tracking-tight text-zinc-950  flex items-center gap-2">
                        <Brain className="w-4 h-4 text-amber-500" />
                        {"Smart Insights"}
                    </h3>
                    <p className="text-xs text-zinc-500  font-semibold">
                        Analisis cerdas dan deteksi masalah dari seluruh matrik komposisi tubuh
                    </p>
                </div>
            </div>

            <div className="p-2 flex-1 space-y-3 overflow-y-auto max-h-[800px] custom-scrollbar">
                {insights.map((insight, idx) => {
                    const style = getStyles(insight.type);
                    const Icon = insight.icon;
                    return (
                        <div
                            key={idx}
                            className={`p-4 rounded-xl border ${style.bg} ${style.border} flex items-start gap-3.5 transition-colors`}
                        >
                            <div
                                className={`p-2 rounded-lg ${style.iconBg} shrink-0 transition-colors`}
                            >
                                <Icon
                                    className={`w-4 h-4 ${style.iconColor}`}
                                />
                            </div>
                            <div>
                                <h4
                                    className={`text-sm font-bold tracking-tight mb-1 ${style.titleColor}`}
                                >
                                    {insight.title}
                                </h4>
                                <p className="text-xs text-zinc-600  leading-relaxed font-semibold">
                                    {insight.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
