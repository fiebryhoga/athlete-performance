import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Brain, Activity, CheckCircle2, AlertTriangle, HeartPulse, Info, Droplets, Zap, Lightbulb } from "lucide-react";
function SmartInsights({ test, player, benchmarks }) {
  if (!test) return null;
  const insights = [];
  const isMale = player?.gender === "male" || player?.gender === "L" || player?.gender === "Laki-laki" || !player?.gender;
  const bmi = parseFloat(test.bmi);
  if (bmi) {
    if (bmi < 18.5) {
      insights.push({
        icon: Activity,
        title: "Kekurangan Berat Badan (BMI)",
        desc: "BMI di bawah batas normal. Diperlukan surplus kalori dan latihan hipertrofi untuk meningkatkan massa otot."
      });
    } else if (bmi >= 18.5 && bmi < 23) {
      insights.push({
        icon: CheckCircle2,
        title: "BMI Ideal & Proporsional",
        desc: "Rasio berat dan tinggi badan berada dalam batas ideal dan sehat untuk atlet."
      });
    } else if (bmi >= 23 && bmi < 25) {
      insights.push({
        icon: CheckCircle2,
        title: "BMI Normal (Batas Atas)",
        desc: "Rasio berat badan dalam batas normal. Pertahankan massa otot dan pantau persentase lemak."
      });
    } else if (bmi >= 25 && bmi < 30) {
      insights.push({
        icon: Activity,
        title: "Kelebihan Berat Badan (BMI)",
        desc: "BMI tinggi. Pastikan berat ini berasal dari massa otot (wajar untuk atlet), bukan penumpukan lemak."
      });
    } else if (bmi >= 30) {
      insights.push({
        icon: AlertTriangle,
        title: "Indikasi Obesitas (BMI)",
        desc: "Tingkat BMI sangat tinggi. Segera perbaiki pola makan dan jalani program defisit kalori."
      });
    }
  }
  const bf = parseFloat(test.body_fat_percentage);
  if (bf) {
    const bfRef = isMale ? benchmarks?.body_fat?.male : benchmarks?.body_fat?.female;
    if (bfRef) {
      if (bf >= bfRef.obese?.min) {
        insights.push({
          icon: HeartPulse,
          title: "Lemak Tubuh Sangat Tinggi",
          desc: "Risiko membebani sendi lutut/pergelangan kaki dan secara drastis mengurangi kelincahan."
        });
      } else if (bf >= bfRef.acceptable?.min && bf <= bfRef.acceptable?.max) {
        insights.push({
          icon: HeartPulse,
          title: "Kadar Lemak Rata-rata",
          desc: "Normal untuk non-atlet, tetapi perlu dikurangi 3-5% untuk mencapai level kompetitif."
        });
      } else if (bf >= bfRef.fitness?.min && bf <= bfRef.athlete?.max) {
        insights.push({
          icon: CheckCircle2,
          title: "Lemak Tubuh Ideal Atlet",
          desc: "Komposisi otot dan lemak optimal. Rasio tenaga terhadap berat (power-to-weight) berada di kondisi puncak."
        });
      } else if (bf <= bfRef.essential?.max) {
        insights.push({
          icon: Info,
          title: "Lemak Esensial Rendah",
          desc: "Persentase lemak sangat rendah. Waspadai penurunan sistem imun jika dipertahankan terlalu lama."
        });
      }
    }
  }
  const tbw = parseFloat(test.total_body_water);
  if (tbw) {
    const minTbw = isMale ? 50 : 45;
    if (tbw < minTbw) {
      insights.push({
        icon: Droplets,
        title: "Dehidrasi Klinis",
        desc: `Total air dalam tubuh (${tbw}%) kurang. Sangat rentan mengalami kram otot. Tingkatkan asupan cairan dan elektrolit.`
      });
    } else if (tbw >= minTbw && tbw <= 65) {
      insights.push({
        icon: Droplets,
        title: "Hidrasi Tubuh Optimal",
        desc: "Sel-sel otot terhidrasi dengan baik, sangat mendukung kelenturan dan daya tahan selama pertandingan."
      });
    } else {
      insights.push({
        icon: Droplets,
        title: "Hidrasi Tinggi",
        desc: "Total air dalam tubuh cukup tinggi. Umumnya menandakan massa otot yang besar karena otot menyimpan banyak air."
      });
    }
  }
  const visc = parseFloat(test.visceral_fat);
  if (visc) {
    if (visc < 10) {
      insights.push({
        icon: CheckCircle2,
        title: "Lemak Organ (Visceral) Aman",
        desc: `Lemak viseral di Level ${visc} sangat sehat. Organ dalam (jantung/paru-paru) terbebas dari tumpukan lemak jahat.`
      });
    } else if (visc >= 10 && visc < 15) {
      insights.push({
        icon: HeartPulse,
        title: "Lemak Organ Meningkat",
        desc: "Penumpukan lemak organ mulai terjadi. Batasi asupan gula sederhana/gorengan dan tingkatkan intensitas kardio."
      });
    } else if (visc >= 15) {
      insights.push({
        icon: AlertTriangle,
        title: "Lemak Organ Berbahaya",
        desc: "Level lemak organ berada di zona merah. Hal ini akan sangat menghambat kapasitas VO2Max dan stamina pemain."
      });
    }
  }
  const actualAge = parseFloat(test.age) || parseFloat(player.age);
  const metAge = parseFloat(test.metabolic_age);
  if (actualAge && metAge) {
    if (metAge > actualAge + 2) {
      insights.push({
        icon: Zap,
        title: "Penurunan Metabolisme",
        desc: `Usia seluler (${metAge} th) terdeteksi lebih tua dari usia sebenarnya. Perbaiki pola istirahat, nutrisi, dan kurangi stres.`
      });
    } else if (metAge < actualAge) {
      insights.push({
        icon: Zap,
        title: "Metabolisme Prima",
        desc: `Luar biasa! Usia biologis sel (${metAge} th) lebih muda dari usia sebenarnya. Pemulihan fisik akan berjalan sangat cepat.`
      });
    } else {
      insights.push({
        icon: CheckCircle2,
        title: "Metabolisme Stabil",
        desc: "Usia seluler sesuai dengan usia sebenarnya. Fungsi regenerasi otot berjalan normal."
      });
    }
  }
  const pa = parseFloat(test.phase_angle);
  if (pa) {
    if (pa < 5.5) {
      insights.push({
        icon: Zap,
        title: "Indikasi Overtraining",
        desc: "Phase Angle sangat rendah. Membran sel rusak/meradang. Wajib pemulihan penuh selama 48-72 jam."
      });
    } else if (pa >= 5.5 && pa < 7) {
      insights.push({
        icon: Activity,
        title: "Integritas Sel Normal",
        desc: "Kondisi kesehatan dan daya tahan sel otot berada dalam batas wajar."
      });
    } else if (pa >= 7) {
      insights.push({
        icon: CheckCircle2,
        title: "Integritas Sel Sangat Kuat",
        desc: "Phase angle tinggi. Sel-sel tubuh sangat bugar dan siap menerima beban latihan intensitas maksimal."
      });
    }
  }
  if (insights.length === 0) {
    insights.push({
      icon: Lightbulb,
      title: "Belum Ada Kesimpulan",
      desc: "Silakan lengkapi form komposisi tubuh untuk mendapatkan rangkuman kesehatan otomatis."
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200/80 rounded-xl flex flex-col h-full shadow-2xs overflow-hidden transition-colors", children: [
    /* @__PURE__ */ jsx("div", { className: "px-4 py-3 border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-900 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Brain, { className: "w-3.5 h-3.5 text-orange-500" }),
        "Smart Insights"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium leading-relaxed", children: "Analisis cerdas & deteksi kondisi dari metrik komposisi tubuh." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "p-3 flex-1 space-y-2 overflow-y-auto max-h-[800px] custom-scrollbar", children: insights.map((insight, idx) => {
      const Icon = insight.icon;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg p-2.5 flex items-start gap-2.5 shadow-2xs hover:border-orange-200/90 transition-all",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded bg-white text-orange-500 flex items-center justify-center shrink-0 border border-slate-200/80 shadow-2xs mt-0.5", children: /* @__PURE__ */ jsx(Icon, { className: "w-3 h-3" }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-0.5", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-900 leading-tight", children: insight.title }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] leading-relaxed text-slate-500 font-medium", children: insight.desc })
            ] })
          ]
        },
        idx
      );
    }) })
  ] });
}
export {
  SmartInsights as default
};
