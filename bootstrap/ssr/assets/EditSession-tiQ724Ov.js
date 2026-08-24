import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ClipboardEdit, ChevronLeft, Dumbbell, Type, Activity } from "lucide-react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PhaseBlock from "./PhaseBlock-B4ubJl7i.js";
import TextBlock from "./TextBlock-CkGgVHqe.js";
import ExerciseQuickModal from "./ExerciseQuickModal-D2LIRvjM.js";
import "axios";
import "./ExerciseSelect-DipOfk37.js";
import "react-dom";
function EditSession({
  training,
  user,
  exercisesList,
  packagesList,
  coachesList
}) {
  const { data, setData, put, processing, errors } = useForm({
    date: training.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    name: training.name || "",
    training_type: training.training_type || "Strength",
    location: training.location || "Gym",
    coach_ids: training.coach_ids || [],
    blocks: training.blocks?.length > 0 ? training.blocks : [],
    is_extra: training.is_extra || false
  });
  const [isExModalOpen, setIsExModalOpen] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    put(route("admin.individual-trainings.session.update", training.id));
  };
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
    if (type === "block") {
      const items = Array.from(data.blocks);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setData("blocks", items);
    } else if (type === "exercise") {
      const sourceBlockIndex = parseInt(source.droppableId.split("-")[2]);
      const destBlockIndex = parseInt(
        destination.droppableId.split("-")[2]
      );
      const newBlocks = [...data.blocks];
      const sourceItems = Array.from(newBlocks[sourceBlockIndex].items);
      const [reorderedItem] = sourceItems.splice(source.index, 1);
      if (sourceBlockIndex === destBlockIndex) {
        sourceItems.splice(destination.index, 0, reorderedItem);
        newBlocks[sourceBlockIndex].items = sourceItems;
      } else {
        const destItems = Array.from(newBlocks[destBlockIndex].items);
        destItems.splice(destination.index, 0, reorderedItem);
        newBlocks[sourceBlockIndex].items = sourceItems;
        newBlocks[destBlockIndex].items = destItems;
      }
      setData("blocks", newBlocks);
    }
  };
  const addTextBlock = () => {
    setData("blocks", [
      ...data.blocks,
      {
        step: 1,
        category: "instruction",
        title: "",
        items: [{ note: "" }]
      }
    ]);
  };
  const addPhaseBlock = () => {
    setData("blocks", [
      ...data.blocks,
      {
        step: 2,
        category: "warm_up",
        title: "",
        description: "",
        items: [
          {
            exercise_id: "",
            note: "",
            load: "",
            load_unit: "kg",
            sets: "",
            reps: "",
            reps_unit: "reps",
            duration: "",
            tempo: "",
            rir: "",
            rest_per_set: "",
            intensity: ""
          }
        ]
      }
    ]);
  };
  const updateBlock = (index, field, value) => {
    const newBlocks = [...data.blocks];
    newBlocks[index][field] = value;
    setData("blocks", newBlocks);
  };
  const removeBlock = (index) => {
    if (confirm("Yakin ingin menghapus blok ini?")) {
      const newBlocks = [...data.blocks];
      newBlocks.splice(index, 1);
      setData("blocks", newBlocks);
    }
  };
  const duplicateBlock = (index) => {
    const newBlocks = [...data.blocks];
    const blockToCopy = JSON.parse(JSON.stringify(newBlocks[index]));
    delete blockToCopy.id;
    if (blockToCopy.items) {
      blockToCopy.items = blockToCopy.items.map((item) => {
        const newItem = { ...item };
        delete newItem.id;
        return newItem;
      });
    }
    newBlocks.splice(index + 1, 0, blockToCopy);
    setData("blocks", newBlocks);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Edit Sesi - ${user.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Edit Sesi - ${user.name}` }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Edit Sesi Latihan",
        subtitle: `Perbarui sesi program latihan untuk ${training.athlete?.name}.`,
        badge: "Training",
        icon: ClipboardEdit,
        actions: /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("admin.individual-trainings.show", user.id),
            className: "inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-800 transition-colors bg-white border border-zinc-200 px-4 py-2 rounded-lg shadow-sm",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
              " Batal & Kembali"
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 border border-zinc-200 rounded-xl shadow-sm", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-zinc-900 mb-6", children: "Informasi Dasar" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-zinc-500 mb-2", children: "Tanggal Sesi" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: data.date,
                onChange: (e) => setData("date", e.target.value),
                className: "w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
              }
            ),
            errors.date && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs mt-1", children: errors.date })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-bold text-zinc-500 mb-2", children: [
              "Judul Sesi Latihan",
              "",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                placeholder: "Contoh: Recovery Training",
                className: "w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none",
                required: true
              }
            ),
            errors.name && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs mt-1", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-zinc-500 mb-2", children: "Fokus Latihan" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.training_type,
                onChange: (e) => setData("training_type", e.target.value),
                placeholder: "e.g. Strength, Recovery...",
                className: "w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-[11px] font-bold text-zinc-500 mb-2", children: [
              "Lokasi ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.location,
                onChange: (e) => setData("location", e.target.value),
                placeholder: "e.g. Gym A...",
                className: `w-full py-2.5 px-3 bg-zinc-50 border rounded-lg text-sm text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none ${errors.location ? "border-red-300" : "border-zinc-200"}`
              }
            ),
            errors.location && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-xs mt-1", children: errors.location })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2 lg:col-span-3", children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg cursor-pointer",
              onClick: () => setData("is_extra", !data.is_extra),
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: data.is_extra,
                    onChange: (e) => setData("is_extra", e.target.checked),
                    className: "w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900"
                  }
                ),
                /* @__PURE__ */ jsxs("label", { className: "text-sm font-semibold text-zinc-900 cursor-pointer", children: [
                  "Sesi Tambahan (Turnamen / PR / Latihan Mandiri)",
                  /* @__PURE__ */ jsx("span", { className: "block text-xs text-zinc-500 mt-0.5", children: "Sesi ini tidak akan memotong kuota paket latihan." })
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 lg:col-span-3", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-zinc-500 mb-2", children: "Coach Pendamping (Pilih 1 atau 2)" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: coachesList && coachesList.length > 0 ? coachesList.map((coach) => /* @__PURE__ */ jsxs(
              "label",
              {
                className: `flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${data.coach_ids.includes(coach.id) ? "bg-zinc-900 border-zinc-900 text-white" : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`,
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      className: "hidden",
                      checked: data.coach_ids.includes(
                        coach.id
                      ),
                      onChange: (e) => {
                        if (e.target.checked) {
                          if (data.coach_ids.length >= 2) {
                            alert(
                              "Maksimal memilih 2 pelatih"
                            );
                            return;
                          }
                          setData("coach_ids", [
                            ...data.coach_ids,
                            coach.id
                          ]);
                        } else {
                          setData(
                            "coach_ids",
                            data.coach_ids.filter(
                              (id) => id !== coach.id
                            )
                          );
                        }
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: coach.name }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-70 bg-black/10 px-1.5 py-0.5 rounded", children: coach.role ? coach.role.replace(
                    "_",
                    ""
                  ) : "Coach" })
                ]
              },
              coach.id
            )) : /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500 italic py-2", children: "Belum ada coach yang ditugaskan untuk atlet ini." }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white border-b border-zinc-200 flex justify-between items-center sticky top-0 z-40", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-zinc-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Dumbbell, { className: "w-5 h-5 text-orange-500" }),
            "Skema & Program Latihan"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "px-6 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer",
              children: processing ? "Menyimpan..." : "Simpan Program"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx(DragDropContext, { onDragEnd, children: /* @__PURE__ */ jsx(Droppable, { droppableId: "blocks", type: "block", children: (provided) => /* @__PURE__ */ jsxs(
            "div",
            {
              ...provided.droppableProps,
              ref: provided.innerRef,
              className: "space-y-6",
              children: [
                data.blocks.map((block, index) => /* @__PURE__ */ jsx(
                  Draggable,
                  {
                    draggableId: `block-${index}`,
                    index,
                    children: (provided2) => /* @__PURE__ */ jsx(
                      "div",
                      {
                        ref: provided2.innerRef,
                        ...provided2.draggableProps,
                        children: block.step === 1 ? /* @__PURE__ */ jsx(
                          TextBlock,
                          {
                            block,
                            dragHandleProps: provided2.dragHandleProps,
                            onChange: (field, val) => updateBlock(
                              index,
                              field,
                              val
                            ),
                            onRemove: () => removeBlock(
                              index
                            ),
                            onDuplicate: () => duplicateBlock(
                              index
                            )
                          }
                        ) : /* @__PURE__ */ jsx(
                          PhaseBlock,
                          {
                            blockIndex: index,
                            dragHandleProps: provided2.dragHandleProps,
                            block,
                            exercises: exercisesList,
                            exercisePackages: packagesList,
                            onChange: (field, val) => updateBlock(
                              index,
                              field,
                              val
                            ),
                            onRemove: () => removeBlock(
                              index
                            ),
                            onDuplicate: () => duplicateBlock(
                              index
                            ),
                            onOpenExerciseModal: () => setIsExModalOpen(
                              true
                            )
                          }
                        )
                      }
                    )
                  },
                  `block-${index}`
                )),
                provided.placeholder
              ]
            }
          ) }) }),
          data.blocks.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 bg-white border border-zinc-200 border-dashed rounded-xl mt-4", children: [
            /* @__PURE__ */ jsx(
              Dumbbell,
              {
                size: 32,
                className: "mx-auto text-zinc-300 mb-3"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-zinc-900", children: "Belum ada blok program latihan" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500 mt-1", children: "Gunakan tombol di bawah untuk mulai menyusun program. Anda bisa menyeret (drag) blok yang telah dibuat untuk mengatur urutannya." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: addTextBlock,
                className: "text-sm font-bold bg-orange-50 border border-orange-200 text-orange-500 px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:bg-orange-100 hover:border-orange-300 shadow-sm hover:shadow-md",
                children: [
                  /* @__PURE__ */ jsx(Type, { size: 16, className: "text-orange-500" }),
                  "",
                  "Tambah Catatan Teks"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: addPhaseBlock,
                className: "text-sm font-bold bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:bg-orange-600 shadow-md shadow-orange-500/20 hover:shadow-lg",
                children: [
                  /* @__PURE__ */ jsx(Activity, { size: 16 }),
                  " Tambah Fase Latihan"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ExerciseQuickModal,
      {
        isOpen: isExModalOpen,
        onClose: () => setIsExModalOpen(false)
      }
    )
  ] });
}
export {
  EditSession as default
};
