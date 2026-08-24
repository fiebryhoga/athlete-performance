import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Target, Calendar, X, User, ChevronDown, Search, ArrowRight } from "lucide-react";
import "axios";
function Create({ athletes = [] }) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: "",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    name: ""
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
  const selectAthlete = (athlete) => {
    setData("user_id", athlete.id);
    setSelectedAthleteLabel(athlete.label);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.performance.store"));
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Input Sesi Tes Fisik", noContainer: true, children: [
    /* @__PURE__ */ jsx(Head, { title: "Input Sesi Tes Fisik" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:w-5/12 bg-gradient-to-br from-orange-600 to-[#cc3d00] relative overflow-hidden flex flex-col justify-between p-8 lg:p-12 text-white", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/40 to-transparent opacity-50" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-4", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("admin.performance.index"),
              className: "inline-flex items-center text-xs font-bold text-orange-200 hover:text-white transition-colors",
              children: [
                /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5 mr-1" }),
                " Kembali ke Tes Fisik"
              ]
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug", children: "Inisiasi Pengukuran Performa Fisik" }),
          /* @__PURE__ */ jsx("p", { className: "text-orange-100 text-xs sm:text-sm leading-relaxed max-w-sm", children: "Mulai sesi asesmen fisik baru untuk mengukur kemajuan parameter performa atlet sesuai benchmark cabang olahraga." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 mt-10 lg:mt-0 hidden lg:block space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center font-bold text-xs shadow-md", children: "1" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: "Pilih Atlet & Tanggal" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-6 border-l-2 border-white/30 ml-4 my-1" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 opacity-60", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-xs", children: "2" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-sm", children: "Input Nilai Parameter" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:w-7/12 flex flex-col justify-center p-6 lg:p-14 bg-white relative", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-slate-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Target, { className: "w-5 h-5 text-orange-500" }),
            " ",
            "Detail Sesi Pengujian"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-xs mt-1", children: "Lengkapi informasi atlet dan tanggal asesmen di bawah ini." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700", children: [
              "Tanggal Tes",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: data.date,
                  onChange: (e) => setData("date", e.target.value),
                  className: "w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs"
                }
              )
            ] }),
            errors.date && /* @__PURE__ */ jsxs("p", { className: "text-rose-600 text-xs font-bold mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }),
              " ",
              errors.date
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "space-y-1.5 relative",
              ref: dropdownRef,
              children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700", children: [
                  "Pilih Atlet",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
                ] }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    onClick: () => setIsDropdownOpen(!isDropdownOpen),
                    className: `w-full flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer transition-all shadow-2xs ${isDropdownOpen ? "border-orange-500 ring-2 ring-orange-500/20 bg-white" : "border-slate-200 bg-white hover:border-slate-300"} ${errors.user_id ? "border-rose-300 bg-rose-50/40" : ""}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 overflow-hidden", children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${selectedAthleteLabel ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-400"}`,
                            children: /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5" })
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `truncate text-xs font-semibold ${selectedAthleteLabel ? "text-slate-900 font-bold" : "text-slate-400 font-normal"}`,
                            children: selectedAthleteLabel || "Pilih atau cari atlet..."
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx(
                        ChevronDown,
                        {
                          className: `w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`
                        }
                      )
                    ]
                  }
                ),
                isDropdownOpen && /* @__PURE__ */ jsxs("div", { className: "absolute z-50 mt-1.5 w-full bg-white rounded-lg shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2 border-b border-slate-100 bg-slate-50 sticky top-0", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        autoFocus: true,
                        placeholder: "Ketik nama atau cabor...",
                        className: "w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder-slate-400 outline-none transition-all",
                        onChange: (e) => setSearchQuery(
                          e.target.value
                        )
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx("div", { className: "max-h-56 overflow-y-auto p-1 space-y-0.5 custom-scrollbar", children: filteredAthletes.length > 0 ? filteredAthletes.map(
                    (athlete) => /* @__PURE__ */ jsxs(
                      "div",
                      {
                        onClick: () => selectAthlete(
                          athlete
                        ),
                        className: `px-3 py-2 cursor-pointer rounded-md flex justify-between items-center text-xs transition-colors ${data.user_id === athlete.id ? "bg-orange-50 text-orange-700 font-bold" : "hover:bg-slate-50 text-slate-700"}`,
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: athlete.name }),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded", children: athlete.sport_name })
                        ]
                      },
                      athlete.id
                    )
                  ) : /* @__PURE__ */ jsx("div", { className: "py-6 text-center text-slate-400 text-xs font-medium", children: "Atlet tidak ditemukan" }) })
                ] }),
                errors.user_id && /* @__PURE__ */ jsxs("p", { className: "text-rose-600 text-xs font-bold mt-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }),
                  " Silakan pilih atlet terlebih dahulu"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700", children: "Nama Sesi" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-slate-400", children: "Opsional" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: `Contoh: Tes Awal Periode - ${data.date}`,
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                className: "w-full px-3 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-slate-400", children: "Jika dikosongkan, nama sesi otomatis menggunakan tanggal tes." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-3", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-md shadow-2xs transition-all flex justify-center items-center gap-1.5 text-xs group disabled:opacity-60",
              children: processing ? "Memproses..." : /* @__PURE__ */ jsxs(Fragment, { children: [
                "Lanjutkan ke Input Nilai",
                " ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" })
              ] })
            }
          ) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Create as default
};
