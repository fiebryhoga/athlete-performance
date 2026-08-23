import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Link } from "@inertiajs/react";
import { User, ChevronLeft, Loader2, Download, Plus } from "lucide-react";
function ProfileHeader({
  player,
  latestTest,
  totalTests,
  onAddRecord,
  onExport,
  isExporting
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start md:items-center gap-5 relative z-10 w-full md:w-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "shrink-0", children: player.photo_url ? /* @__PURE__ */ jsx(
        "img",
        {
          src: player.photo_url,
          alt: player.name,
          className: "w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-slate-200 shadow-sm bg-slate-50"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center", children: /* @__PURE__ */ jsx(
        User,
        {
          size: 32,
          strokeWidth: 1.5,
          className: "text-slate-400"
        }
      ) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 mb-2", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-2xl font-semibold tracking-tight text-slate-900 leading-none capitalize", children: player.name }),
          player.position && /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200/60 shadow-sm", children: player.position })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-y-3 gap-x-6 sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4 text-xs md:text-sm mt-3 sm:mt-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 mb-0.5", children: "Usia" }),
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
              player.age || latestTest?.age || "-",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-500", children: "thn" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-slate-200 hidden sm:block" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 mb-0.5", children: "Tinggi" }),
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
              player.height || latestTest?.height || "-",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-500", children: "cm" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-slate-200 hidden sm:block" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 mb-0.5", children: "Berat Terakhir" }),
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
              latestTest?.weight || player.weight || "-",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-500", children: "kg" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-px h-6 bg-slate-200 hidden sm:block" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 mb-0.5", children: "Total Tes" }),
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
              totalTests,
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-500", children: "rekam" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 relative z-10 w-full md:w-auto shrink-0 border-t border-slate-100 md:border-none pt-4 md:pt-0 mt-2 md:mt-0", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("admin.composition-tests.index"),
          className: "inline-flex flex-1 md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-colors border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 h-10 px-5 shadow-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2",
          children: [
            /* @__PURE__ */ jsx(ChevronLeft, { size: 16, className: "mr-1.5" }),
            "Kembali"
          ]
        }
      ),
      onExport && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onExport,
          disabled: isExporting,
          className: "inline-flex flex-1 md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-colors border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 h-10 px-5 shadow-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 disabled:opacity-50",
          title: "Ekspor ke PDF",
          children: [
            isExporting ? /* @__PURE__ */ jsx(
              Loader2,
              {
                size: 16,
                className: "mr-1.5 animate-spin"
              }
            ) : /* @__PURE__ */ jsx(Download, { size: 16, className: "mr-1.5" }),
            "PDF"
          ]
        }
      ),
      onAddRecord && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onAddRecord,
          className: "inline-flex flex-[2] md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-all bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 h-10 px-6 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
          children: [
            /* @__PURE__ */ jsx(Plus, { size: 16, className: "mr-1.5 sm:mr-1.5" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Tambah Data" }),
            /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Tambah" })
          ]
        }
      )
    ] })
  ] });
}
export {
  ProfileHeader as default
};
