import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Plus, ShieldCheck, Compass, User, Scale } from "lucide-react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import TrendHighlights from "./TrendHighlights-CD3GjLl4.js";
import CompositionAnatomy from "./CompositionAnatomy-D18WAKuA.js";
import AnalyticsDashboard from "./AnalyticsDashboard-BS00o0Z4.js";
import SmartInsights from "./SmartInsights-_1nD7GeQ.js";
import HistoryTable from "./HistoryTable-CvsPGuPk.js";
import CompositionFormModal from "./CompositionFormModal-Z7y8VoIJ.js";
import TdeeSummary from "./TdeeSummary-b2KlQE7a.js";
import "axios";
import "./Modal-DUGk5ZHw.js";
import "@headlessui/react";
function Show({
  auth,
  player = {},
  history = [],
  benchmarks = {}
}) {
  const isAthlete = auth?.user?.role === "athlete";
  const { permissions } = usePage().props;
  const canCreate = permissions?.body_composition?.create ?? true;
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const latestTest = history.length > 0 ? history[0] : null;
  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsFormModalOpen(true);
  };
  const handleAddRecord = () => {
    setEditingRecord(null);
    setIsFormModalOpen(true);
  };
  const getInitials = (name) => {
    if (!name) return "??";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  const getAthleteCode = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length >= 3) {
      return `@${words[0][0]}${words[1][0]}${words[2][0]}`.toUpperCase();
    }
    if (words.length === 2) {
      return `@${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return `@${name.substring(0, 3)}`.toUpperCase();
  };
  const isFemale = player?.gender === "P" || player?.gender === "female" || player?.gender === "Perempuan";
  const genderFull = isFemale ? "Perempuan" : "Laki-laki";
  const coachesList = player?.coaches && player.coaches.length > 0 ? player.coaches.map((c) => c.name).join(", ") : null;
  const currentWeight = latestTest?.weight || player?.weight || "-";
  const currentHeight = latestTest?.height || player?.height || "-";
  const currentAge = latestTest?.age || player?.age || "-";
  const calculateBMI = (h, w) => {
    if (h === "-" || w === "-") return "-";
    const heightInM = parseFloat(h) / 100;
    const bmiVal = parseFloat(w) / (heightInM * heightInM);
    return parseFloat(bmiVal.toFixed(1));
  };
  const bmi = latestTest?.bmi || calculateBMI(currentHeight, currentWeight);
  const getBMIStatus = (val) => {
    if (val === "-" || isNaN(val))
      return {
        label: "-",
        color: "text-slate-400",
        bg: "bg-slate-50 border-slate-200"
      };
    const num = parseFloat(val);
    if (num < 18.5)
      return {
        label: "Underweight",
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200"
      };
    if (num >= 18.5 && num <= 22.9)
      return {
        label: "Ideal",
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200"
      };
    if (num >= 23 && num <= 24.9)
      return {
        label: "Normal",
        color: "text-teal-600",
        bg: "bg-teal-50 border-teal-200"
      };
    if (num >= 25 && num <= 29.9)
      return {
        label: "Overweight",
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-200"
      };
    return {
      label: "Obese",
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-200"
    };
  };
  const bmiStatus = getBMIStatus(bmi);
  return /* @__PURE__ */ jsxs(
    AppLayout,
    {
      title: `Komposisi Tubuh - ${player.name}`,
      description: `Analisis detail komposisi tubuh, massa otot, persentase lemak, dan performa seluler atlet ${player.name}.`,
      children: [
        /* @__PURE__ */ jsx(Head, { title: `Komposisi Tubuh - ${player.name}` }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            !isAthlete && /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("admin.composition-tests.index"),
                className: "inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5",
                children: [
                  /* @__PURE__ */ jsx(ArrowLeft, { size: 13 }),
                  " Kembali ke Komposisi Tubuh"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              PageHeader,
              {
                title: "Analisis Komposisi Tubuh",
                description: `Evaluasi bioimpedansi atlet, distribusi jaringan otot, lemak tubuh, dan metabolisme.`,
                actions: !isAthlete && canCreate && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleAddRecord,
                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Tambah Data" })
                    ]
                  }
                )
              }
            )
          ] }),
          latestTest ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4 items-start", children: [
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
                    /* @__PURE__ */ jsx("span", { children: player.package?.name || player.subscription_package?.name || (player.sport?.name ? `${player.sport.name}` : "Member") })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "px-5 pb-4 pt-2.5 sm:pt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col xl:flex-row xl:items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3.5 min-w-0", children: [
                    /* @__PURE__ */ jsx("div", { className: "relative -mt-10 sm:-mt-12 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-xl border-[3px] border-white shadow-md overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 font-black text-2xl flex items-center justify-center shrink-0 z-10", children: player.photo_url ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: player.photo_url,
                        alt: player.name,
                        className: "w-full h-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsx("span", { className: "leading-none select-none", children: getInitials(
                      player.name
                    ) }) }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsx("h2", { className: "text-base sm:text-lg font-black text-slate-900 leading-tight uppercase tracking-tight", children: player.name || "Unknown" }),
                        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono text-slate-400 font-bold", children: player.username ? `@${player.username}` : getAthleteCode(
                          player.name
                        ) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                        player.sport?.name && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded text-[10.5px]", children: [
                          /* @__PURE__ */ jsx(
                            Compass,
                            {
                              size: 11,
                              className: "text-orange-500"
                            }
                          ),
                          player.sport.name
                        ] }),
                        player.category && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded text-[10.5px] uppercase", children: player.category })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap", children: [
                        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                          /* @__PURE__ */ jsx(
                            User,
                            {
                              size: 12,
                              className: "text-slate-400"
                            }
                          ),
                          genderFull
                        ] }),
                        coachesList && /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "•" }),
                          /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
                            "Pelatih:",
                            " ",
                            /* @__PURE__ */ jsx("strong", { className: "text-slate-700 font-bold", children: coachesList })
                          ] })
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-2.5 self-stretch xl:self-auto justify-between xl:justify-end border-t xl:border-t-0 pt-3 xl:pt-0 border-slate-100 overflow-x-auto", children: [
                    /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 bg-white rounded-lg border border-slate-200/80 text-center shadow-2xs min-w-[72px]", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider block", children: "Tinggi" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-0.5 mt-0.5", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-sm sm:text-base font-black text-slate-900", children: currentHeight }),
                        /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400", children: "cm" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 bg-white rounded-lg border border-slate-200/80 text-center shadow-2xs min-w-[72px]", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider block", children: "Berat" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-0.5 mt-0.5", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-sm sm:text-base font-black text-slate-900", children: currentWeight }),
                        /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400", children: "kg" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 bg-white rounded-lg border border-slate-200/80 text-center shadow-2xs min-w-[72px]", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider block", children: "Usia" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-0.5 mt-0.5", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-sm sm:text-base font-black text-slate-900", children: currentAge }),
                        /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400", children: "thn" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 bg-white rounded-lg border border-slate-200/80 text-center shadow-2xs min-w-[72px]", children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `text-[9.5px] font-bold block ${bmiStatus.color}`,
                          children: bmiStatus.label
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-0.5 mt-0.5", children: [
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `text-sm sm:text-base font-black ${bmiStatus.color}`,
                            children: bmi
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400", children: "BMI" })
                      ] })
                    ] })
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsx(TrendHighlights, { history }),
              /* @__PURE__ */ jsx(
                CompositionAnatomy,
                {
                  test: latestTest,
                  player
                }
              ),
              /* @__PURE__ */ jsx(
                HistoryTable,
                {
                  history,
                  onEdit: !isAthlete ? handleEdit : null,
                  canDelete: !isAthlete
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-4", children: [
              /* @__PURE__ */ jsx(
                AnalyticsDashboard,
                {
                  test: latestTest,
                  player,
                  benchmarks
                }
              ),
              /* @__PURE__ */ jsx(
                SmartInsights,
                {
                  test: latestTest,
                  player,
                  benchmarks
                }
              ),
              /* @__PURE__ */ jsx(TdeeSummary, { test: latestTest, player })
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-3 text-orange-500 shadow-2xs", children: /* @__PURE__ */ jsx(Scale, { className: "w-7 h-7" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900 mb-1", children: "Belum Ada Data Evaluasi Komposisi Tubuh" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed", children: "Atlet ini belum memiliki catatan riwayat bioimpedansi. Tambahkan data pengukuran pertama untuk melihat analisis mendalam." }),
            !isAthlete && canCreate && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleAddRecord,
                className: "inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Input Data Pertama" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(PageFooter, {})
        ] }),
        /* @__PURE__ */ jsx(
          CompositionFormModal,
          {
            isOpen: isFormModalOpen,
            onClose: () => setIsFormModalOpen(false),
            player,
            record: editingRecord
          }
        )
      ]
    }
  );
}
export {
  Show as default
};
