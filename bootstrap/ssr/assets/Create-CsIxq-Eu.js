import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { Activity, ChevronDown, Save } from "lucide-react";
import "axios";
function Create({ athletes }) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: "",
    record_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    week: "Week 1",
    rhr: "",
    spo2: "",
    weight: "",
    vj: "",
    quick_recovery_score: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAthleteLabel, setSelectedAthleteLabel] = useState("");
  const dropdownRef = useRef(null);
  const filteredAthletes = athletes.filter(
    (athlete) => athlete.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.daily-metrics.store"));
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Daily Monitoring", noContainer: true, children: [
    /* @__PURE__ */ jsx(Head, { title: "Daily Monitoring" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-slate-50", children: /* @__PURE__ */ jsx("div", { className: "lg:w-full flex justify-center p-6 lg:p-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 border-b border-slate-100 pb-6", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Activity, { className: "w-6 h-6 text-[#00488b]" }),
          " Record Daily Metrics"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-1", children: "Input athlete's daily resting heart rate, recovery, and other metrics." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 relative", ref: dropdownRef, children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-bold text-slate-700", children: [
              "Select Athlete ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => setIsDropdownOpen(!isDropdownOpen),
                className: `w-full flex items-center justify-between pl-4 pr-4 py-3.5 rounded-xl border cursor-pointer transition-all ${isDropdownOpen ? "border-[#00488b] ring-4 ring-blue-500/10" : "border-slate-200 bg-slate-50 hover:bg-white"}`,
                children: [
                  /* @__PURE__ */ jsx("span", { className: `truncate font-medium ${selectedAthleteLabel ? "text-slate-900" : "text-slate-400"}`, children: selectedAthleteLabel || "Search athlete..." }),
                  /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5 text-slate-400" })
                ]
              }
            ),
            isDropdownOpen && /* @__PURE__ */ jsxs("div", { className: "absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "p-3 border-b border-slate-50 bg-white sticky top-0", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Type name...",
                  className: "w-full pl-4 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00488b]/20",
                  onChange: (e) => setSearchQuery(e.target.value)
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "max-h-60 overflow-y-auto p-2", children: filteredAthletes.map((athlete) => /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => {
                    setData("user_id", athlete.id);
                    setSelectedAthleteLabel(athlete.label);
                    setIsDropdownOpen(false);
                  },
                  className: "px-4 py-3 cursor-pointer rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-sm",
                  children: [
                    athlete.name,
                    " ",
                    /* @__PURE__ */ jsxs("span", { className: "text-xs font-normal text-slate-400", children: [
                      "(",
                      athlete.sport_name,
                      ")"
                    ] })
                  ]
                },
                athlete.id
              )) })
            ] }),
            errors.user_id && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs font-bold", children: errors.user_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-bold text-slate-700", children: [
              "Record Date ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: data.record_date,
                onChange: (e) => setData("record_date", e.target.value),
                className: "block w-full px-4 py-3.5 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-700"
              }
            ),
            errors.record_date && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs font-bold", children: errors.record_date })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700", children: "Week Label" }),
            /* @__PURE__ */ jsx("input", { type: "text", value: data.week, onChange: (e) => setData("week", e.target.value), className: "block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]", placeholder: "e.g. Week 17" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700", children: "RHR (Resting Heart Rate)" }),
            /* @__PURE__ */ jsx("input", { type: "number", value: data.rhr, onChange: (e) => setData("rhr", e.target.value), className: "block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]", placeholder: "e.g. 61" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700", children: "SpO2 (%)" }),
            /* @__PURE__ */ jsx("input", { type: "number", value: data.spo2, onChange: (e) => setData("spo2", e.target.value), className: "block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]", placeholder: "e.g. 98" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700", children: "Weight (BB)" }),
            /* @__PURE__ */ jsx("input", { type: "number", value: data.weight, onChange: (e) => setData("weight", e.target.value), className: "block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]", placeholder: "e.g. 70" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700", children: "Vertical Jump (VJ)" }),
            /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", value: data.vj, onChange: (e) => setData("vj", e.target.value), className: "block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]", placeholder: "e.g. 30.66" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700", children: "Quick Recovery Score" }),
            /* @__PURE__ */ jsx("input", { type: "number", value: data.quick_recovery_score, onChange: (e) => setData("quick_recovery_score", e.target.value), className: "block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]", placeholder: "0 - 100" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-6", children: /* @__PURE__ */ jsxs("button", { type: "submit", disabled: processing, className: "w-full bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#003666] transition-all flex justify-center items-center gap-2", children: [
          /* @__PURE__ */ jsx(Save, { className: "w-5 h-5" }),
          " ",
          processing ? "Processing..." : "Save & Calculate Metrics"
        ] }) })
      ] })
    ] }) }) })
  ] });
}
export {
  Create as default
};
