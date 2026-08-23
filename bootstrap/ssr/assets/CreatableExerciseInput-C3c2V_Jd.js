import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Trash2, Plus } from "lucide-react";
function CreatableExerciseInput({ value, options, onChange, onNewOption, onDeleteOption, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const wrapperRef = useRef(null);
  const filteredOptions = options.filter((opt) => opt.toLowerCase().includes(inputValue.toLowerCase()));
  const isNew = inputValue.trim() !== "" && !options.find((opt) => opt.toLowerCase() === inputValue.toLowerCase());
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setInputValue(value || "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);
  useEffect(() => setInputValue(value || ""), [value]);
  const handleSelect = (opt) => {
    setInputValue(opt);
    onChange(opt);
    setIsOpen(false);
  };
  return (
    // PERBAIKAN: Menambahkan z-index tinggi dan overflow-visible agar dropdown tidak terpotong tabel
    /* @__PURE__ */ jsxs("div", { ref: wrapperRef, className: "relative w-full h-full flex items-center min-w-[140px] md:min-w-0 z-50 overflow-visible", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: inputValue,
          disabled,
          placeholder: "Ketik/Pilih Gerakan...",
          onChange: (e) => {
            setInputValue(e.target.value);
            if (!isOpen) setIsOpen(true);
          },
          onClick: (e) => {
            e.stopPropagation();
            if (!disabled) setIsOpen(true);
          },
          className: "w-full h-full border-none outline-none bg-transparent text-xs md:text-sm px-2 md:px-4 py-3 focus:ring-2 focus:ring-inset focus:ring-orange-500 font-bold text-slate-700 placeholder-slate-400 touch-manipulation truncate relative z-10"
        }
      ),
      !disabled && /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute right-1 md:right-3 p-1 cursor-pointer bg-white z-20",
          onClick: (e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          },
          children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-slate-400" })
        }
      ),
      isOpen && !disabled && // PERBAIKAN: z-[999] yang sangat tinggi agar dropdown selalu berada di lapisan paling depan
      /* @__PURE__ */ jsxs("div", { className: "absolute top-[100%] left-0 w-full min-w-[250px] mt-1 bg-white border border-slate-200 shadow-xl rounded-xl max-h-56 overflow-y-auto z-[999] py-1 custom-scrollbar", children: [
        filteredOptions.length > 0 ? filteredOptions.map((opt, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group flex items-center justify-between px-3 md:px-4 py-2.5 hover:bg-orange-50 cursor-pointer border-b border-slate-50 last:border-b-0",
            onClick: (e) => {
              e.stopPropagation();
              handleSelect(opt);
            },
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs md:text-sm text-slate-700 font-medium group-hover:text-orange-500 truncate pr-2 w-full", children: opt }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.stopPropagation();
                    if (confirm(`Hapus "${opt}" dari daftar pilihan?`)) {
                      onDeleteOption(opt);
                    }
                  },
                  className: "opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1.5 md:p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all shrink-0",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5 md:w-4 md:h-4" })
                }
              )
            ]
          },
          idx
        )) : !isNew && /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-xs text-slate-400 italic text-center", children: "Gerakan tidak ditemukan" }),
        isNew && /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: (e) => {
              e.stopPropagation();
              onNewOption(inputValue.trim());
              handleSelect(inputValue.trim());
            },
            className: "px-3 md:px-4 py-3 text-xs md:text-sm text-orange-500 bg-orange-50/50 hover:bg-orange-100 cursor-pointer font-bold flex items-center gap-2 border-t border-slate-100",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 shrink-0" }),
              " ",
              /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                'Tambah Baru "',
                inputValue,
                '"'
              ] })
            ]
          }
        )
      ] })
    ] })
  );
}
export {
  CreatableExerciseInput as default
};
