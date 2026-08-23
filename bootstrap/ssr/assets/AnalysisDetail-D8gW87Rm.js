import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Line } from "recharts";
import { Printer, Download, X, FileText, Type, Loader2, ArrowLeft, Eye, Edit3, Plus, TrendingUp } from "lucide-react";
import { M as Modal } from "./Modal-DUGk5ZHw.js";
import ReactQuill from "react-quill";
import "@headlessui/react";
function ExportModal({
  isOpen,
  onClose,
  onExport,
  isExporting,
  defaultTitle = "",
  defaultFilename = "",
  exportType = "pdf",
  showSmartInsightsToggle = false,
  showNotesToggle = true,
  children
}) {
  const [title, setTitle] = useState("");
  const [filename, setFilename] = useState("");
  const [note, setNote] = useState("");
  const [includeInsights, setIncludeInsights] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setFilename("");
      setNote("");
      setIncludeInsights(false);
      setIncludeNotes(false);
    }
  }, [isOpen]);
  const handleExport = () => {
    onExport(
      filename || defaultFilename,
      title || defaultTitle,
      includeNotes ? note : "",
      { includeInsights }
    );
  };
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"]
    ]
  };
  return /* @__PURE__ */ jsx(Modal, { show: isOpen, onClose, maxWidth: "2xl", children: /* @__PURE__ */ jsxs("div", { className: "bg-white  border border-zinc-200  shadow-lg sm:rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col space-y-1.5 p-6 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100  text-zinc-900 ", children: exportType === "pdf" ? /* @__PURE__ */ jsx(Printer, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Download, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold leading-none tracking-tight text-zinc-900 ", children: [
            '"Export" ',
            exportType === "pdf" ? "PDF" : "Excel",
            ' "Report"'
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500 ", children: '"Customize the file name, document title, and report settings."' })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onClose,
          className: "rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-500    ",
          children: [
            /* @__PURE__ */ jsx(X, { className: "h-4 w-4 text-zinc-500 " }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: '"Close"' })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 pt-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "filename",
              className: "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 ",
              children: '"File Name"'
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FileText, { className: "absolute left-3 top-2.5 h-4 w-4 text-zinc-500 " }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "filename",
                type: "text",
                placeholder: defaultFilename || "E.g., Report.pdf",
                value: filename,
                onChange: (e) => setFilename(e.target.value),
                className: "flex h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50      text-zinc-900 "
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "title",
              className: "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 ",
              children: '"Document Title"'
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Type, { className: "absolute left-3 top-2.5 h-4 w-4 text-zinc-500 " }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "title",
                type: "text",
                placeholder: defaultTitle || "E.g., BODY COMPOSITION",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                className: "flex h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50      text-zinc-900 "
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-zinc-200  pt-5", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        showSmartInsightsToggle && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 rounded-md", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center h-5", children: /* @__PURE__ */ jsx(
            "input",
            {
              id: "insights-toggle",
              type: "checkbox",
              checked: includeInsights,
              onChange: (e) => setIncludeInsights(e.target.checked),
              className: "w-4 h-4 text-zinc-900 bg-white border-zinc-300 rounded focus:ring-zinc-900   focus:ring-2  "
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx("label", { htmlFor: "insights-toggle", className: "text-sm font-medium text-zinc-900  cursor-pointer flex items-center gap-1.5", children: '"Include Smart Insights"' }) })
        ] }),
        children && /* @__PURE__ */ jsx("div", { className: "mt-4", children }),
        showNotesToggle && /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-3 rounded-md", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center h-5", children: /* @__PURE__ */ jsx(
              "input",
              {
                id: "notes-toggle",
                type: "checkbox",
                checked: includeNotes,
                onChange: (e) => setIncludeNotes(e.target.checked),
                className: "w-4 h-4 text-zinc-900 bg-white border-zinc-300 rounded focus:ring-zinc-900   focus:ring-2  "
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col w-full", children: /* @__PURE__ */ jsx("label", { htmlFor: "notes-toggle", className: "text-sm font-medium text-zinc-900  cursor-pointer flex items-center gap-1.5", children: '"Add Custom Notes"' }) })
          ] }),
          includeNotes && /* @__PURE__ */ jsx("div", { className: "animate-in fade-in slide-in-from-top-2 duration-200", children: /* @__PURE__ */ jsx("div", { className: "rounded-md border border-zinc-200  bg-white  overflow-hidden shadow-sm transition-colors focus-within:ring-2 focus-within:ring-zinc-950  focus-within:ring-offset-2 ring-offset-white  [&_.ql-toolbar]:bg-zinc-50/50 [&_.ql-toolbar]: [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-zinc-200 [&_.ql-toolbar]: [&_.ql-container]:border-none [&_.ql-editor]:min-h-[120px] [&_.ql-editor]:text-sm [&_.ql-editor]:text-zinc-900 [&_.ql-editor]: [&_.ql-editor.ql-blank::before]:text-zinc-500 [&_.ql-editor.ql-blank::before]: [&_.ql-editor.ql-blank::before]:font-normal [&_.ql-stroke]: [&_.ql-fill]: [&_.ql-picker]:", children: /* @__PURE__ */ jsx(
            ReactQuill,
            {
              theme: "snow",
              value: note,
              onChange: setNote,
              modules: quillModules,
              placeholder: "Type your notes here..."
            }
          ) }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end p-4 border-t border-zinc-200  bg-zinc-50 ", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full sm:w-auto", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          disabled: isExporting,
          className: "inline-flex h-9 w-full  sm:w-auto items-center justify-center whitespace-nowrap rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium ring-offset-white transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50     ",
          children: '"Cancel"'
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleExport,
          disabled: isExporting,
          className: "inline-flex h-9 w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 ring-offset-white transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50     gap-2 shadow-sm",
          children: [
            isExporting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
            isExporting ? "Processing..." : `$"Export" ${exportType === "pdf" ? "PDF" : "Excel"}`
          ]
        }
      )
    ] }) })
  ] }) });
}
function submitDownloadForm(action, fields) {
  const IFRAME_ID = "__download_iframe__";
  let iframe = document.getElementById(IFRAME_ID);
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = IFRAME_ID;
    iframe.name = IFRAME_ID;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  form.target = IFRAME_ID;
  for (const key in fields) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = fields[key] ?? "";
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
function AnalysisDetail({ weeklyData, athleteWeeklyInfo, onBack }) {
  const { permissions } = usePage().props;
  const canModify = permissions?.wellness?.create || permissions?.wellness?.update;
  const [isExporting, setIsExporting] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [viewingEntry, setViewingEntry] = useState(null);
  const handleDownloadPdf = () => {
    if (!athleteWeeklyInfo || !athleteWeeklyInfo.user_id) return;
    setIsExportModalOpen(true);
  };
  const handleExportConfirm = (filename, customTitle, note, { includeInsights }) => {
    setIsExportModalOpen(false);
    setIsExporting(true);
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    submitDownloadForm(route("admin.wellness-rpe.export-pdf", athleteWeeklyInfo.user_id), {
      _token: csrfToken,
      filename,
      title: customTitle,
      note,
      include_insights: includeInsights ? 1 : 0
    });
    setTimeout(() => setIsExporting(false), 2e3);
  };
  const getAcwrBadgeClass = (acwr) => {
    if (!acwr || acwr === 0) return "text-slate-400  bg-transparent";
    if (acwr < 0.8) return "text-orange-500  font-bold";
    if (acwr >= 0.8 && acwr <= 1.3) return "text-emerald-500  font-bold";
    if (acwr > 1.3 && acwr <= 1.5) return "text-yellow-500  font-bold";
    return "text-red-600  font-bold";
  };
  const getDailyLoadBadgeClass = (val) => {
    if (!val || val === 0) return "text-slate-900  bg-slate-100  border-slate-200 ";
    if (val < 1500) return "text-emerald-700  bg-emerald-100  border-emerald-200 ";
    if (val <= 3e3) return "text-amber-700  bg-amber-100  border-amber-200 ";
    return "text-red-700  bg-red-100  border-red-200 ";
  };
  const getDailyWellnessColor = (score) => {
    if (!score && score !== 0) return { text: "text-slate-500", bg: "bg-slate-100 ", border: "border-slate-300 ", label: "N/A" };
    if (score <= 9) return { text: "text-teal-700 ", bg: "bg-teal-100 ", border: "border-teal-200 ", label: "Sangat Baik" };
    if (score <= 13) return { text: "text-emerald-700 ", bg: "bg-emerald-100 ", border: "border-emerald-200 ", label: "Baik" };
    if (score <= 17) return { text: "text-sky-700 ", bg: "bg-sky-100 ", border: "border-sky-200 ", label: "Agak Baik" };
    if (score <= 20) return { text: "text-yellow-700 ", bg: "bg-yellow-100 ", border: "border-yellow-200 ", label: "Sedang" };
    if (score <= 23) return { text: "text-amber-700 ", bg: "bg-amber-100 ", border: "border-amber-200 ", label: "Agak Buruk" };
    if (score <= 27) return { text: "text-orange-700 ", bg: "bg-orange-100 ", border: "border-orange-200 ", label: "Buruk" };
    return { text: "text-red-700 ", bg: "bg-red-100 ", border: "border-red-200 ", label: "Sangat Buruk" };
  };
  const getWeeklyWellnessColor = (score) => {
    if (!score && score !== 0) return { text: "text-slate-500", bg: "bg-slate-100 ", border: "border-slate-300 ", label: "N/A" };
    if (score <= 66) return { text: "text-teal-700 ", bg: "bg-teal-100 ", border: "border-teal-200 ", label: "Sangat Baik" };
    if (score <= 90) return { text: "text-emerald-700 ", bg: "bg-emerald-100 ", border: "border-emerald-200 ", label: "Baik" };
    if (score <= 119) return { text: "text-sky-700 ", bg: "bg-sky-100 ", border: "border-sky-200 ", label: "Agak Baik" };
    if (score <= 140) return { text: "text-yellow-700 ", bg: "bg-yellow-100 ", border: "border-yellow-200 ", label: "Sedang" };
    if (score <= 162) return { text: "text-amber-700 ", bg: "bg-amber-100 ", border: "border-amber-200 ", label: "Agak Buruk" };
    if (score <= 189) return { text: "text-orange-700 ", bg: "bg-orange-100 ", border: "border-orange-200 ", label: "Buruk" };
    return { text: "text-red-700 ", bg: "bg-red-100 ", border: "border-red-200 ", label: "Sangat Buruk" };
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-10 animate-in fade-in zoom-in-95 duration-300", children: [
    /* @__PURE__ */ jsx(
      ExportModal,
      {
        isOpen: isExportModalOpen,
        onClose: () => setIsExportModalOpen(false),
        onExport: handleExportConfirm,
        isExporting,
        defaultTitle: `WELLNESS & ACWR REPORT`,
        defaultFilename: `Wellness_ACWR_${athleteWeeklyInfo?.name?.replace(/ /g, "_")}`,
        showSmartInsightsToggle: true
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-200  pb-4", children: [
      onBack ? /* @__PURE__ */ jsxs("button", { onClick: onBack, className: "flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900  transition-colors py-2 px-1", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
        "Back to Athlete Register"
      ] }) : /* @__PURE__ */ jsx("div", {}),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleDownloadPdf,
          disabled: isExporting,
          className: "flex items-center gap-2 px-4 py-2 bg-slate-900  text-white  rounded-lg text-xs font-bold hover:bg-slate-800  transition-colors shadow-sm disabled:opacity-50",
          children: [
            isExporting ? /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsx(Download, { size: 14 }),
            '"Download PDF Report"'
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6 bg-transparent", children: athleteWeeklyInfo?.weekly_history?.map((week, idx) => {
      const chartData = [];
      const parts = week.start_date.split("-");
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        currentDay.setDate(currentDay.getDate() + i);
        const yyyy = currentDay.getFullYear();
        const mm = String(currentDay.getMonth() + 1).padStart(2, "0");
        const dd = String(currentDay.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;
        const dateLabel = `${currentDay.getDate()} ${currentDay.toLocaleDateString("id-ID", { month: "short" })}`;
        const logData = week.logs?.[dateStr];
        chartData.push({
          dateStr,
          dayName: currentDay.toLocaleDateString("id-ID", { weekday: "long" }),
          dateLabel,
          load: logData ? parseFloat(logData.daily_load || 0) : 0,
          wellness: logData ? parseInt(logData.daily_wellness_score || 0) : 0,
          notes: logData?.notes || "-",
          amLoad: logData ? parseFloat(logData.am_rpe || 0) * parseInt(logData.am_duration || 0) : 0,
          pmLoad: logData ? parseFloat(logData.pm_rpe || 0) * parseInt(logData.pm_duration || 0) : 0,
          hasData: !!logData,
          rawData: logData
        });
      }
      const maxLoad = chartData.length > 0 ? Math.max(...chartData.map((d) => d.load)) : 0;
      const validWellness = chartData.map((d) => d.wellness).filter((w) => w > 0);
      const minWellness = validWellness.length > 0 ? Math.min(...validWellness) : 0;
      return /* @__PURE__ */ jsxs("div", { className: "bg-white  rounded-2xl shadow-sm border border-slate-200  overflow-hidden relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-200  bg-slate-50/80  flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-slate-200  flex items-center justify-center font-bold text-slate-500 text-sm  shrink-0 border border-slate-300 ", children: athleteWeeklyInfo.position }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900  text-base leading-none", children: athleteWeeklyInfo.name }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxs("span", { className: "bg-slate-900 text-slate-100   px-4 py-1 rounded-md text-[10px] font-bold shadow-sm", children: [
                    '"Week" ',
                    week.week_number
                  ] }),
                  idx === 0 && /* @__PURE__ */ jsx("span", { className: "bg-slate-100 text-slate-700 border border-slate-200    px-4 py-1 rounded-md text-[10px] font-bold", children: "Latest" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-500 font-bold", children: [
                '"Period": ',
                week.start_date,
                " ",
                /* @__PURE__ */ jsx("span", { className: "mx-1 text-slate-300 ", children: "➔" }),
                " ",
                week.end_date
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white  px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-200  shadow-sm w-fit self-start sm:self-auto", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[12px] font-bold text-slate-400 ", children: "Weekly Wellness" }),
            /* @__PURE__ */ jsx("div", { className: "h-5 w-px bg-slate-200 " }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxs("span", { className: `font-bold text-lg leading-none ${getWeeklyWellnessColor(week.weekly_wellness_score).text}`, children: [
                week.weekly_wellness_score || 0,
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-bold", children: "/ 196" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: `text-[9px] font-bold ${getWeeklyWellnessColor(week.weekly_wellness_score).text} mt-0.5`, children: getWeeklyWellnessColor(week.weekly_wellness_score).label })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-slate-200  grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pb-8 bg-white ", children: [
          /* @__PURE__ */ jsxs("div", { className: "h-56 w-full", id: `chart-week-${week.week_number}`, children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-400  text-center", children: "Load vs Wellness (Daily)" }),
            /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(ComposedChart, { data: chartData, margin: { top: 10, right: 0, left: -20, bottom: 0 }, children: [
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#e4e4e7", className: "" }),
              /* @__PURE__ */ jsx(XAxis, { dataKey: "dayName", tick: { fontSize: 10, fill: "#a1a1aa", fontWeight: "bold" }, axisLine: false, tickLine: false, dy: 5 }),
              /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", tick: { fontSize: 10, fill: "#71717a", fontWeight: "bold" }, axisLine: false, tickLine: false, dx: -5 }),
              /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", tick: { fontSize: 10, fill: "#a1a1aa", fontWeight: "bold" }, axisLine: false, tickLine: false, domain: [0, 28], dx: 5 }),
              /* @__PURE__ */ jsx(Tooltip, { contentStyle: { backgroundColor: "#09090b", color: "#fff", borderRadius: "8px", border: "1px solid #27272a", fontSize: "12px", fontWeight: "bold" }, cursor: { fill: "rgba(0,0,0,0.02)" } }),
              /* @__PURE__ */ jsx(Bar, { yAxisId: "left", dataKey: "load", name: "Daily Load (AU)", fill: "#27272a", radius: [4, 4, 0, 0], barSize: 22, className: "" }),
              /* @__PURE__ */ jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "wellness", name: "Wellness", stroke: "#a1a1aa", strokeWidth: 2.5, dot: { r: 3, strokeWidth: 2, fill: "#fff" } })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50  p-4 rounded-xl border border-slate-200  flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 ", children: "Peak Training Load" }),
                /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-700  text-xs mt-0.5", children: "Day with Highest Load" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-xl text-slate-900 ", children: [
                maxLoad,
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "AU" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50  p-4 rounded-xl border border-slate-200  flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 ", children: "Minimum Fitness" }),
                /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-700  text-xs mt-0.5", children: "Day with Lowest Wellness" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-xl text-slate-900 ", children: [
                minWellness,
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-400", children: "/28" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full border-b border-slate-200 ", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs whitespace-nowrap", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-slate-50/50  border-b border-slate-200  text-slate-500 text-[9px] font-bold", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Days" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-4 text-center", children: "Wellness" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-4", children: "Morning Session (AM)" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-4", children: "Afternoon Session (PM)" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-4", children: "Notes" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-4 text-center", children: "Daily Load" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 ", children: chartData.map((day, dayIdx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/40  transition-colors", children: [
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-3", children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900  text-xs", children: day.dayName }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400 font-bold", children: day.dateLabel })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: day.wellness > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: `font-bold px-2.5 py-0.5 rounded text-[11px] border ${getDailyWellnessColor(day.wellness).bg} ${getDailyWellnessColor(day.wellness).text} ${getDailyWellnessColor(day.wellness).border}`, children: day.wellness }),
              /* @__PURE__ */ jsx("span", { className: `text-[9px] font-bold ${getDailyWellnessColor(day.wellness).text}`, children: getDailyWellnessColor(day.wellness).label })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300 ", children: "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: day.amLoad > 0 ? /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-700  text-xs", children: [
              day.amLoad,
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 font-normal", children: "AU" })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300 ", children: "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: day.pmLoad > 0 ? /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-700  text-xs", children: [
              day.pmLoad,
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 font-normal", children: "AU" })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300 ", children: "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 max-w-[200px] whitespace-normal", children: day.notes !== "-" ? /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500  italic", children: day.notes }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300 ", children: "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: day.load > 0 ? /* @__PURE__ */ jsx("span", { className: `font-bold px-2.5 py-1 rounded text-xs border ${getDailyLoadBadgeClass(day.load)}`, children: day.load }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300 ", children: "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-3 text-right", children: !canModify ? /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setViewingEntry(day),
                className: "inline-flex items-center gap-1 bg-slate-900  text-slate-50  text-[10px] font-bold px-2.5 py-1 rounded hover:bg-slate-800  transition-colors",
                children: [
                  /* @__PURE__ */ jsx(Eye, { size: 10 }),
                  "View"
                ]
              }
            ) : /* @__PURE__ */ jsx(
              Link,
              {
                href: route("admin.wellness-rpe.show", { date: day.dateStr }),
                className: "inline-flex items-center gap-1 bg-slate-900  text-slate-50  text-[10px] font-bold px-2.5 py-1 rounded hover:bg-slate-800  transition-colors",
                children: day.hasData ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Edit3, { size: 10 }),
                  "Edit"
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Plus, { size: 10 }),
                  "Fill Data"
                ] })
              }
            ) })
          ] }, dayIdx)) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-800  p-6 text-slate-100 ", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 opacity-70", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-slate-100 " }),
            /* @__PURE__ */ jsxs("h4", { className: "text-xs text-slate-100  font-bold", children: [
              '"Load Metrics & Monitoring" ("Week" ',
              week.week_number,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-y-6 gap-x-4 divide-x divide-slate-400 ", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-4 first:pl-0 border-none", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold text-slate-100  mb-1", children: "Weekly Load" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl text-slate-100 ", children: week.weekly_load })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold text-slate-100  mb-1", children: "ACWR Ratio" }),
              /* @__PURE__ */ jsx("p", { className: `text-2xl font-bold ${getAcwrBadgeClass(week.acwr)} px-2 py-0.5 rounded inline-block`, children: week.acwr > 0 ? week.acwr : /* @__PURE__ */ jsx("span", { className: "text-slate-100  text-sm font-medium border-none bg-transparent", children: "0.00" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold text-slate-100  mb-1", children: "Mean Daily Load" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-bold mt-1 text-slate-100 ", children: week.mean_daily_load })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-4 border-none md:border-solid", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold text-slate-100  mb-1", children: "Std Deviation" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-bold mt-1 text-slate-100 ", children: week.standard_deviation })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold text-slate-100  mb-1", children: "Monotony" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-bold mt-1 text-slate-100 ", children: week.training_monotony })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold text-slate-100  mb-1", children: "Strain" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-bold mt-1 text-slate-100 ", children: week.strain })
            ] })
          ] })
        ] })
      ] }, week.week_number);
    }) }),
    viewingEntry && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white  border border-slate-200  w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-slate-200  bg-slate-50/50  flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 ", children: "Metric Details" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-bold text-slate-500  mt-0.5", children: [
            viewingEntry.dayName,
            ", ",
            viewingEntry.dateLabel
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setViewingEntry(null), className: "p-2 text-slate-500 hover:bg-slate-200    rounded-full transition-colors", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 grid grid-cols-1 gap-3 overflow-y-auto", children: !viewingEntry.hasData ? /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 text-center py-4", children: "No data for today." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold text-sm text-slate-900  mb-2 border-b border-slate-200  pb-2", children: "Wellness" }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Quality of Sleep", value: viewingEntry.rawData?.quality_of_sleep }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Fatigue", value: viewingEntry.rawData?.fatigue }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Muscle Soreness", value: viewingEntry.rawData?.muscle_soreness }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Stress", value: viewingEntry.rawData?.stress }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Motivation", value: viewingEntry.rawData?.motivation }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Health", value: viewingEntry.rawData?.health }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Mood State", value: viewingEntry.rawData?.mood_state }),
        /* @__PURE__ */ jsx(DetailRow, { label: "Attitude to Study", value: viewingEntry.rawData?.attitude_to_study }),
        /* @__PURE__ */ jsx("div", { className: "font-bold text-sm text-slate-900  mt-4 mb-2 border-b border-slate-200  pb-2", children: "RPE (AM & PM)" }),
        /* @__PURE__ */ jsx(DetailRow, { label: "AM RPE", value: viewingEntry.rawData?.am_rpe, unit: "point" }),
        /* @__PURE__ */ jsx(DetailRow, { label: "AM Duration", value: viewingEntry.rawData?.am_duration, unit: "min" }),
        /* @__PURE__ */ jsx(DetailRow, { label: "PM RPE", value: viewingEntry.rawData?.pm_rpe, unit: "point" }),
        /* @__PURE__ */ jsx(DetailRow, { label: "PM Duration", value: viewingEntry.rawData?.pm_duration, unit: "min" })
      ] }) })
    ] }) })
  ] });
}
const DetailRow = ({ label, value, unit = "" }) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-2.5 border-b border-slate-100  last:border-0", children: [
  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-xs font-bold text-slate-500  tracking-tighter", children: label }),
  /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-slate-900 ", children: [
    value !== null && value !== void 0 && value !== "" ? value : "-",
    unit && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400  ml-1", children: unit })
  ] })
] });
export {
  AnalysisDetail as default
};
