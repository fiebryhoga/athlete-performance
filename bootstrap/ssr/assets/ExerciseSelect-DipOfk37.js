import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, Check, Plus } from "lucide-react";
import ExerciseQuickModal from "./ExerciseQuickModal-D2LIRvjM.js";
import "axios";
function ExerciseSelect({ value, options, onChange }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localOptions, setLocalOptions] = useState(options);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);
  const filtered = useMemo(() => {
    return (localOptions || []).filter(
      (opt) => opt.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, localOptions]);
  const isNotFound = search.length > 0 && filtered.length === 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCreateNew = () => {
    setIsOpen(false);
    setIsModalOpen(true);
  };
  const handleSuccess = (newEx) => {
    setLocalOptions((prev) => [...prev, newEx]);
    onChange(newEx.id);
    setSearch("");
  };
  const selectedEx = (localOptions || []).find((o) => o.id == value);
  const updateCoords = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUp = spaceBelow < 260 && spaceAbove > spaceBelow;
      setCoords({
        top: openUp ? rect.top - 6 : rect.bottom + 6,
        left: rect.left,
        width: Math.max(rect.width, 280),
        openUp
      });
    }
  };
  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
      return () => {
        window.removeEventListener("scroll", updateCoords, true);
        window.removeEventListener("resize", updateCoords);
      };
    }
  }, [isOpen]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && (!menuRef.current || !menuRef.current.contains(event.target))) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const dropdownPortal = isOpen ? createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: menuRef,
        style: {
          position: "fixed",
          top: coords.openUp ? "auto" : `${coords.top}px`,
          bottom: coords.openUp ? `${window.innerHeight - coords.top}px` : "auto",
          left: `${coords.left}px`,
          width: `${coords.width}px`,
          zIndex: 99999
        },
        className: "bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/80", children: [
            /* @__PURE__ */ jsx(Search, { size: 14, className: "text-slate-400 ml-1 shrink-0" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                autoFocus: true,
                className: "w-full bg-transparent border-none focus:outline-none focus:ring-0 text-xs p-1 text-slate-800 placeholder:text-slate-400 font-medium",
                placeholder: "Cari atau ketik baru...",
                value: search,
                onChange: (e) => setSearch(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "max-h-[250px] overflow-y-auto p-1.5 space-y-1", children: [
            filtered.map((opt) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  onChange(opt.id);
                  setIsOpen(false);
                  setSearch("");
                },
                className: "w-full text-left px-3 py-2.5 text-xs hover:bg-[#ed4e18]/10 hover:text-[#ed4e18] rounded-lg flex items-center justify-between group transition-all cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "flex flex-col truncate pr-2", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 group-hover:text-[#ed4e18] truncate", children: opt.name }) }),
                  value == opt.id && /* @__PURE__ */ jsx(Check, { size: 14, className: "text-[#ed4e18] shrink-0 font-bold" })
                ]
              },
              opt.id
            )),
            isNotFound && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleCreateNew,
                className: "w-full text-left px-3 py-3 text-xs bg-[#ed4e18] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#ed4e18]/90 mt-1 shadow-2xs transition-all font-bold cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Plus, { size: 14, className: "shrink-0" }),
                  /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                    'Tambah "',
                    search,
                    '" ke Master'
                  ] })
                ]
              }
            )
          ] })
        ]
      }
    ),
    document.body
  ) : null;
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full", ref: dropdownRef, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          if (!isOpen) updateCoords();
          setIsOpen(!isOpen);
        },
        className: "w-full text-left px-3 py-2 text-xs font-bold bg-white rounded-lg border border-slate-200 hover:border-[#ed4e18] shadow-2xs transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#ed4e18]/20 focus:border-[#ed4e18] cursor-pointer",
        children: /* @__PURE__ */ jsx("span", { className: value ? "text-slate-800 truncate" : "text-slate-400 font-normal", children: selectedEx ? selectedEx.name : "Pilih Latihan..." })
      }
    ),
    dropdownPortal,
    /* @__PURE__ */ jsx(
      ExerciseQuickModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        initialName: search,
        onSuccess: handleSuccess
      }
    )
  ] });
}
export {
  ExerciseSelect as default
};
