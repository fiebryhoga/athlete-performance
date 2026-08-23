import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Calculator, Utensils, Activity, ChevronUp, ChevronDown } from "lucide-react";
const ACTIVITY_MULTIPLIERS = [
  { label: "BMR (Metabolisme Basal)", value: 1 },
  { label: "Tidak Aktif (Sedentary)", value: 1.2 },
  { label: "Olahraga Ringan (1-3x/mgg)", value: 1.375 },
  { label: "Olahraga Sedang (3-5x/mgg)", value: 1.55 },
  { label: "Olahraga Berat (6-7x/mgg)", value: 1.725 },
  { label: "Atlet Sangat Aktif (2x/hari)", value: 1.9 }
];
const MACRO_SPLITS = [
  {
    id: "moderate",
    name: "Karbo Sedang (Moderate)",
    ratios: [0.3, 0.35, 0.35],
    desc: "30P / 35L / 35K"
  },
  {
    id: "lower",
    name: "Karbo Rendah (Low Carb)",
    ratios: [0.4, 0.4, 0.2],
    desc: "40P / 40L / 20K"
  },
  {
    id: "higher",
    name: "Karbo Tinggi (High Carb)",
    ratios: [0.3, 0.2, 0.5],
    desc: "30P / 20L / 50K"
  }
];
function TdeeSummary({ test }) {
  const [activeGoal, setActiveGoal] = useState("maintenance");
  const [selectedMacroSplit, setSelectedMacroSplit] = useState("moderate");
  const [showActivityTable, setShowActivityTable] = useState(false);
  const analysis = useMemo(() => {
    if (!test || !test.bmr) return null;
    const bmr2 = parseFloat(test.bmr) || 0;
    const activityLevel = parseFloat(test.activity_level) || 1.2;
    const maintenance2 = Math.round(bmr2 * activityLevel);
    return { bmr: bmr2, maintenance: maintenance2, activityLevel };
  }, [test]);
  if (!analysis) return null;
  const { bmr, maintenance } = analysis;
  const getGoalCalories = (goal) => {
    if (goal === "cutting") return Math.max(1e3, maintenance - 500);
    if (goal === "bulking") return maintenance + 500;
    return maintenance;
  };
  const goalCalories = getGoalCalories(activeGoal);
  const calculateMacros = (cals, ratios) => {
    const [pRatio, fRatio, cRatio] = ratios;
    return {
      protein: Math.round(cals * pRatio / 4),
      fats: Math.round(cals * fRatio / 9),
      carbs: Math.round(cals * cRatio / 4)
    };
  };
  const activeSplit = MACRO_SPLITS.find((s) => s.id === selectedMacroSplit) || MACRO_SPLITS[0];
  const currentMacros = calculateMacros(goalCalories, activeSplit.ratios);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-slate-100 bg-slate-50/50", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-900 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Calculator, { className: "w-3.5 h-3.5 text-orange-500" }),
          "Target Kalori & Makronutrisi"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium leading-relaxed", children: "Kalkulasi kebutuhan energi (Katch-McArdle)." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-200/80 mt-2.5", children: [
        { id: "maintenance", label: "Maintenance" },
        { id: "cutting", label: "Cutting (-500)" },
        { id: "bulking", label: "Bulking (+500)" }
      ].map((g) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setActiveGoal(g.id),
          className: `flex-1 py-1 text-[10.5px] font-bold rounded-md transition-all ${activeGoal === g.id ? "bg-white text-orange-600 shadow-2xs border border-slate-200/60" : "text-slate-500 hover:text-slate-800"}`,
          children: g.label
        },
        g.id
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-3.5 space-y-3.5", children: [
      /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 border border-slate-200/90 shadow-2xs hover:border-orange-200/90 transition-all", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block", children: "Target Energi Harian" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 mt-0.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl font-black tracking-tight leading-none text-slate-900", children: goalCalories.toLocaleString("id-ID") }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-400", children: "kkal/hari" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block", children: "Total Mingguan" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-700 mt-0.5 block", children: [
            (goalCalories * 7).toLocaleString("id-ID"),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-normal", children: "kkal" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-800 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Utensils, { className: "w-3 h-3 text-orange-500" }),
            "Distribusi Makronutrisi"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: MACRO_SPLITS.map((split) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setSelectedMacroSplit(split.id),
              className: `px-1.5 py-0.5 text-[9.5px] font-bold rounded transition-all ${selectedMacroSplit === split.id ? "bg-orange-50 text-orange-700 border border-orange-200" : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60"}`,
              children: split.id === "moderate" ? "Sedang" : split.id === "lower" ? "Rendah" : "Tinggi"
            },
            split.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg p-2 text-center shadow-2xs hover:border-orange-200/90 transition-all", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase tracking-wider block", children: "Protein" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-0.5 mt-0.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-base font-black text-slate-900", children: currentMacros.protein }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400", children: "g" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[8.5px] text-slate-400 font-medium block", children: [
              Math.round(currentMacros.protein * 4),
              " kkal"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg p-2 text-center shadow-2xs hover:border-orange-200/90 transition-all", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase tracking-wider block", children: "Lemak" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-0.5 mt-0.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-base font-black text-slate-900", children: currentMacros.fats }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400", children: "g" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[8.5px] text-slate-400 font-medium block", children: [
              Math.round(currentMacros.fats * 9),
              " kkal"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg p-2 text-center shadow-2xs hover:border-orange-200/90 transition-all", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase tracking-wider block", children: "Karbo" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-0.5 mt-0.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-base font-black text-slate-900", children: currentMacros.carbs }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400", children: "g" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[8.5px] text-slate-400 font-medium block", children: [
              Math.round(currentMacros.carbs * 4),
              " kkal"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border border-slate-200/80 rounded-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowActivityTable(!showActivityTable),
            className: "w-full px-3 py-2 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors",
            children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-slate-700 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Activity, { className: "w-3 h-3 text-orange-500" }),
                "Estimasi Berdasarkan Aktivitas"
              ] }),
              showActivityTable ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-3.5 h-3.5 text-slate-400" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5 text-slate-400" })
            ]
          }
        ),
        showActivityTable && /* @__PURE__ */ jsx("div", { className: "p-2 divide-y divide-slate-100 bg-white", children: ACTIVITY_MULTIPLIERS.map((act, idx) => {
          const baseMaintenance = Math.round(
            bmr * act.value
          );
          let cals = baseMaintenance;
          if (act.label !== "BMR (Metabolisme Basal)") {
            if (activeGoal === "cutting")
              cals = Math.max(1e3, cals - 500);
            if (activeGoal === "bulking") cals += 500;
          }
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex justify-between items-center py-1.5 px-2 hover:bg-slate-50 rounded text-[10.5px]",
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-600 font-medium", children: act.label }),
                /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
                  cals.toLocaleString("id-ID"),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 font-normal", children: "kkal" })
                ] })
              ]
            },
            idx
          );
        }) })
      ] })
    ] })
  ] });
}
export {
  TdeeSummary as default
};
