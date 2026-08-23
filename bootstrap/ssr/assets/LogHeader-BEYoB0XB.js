import { jsxs, jsx } from "react/jsx-runtime";
import { User, Activity, Dumbbell, Calendar, MapPin } from "lucide-react";
function LogHeader({ session }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 md:mb-8 w-full max-w-full overflow-hidden flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-5 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-orange-50/50 to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsx("div", { className: "shrink-0 relative z-10", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-md bg-slate-100 flex items-center justify-center overflow-hidden", children: session.user?.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: session.user.profile_photo_url, alt: session.user.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(User, { className: "w-8 h-8 text-slate-400" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2 md:mb-2.5", children: [
          /* @__PURE__ */ jsxs("span", { className: "bg-orange-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-md shadow-sm shadow-orange-500/20", children: [
            "Sesi ",
            session.session_number
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] md:text-xs font-bold text-slate-400 flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1 rounded-md", children: [
            /* @__PURE__ */ jsx(Activity, { className: "w-3 h-3 md:w-3.5 md:h-3.5 text-orange-500" }),
            " Program Latihan"
          ] })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight leading-tight break-words whitespace-normal", children: session.training_type })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 bg-slate-50 border-t border-slate-100 divide-x divide-slate-200/60", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3 border-b md:border-b-0 border-slate-200/60", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-white border border-slate-200 rounded-lg text-slate-500 shadow-sm shrink-0", children: /* @__PURE__ */ jsx(User, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-0.5", children: "Klien (Atlet)" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-bold text-slate-700 truncate", children: session.user?.name || "-" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3 border-b md:border-b-0 border-slate-200/60", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-white border border-slate-200 rounded-lg text-slate-500 shadow-sm shrink-0", children: /* @__PURE__ */ jsx(Dumbbell, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-0.5", children: "Coach Pendamping" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-bold text-slate-700 truncate", children: session.coach?.name || "Latihan Mandiri" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-white border border-slate-200 rounded-lg text-orange-500 shadow-sm shrink-0", children: /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-0.5", children: "Tanggal" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-bold text-slate-700 truncate", children: new Date(session.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-5 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-white border border-slate-200 rounded-lg text-rose-500 shadow-sm shrink-0", children: /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-0.5", children: "Lokasi Latihan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-bold text-slate-700 truncate", children: session.location || "Tidak diatur" })
        ] })
      ] })
    ] })
  ] });
}
export {
  LogHeader as default
};
