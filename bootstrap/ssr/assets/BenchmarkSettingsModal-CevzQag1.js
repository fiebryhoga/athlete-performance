import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { M as Modal } from "./Modal-DUGk5ZHw.js";
import { Scale, Flame, Target, Zap, Settings2, X, Save, ChevronDown, Check } from "lucide-react";
import "@headlessui/react";
const COLOR_OPTIONS = [
  {
    value: "blue",
    label: "Biru (Rendah / Essential)",
    bg: "bg-blue-500",
    ring: "ring-blue-500/25",
    text: "text-blue-600",
    pill: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    value: "green",
    label: "Hijau (Normal / Optimal)",
    bg: "bg-emerald-500",
    ring: "ring-emerald-500/25",
    text: "text-emerald-600",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    value: "lime",
    label: "Teal (Atlet / Fitness)",
    bg: "bg-teal-500",
    ring: "ring-teal-500/25",
    text: "text-teal-600",
    pill: "bg-teal-50 text-teal-700 border-teal-200"
  },
  {
    value: "yellow",
    label: "Kuning (Waspada / Batas Atas)",
    bg: "bg-amber-500",
    ring: "ring-amber-500/25",
    text: "text-amber-600",
    pill: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    value: "orange",
    label: "Oranye (Tinggi)",
    bg: "bg-orange-500",
    ring: "ring-orange-500/25",
    text: "text-orange-600",
    pill: "bg-orange-50 text-orange-700 border-orange-200"
  },
  {
    value: "red",
    label: "Merah (Sangat Tinggi / Bahaya)",
    bg: "bg-rose-500",
    ring: "ring-rose-500/25",
    text: "text-rose-600",
    pill: "bg-rose-50 text-rose-700 border-rose-200"
  }
];
function ColorSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = COLOR_OPTIONS.find((c) => c.value === value) || COLOR_OPTIONS[1];
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(!isOpen),
        className: "w-full flex items-center justify-between px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 hover:bg-slate-50 transition-all shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 truncate", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `w-2.5 h-2.5 rounded-full ${selected.bg} ring-2 ${selected.ring} shrink-0`
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: selected.label })
          ] }),
          /* @__PURE__ */ jsx(
            ChevronDown,
            {
              className: `w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 transition-transform ${isOpen ? "rotate-180 text-orange-500" : ""}`
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 z-40 cursor-default",
          onClick: () => setIsOpen(false)
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-full mt-1 w-full bg-white rounded-md shadow-xl border border-slate-200 p-1 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5 max-h-48 overflow-y-auto custom-scrollbar", children: COLOR_OPTIONS.map((c) => {
        const isSelected = c.value === value;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              onChange(c.value);
              setIsOpen(false);
            },
            className: `w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors text-left ${isSelected ? "bg-orange-50 text-orange-700 font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 truncate", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `w-2.5 h-2.5 rounded-full ${c.bg} shrink-0`
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: c.label })
              ] }),
              isSelected && /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-orange-600 shrink-0 ml-1" })
            ]
          },
          c.value
        );
      }) })
    ] })
  ] });
}
function BenchmarkSettingsModal({
  isOpen,
  onClose,
  currentBenchmarks
}) {
  const { data, setData, post, processing, reset } = useForm({
    benchmarks: {}
  });
  const [localData, setLocalData] = useState(currentBenchmarks || {});
  const [activeTab, setActiveTab] = useState("bmi");
  useEffect(() => {
    if (isOpen) {
      setLocalData(currentBenchmarks || {});
      setData("benchmarks", currentBenchmarks || {});
      setActiveTab("bmi");
    }
  }, [isOpen, currentBenchmarks]);
  const tabs = [
    {
      id: "bmi",
      label: "Indeks Massa Tubuh (BMI)",
      icon: Scale,
      path: ["bmi"]
    },
    {
      id: "bf_male",
      label: "Body Fat (Putra)",
      icon: Flame,
      path: ["body_fat", "male"]
    },
    {
      id: "bf_female",
      label: "Body Fat (Putri)",
      icon: Flame,
      path: ["body_fat", "female"]
    },
    {
      id: "visceral",
      label: "Lemak Visceral",
      icon: Target,
      path: ["visceral_fat"]
    },
    {
      id: "phase_angle",
      label: "Phase Angle",
      icon: Zap,
      path: ["phase_angle"]
    }
  ];
  const getNestedValue = (obj, path) => {
    return path.reduce((acc, part) => acc && acc[part], obj) || {};
  };
  const handleUpdate = (path, key, field, value) => {
    const newData = JSON.parse(JSON.stringify(localData));
    let current = newData;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    current[key][field] = field === "max" ? value === "" ? "" : value : value;
    let previousMax = -0.1;
    for (const k of Object.keys(current)) {
      current[k].min = parseFloat((previousMax + 0.1).toFixed(1));
      previousMax = parseFloat(current[k].max) || 0;
    }
    setLocalData(newData);
    setData("benchmarks", newData);
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.composition-tests.save-benchmarks"), {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
        reset();
      }
    });
  };
  const activeTabConfig = tabs.find((t) => t.id === activeTab);
  const activeCategoryData = getNestedValue(localData, activeTabConfig.path);
  const inputClass = "flex h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500";
  const labelClass = "text-[11px] font-bold text-slate-600 mb-1 block";
  return /* @__PURE__ */ jsx(Modal, { show: isOpen, onClose, maxWidth: "3xl", children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: submit,
      className: "bg-white rounded-xl overflow-hidden flex flex-col max-h-[88vh] shadow-2xl border border-slate-200 relative",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white z-10 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-orange-50 border border-orange-200/70 flex items-center justify-center text-orange-600 shrink-0", children: /* @__PURE__ */ jsx(Settings2, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-sm sm:text-base font-bold text-slate-900 leading-none", children: "Standar Evaluasi Komposisi Tubuh" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-500 mt-1", children: "Sesuaikan batas ambang nilai acuan klasifikasi bioimpedansi." })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors",
              title: "Tutup",
              children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 overflow-hidden flex-col md:flex-row bg-slate-50/40", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-60 border-b md:border-b-0 md:border-r border-slate-200/80 bg-slate-50/70 p-3 shrink-0 overflow-x-auto md:overflow-y-auto custom-scrollbar", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 mb-2", children: "Pilih Parameter" }),
            /* @__PURE__ */ jsx("nav", { className: "flex md:flex-col gap-1 min-w-max md:min-w-0", children: tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTab(tab.id),
                  className: `w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-bold transition-all text-left ${isActive ? "bg-white text-orange-600 shadow-2xs border border-slate-200/90" : "text-slate-600 hover:bg-white/60 hover:text-slate-900"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      TabIcon,
                      {
                        className: `w-3.5 h-3.5 shrink-0 ${isActive ? "text-orange-500" : "text-slate-400"}`
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: tab.label })
                  ]
                },
                tab.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar bg-slate-50/30", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3.5", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between pb-1 border-b border-slate-200/60", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-900", children: [
                "Klasifikasi Nilai:",
                " ",
                activeTabConfig.label
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 font-medium", children: "Batas minimum dihitung otomatis berurutan dari batas maksimum sebelumnya." })
            ] }) }),
            Object.entries(activeCategoryData).map(
              ([key, item]) => {
                const colorObj = COLOR_OPTIONS.find(
                  (c) => c.value === item.color
                ) || COLOR_OPTIONS[1];
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "p-3.5 rounded-lg border border-slate-200/80 bg-white shadow-2xs transition-all hover:border-slate-300 space-y-3",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: `w-2.5 h-2.5 rounded-full ${colorObj.bg} ring-2 ${colorObj.ring} shrink-0`
                            }
                          ),
                          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-800 capitalize", children: key.replace(/_/g, " ") })
                        ] }),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `text-[10px] font-bold ${colorObj.text}`,
                            children: item.label || key
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100", children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx(
                            "label",
                            {
                              className: labelClass,
                              children: "Label Tampilan"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "text",
                              value: item.label || "",
                              onChange: (e) => handleUpdate(
                                activeTabConfig.path,
                                key,
                                "label",
                                e.target.value
                              ),
                              placeholder: "Contoh: Normal",
                              className: inputClass
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx(
                            "label",
                            {
                              className: labelClass,
                              children: "Warna Status"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            ColorSelect,
                            {
                              value: item.color || "green",
                              onChange: (val) => handleUpdate(
                                activeTabConfig.path,
                                key,
                                "color",
                                val
                              )
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                          /* @__PURE__ */ jsx(
                            "label",
                            {
                              className: labelClass,
                              children: "Rentang Nilai (Min — Maks)"
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx("div", { className: "flex-1 flex h-8 items-center justify-center bg-slate-50 border border-slate-200 rounded-md text-xs font-mono text-slate-500 select-none", children: item.min ?? 0 }),
                            /* @__PURE__ */ jsx("span", { className: "text-slate-300 font-bold text-xs", children: "sampai" }),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "number",
                                step: "0.1",
                                value: item.max ?? "",
                                onChange: (e) => handleUpdate(
                                  activeTabConfig.path,
                                  key,
                                  "max",
                                  e.target.value
                                ),
                                className: `${inputClass} flex-1 text-center font-mono font-bold text-slate-900`,
                                placeholder: "Maksimal..."
                              }
                            )
                          ] })
                        ] })
                      ] })
                    ]
                  },
                  key
                );
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-3 border-t border-slate-200/80 bg-white flex items-center justify-between shrink-0 z-10", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-slate-400", children: "Perubahan akan langsung mempengaruhi kalkulasi evaluasi." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors",
                children: "Batal"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-md text-xs font-bold transition-all shadow-sm hover:shadow disabled:opacity-50",
                children: [
                  /* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }),
                  "Simpan Standar"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
export {
  BenchmarkSettingsModal as default
};
