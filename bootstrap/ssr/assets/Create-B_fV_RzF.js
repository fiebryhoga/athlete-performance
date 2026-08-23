import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head } from "@inertiajs/react";
import { Scale, User, Activity, Flame, Droplets, Save } from "lucide-react";
import { useState, useEffect } from "react";
import "axios";
function Create({ athletes }) {
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const { data, setData, post, processing, reset } = useForm({
    user_id: "",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    age: "",
    metabolic_age: "",
    weight: "",
    height: "",
    bmi: "",
    body_fat_percentage: "",
    muscle_mass: "",
    bone_mass: "",
    visceral_fat: "",
    bmr: "",
    total_body_water: ""
  });
  const handleAthleteChange = (e) => {
    const id = e.target.value;
    const athlete = athletes.find((a) => String(a.id) === String(id));
    setSelectedAthlete(athlete);
    setData((prev) => ({
      ...prev,
      user_id: id,
      age: athlete?.age || "",
      weight: athlete?.weight || "",
      height: athlete?.height || ""
    }));
  };
  useEffect(() => {
    if (data.weight && data.height && data.height > 0) {
      const bmiValue = (parseFloat(data.weight) / (parseFloat(data.height) * parseFloat(data.height))).toFixed(2);
      setData("bmi", bmiValue);
    } else {
      setData("bmi", "");
    }
  }, [data.weight, data.height]);
  const getBmiRating = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: "Underweight", color: "bg-yellow-100 text-yellow-700" };
    if (bmi <= 22.9) return { label: "Normal", color: "bg-green-100 text-green-700" };
    if (bmi <= 24.9) return { label: "Overweight", color: "bg-orange-100 text-orange-700" };
    if (bmi <= 29.9) return { label: "Obesitas I", color: "bg-rose-100 text-rose-700" };
    return { label: "Obesitas II", color: "bg-red-200 text-red-800" };
  };
  const getVisceralRating = (vf) => {
    if (!vf) return null;
    if (vf <= 9) return { label: "Standart", color: "bg-green-100 text-green-700" };
    if (vf <= 14) return { label: "High", color: "bg-orange-100 text-orange-700" };
    return { label: "Very High", color: "bg-rose-100 text-rose-700" };
  };
  const getBodyFatRating = (bf, gender) => {
    if (!bf || !gender) return null;
    const g = gender.toUpperCase();
    if (g === "L") {
      if (bf >= 2 && bf <= 5) return { label: "Esensial", color: "bg-blue-100 text-blue-700" };
      if (bf <= 13) return { label: "Atlet", color: "bg-emerald-100 text-emerald-700" };
      if (bf <= 17) return { label: "Fitness", color: "bg-green-100 text-green-700" };
      if (bf <= 24) return { label: "Acceptable", color: "bg-yellow-100 text-yellow-700" };
      return { label: "Obesity", color: "bg-rose-100 text-rose-700" };
    } else {
      if (bf >= 2 && bf <= 13) return { label: "Esensial", color: "bg-blue-100 text-blue-700" };
      if (bf >= 14 && bf <= 20) return { label: "Atlet", color: "bg-emerald-100 text-emerald-700" };
      if (bf <= 24) return { label: "Fitness", color: "bg-green-100 text-green-700" };
      if (bf <= 31) return { label: "Acceptable", color: "bg-yellow-100 text-yellow-700" };
      return { label: "Obesity", color: "bg-rose-100 text-rose-700" };
    }
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.composition-tests.store"), {
      onSuccess: () => reset()
    });
  };
  const bmiInfo = getBmiRating(data.bmi);
  const visceralInfo = getVisceralRating(data.visceral_fat);
  const bodyFatInfo = getBodyFatRating(data.body_fat_percentage, selectedAthlete?.gender || "L");
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Input Body Composition", children: [
    /* @__PURE__ */ jsx(Head, { title: "Input Body Composition Test" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto pb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl  font-bold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Scale, { className: "w-6 h-6 text-[#00488b]" }),
          " Body Composition Test"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium mt-1 text-sm", children: "Catat metrik tubuh klien. Data berat, tinggi, dan usia akan tersinkronisasi otomatis dengan profil Atlet." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 border-b border-slate-100 bg-slate-50/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-100 text-[#00488b] flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Identitas & Metrik Dasar" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Pilih Client" }),
              /* @__PURE__ */ jsxs("select", { value: data.user_id, onChange: handleAthleteChange, className: "w-full rounded-xl border-slate-200 text-sm bg-white focus:ring-[#00488b]", required: true, children: [
                /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "-- Pilih Klien --" }),
                athletes.map((a) => /* @__PURE__ */ jsxs("option", { value: a.id, children: [
                  a.name,
                  " (",
                  a.gender === "L" ? "L" : "P",
                  ")"
                ] }, a.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Tanggal Test" }),
              /* @__PURE__ */ jsx("input", { type: "date", value: data.date, onChange: (e) => setData("date", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm bg-white focus:ring-[#00488b]", required: true })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Age" }),
                /* @__PURE__ */ jsx("input", { type: "number", value: data.age, onChange: (e) => setData("age", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm font-bold", required: true })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Metabolic Age" }),
                /* @__PURE__ */ jsx("input", { type: "number", value: data.metabolic_age, onChange: (e) => setData("metabolic_age", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Weight (KG)" }),
                /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", value: data.weight, onChange: (e) => setData("weight", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm font-bold text-blue-700", required: true })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Height (Meter)" }),
                /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", placeholder: "Cth: 1.75", value: data.height, onChange: (e) => setData("height", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm font-bold text-blue-700", required: true })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Detail Komposisi Tubuh" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { children: "BMI (Kg/M2)" }),
                bmiInfo && /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[8px] ${bmiInfo.color}`, children: bmiInfo.label })
              ] }),
              /* @__PURE__ */ jsx("input", { type: "number", value: data.bmi, readOnly: true, className: "w-full rounded-xl border-slate-200 text-sm bg-slate-100 text-slate-500  font-bold cursor-not-allowed" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { children: "Bodyfat %" }),
                bodyFatInfo && /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[8px] ${bodyFatInfo.color}`, children: bodyFatInfo.label })
              ] }),
              /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", value: data.body_fat_percentage, onChange: (e) => setData("body_fat_percentage", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Muscle Mass" }),
              /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", value: data.muscle_mass, onChange: (e) => setData("muscle_mass", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Bone Mass" }),
              /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", value: data.bone_mass, onChange: (e) => setData("bone_mass", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { children: "Visceral Fat" }),
                visceralInfo && /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[8px] ${visceralInfo.color}`, children: visceralInfo.label })
              ] }),
              /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", value: data.visceral_fat, onChange: (e) => setData("visceral_fat", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Flame, { className: "w-3 h-3 text-orange-500" }),
                " BMR (Kcal)"
              ] }),
              /* @__PURE__ */ jsx("input", { type: "number", value: data.bmr, onChange: (e) => setData("bmr", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Droplets, { className: "w-3 h-3 text-blue-500" }),
                " Total Body Water %"
              ] }),
              /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", value: data.total_body_water, onChange: (e) => setData("total_body_water", e.target.value), className: "w-full rounded-xl border-slate-200 text-sm" }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 block mt-1", children: "Ref: L 50-65% | P 45-60%" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-6 bg-slate-50 border-t border-slate-100 flex justify-end", children: /* @__PURE__ */ jsxs("button", { type: "submit", disabled: processing, className: "px-8 py-3 bg-orange-500 text-white  font-bold text-sm rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003666] transition-all flex items-center gap-2", children: [
          processing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
          "SIMPAN COMPOSITION TEST"
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Create as default
};
