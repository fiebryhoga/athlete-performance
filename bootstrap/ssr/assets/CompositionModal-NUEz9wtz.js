import { jsx, jsxs } from "react/jsx-runtime";
import { Scale, X, Save, Calculator, Activity, HeartPulse, Zap, Droplets, Dumbbell, UserCheck } from "lucide-react";
import { useState } from "react";
function CompositionModal({
  isOpen,
  onClose,
  data,
  setData,
  submit,
  processing,
  athlete
}) {
  if (!isOpen) return null;
  const [activeTool, setActiveTool] = useState("bodyfat");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const estimatedBF = (() => {
    if (!data.height || !neck || !waist || athlete.gender === "P" && !hip)
      return null;
    const h = parseFloat(data.height) * 100, n = parseFloat(neck), w = parseFloat(waist), hi = parseFloat(hip);
    let bf = athlete.gender === "L" ? 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450 : 495 / (1.29579 - 0.35004 * Math.log10(w + hi - n) + 0.221 * Math.log10(h)) - 450;
    return isNaN(bf) ? null : Math.max(2, bf).toFixed(1);
  })();
  const estimatedVisceral = (() => {
    if (!waist) return null;
    const w = parseFloat(waist);
    const v = Math.round(w / 10 - (athlete.gender === "L" ? 2 : 3));
    return isNaN(v) ? null : Math.max(1, v);
  })();
  const estimatedBMR = (() => {
    if (!data.weight || !data.height || !data.age) return null;
    const w = parseFloat(data.weight), h = parseFloat(data.height) * 100, a = parseFloat(data.age);
    const bmr = athlete.gender === "L" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    return isNaN(bmr) ? null : Math.round(bmr);
  })();
  const estimatedTBW = (() => {
    if (!data.weight || !data.height || !data.age) return null;
    const w = parseFloat(data.weight), h = parseFloat(data.height) * 100, a = parseFloat(data.age);
    let tbwLiters = athlete.gender === "L" ? 2.447 - 0.09156 * a + 0.1074 * h + 0.3362 * w : -2.097 + 0.1069 * h + 0.2466 * w;
    const percent = tbwLiters / w * 100;
    return isNaN(percent) ? null : percent.toFixed(1);
  })();
  const estimatedBone = (() => {
    if (!data.weight) return null;
    const w = parseFloat(data.weight);
    if (athlete.gender === "L") return w < 60 ? 2.5 : w <= 75 ? 2.9 : 3.2;
    return w < 45 ? 1.8 : w <= 60 ? 2.2 : 2.5;
  })();
  const estimatedMuscle = (() => {
    if (!data.weight || !data.body_fat_percentage) return null;
    const w = parseFloat(data.weight);
    const bf = parseFloat(data.body_fat_percentage);
    const bone = estimatedBone ? parseFloat(estimatedBone) : 2.5;
    const muscle = w - w * (bf / 100) - bone;
    return isNaN(muscle) ? null : Math.max(0, muscle).toFixed(1);
  })();
  const estimatedMetAge = (() => {
    if (!data.age || !data.body_fat_percentage) return null;
    const a = parseFloat(data.age), bf = parseFloat(data.body_fat_percentage);
    const normalBf = athlete.gender === "L" ? 15 : 23;
    const met = Math.round(a + (bf - normalBf) / 1.2);
    return isNaN(met) ? null : Math.max(12, met);
  })();
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white w-full max-w-6xl rounded-lg shadow-2xl flex flex-col xl:flex-row my-auto max-h-[95vh] xl:max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 xl:w-7/12 border-b xl:border-b-0 xl:border-r border-slate-200 flex flex-col overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-20 px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-bold text-base md:text-lg text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Scale, { className: "w-4 h-4 md:w-5 md:h-5 text-orange-500" }),
          " ",
          "Record Composition"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "p-1.5 md:p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors",
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submit,
          className: "p-4 md:p-6 sm:p-8 flex-1 flex flex-col bg-white",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 md:mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "col-span-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Tanggal Tes" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "date",
                    value: data.date,
                    onChange: (e) => setData("date", e.target.value),
                    className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Usia Biologis" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: data.age,
                    onChange: (e) => setData("age", e.target.value),
                    className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm",
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 md:mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "col-span-1 p-3 sm:p-4 bg-orange-50/50 rounded-lg border border-orange-100 shadow-sm", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-orange-500 mb-1 block", children: "Berat (KG)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.01",
                    value: data.weight,
                    onChange: (e) => setData("weight", e.target.value),
                    className: "w-full rounded-lg border-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-base md:text-lg font-bold shadow-sm outline-none transition-all text-slate-800",
                    required: true,
                    placeholder: "0.00"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-1 p-3 sm:p-4 bg-orange-50/50 rounded-lg border border-orange-100 shadow-sm", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-orange-500 mb-1 block", children: "Tinggi (Meter)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.01",
                    value: data.height,
                    onChange: (e) => setData("height", e.target.value),
                    className: "w-full rounded-lg border-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-base md:text-lg font-bold shadow-sm outline-none transition-all text-slate-800",
                    required: true,
                    placeholder: "1.70"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 border-t border-slate-100 pt-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Bodyfat %" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.1",
                    value: data.body_fat_percentage,
                    onChange: (e) => setData(
                      "body_fat_percentage",
                      e.target.value
                    ),
                    className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Muscle Mass" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.1",
                    value: data.muscle_mass,
                    onChange: (e) => setData("muscle_mass", e.target.value),
                    className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Bone Mass" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.1",
                    value: data.bone_mass,
                    onChange: (e) => setData("bone_mass", e.target.value),
                    className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Visceral Fat" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.1",
                    value: data.visceral_fat,
                    onChange: (e) => setData("visceral_fat", e.target.value),
                    className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1.5 block", children: "BMR (Kcal)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: data.bmr,
                    onChange: (e) => setData("bmr", e.target.value),
                    className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1.5 block", children: "TBW % (Air)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.1",
                    value: data.total_body_water,
                    onChange: (e) => setData(
                      "total_body_water",
                      e.target.value
                    ),
                    className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-2 sm:col-span-3 lg:col-span-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Metabolic Age" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: data.metabolic_age,
                    onChange: (e) => setData("metabolic_age", e.target.value),
                    className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50 focus:bg-white transition-all outline-none shadow-sm",
                    placeholder: "Opsional"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-6 md:pt-8 mt-auto border-t border-slate-100 hidden xl:block", children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "w-full py-3 md:py-4 bg-orange-500 text-white font-bold rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 text-sm disabled:opacity-70",
                children: [
                  processing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                  processing ? "Menyimpan..." : "Simpan Rekaman Tes"
                ]
              }
            ) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "xl:w-5/12 bg-slate-50 flex flex-col relative border-t xl:border-t-0 border-slate-200 xl:border-none overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ jsx("div", { className: "px-4 md:px-6 py-4 md:py-5 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 flex justify-between items-center", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-bold text-base md:text-lg text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Calculator, { className: "w-4 h-4 md:w-5 md:h-5 text-teal-600" }),
          " ",
          "Helper Tools"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs text-slate-500 mt-0.5", children: "Kalkulator jika Anda hanya membawa meteran pita." })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex px-3 md:px-4 pt-3 border-b border-slate-200 overflow-x-auto custom-scrollbar bg-slate-100 sticky top-[60px] md:top-[70px] z-10", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTool("bodyfat"),
            className: `pb-2.5 px-3 text-[10px] md:text-xs font-bold border-b-2 whitespace-nowrap transition-all ${activeTool === "bodyfat" ? "border-teal-500 text-teal-700 bg-slate-50 rounded-t-lg" : "border-transparent text-slate-400 hover:text-slate-600"}`,
            children: "1. Lemak & Visc"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTool("bmr"),
            className: `pb-2.5 px-3 text-[10px] md:text-xs font-bold border-b-2 whitespace-nowrap transition-all ${activeTool === "bmr" ? "border-teal-500 text-teal-700 bg-slate-50 rounded-t-lg" : "border-transparent text-slate-400 hover:text-slate-600"}`,
            children: "2. BMR & Air"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTool("mass"),
            className: `pb-2.5 px-3 text-[10px] md:text-xs font-bold border-b-2 whitespace-nowrap transition-all ${activeTool === "mass" ? "border-teal-500 text-teal-700 bg-slate-50 rounded-t-lg" : "border-transparent text-slate-400 hover:text-slate-600"}`,
            children: "3. Otot & Tulang"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-6 flex-1 flex flex-col pb-8", children: [
        activeTool === "bodyfat" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-in fade-in duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-teal-50/50 p-3 md:p-4 rounded-lg border border-teal-100 text-[10px] md:text-xs text-teal-800 font-medium leading-relaxed", children: [
            "Menggunakan metode ukur US Navy. Pastikan input",
            " ",
            /* @__PURE__ */ jsx("strong", { className: "font-bold text-teal-900", children: "Tinggi Badan" }),
            " ",
            "di form utama sudah terisi."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:gap-4 mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "col-span-2 sm:col-span-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-500 mb-1.5 block", children: "Lingkar Leher (cm)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.1",
                  value: neck,
                  onChange: (e) => setNeck(e.target.value),
                  className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm",
                  placeholder: "Cth: 38"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "col-span-2 sm:col-span-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-500 mb-1.5 block", children: "Lingkar Perut (cm)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.1",
                  value: waist,
                  onChange: (e) => setWaist(e.target.value),
                  className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm",
                  placeholder: "Pada pusar"
                }
              )
            ] }),
            athlete.gender === "P" && /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-500 mb-1.5 block", children: "Lingkar Pinggul (cm) - Wanita" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.1",
                  value: hip,
                  onChange: (e) => setHip(e.target.value),
                  className: "w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm",
                  placeholder: "Bagian terlebar"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex flex-col gap-3 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1", children: [
                  /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 text-teal-500" }),
                  " ",
                  "Body Fat %"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold text-teal-600", children: estimatedBF ? `${estimatedBF}%` : "-" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => estimatedBF && setData(
                    "body_fat_percentage",
                    estimatedBF
                  ),
                  disabled: !estimatedBF,
                  className: "px-3 md:px-4 py-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50",
                  children: "Terapkan"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-px bg-slate-100 w-full" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1", children: [
                  /* @__PURE__ */ jsx(HeartPulse, { className: "w-3.5 h-3.5 text-rose-500" }),
                  " ",
                  "Visceral Rating"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold text-rose-600", children: estimatedVisceral || "-" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => estimatedVisceral && setData(
                    "visceral_fat",
                    estimatedVisceral
                  ),
                  disabled: !estimatedVisceral,
                  className: "px-3 md:px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50",
                  children: "Terapkan"
                }
              )
            ] })
          ] })
        ] }),
        activeTool === "bmr" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-in fade-in duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-teal-50/50 p-3 md:p-4 rounded-lg border border-teal-100 text-[10px] md:text-xs text-teal-800 font-medium leading-relaxed", children: [
            "Menggunakan rumus Mifflin-St Jeor (BMR) dan Watson (Air). Pastikan",
            " ",
            /* @__PURE__ */ jsx("strong", { className: "font-bold text-teal-900", children: "Usia, Berat, dan Tinggi" }),
            " ",
            "di form utama sudah terisi."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 md:gap-4 mt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1", children: [
                  /* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 text-amber-500" }),
                  " ",
                  "BMR (Kcal)"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold text-amber-600", children: estimatedBMR || "-" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => estimatedBMR && setData("bmr", estimatedBMR),
                  disabled: !estimatedBMR,
                  className: "px-3 md:px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50",
                  children: "Terapkan"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1", children: [
                  /* @__PURE__ */ jsx(Droplets, { className: "w-3.5 h-3.5 text-teal-500" }),
                  " ",
                  "Air / TBW (%)"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold text-teal-600", children: estimatedTBW ? `${estimatedTBW}%` : "-" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => estimatedTBW && setData(
                    "total_body_water",
                    estimatedTBW
                  ),
                  disabled: !estimatedTBW,
                  className: "px-3 md:px-4 py-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50",
                  children: "Terapkan"
                }
              )
            ] })
          ] })
        ] }),
        activeTool === "mass" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-in fade-in duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-teal-50/50 p-3 md:p-4 rounded-lg border border-teal-100 text-[10px] md:text-xs text-teal-800 font-medium leading-relaxed", children: [
            "Pastikan metrik",
            " ",
            /* @__PURE__ */ jsx("strong", { className: "font-bold text-teal-900", children: "Body Fat %" }),
            " ",
            "di form kiri sudah terisi agar sistem dapat memisahkan massa otot dan tulang secara akurat."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 md:gap-4 mt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1", children: [
                  /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 text-slate-400" }),
                  " ",
                  "Bone Mass (Kg)"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold text-slate-700", children: estimatedBone || "-" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => estimatedBone && setData(
                    "bone_mass",
                    estimatedBone
                  ),
                  disabled: !estimatedBone,
                  className: "px-3 md:px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50",
                  children: "Terapkan"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1", children: [
                  /* @__PURE__ */ jsx(Dumbbell, { className: "w-3.5 h-3.5 text-emerald-500" }),
                  " ",
                  "Est. Muscle (Kg)"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold text-emerald-600", children: estimatedMuscle || "-" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => estimatedMuscle && setData(
                    "muscle_mass",
                    estimatedMuscle
                  ),
                  disabled: !estimatedMuscle,
                  className: "px-3 md:px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50",
                  children: "Terapkan"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1", children: [
                  /* @__PURE__ */ jsx(UserCheck, { className: "w-3.5 h-3.5 text-teal-600" }),
                  " ",
                  "Metabolic Age"
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold text-teal-700", children: estimatedMetAge || "-" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => estimatedMetAge && setData(
                    "metabolic_age",
                    estimatedMetAge
                  ),
                  disabled: !estimatedMetAge,
                  className: "px-3 md:px-4 py-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50",
                  children: "Terapkan"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "xl:hidden mt-auto pt-8", children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              submit(e);
            },
            disabled: processing,
            className: "w-full py-4 bg-orange-500 text-white font-bold rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all flex justify-center items-center gap-2 text-sm disabled:opacity-70",
            children: [
              processing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
              processing ? "Menyimpan..." : "Simpan Rekaman Tes"
            ]
          }
        ) })
      ] })
    ] })
  ] }) });
}
export {
  CompositionModal as default
};
