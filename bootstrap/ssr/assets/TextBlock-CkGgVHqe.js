import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { GripVertical, Copy, Trash2, MessageSquare, FileText, CheckSquare, AlertCircle } from "lucide-react";
function TextBlock({ block, onChange, onRemove, onDuplicate, dragHandleProps }) {
  const getCategoryConfig = (category) => {
    switch (category) {
      case "nb":
        return {
          label: "N.B (Penting)",
          icon: AlertCircle,
          badgeStyle: "bg-[#ed4e18]/10 text-[#ed4e18] border-[#ed4e18]/20",
          containerStyle: "border-[#ed4e18]/30 bg-gradient-to-r from-[#ed4e18]/[0.03] to-transparent",
          textareaStyle: "text-slate-900 font-semibold placeholder:text-slate-400 focus:border-[#ed4e18] focus:ring-[#ed4e18]/10"
        };
      case "instruction":
        return {
          label: "Instruksi Latihan",
          icon: CheckSquare,
          badgeStyle: "bg-slate-100 text-slate-700 border-slate-200",
          containerStyle: "border-slate-200 bg-white",
          textareaStyle: "text-slate-700 font-medium placeholder:text-slate-400 focus:border-[#ed4e18] focus:ring-[#ed4e18]/10"
        };
      case "description":
        return {
          label: "Deskripsi Sesi",
          icon: FileText,
          badgeStyle: "bg-slate-100 text-slate-700 border-slate-200",
          containerStyle: "border-slate-200 bg-white",
          textareaStyle: "text-slate-700 font-medium placeholder:text-slate-400 focus:border-[#ed4e18] focus:ring-[#ed4e18]/10"
        };
      default:
        return {
          label: "Catatan Umum",
          icon: MessageSquare,
          badgeStyle: "bg-slate-100 text-slate-700 border-slate-200",
          containerStyle: "border-slate-200 bg-white",
          textareaStyle: "text-slate-700 font-medium placeholder:text-slate-400 focus:border-[#ed4e18] focus:ring-[#ed4e18]/10"
        };
    }
  };
  const config = getCategoryConfig(block.category);
  const IconComponent = config.icon;
  return /* @__PURE__ */ jsxs("div", { className: `rounded-2xl border ${config.containerStyle} shadow-sm hover:shadow-md transition-all duration-300 mb-6 overflow-hidden group/block`, children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-50/80 p-3.5 px-5 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-1 w-full sm:w-auto", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ...dragHandleProps,
            className: "cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-200/50 -ml-1 shrink-0",
            title: "Tahan dan geser untuk memindahkan",
            children: /* @__PURE__ */ jsx(GripVertical, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs ${config.badgeStyle}`, children: /* @__PURE__ */ jsx(IconComponent, { size: 16 }) }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "appearance-none bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-bold py-1.5 pl-3 pr-8 shadow-2xs cursor-pointer hover:border-[#ed4e18] outline-none focus:ring-2 focus:ring-[#ed4e18]/20 focus:border-[#ed4e18] transition-all",
                value: block.category || "note",
                onChange: (e) => onChange("category", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "instruction", children: "Instruksi Latihan" }),
                  /* @__PURE__ */ jsx("option", { value: "description", children: "Deskripsi Sesi" }),
                  /* @__PURE__ */ jsx("option", { value: "nb", children: "N.B (Penting)" }),
                  /* @__PURE__ */ jsx("option", { value: "note", children: "Catatan Umum" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400", children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 fill-current", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd", fillRule: "evenodd" }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-px h-5 bg-slate-200 hidden sm:block mx-1" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Judul blok teks (opsional)...",
            className: "bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-400 w-full hover:bg-white/50 focus:bg-white rounded px-2 py-1 transition-all",
            value: block.title || "",
            onChange: (e) => onChange("title", e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 self-end sm:self-auto shrink-0", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onDuplicate,
            className: "p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all",
            title: "Duplikat Blok",
            children: /* @__PURE__ */ jsx(Copy, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onRemove,
            className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all",
            title: "Hapus Blok",
            children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-5 bg-white/80", children: /* @__PURE__ */ jsx(
      "textarea",
      {
        className: `w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200/80 rounded-xl p-4 text-sm leading-relaxed min-h-[100px] resize-y transition-all outline-none focus:ring-2 ${config.textareaStyle}`,
        placeholder: block.category === "nb" ? "Tulis catatan penting atau instruksi krusial yang harus diperhatikan atlet di sini..." : "Ketik penjelasan detail, arahan sesi, atau catatan umum di sini...",
        value: block.items?.[0]?.note || "",
        onChange: (e) => {
          const newItems = block.items?.length ? [...block.items] : [{ note: "" }];
          newItems[0].note = e.target.value;
          onChange("items", newItems);
        }
      }
    ) })
  ] });
}
export {
  TextBlock as default
};
