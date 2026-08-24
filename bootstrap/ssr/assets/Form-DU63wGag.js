import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { Save, X, UploadCloud } from "lucide-react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
const ImageUploader = ({ label, field, imagePath, data, setData, removeFlag }) => {
  const t = (text) => text;
  const previewUrl = data[field] instanceof File ? URL.createObjectURL(data[field]) : !data[removeFlag] && imagePath ? `/storage/${imagePath}` : null;
  const handleRemove = () => {
    setData((prev) => ({ ...prev, [field]: null, [removeFlag]: true }));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200 ", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 ", children: label }),
    previewUrl ? /* @__PURE__ */ jsxs("div", { className: "relative group rounded-lg overflow-hidden border border-slate-200 bg-white inline-block", children: [
      /* @__PURE__ */ jsx("img", { src: previewUrl, alt: "Preview", className: "h-32 w-auto object-cover" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleRemove,
          className: "bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-sm transition-colors",
          title: "Remove Image",
          children: /* @__PURE__ */ jsx(X, { size: 16 })
        }
      ) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "relative border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100/50 :bg-slate-800/50 transition-colors cursor-pointer group", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "file",
          accept: "image/*",
          className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
          onChange: (e) => {
            if (e.target.files[0]) {
              setData((prev) => ({
                ...prev,
                [field]: e.target.files[0],
                [removeFlag]: false
              }));
            }
          }
        }
      ),
      /* @__PURE__ */ jsx(UploadCloud, { size: 24, className: "text-slate-400 group-hover:text-slate-500 :text-slate-400 mb-2" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-600 ", children: t("Click or drag image to upload") })
    ] })
  ] });
};
function DpaForm({ auth, dpaCompensation }) {
  const t = (text) => text;
  const isEdit = !!dpaCompensation;
  const { data, setData, post, processing, errors } = useForm({
    category: dpaCompensation?.category || "Posterior View",
    name: dpaCompensation?.name || "",
    overactive_muscles: dpaCompensation?.overactive_muscles || "",
    underactive_muscles: dpaCompensation?.underactive_muscles || "",
    possible_injuries: dpaCompensation?.possible_injuries || "",
    exercises_smr: dpaCompensation?.exercises_smr || "",
    exercises_stretching: dpaCompensation?.exercises_stretching || "",
    exercises_isometrics: dpaCompensation?.exercises_isometrics || "",
    exercises_integrated: dpaCompensation?.exercises_integrated || "",
    // File fields
    image: null,
    image_smr: null,
    image_stretching: null,
    image_isometrics: null,
    image_integrated: null,
    // Removal flags
    remove_image: false,
    remove_image_smr: false,
    remove_image_stretching: false,
    remove_image_isometrics: false,
    remove_image_integrated: false
  });
  const categories = [
    "Posterior View",
    "Lateral View",
    "Anterior View",
    "Single Leg"
  ];
  const handleSubmit = (e) => {
    e.preventDefault();
    const routeName = isEdit ? route("admin.dpa-compensations.update", dpaCompensation.id) : route("admin.dpa-compensations.store");
    post(routeName, {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "DPA Compensations", children: [
    /* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit DPA Compensation" : "Add DPA Compensation" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full pb-12 space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: isEdit ? "Edit Compensation" : "New Compensation",
          subtitle: t("Fill in the details below."),
          badge: "Master DPA",
          actions: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("admin.dpa-compensations.index"),
                className: "px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors",
                children: t("Cancel")
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleSubmit,
                disabled: processing,
                className: "bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50",
                children: [
                  /* @__PURE__ */ jsx(Save, { size: 18, strokeWidth: 2 }),
                  processing ? "Saving..." : "Save Compensation"
                ]
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white [#09090b] border border-slate-200 rounded-2xl p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 ", children: t("Basic Information") }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 mb-1", children: t("Category") }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    className: "w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors",
                    value: data.category,
                    onChange: (e) => setData("category", e.target.value),
                    children: categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat))
                  }
                ),
                errors.category && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.category })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 mb-1", children: t("Compensation Name") }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors",
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    placeholder: t("e.g. Foot Flattens")
                  }
                ),
                errors.name && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.name })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                ImageUploader,
                {
                  label: "Reference Image (Optional)",
                  field: "image",
                  imagePath: dpaCompensation?.image_path,
                  data,
                  setData,
                  removeFlag: "remove_image"
                }
              ),
              errors.image && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.image })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white [#09090b] border border-slate-200 rounded-2xl p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6 pb-3 border-b border-slate-100 ", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 ", children: t("Muscles & Injuries") }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-500 mt-1", children: t("Separate with commas or newlines for multiple items.") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 mb-1", children: t("Problem Overactive Muscles") }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors",
                  rows: "4",
                  value: data.overactive_muscles,
                  onChange: (e) => setData("overactive_muscles", e.target.value),
                  placeholder: t("e.g. Soleus, Lateral gastrocnemius...")
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 mb-1", children: t("Problem Underactive Muscles") }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors",
                  rows: "4",
                  value: data.underactive_muscles,
                  onChange: (e) => setData("underactive_muscles", e.target.value),
                  placeholder: t("e.g. Medial gastrocnemius, Anterior tibialis...")
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 mb-1", children: t("Possible Injuries") }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors",
                  rows: "4",
                  value: data.possible_injuries,
                  onChange: (e) => setData("possible_injuries", e.target.value),
                  placeholder: t("e.g. Plantar fasciitis, Achilles tendinopathy...")
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white [#09090b] border border-slate-200 rounded-2xl p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6 pb-3 border-b border-slate-100 ", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 ", children: t("Corrective Exercises (NASM)") }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-500 mt-1", children: t("Provide exercise instructions and attach corresponding demonstration images.") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 mb-1", children: "1. Inhibit (SMR)" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors",
                    rows: "2",
                    value: data.exercises_smr,
                    onChange: (e) => setData("exercises_smr", e.target.value),
                    placeholder: t("Exercise description...")
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                ImageUploader,
                {
                  label: "SMR Image",
                  field: "image_smr",
                  imagePath: dpaCompensation?.image_smr,
                  data,
                  setData,
                  removeFlag: "remove_image_smr"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 mb-1", children: "2. Lengthen (Static Stretching)" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors",
                    rows: "2",
                    value: data.exercises_stretching,
                    onChange: (e) => setData("exercises_stretching", e.target.value),
                    placeholder: t("Exercise description...")
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                ImageUploader,
                {
                  label: "Stretching Image",
                  field: "image_stretching",
                  imagePath: dpaCompensation?.image_stretching,
                  data,
                  setData,
                  removeFlag: "remove_image_stretching"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 mb-1", children: "3. Activate (Positional Isometrics)" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors",
                    rows: "2",
                    value: data.exercises_isometrics,
                    onChange: (e) => setData("exercises_isometrics", e.target.value),
                    placeholder: t("Exercise description...")
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                ImageUploader,
                {
                  label: "Isometrics Image",
                  field: "image_isometrics",
                  imagePath: dpaCompensation?.image_isometrics,
                  data,
                  setData,
                  removeFlag: "remove_image_isometrics"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-700 mb-1", children: "4. Integrate (Dynamic Movement)" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors",
                    rows: "2",
                    value: data.exercises_integrated,
                    onChange: (e) => setData("exercises_integrated", e.target.value),
                    placeholder: t("Exercise description...")
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                ImageUploader,
                {
                  label: "Integrated Image",
                  field: "image_integrated",
                  imagePath: dpaCompensation?.image_integrated,
                  data,
                  setData,
                  removeFlag: "remove_image_integrated"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  DpaForm as default
};
