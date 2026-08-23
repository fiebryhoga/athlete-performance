import { jsxs, jsx } from "react/jsx-runtime";
import "react";
function PageHeader({
  title,
  description,
  badge,
  icon: Icon,
  actions,
  className = ""
}) {
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        Icon && /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs border border-orange-100/60", children: /* @__PURE__ */ jsx(Icon, { size: 14 }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight", children: title }),
        badge && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-200/60", children: badge })
      ] }),
      description && /* @__PURE__ */ jsx("p", { className: "text-[11px] sm:text-xs font-medium text-slate-500 leading-relaxed", children: description })
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 shrink-0", children: actions })
  ] });
}
export {
  PageHeader as P
};
