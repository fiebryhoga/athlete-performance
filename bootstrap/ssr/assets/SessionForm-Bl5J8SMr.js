import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { Activity, ArrowLeft, ArrowRight, HeartPulse, CheckSquare, Clock } from "lucide-react";
import { B as BodyHighlighter } from "./BodyHighlighter-CAt1_A-z.js";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
const MUSCLE_PAIN_AREAS = [
  "Neck (L)",
  "Neck (R)",
  "Trapezius (L)",
  "Trapezius (R)",
  "Front Deltoids (L)",
  "Front Deltoids (R)",
  "Back Deltoids (L)",
  "Back Deltoids (R)",
  "Chest (L)",
  "Chest (R)",
  "Upper Back (L)",
  "Upper Back (R)",
  "Lower Back (L)",
  "Lower Back (R)",
  "Rectus Abdominis (L)",
  "Rectus Abdominis (R)",
  "Obliques (L)",
  "Obliques (R)",
  "Biceps (L)",
  "Biceps (R)",
  "Triceps (L)",
  "Triceps (R)",
  "Forearm (L)",
  "Forearm (R)",
  "Gluteal (L)",
  "Gluteal (R)",
  "Abductors (L)",
  "Abductors (R)",
  "Quadriceps (L)",
  "Quadriceps (R)",
  "Hamstring (L)",
  "Hamstring (R)",
  "Knees (L)",
  "Knees (R)",
  "Calves (L)",
  "Calves (R)",
  "Ankles (L)",
  "Ankles (R)",
  "Head"
];
function SessionForm({
  auth,
  date,
  log,
  redirectTo,
  mode = "all",
  training_id,
  isCompleted = false,
  athlete_id = null
}) {
  const isWellnessLocked = isCompleted && (mode === "all" || mode === "wellness");
  const { data, setData, post, processing, errors, transform } = useForm({
    date,
    session_type: "am",
    rpe: log?.am_rpe || "",
    duration: log?.am_duration || "",
    // Wellness
    quality_of_sleep: log?.quality_of_sleep || "",
    stress: log?.stress || "",
    fatigue: log?.fatigue || "",
    muscle_soreness: log?.muscle_soreness || "",
    motivation: log?.motivation || "",
    mood_state: log?.mood_state || "",
    muscle_pain_areas: log?.muscle_pain_areas || [],
    other_pain: "",
    // Temporary field to handle "Other:" text
    redirect_to: redirectTo || "",
    athlete_id
  });
  const [isWellnessExpanded, setIsWellnessExpanded] = useState(
    mode === "all" || mode === "wellness"
  );
  const [isRpeExpanded, setIsRpeExpanded] = useState(
    mode === "all" || mode === "rpe"
  );
  React.useEffect(() => {
    if (log?.muscle_pain_areas && Array.isArray(log.muscle_pain_areas)) {
      const otherArea = log.muscle_pain_areas.find(
        (a) => a.startsWith("Other: ")
      );
      if (otherArea) {
        setData("other_pain", otherArea.replace("Other: ", ""));
      }
    }
  }, [log]);
  const handleSessionTypeChange = (type) => {
    setData((data2) => ({
      ...data2,
      session_type: type,
      rpe: type === "am" ? log?.am_rpe || "" : log?.pm_rpe || "",
      duration: type === "am" ? log?.am_duration || "" : log?.pm_duration || ""
    }));
  };
  const togglePainArea = (area) => {
    if (isWellnessLocked) return;
    setData(
      "muscle_pain_areas",
      data.muscle_pain_areas.includes(area) ? data.muscle_pain_areas.filter((a) => a !== area) : [...data.muscle_pain_areas, area]
    );
  };
  const submit = (e) => {
    e.preventDefault();
    setRpeError("");
    transform((data2) => {
      let finalAreas = data2.muscle_pain_areas.filter(
        (a) => !a.startsWith("Other: ")
      );
      if (data2.other_pain.trim() !== "") {
        finalAreas.push(`Other: ${data2.other_pain.trim()}`);
      }
      return {
        ...data2,
        muscle_pain_areas: finalAreas
      };
    });
    post(route("admin.wellness-rpe.store-session"));
  };
  const isWellnessComplete = data.quality_of_sleep && data.stress && data.fatigue && data.muscle_soreness && data.motivation && data.mood_state;
  const isRpeComplete = data.rpe && data.duration;
  const [rpeError, setRpeError] = useState("");
  const isSubmitDisabled = processing || mode === "wellness" && isWellnessLocked || (mode === "all" || mode === "wellness") && !isWellnessComplete && !isWellnessLocked;
  const renderScaleButtons = (field, label, leftLabel, rightLabel) => {
    const getColorClass = (num, isSelected) => {
      const colors = {
        1: "bg-[#34a853]",
        // Green (Excellent)
        2: "bg-[#4285f4]",
        // Blue (Good)
        3: "bg-[#fbbc05]",
        // Yellow (OK)
        4: "bg-[#f57c00]",
        // Orange (Poor)
        5: "bg-[#ea4335]"
        // Red (Awful)
      };
      const baseColor = colors[num];
      if (isSelected) {
        return `${baseColor} text-white border-transparent shadow-lg transform scale-[1.03] ring-2 ring-offset-2 ring-slate-400  z-10`;
      }
      return `${baseColor} text-white/90 border-transparent opacity-70 hover:opacity-100 hover:scale-[1.02]`;
    };
    return /* @__PURE__ */ jsxs("div", { className: "space-y-3 p-5 bg-slate-50  rounded-xl border border-slate-100 ", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-slate-900  tracking-tight", children: label }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[11px] font-bold text-slate-600  mb-1", children: [
        /* @__PURE__ */ jsx("span", { children: leftLabel }),
        /* @__PURE__ */ jsx("span", { children: rightLabel })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex", children: [1, 2, 3, 4, 5].map((num, idx) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: isWellnessLocked,
          onClick: () => {
            if (isWellnessLocked) return;
            setData(field, num);
          },
          className: `flex-1 sm:h-12 py-3 font-bold text-sm sm:text-base transition-all relative
                                ${idx === 0 ? "rounded-l-md" : ""} 
                                ${idx === 4 ? "rounded-r-md" : ""}
                                ${getColorClass(num, data[field] === num)}
                                ${isWellnessLocked ? "cursor-not-allowed opacity-50" : ""}
                            `,
          children: num
        },
        num
      )) })
    ] });
  };
  return /* @__PURE__ */ jsxs(
    AppLayout,
    {
      user: auth.user,
      headerTitle: "Wellness & RPE Harian",
      headerDescription: "Catat metrik wellness harian dan RPE sesi latihan Anda.",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Wellness & RPE Harian" }),
        /* @__PURE__ */ jsxs("div", { className: "pb-12 mx-auto space-y-6 relative", children: [
          /* @__PURE__ */ jsx(
            PageHeader,
            {
              title: "Wellness & RPE Harian",
              subtitle: "Catat metrik wellness harian dan RPE sesi latihan Anda.",
              badge: new Date(date).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              }),
              icon: Activity,
              actions: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full sm:w-auto", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      if (redirectTo) {
                        window.location.href = redirectTo;
                      } else {
                        window.location.href = route("admin.individual-trainings.index");
                      }
                    },
                    className: "flex justify-center items-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm w-full sm:w-auto",
                    children: [
                      /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
                      " Kembali"
                    ]
                  }
                ),
                training_id && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      window.location.href = route("admin.individual-trainings.show", training_id);
                    },
                    className: "flex justify-center items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 w-full sm:w-auto",
                    children: mode === "wellness" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      "Ke Program Latihan ",
                      /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
                      " Ke Program Latihan"
                    ] })
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
            (mode === "all" || mode === "wellness") && /* @__PURE__ */ jsxs("div", { className: "bg-white  border border-slate-200  rounded-2xl shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "p-6 sm:p-8 cursor-pointer flex justify-between items-center bg-slate-50  hover:bg-slate-100  transition-colors",
                  onClick: () => setIsWellnessExpanded(!isWellnessExpanded),
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "p-3 bg-slate-200  rounded-xl text-slate-900 ", children: /* @__PURE__ */ jsx(HeartPulse, { size: 24 }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900  tracking-tight", children: "1. Wellness Harian" }),
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500  mt-1", children: "Catat kualitas tidur, stres, dan tingkat kelelahan otot" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "text-slate-400 font-bold text-sm bg-white  px-3 py-1 rounded-full border border-slate-200  shadow-sm", children: isWellnessExpanded ? "Tutup" : "Buka" })
                  ]
                }
              ),
              isWellnessExpanded && /* @__PURE__ */ jsxs("div", { className: "p-6 sm:p-8 border-t border-slate-100  space-y-8 animate-in fade-in slide-in-from-top-4 duration-300", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                  renderScaleButtons(
                    "quality_of_sleep",
                    "Kualitas Tidur (Quality of Sleep)",
                    "Sangat Baik",
                    "Sangat Buruk"
                  ),
                  renderScaleButtons(
                    "fatigue",
                    "Tingkat Kelelahan (Fatigue)",
                    "Sangat Baik",
                    "Sangat Buruk"
                  ),
                  renderScaleButtons(
                    "muscle_soreness",
                    "Nyeri Otot (Muscle Soreness)",
                    "Sangat Baik",
                    "Sangat Buruk"
                  ),
                  renderScaleButtons(
                    "stress",
                    "Tingkat Stres (Stress)",
                    "Sangat Baik",
                    "Sangat Buruk"
                  ),
                  renderScaleButtons(
                    "motivation",
                    "Motivasi Latihan (Motivation)",
                    "Sangat Baik",
                    "Sangat Buruk"
                  ),
                  renderScaleButtons(
                    "mood_state",
                    "Kondisi Mood (Mood State)",
                    "Sangat Baik",
                    "Sangat Buruk"
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-slate-100  space-y-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 ", children: "Bagaimana dengan Keluhan Area Nyeri Anda?" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8 items-start", children: [
                    /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-1/2 rounded-xl overflow-hidden border border-slate-200  bg-white  p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-center", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full flex flex-col items-center", children: [
                        /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold text-slate-400  tracking-[0.15em] mb-2", children: "DEPAN (ANTERIOR)" }),
                        /* @__PURE__ */ jsx("div", { className: "w-full max-w-[180px]", children: /* @__PURE__ */ jsx(BodyHighlighter, { type: "anterior", selectedAreas: data.muscle_pain_areas, onSelectArea: togglePainArea }) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full flex flex-col items-center", children: [
                        /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold text-slate-400  tracking-[0.15em] mb-2", children: "BELAKANG (POSTERIOR)" }),
                        /* @__PURE__ */ jsx("div", { className: "w-full max-w-[180px]", children: /* @__PURE__ */ jsx(BodyHighlighter, { type: "posterior", selectedAreas: data.muscle_pain_areas, onSelectArea: togglePainArea }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-1/2 space-y-4", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-500  mb-2", children: "Pilih area spesifik di mana Anda merasakan nyeri atau ketidaknyamanan:" }),
                      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar", children: MUSCLE_PAIN_AREAS.map(
                        (area) => /* @__PURE__ */ jsxs(
                          "div",
                          {
                            onClick: () => togglePainArea(
                              area
                            ),
                            className: `flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${data.muscle_pain_areas.includes(
                              area
                            ) ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"}`,
                            children: [
                              /* @__PURE__ */ jsx(
                                "div",
                                {
                                  className: `w-4 h-4 rounded border flex items-center justify-center shrink-0 ${data.muscle_pain_areas.includes(
                                    area
                                  ) ? "bg-white border-white text-orange-500" : "bg-white border-slate-300"}`,
                                  children: data.muscle_pain_areas.includes(
                                    area
                                  ) && /* @__PURE__ */ jsx(
                                    CheckSquare,
                                    {
                                      size: 12,
                                      strokeWidth: 4
                                    }
                                  )
                                }
                              ),
                              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-tight", children: area })
                            ]
                          },
                          area
                        )
                      ) }),
                      /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
                        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-700  mb-1 block", children: "Area Lainnya:" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "Sebutkan titik nyeri lainnya...",
                            className: "w-full px-4 py-3 bg-slate-50  border border-slate-200  rounded-xl text-sm font-medium text-slate-900  focus:ring-2 focus:ring-orange-500  outline-none transition-all",
                            value: data.other_pain,
                            onChange: (e) => setData(
                              "other_pain",
                              e.target.value
                            )
                          }
                        )
                      ] })
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            (mode === "all" || mode === "rpe") && /* @__PURE__ */ jsxs("div", { className: "bg-white  border border-slate-200  rounded-2xl shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "p-6 sm:p-8 flex justify-between items-center bg-slate-50 border-b border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-white border border-slate-200 rounded-xl text-orange-500 shadow-sm", children: /* @__PURE__ */ jsx(Activity, { size: 24 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900  tracking-tight", children: "2. RPE Sesi Latihan" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500  mt-1", children: "Catat intensitas dan durasi latihan Anda" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "p-6 sm:p-8 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-slate-900 ", children: "Pilih Sesi Latihan" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-500  mb-3", children: "Masukkan skor RPE (1–10) berdasarkan seberapa berat sesi latihan yang dirasakan, lalu catat durasi latihan dalam menit" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleSessionTypeChange("am"),
                        className: `p-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-2 ${data.session_type === "am" ? "border-orange-500 bg-orange-50 text-orange-500 " : "border-slate-200  bg-white  text-slate-500 hover:border-slate-300 "}`,
                        children: "Sesi Pagi (AM)"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleSessionTypeChange("pm"),
                        className: `p-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-2 ${data.session_type === "pm" ? "border-orange-500 bg-orange-50 text-orange-500 " : "border-slate-200  bg-white  text-slate-500 hover:border-slate-300 "}`,
                        children: "Sesi Sore (PM)"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-slate-900 ", children: "RPE Sesi (1-10)" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(
                        Activity,
                        {
                          size: 18,
                          className: "text-slate-400"
                        }
                      ) }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "number",
                          min: "1",
                          max: "10",
                          value: data.rpe,
                          onChange: (e) => setData("rpe", e.target.value),
                          className: "w-full pl-11 pr-4 py-3 bg-slate-50  border border-slate-200  rounded-xl text-slate-900  font-bold focus:ring-2 focus:ring-orange-500  outline-none transition-all",
                          placeholder: "Masukkan angka 1 - 10"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-500  mt-2", children: "Pilih angka yang paling menggambarkan seberapa berat sesi latihan yang baru saja dilakukan." }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-4 p-4 bg-slate-100  border border-slate-200  rounded-xl space-y-3", children: [
                      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-xs font-bold", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx("span", { className: "w-12 text-center py-1 bg-slate-300  text-slate-800  rounded", children: "1 - 2" }),
                        /* @__PURE__ */ jsx("span", { className: "text-slate-600 ", children: "Sangat Ringan" })
                      ] }) }),
                      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-xs font-bold", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx("span", { className: "w-12 text-center py-1 bg-blue-400  text-white rounded", children: "3 - 4" }),
                        /* @__PURE__ */ jsx("span", { className: "text-blue-600 ", children: "Ringan" })
                      ] }) }),
                      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-xs font-bold", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx("span", { className: "w-12 text-center py-1 bg-green-500  text-white rounded", children: "5 - 6" }),
                        /* @__PURE__ */ jsx("span", { className: "text-green-600 ", children: "Sedang" })
                      ] }) }),
                      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-xs font-bold", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx("span", { className: "w-12 text-center py-1 bg-amber-500  text-white rounded", children: "7 - 8" }),
                        /* @__PURE__ */ jsx("span", { className: "text-amber-600 ", children: "Berat" })
                      ] }) }),
                      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-xs font-bold", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx("span", { className: "w-12 text-center py-1 bg-red-600  text-white rounded", children: "9 - 10" }),
                        /* @__PURE__ */ jsx("span", { className: "text-red-600 ", children: "Maksimal" })
                      ] }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-slate-900 ", children: "Durasi Latihan (Menit)" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(
                        Clock,
                        {
                          size: 18,
                          className: "text-slate-400"
                        }
                      ) }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "number",
                          min: "1",
                          value: data.duration,
                          onChange: (e) => setData("duration", e.target.value),
                          className: "w-full pl-11 pr-4 py-3 bg-slate-50  border border-slate-200  rounded-xl text-slate-900  font-bold focus:ring-2 focus:ring-orange-500  outline-none transition-all",
                          placeholder: "Misal: 60"
                        }
                      )
                    ] })
                  ] })
                ] })
              ] }) })
            ] }),
            rpeError && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-lg bg-red-50  border border-red-200  text-red-600  text-sm font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Activity, { size: 16 }),
              rpeError
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-4 gap-4", children: mode === "wellness" && isWellnessLocked ? /* @__PURE__ */ jsx(Fragment, { children: training_id && /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("admin.individual-trainings.show", training_id),
                className: "rounded-lg flex items-center gap-2 px-8 py-3 bg-orange-500 text-white  hover:bg-orange-600 hover:scale-105 font-bold text-sm transition-all shadow-lg shadow-orange-500/20",
                children: [
                  "Lanjut: Lihat Program Aktual ",
                  /* @__PURE__ */ jsx(ArrowRight, { size: 18 })
                ]
              }
            ) }) : /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: isSubmitDisabled,
                onClick: () => {
                  if ((mode === "all" || mode === "rpe") && !isRpeComplete) {
                    setRpeError("Wajib mengisi RPE & Duration minimal di salah satu sesi (AM/PM).");
                  }
                },
                className: `w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 ${isSubmitDisabled ? "bg-slate-300  text-slate-500  cursor-not-allowed shadow-none" : "bg-orange-500 text-white  hover:bg-orange-600 hover:scale-105"}`,
                children: /* @__PURE__ */ jsxs(Fragment, { children: [
                  "Selesai ",
                  /* @__PURE__ */ jsx(CheckSquare, { size: 18 })
                ] })
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 10px;
                }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155;
                }
            ` })
      ]
    }
  );
}
export {
  SessionForm as default
};
