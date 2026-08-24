import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import { ArrowLeft, Plus, ShieldCheck, Compass, Users, Activity, Calendar, TrendingUp, Clock, Sparkles, Zap, AlertCircle, Ruler, Layers, Edit3, Trash2 } from "lucide-react";
import "axios";
function getInitials(name) {
  if (!name) return "??";
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
function getAthleteCode(name) {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length >= 3) {
    return `@${words[0][0]}${words[1][0]}${words[2][0]}`.toUpperCase();
  }
  if (words.length === 2) {
    return `@${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return `@${name.substring(0, 3)}`.toUpperCase();
}
function Show({ auth, athlete = {}, assessments = [] }) {
  const [isDeleting, setIsDeleting] = useState(null);
  const isAthlete = auth?.user?.role === "athlete";
  const latest = assessments.length > 0 ? assessments[0] : null;
  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data penilaian ini?")) {
      setIsDeleting(id);
      router.delete(route("admin.phv-calculator.destroy", id), {
        preserveScroll: true,
        onFinish: () => setIsDeleting(null)
      });
    }
  };
  const isFemale = athlete?.gender === "P" || athlete?.gender === "female" || athlete?.gender === "Perempuan";
  const genderFull = isFemale ? "Perempuan" : "Laki-laki";
  const coachesList = athlete?.coaches && athlete.coaches.length > 0 ? athlete.coaches.map((c) => c.name).join(", ") : null;
  const getStatusInfo = (statusStr) => {
    if (!statusStr)
      return {
        label: "Belum Terukur",
        color: "text-slate-600",
        bg: "bg-slate-50 border-slate-200",
        badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
        stage: "-"
      };
    const s = statusStr.toUpperCase();
    if (s.includes("PRE")) {
      return {
        label: "Pre-PHV",
        color: "text-sky-600",
        bg: "bg-sky-50/50 border-sky-200",
        badgeBg: "bg-sky-50 text-sky-700 border-sky-200",
        stage: "Pra-Lonjakan Pertumbuhan"
      };
    }
    if (s.includes("CIRCA")) {
      return {
        label: "Circa-PHV",
        color: "text-orange-600",
        bg: "bg-orange-50/50 border-orange-200",
        badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
        stage: "Puncak Lonjakan Pertumbuhan"
      };
    }
    if (s.includes("POST")) {
      return {
        label: "Post-PHV",
        color: "text-emerald-600",
        bg: "bg-emerald-50/50 border-emerald-200",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        stage: "Pasca-Lonjakan Pertumbuhan"
      };
    }
    return {
      label: statusStr,
      color: "text-slate-700",
      bg: "bg-slate-50 border-slate-200",
      badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
      stage: "Status Kematangan"
    };
  };
  const statusInfo = latest ? getStatusInfo(latest.maturity_status) : null;
  const offsetNum = latest ? parseFloat(latest.maturity_offset) : null;
  const isOffsetPositive = offsetNum !== null && offsetNum >= 0;
  const sittingRatio = latest && latest.standing_height && latest.sitting_height ? (parseFloat(latest.sitting_height) / parseFloat(latest.standing_height) * 100).toFixed(1) : null;
  const photo = athlete.profile_photo_url || athlete.profile_photo;
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `Evaluasi PHV - ${athlete.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        !isAthlete && /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("admin.phv-calculator.index"),
            className: "inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { size: 13 }),
              " Kembali ke Kalkulator PHV"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          PageHeader,
          {
            title: "Analisis Peak Height Velocity (PHV)",
            description: "Pantau status kematangan biologis, lintasan pertumbuhan, dan perkiraan lonjakan tinggi badan atlet.",
            actions: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: route(
                  "admin.phv-calculator.create",
                  athlete.id
                ),
                className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsx("span", { children: "Catat Penilaian Baru" })
                ]
              }
            ) })
          }
        )
      ] }),
      latest ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden hover:border-slate-300 transition-all", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative h-20 sm:h-24 bg-gradient-to-r from-white via-orange-50/40 to-amber-50/50 border-b border-slate-100 p-3.5 flex justify-end items-start overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-15 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" }),
              /* @__PURE__ */ jsxs("span", { className: "relative z-10 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 text-slate-700 text-[10.5px] font-bold px-3 py-1 rounded-full shadow-2xs", children: [
                /* @__PURE__ */ jsx(
                  ShieldCheck,
                  {
                    size: 13,
                    className: "text-orange-500"
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: athlete.sport?.name || "Atlet / Member" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-5 pb-4 pt-2.5 sm:pt-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col xl:flex-row xl:items-center justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3.5 min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "relative -mt-10 sm:-mt-12 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-xl border-[3px] border-white shadow-md overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 font-black text-2xl flex items-center justify-center shrink-0 z-10", children: photo ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: photo,
                      alt: athlete.name,
                      className: "w-full h-full object-cover"
                    }
                  ) : /* @__PURE__ */ jsx("span", { className: "leading-none select-none", children: getInitials(
                    athlete.name
                  ) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsx("h2", { className: "text-base sm:text-lg font-black text-slate-900 leading-tight uppercase tracking-tight", children: athlete.name || "Unknown" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono text-slate-400 font-bold", children: athlete.username ? `@${athlete.username}` : getAthleteCode(
                        athlete.name
                      ) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      athlete.sport?.name && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded text-[10.5px]", children: [
                        /* @__PURE__ */ jsx(
                          Compass,
                          {
                            size: 11,
                            className: "text-orange-500"
                          }
                        ),
                        athlete.sport.name
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "inline-flex items-center font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10.5px]", children: genderFull }),
                      athlete.age && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10.5px]", children: [
                        Math.round(
                          athlete.age
                        ),
                        " ",
                        "Tahun"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3 flex-wrap", children: [
                  /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg text-center shadow-2xs min-w-[70px]", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider block", children: "Tinggi" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-slate-800", children: [
                      latest.standing_height || "-",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 font-normal", children: "cm" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg text-center shadow-2xs min-w-[70px]", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider block", children: "Berat" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-slate-800", children: [
                      latest.weight || "-",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 font-normal", children: "kg" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg text-center shadow-2xs min-w-[70px]", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider block", children: "Evaluasi" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-orange-600", children: [
                      assessments.length,
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 font-normal", children: "x" })
                    ] })
                  ] })
                ] })
              ] }),
              coachesList && /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium", children: [
                /* @__PURE__ */ jsx(
                  Users,
                  {
                    size: 12,
                    className: "text-slate-400"
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: "Pelatih / Coach:" }),
                /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: coachesList })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden p-4 sm:p-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/80 text-orange-600 flex items-center justify-center shadow-2xs", children: /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xs font-black text-slate-900 uppercase tracking-tight", children: "Hasil Penilaian PHV Terkini" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: "Formula Mirwald (Biological Maturity Assessment)" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 self-start sm:self-auto bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-md text-[10.5px] font-bold text-slate-600 shadow-2xs", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3 text-slate-400" }),
                /* @__PURE__ */ jsx("span", { children: new Date(
                  latest.assessment_date
                ).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center p-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5 text-orange-500" }),
                  "Maturity Offset"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 my-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-4xl sm:text-5xl font-black text-slate-900 leading-none", children: isOffsetPositive ? `+${offsetNum.toFixed(
                    1
                  )}` : offsetNum.toFixed(1) }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-400", children: "tahun" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border ${statusInfo.badgeBg}`,
                    children: [
                      statusInfo.label,
                      " •",
                      " ",
                      statusInfo.stage
                    ]
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center p-2 pt-4 sm:pt-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-slate-400" }),
                  "Perkiraan Usia Saat PHV"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 my-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-4xl sm:text-5xl font-black text-slate-900 leading-none", children: latest.phv_age ? parseFloat(
                    latest.phv_age
                  ).toFixed(1) : "-" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-400", children: "tahun" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider", children: [
                  latest.maturity_status || "TEREKAM",
                  " ",
                  "MATURER"
                ] }) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 rounded-xl border border-slate-200/90 p-3.5 text-center shadow-2xs hover:border-orange-300 transition-all", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1", children: "Sisa Pertumbuhan" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-slate-900 leading-tight", children: latest.remaining_growth || "-" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "cm" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9.5px] text-slate-400 font-medium mt-0.5 block", children: "Predicted Growth Remain" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 rounded-xl border border-slate-200/90 p-3.5 text-center shadow-2xs hover:border-orange-300 transition-all", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1", children: "Prediksi Tinggi Dewasa" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-slate-900 leading-tight", children: latest.predicted_adult_height || "-" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "cm" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9.5px] text-slate-400 font-medium mt-0.5 block", children: "Predicted Adult Height" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 rounded-xl border border-slate-200/90 p-3.5 text-center shadow-2xs hover:border-orange-300 transition-all", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1", children: "Capaian Tinggi Dewasa" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-orange-600 leading-tight", children: latest.adult_height_percentage || "-" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-black text-orange-500", children: "%" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[9.5px] text-slate-400 font-medium mt-0.5 block", children: "Current % Adult Height" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-3.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-slate-100 pb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-md bg-white border border-slate-200 text-orange-500 flex items-center justify-center shadow-2xs", children: /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-900", children: "Rekomendasi & Panduan Latihan Biologis" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-medium", children: "Penyesuaian periodisasi beban latihan berdasarkan status kematangan atlet" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-1.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-white border border-slate-200 text-orange-600 flex items-center justify-center shadow-2xs", children: /* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5" }) }),
                  /* @__PURE__ */ jsx("h5", { className: "text-xs font-bold text-slate-800", children: "Prioritas Adaptasi Fisik" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-600 leading-relaxed", children: statusInfo.label === "Pre-PHV" ? "Fokus utama pada kelincahan (agility), koordinasi neuromuskular, kecepatan, dan penguasaan teknik dasar sebelum pertumbuhan pesat." : statusInfo.label === "Circa-PHV" ? "Fasilitasi stabilitas sendi, fleksibilitas otot, dan mobilitas. Kurangi beban aksial berat untuk melindungi lempeng pertumbuhan (epifisis)." : "Jendela optimal untuk penguatan hipertrofi otot, kekuatan maksimal (maximal strength), dan kapasitas daya tahan aerobik/anaerobik." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-1.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-white border border-slate-200 text-orange-600 flex items-center justify-center shadow-2xs", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5" }) }),
                  /* @__PURE__ */ jsx("h5", { className: "text-xs font-bold text-slate-800", children: "Mitigasi Cedera & Beban" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-600 leading-relaxed", children: statusInfo.label === "Circa-PHV" ? "Waspadai risiko Osgood-Schlatter dan Sever's Disease akibat pemanjangan tulang yang mendahului adaptasi tendon dan otot." : "Pastikan pemulihan yang cukup, nutrisi tinggi kalsium dan protein untuk mendukung perkembangan densitas tulang dan massa otot." })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3.5", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-md bg-white border border-slate-200 text-orange-500 flex items-center justify-center shadow-2xs", children: /* @__PURE__ */ jsx(Ruler, { className: "w-3.5 h-3.5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-900", children: "Data Antropometri" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-medium", children: "Pengukuran Fisik Terbaru" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Tinggi Berdiri (Standing)" }),
                /* @__PURE__ */ jsxs("strong", { className: "text-slate-900 font-black", children: [
                  latest.standing_height || "-",
                  " cm"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Tinggi Duduk (Sitting)" }),
                /* @__PURE__ */ jsxs("strong", { className: "text-slate-900 font-black", children: [
                  latest.sitting_height || "-",
                  " cm"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Panjang Kaki (Leg Length)" }),
                /* @__PURE__ */ jsxs("strong", { className: "text-slate-900 font-black", children: [
                  latest.leg_length || "-",
                  " cm"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Berat Badan" }),
                /* @__PURE__ */ jsxs("strong", { className: "text-slate-900 font-black", children: [
                  latest.weight || "-",
                  " kg"
                ] })
              ] }),
              sittingRatio && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Rasio Duduk / Berdiri" }),
                /* @__PURE__ */ jsxs("strong", { className: "text-orange-600 font-black", children: [
                  sittingRatio,
                  " %"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-slate-100 pb-2.5", children: [
              /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-md bg-white border border-slate-200 text-orange-500 flex items-center justify-center shadow-2xs", children: /* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-900", children: "Tahapan Kematangan PHV" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-medium", children: "Kriteria Klasifikasi Biologis" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-[11px]", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-2.5 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs space-y-0.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-sky-700", children: "Pre-PHV" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-mono font-bold", children: "Offset < -1.0 thn" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-[10px] leading-tight", children: "Fase pra-lonjakan. Kecepatan tumbuh masih stabil." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-2.5 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs space-y-0.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-orange-700", children: "Circa-PHV" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-orange-500 font-mono font-bold", children: "-1.0 s/d +1.0 thn" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-[10px] leading-tight", children: "Puncak pertumbuhan cepat tinggi badan atlet." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-2.5 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs space-y-0.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700", children: "Post-PHV" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-mono font-bold", children: "Offset > +1.0 thn" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-[10px] leading-tight", children: "Pertumbuhan melambat menuju tinggi dewasa penuh." })
              ] })
            ] })
          ] })
        ] })
      ] }) : (
        /* Empty state if athlete has no records yet */
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center shadow-2xs", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-3 shadow-2xs", children: /* @__PURE__ */ jsx(Activity, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800 mb-1", children: "Belum Ada Data Penilaian PHV" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed", children: [
            "Mulai rekam pengukuran antropometri dan kematangan biologis pertama untuk atlet ",
            athlete.name,
            "."
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route(
                "admin.phv-calculator.create",
                athlete.id
              ),
              className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 rounded-md text-xs font-bold hover:border-orange-300 transition-all shadow-2xs cursor-pointer",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "Mulai Penilaian PHV" })
              ]
            }
          )
        ] })
      ),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-md bg-white border border-slate-200 text-slate-500 flex items-center justify-center shadow-2xs", children: /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-xs sm:text-sm", children: "Riwayat Evaluasi PHV" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80", children: [
            "Total: ",
            assessments.length,
            " Catatan"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs text-slate-600", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-slate-50/80 text-slate-700 font-bold border-b border-slate-200/80 uppercase text-[10px] tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Tanggal Asesmen" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Usia" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Tinggi (cm)" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Duduk (cm)" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Kaki (cm)" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Maturity Offset" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Age at PHV" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Sisa Tumbuh" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Prediksi Dewasa" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-slate-100", children: [
            assessments.map((item) => {
              const itemStatus = getStatusInfo(
                item.maturity_status
              );
              const itemOffset = parseFloat(
                item.maturity_offset
              );
              const isItemOffsetPos = itemOffset >= 0;
              return /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "hover:bg-orange-50/20 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-bold text-slate-800 whitespace-nowrap", children: new Date(
                      item.assessment_date
                    ).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }) }),
                    /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-center font-medium whitespace-nowrap", children: [
                      Math.round(item.age),
                      " thn"
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center font-semibold text-slate-800 whitespace-nowrap", children: item.standing_height || "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center font-medium text-slate-600 whitespace-nowrap", children: item.sitting_height || "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center font-medium text-slate-600 whitespace-nowrap", children: item.leg_length || "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center whitespace-nowrap", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
                      isItemOffsetPos ? `+${itemOffset.toFixed(
                        1
                      )}` : itemOffset.toFixed(
                        1
                      ),
                      " ",
                      "thn"
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: item.phv_age ? parseFloat(
                        item.phv_age
                      ).toFixed(1) : "-" }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `inline-flex items-center px-1.5 py-0.2 rounded text-[8.5px] font-bold border ${itemStatus.badgeBg}`,
                          children: itemStatus.label
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-center font-medium whitespace-nowrap", children: [
                      item.remaining_growth || "-",
                      " ",
                      "cm"
                    ] }),
                    /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-center font-semibold text-slate-800 whitespace-nowrap", children: [
                      item.predicted_adult_height || "-",
                      " ",
                      "cm"
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
                      /* @__PURE__ */ jsx(
                        Link,
                        {
                          href: route(
                            "admin.phv-calculator.edit",
                            item.id
                          ),
                          className: "p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors",
                          title: "Edit Penilaian",
                          children: /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleDelete(
                            item.id
                          ),
                          disabled: isDeleting === item.id,
                          className: "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50 cursor-pointer",
                          title: "Hapus Penilaian",
                          children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                        }
                      )
                    ] }) })
                  ]
                },
                item.id
              );
            }),
            assessments.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
              "td",
              {
                colSpan: "10",
                className: "px-6 py-8 text-center text-slate-400 text-xs",
                children: "Belum ada catatan evaluasi PHV untuk atlet ini."
              }
            ) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(PageFooter, {})
    ] })
  ] });
}
export {
  Show as default
};
