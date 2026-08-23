import { jsx, jsxs } from "react/jsx-runtime";
import "react";
function PageFooter({
  brand = "Olympus Training Surabaya",
  description = "Pusat Pengembangan Atlet & Analisis Performa Olahraga",
  className = ""
}) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: `pt-3 pb-1 mt-2 text-center font-semibold ${className}`, children: /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-400 leading-relaxed", children: [
    "© ",
    currentYear,
    " ",
    /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: brand }),
    ". ",
    description
  ] }) });
}
export {
  PageFooter as P
};
