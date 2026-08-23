import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Activity, Flame, Scale, Zap } from "lucide-react";
const MetricGauge = ({
  label,
  value,
  unit,
  ranges,
  maxGaugeValue = 40,
  icon: Icon
}) => {
  if (value === null || value === void 0 || value === "") return null;
  const val = parseFloat(value);
  const positionPct = Math.min(100, Math.max(0, val / maxGaugeValue * 100));
  let currentCategory = { label: "Di luar rentang", color: "gray" };
  Object.values(ranges || {}).forEach((range) => {
    if (val >= range.min && val <= range.max) {
      currentCategory = range;
    }
  });
  const bgColors = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    lime: "bg-teal-500",
    yellow: "bg-amber-400",
    orange: "bg-orange-500",
    red: "bg-rose-500",
    gray: "bg-slate-400"
  };
  const textColors = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    lime: "text-teal-600",
    yellow: "text-amber-600",
    orange: "text-orange-600",
    red: "text-rose-600",
    gray: "text-slate-500"
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-slate-50/50 hover:bg-slate-50/90 border border-slate-200/70 rounded-lg p-2.5 shadow-2xs space-y-1.5 transition-all", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
        Icon && /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded bg-white text-orange-500 flex items-center justify-center shrink-0 border border-slate-200/80 shadow-2xs", children: /* @__PURE__ */ jsx(Icon, { className: "w-3 h-3" }) }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "text-[11px] font-bold text-slate-700 truncate leading-tight",
            title: label,
            children: label
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5 shrink-0", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-slate-900", children: [
          val,
          unit && /* @__PURE__ */ jsx("span", { className: "text-[9.5px] font-bold text-slate-400 ml-0.5", children: unit })
        ] }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `text-[10px] font-bold ${textColors[currentCategory.color] || textColors.gray}`,
            children: currentCategory.label
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative w-full h-2 bg-slate-200/80 rounded-full overflow-hidden", children: Object.values(ranges || {}).map((r, i) => {
      const rMax = Math.min(r.max, maxGaugeValue);
      const left = r.min / maxGaugeValue * 100;
      const width = Math.max(
        0,
        (rMax - r.min) / maxGaugeValue * 100
      );
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute h-full opacity-70 ${bgColors[r.color] || "bg-slate-300"}`,
          style: {
            left: `${left}%`,
            width: `${width}%`
          },
          title: `${r.label}: ${r.min} - ${r.max}`
        },
        i
      );
    }) }),
    /* @__PURE__ */ jsx("div", { className: "relative w-full h-1.5", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute -top-3 -translate-x-1/2 w-3 h-3 bg-white border-2 border-slate-900 rounded-full shadow-xs z-10 transition-all duration-500",
        style: { left: `${positionPct}%` }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[8.5px] text-slate-400 font-medium -mt-1", children: [
      /* @__PURE__ */ jsx("span", { children: "0" }),
      /* @__PURE__ */ jsxs("span", { children: [
        "Batas ",
        maxGaugeValue,
        " ",
        unit
      ] })
    ] })
  ] });
};
function AnalyticsDashboard({ test, player, benchmarks }) {
  if (!test || !benchmarks) return null;
  const isMale = player?.gender === "male" || player?.gender === "L" || player?.gender === "Laki-laki" || !player?.gender;
  const bfBenchmarks = isMale ? benchmarks.body_fat?.male : benchmarks.body_fat?.female;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden transition-colors", children: [
    /* @__PURE__ */ jsx("div", { className: "px-4 py-3 border-b border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-900 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 text-orange-500" }),
        "Ambang Batas & Benchmark"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-400 font-medium leading-relaxed", children: [
        "Posisi nilai aktual atlet pada batas acuan (",
        isMale ? "Putra" : "Putri",
        ")."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-3 space-y-2.5", children: [
      /* @__PURE__ */ jsx(
        MetricGauge,
        {
          label: "Body Fat (%)",
          value: test.body_fat_percentage,
          unit: "%",
          ranges: bfBenchmarks,
          maxGaugeValue: 35,
          icon: Flame
        }
      ),
      /* @__PURE__ */ jsx(
        MetricGauge,
        {
          label: "Lemak Visceral",
          value: test.visceral_fat,
          unit: "Lvl",
          ranges: benchmarks.visceral_fat,
          maxGaugeValue: 20,
          icon: Flame
        }
      ),
      /* @__PURE__ */ jsx(
        MetricGauge,
        {
          label: "BMI",
          value: test.bmi,
          unit: "",
          ranges: benchmarks.bmi,
          maxGaugeValue: 35,
          icon: Scale
        }
      ),
      /* @__PURE__ */ jsx(
        MetricGauge,
        {
          label: "Phase Angle",
          value: test.phase_angle,
          unit: "°",
          ranges: benchmarks.phase_angle,
          maxGaugeValue: 12,
          icon: Zap
        }
      )
    ] })
  ] });
}
export {
  AnalyticsDashboard as default
};
