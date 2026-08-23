import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Activity, Trophy } from "lucide-react";
function ProfileHeader({ safeAthlete, bmi, initial }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs(Link, { href: route("admin.athletes.index"), className: "inline-flex items-center text-[10px] font-bold text-slate-400 hover:text-orange-500 mb-4 group transition-colors", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3 h-3 mr-1.5 transition-transform group-hover:-translate-x-1" }),
        "Back to Athletes List"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold text-slate-800 tracking-tight", children: "Client Analysis" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium text-sm mt-1", children: "Comprehensive performance report and physical metrics." })
        ] }),
        safeAthlete.id && /* @__PURE__ */ jsxs(Link, { href: route("admin.individual-trainings.show", safeAthlete.id), className: "w-full md:w-auto bg-white border border-slate-200 text-orange-500 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4" }),
          " Lihat Program Latihan"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center h-full relative overflow-hidden group hover:border-orange-200 transition-colors", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-orange-50 to-transparent" }),
      /* @__PURE__ */ jsx("div", { className: "relative z-10 w-28 h-28 mb-5 mt-2", children: safeAthlete.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: safeAthlete.profile_photo_url, alt: safeAthlete.name, className: "w-full h-full rounded-lg object-cover shadow-lg shadow-orange-500/10 border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-300" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-br from-orange-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-orange-500/20 border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-300", children: initial }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-800 tracking-tight group-hover:text-orange-500 transition-colors", children: safeAthlete.name || "Unknown Name" }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold mt-1 mb-3", children: safeAthlete.username || "-" }),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 text-orange-500 rounded-lg text-[10px] font-bold border border-orange-100 mb-6", children: [
        /* @__PURE__ */ jsx(Trophy, { className: "w-3.5 h-3.5" }),
        " ",
        safeAthlete.sport?.name || "No Sport"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 w-full mt-auto pt-6 border-t border-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50 transition-colors hover:bg-orange-50 hover:border-orange-100", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold mb-1", children: "Height" }),
          /* @__PURE__ */ jsxs("p", { className: "font-bold text-slate-700", children: [
            safeAthlete.height || "-",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "cm" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50 transition-colors hover:bg-orange-50 hover:border-orange-100", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold mb-1", children: "Weight" }),
          /* @__PURE__ */ jsxs("p", { className: "font-bold text-slate-700", children: [
            safeAthlete.weight || "-",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "kg" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50 transition-colors hover:bg-orange-50 hover:border-orange-100", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold mb-1", children: "Age" }),
          /* @__PURE__ */ jsxs("p", { className: "font-bold text-slate-700", children: [
            safeAthlete.age || "-",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "yrs" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50 transition-colors hover:bg-orange-50 hover:border-orange-100", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold mb-1", children: "BMI" }),
          /* @__PURE__ */ jsx("p", { className: "font-bold text-orange-500", children: bmi })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProfileHeader as default
};
