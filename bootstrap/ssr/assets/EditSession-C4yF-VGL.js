import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ChevronLeft, UserPlus, Dumbbell, Type, Activity } from "lucide-react";
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
  coachesList,
  group,
  availableAthletes
}) {
  const { data, setData, put, processing, errors, transform } = useForm({
    date: training.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    name: training.name || "",
    training_type: training.training_type || "Strength",
    location: training.location || "Gym",
    coach_ids: training.coach_ids || [],
    attendee_ids: training.attendee_ids || [],
    programs: training.programs || [{ name: "Program Utama", athlete_ids: null, blocks: [] }],
    is_extra: training.is_extra || false
  });
  transform((data2) => ({
    ...data2,
    programs: hasSecondaryProgram ? data2.programs : [{ ...data2.programs[0], athlete_ids: null }]
  }));
  const [isExModalOpen, setIsExModalOpen] = useState(false);
  const [activeProgramIndex, setActiveProgramIndex] = useState(0);
  const [hasSecondaryProgram, setHasSecondaryProgram] = useState(
    data.programs && data.programs.length > 1
  );
  const submit = (e) => {
    e.preventDefault();
    put(route("admin.group-trainings.session.update", training.id));
  };
  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;
    const newPrograms = [...data.programs];
    const activeBlocks = newPrograms[activeProgramIndex].blocks;
    if (type === "block") {
      const [reorderedBlock] = activeBlocks.splice(source.index, 1);
      activeBlocks.splice(destination.index, 0, reorderedBlock);
    } else if (type === "exercise") {
      const sourceBlockIndex = parseInt(source.droppableId.split("-")[2]);
      const destBlockIndex = parseInt(destination.droppableId.split("-")[2]);
      const sourceItems = Array.from(activeBlocks[sourceBlockIndex].items);
      const [reorderedItem] = sourceItems.splice(source.index, 1);
      if (sourceBlockIndex === destBlockIndex) {
        sourceItems.splice(destination.index, 0, reorderedItem);
        activeBlocks[sourceBlockIndex].items = sourceItems;
      } else {
        const destItems = Array.from(activeBlocks[destBlockIndex].items);
        destItems.splice(destination.index, 0, reorderedItem);
        activeBlocks[sourceBlockIndex].items = sourceItems;
        activeBlocks[destBlockIndex].items = destItems;
      }
    }
    setData("programs", newPrograms);
  };
  const addTextBlock = () => {
    const newPrograms = [...data.programs];
    newPrograms[activeProgramIndex].blocks.push({ step: 1, category: "instruction", title: "", items: [{ note: "" }] });
    setData("programs", newPrograms);
  };
  const addPhaseBlock = () => {
    const newPrograms = [...data.programs];
    newPrograms[activeProgramIndex].blocks.push({
      step: 2,
      category: "warm_up",
      title: "",
      description: "",
      items: [{ exercise_id: "", note: "", load: "", load_unit: "kg", sets: "", reps: "", reps_unit: "reps", duration: "", tempo: "", rir: "", rest_per_set: "", intensity: "" }]
    });
    setData("programs", newPrograms);
  };
  const updateBlock = (index, field, value) => {
    const newPrograms = [...data.programs];
    newPrograms[activeProgramIndex].blocks[index][field] = value;
    setData("programs", newPrograms);
  };
  const removeBlock = (index) => {
    if (confirm("Yakin ingin menghapus blok ini?")) {
      const newPrograms = [...data.programs];
      newPrograms[activeProgramIndex].blocks.splice(index, 1);
      setData("programs", newPrograms);
    }
  };
  const duplicateBlock = (index) => {
    const newPrograms = [...data.programs];
    const blockToCopy = JSON.parse(JSON.stringify(newPrograms[activeProgramIndex].blocks[index]));
    delete blockToCopy.id;
    if (blockToCopy.items) {
      blockToCopy.items = blockToCopy.items.map((item) => {
        const newItem = { ...item };
        delete newItem.id;
        return newItem;
      });
    }
    newPrograms[activeProgramIndex].blocks.splice(index + 1, 0, blockToCopy);
    setData("programs", newPrograms);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Edit Sesi - ${training.group?.name || ""}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Edit Sesi - ${training.group?.name || ""}` }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-zinc-900 tracking-tight", children: "Edit Sesi Latihan" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500 mt-1", children: [
          "Perbarui sesi program latihan untuk",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-slate-900 font-bold", children: training.group?.name })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("admin.group-trainings.show", training.training_group_id),
          className: "inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors",
          children: [
            /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
            " Batal & Kembali"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 border border-zinc-200 rounded-xl shadow-sm", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-zinc-900 mb-6", children: "Informasi Dasar" }),
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
              "Judul Sesi Latihan ",
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
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2 lg:col-span-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg cursor-pointer", onClick: () => setData("is_extra", !data.is_extra), children: [
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
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 lg:col-span-3", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-zinc-500 mb-2", children: "Coach Pendamping (Pilih 1 atau 2)" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: coachesList && coachesList.length > 0 ? coachesList.map((coach) => /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${data.coach_ids.includes(coach.id) ? "bg-zinc-900 border-zinc-900 text-white" : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "hidden",
                  checked: data.coach_ids.includes(coach.id),
                  onChange: (e) => {
                    if (e.target.checked) {
                      if (data.coach_ids.length >= 2) {
                        alert("Maksimal memilih 2 pelatih");
                        return;
                      }
                      setData("coach_ids", [...data.coach_ids, coach.id]);
                    } else {
                      setData("coach_ids", data.coach_ids.filter((id) => id !== coach.id));
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: coach.name }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-70 bg-black/10 px-1.5 py-0.5 rounded", children: coach.role ? coach.role.replace("_", " ") : "Coach" })
            ] }, coach.id)) : /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500 italic py-2", children: "Belum ada coach yang ditugaskan untuk atlet ini." }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 lg:col-span-3", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-zinc-500 mb-3 uppercase tracking-widest", children: "Peserta Sesi (Checklist Kehadiran)" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-zinc-500 mb-3 -mt-1", children: [
              "Hapus centang pada atlet yang ",
              /* @__PURE__ */ jsx("strong", { children: "tidak hadir / absen" }),
              " pada sesi ini agar mereka tidak dimasukkan ke dalam catatan sesi."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
              group?.members && group.members.length > 0 ? group.members.map((member) => /* @__PURE__ */ jsxs(
                "label",
                {
                  className: `flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${data.attendee_ids.includes(member.id) ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm" : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:border-zinc-300"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        className: "hidden",
                        checked: data.attendee_ids.includes(member.id),
                        onChange: (e) => {
                          let newIds = [...data.attendee_ids];
                          if (e.target.checked) {
                            newIds.push(member.id);
                          } else {
                            newIds = newIds.filter((id) => id !== member.id);
                          }
                          let newData = { ...data, attendee_ids: newIds };
                          if (typeof hasSecondaryProgram !== "undefined" && hasSecondaryProgram) {
                            const newProgs = [...data.programs];
                            if (newProgs[1] && newProgs[1].athlete_ids) {
                              newProgs[1].athlete_ids = newProgs[1].athlete_ids.filter((id) => newIds.includes(id));
                            }
                            if (newProgs[0] && newProgs[0].athlete_ids) {
                              newProgs[0].athlete_ids = newIds.filter((id) => !newProgs[1]?.athlete_ids?.includes(id));
                            }
                            newData.programs = newProgs;
                          }
                          setData(newData);
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: member.name })
                  ]
                },
                member.id
              )) : /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500 italic py-2", children: "Belum ada anggota di grup ini." }),
              data.attendee_ids.filter((id) => !group?.members?.some((m) => m.id === id)).map((guestId) => {
                const guest = typeof availableAthletes !== "undefined" ? availableAthletes?.find((a) => a.id === guestId) : null;
                if (!guest) return null;
                return /* @__PURE__ */ jsxs(
                  "label",
                  {
                    className: "flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all bg-orange-50 border-orange-500 text-orange-700 shadow-sm",
                    children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "checkbox",
                          className: "hidden",
                          checked: true,
                          onChange: () => {
                            const newIds = data.attendee_ids.filter((id) => id !== guest.id);
                            let newData = { ...data, attendee_ids: newIds };
                            if (typeof hasSecondaryProgram !== "undefined" && hasSecondaryProgram) {
                              const newProgs = [...data.programs];
                              if (newProgs[1] && newProgs[1].athlete_ids) {
                                newProgs[1].athlete_ids = newProgs[1].athlete_ids.filter((id) => newIds.includes(id));
                              }
                              if (newProgs[0] && newProgs[0].athlete_ids) {
                                newProgs[0].athlete_ids = newIds.filter((id) => !newProgs[1]?.athlete_ids?.includes(id));
                              }
                              newData.programs = newProgs;
                            }
                            setData(newData);
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: guest.name }),
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-orange-200 text-orange-800", children: "GUEST" })
                    ]
                  },
                  `guest-${guest.id}`
                );
              })
            ] }),
            typeof availableAthletes !== "undefined" && availableAthletes && availableAthletes.filter((a) => !group?.members?.some((m) => m.id === a.id) && !data.attendee_ids.includes(a.id)).length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-orange-50/60 via-amber-50/30 to-transparent p-3.5 rounded-xl border border-orange-200/60 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 shrink-0 shadow-sm", children: /* @__PURE__ */ jsx(UserPlus, { size: 18, strokeWidth: 2.5 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "block text-xs font-extrabold text-zinc-800 tracking-tight", children: "Tambah Tamu (Guest Athlete)" }),
                  /* @__PURE__ */ jsx("span", { className: "block text-[11px] font-medium text-zinc-500 mt-0.5", children: "Undang atlet dari luar grup untuk sesi latihan gabungan / make-up" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative min-w-[240px]", children: [
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: "w-full text-xs font-bold bg-white border border-zinc-300 hover:border-orange-500 text-zinc-700 rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 cursor-pointer shadow-sm transition-all appearance-none",
                    value: "",
                    onChange: (e) => {
                      const guestId = parseInt(e.target.value);
                      if (guestId && !data.attendee_ids.includes(guestId)) {
                        const newIds = [...data.attendee_ids, guestId];
                        let newData = { ...data, attendee_ids: newIds };
                        if (typeof hasSecondaryProgram !== "undefined" && hasSecondaryProgram) {
                          const newProgs = [...data.programs];
                          if (newProgs[0] && newProgs[0].athlete_ids) {
                            newProgs[0].athlete_ids = newIds.filter((id) => !newProgs[1]?.athlete_ids?.includes(id));
                          }
                          newData.programs = newProgs;
                        }
                        setData(newData);
                      }
                    },
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", className: "text-zinc-400", children: "+ Pilih & Tambahkan Atlet..." }),
                      availableAthletes.filter((a) => !group?.members?.some((m) => m.id === a.id) && !data.attendee_ids.includes(a.id)).map((a) => /* @__PURE__ */ jsxs("option", { value: a.id, className: "font-semibold text-zinc-800 py-1", children: [
                        a.name,
                        " (",
                        a.sport?.name || "Atlet",
                        ")"
                      ] }, a.id))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.5", d: "M19 9l-7 7-7-7" }) }) })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white border-b border-zinc-200 sticky top-0 z-40", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-zinc-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Dumbbell, { className: "w-5 h-5 text-orange-500" }),
              "Skema & Program Latihan"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-bold text-zinc-600 cursor-pointer bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-all", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "rounded border-zinc-300 text-orange-500 focus:ring-orange-500",
                    checked: hasSecondaryProgram,
                    onChange: (e) => {
                      const isChecked = e.target.checked;
                      setHasSecondaryProgram(isChecked);
                      const newProgs = [...data.programs];
                      if (isChecked) {
                        if (newProgs.length < 2) {
                          newProgs.push({ name: "Program Sekunder", athlete_ids: [], blocks: [] });
                        }
                        newProgs[0].athlete_ids = [...data.attendee_ids];
                        if (newProgs[1] && newProgs[1].athlete_ids) {
                          newProgs[0].athlete_ids = data.attendee_ids.filter((id) => !newProgs[1].athlete_ids.includes(id));
                        }
                      } else {
                        setActiveProgramIndex(0);
                        newProgs[0].athlete_ids = null;
                      }
                      setData("programs", newProgs);
                    }
                  }
                ),
                "Buat 2 Program Berbeda?"
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: processing,
                  className: "px-6 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer",
                  children: processing ? "MENYIMPAN..." : "Simpan Program"
                }
              )
            ] })
          ] }),
          hasSecondaryProgram && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveProgramIndex(0),
                className: `px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeProgramIndex === 0 ? "bg-orange-500 text-white shadow-md" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`,
                children: data.programs[0].name
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveProgramIndex(1),
                className: `px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeProgramIndex === 1 ? "bg-orange-500 text-white shadow-md" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`,
                children: data.programs[1]?.name || "Program Sekunder"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          hasSecondaryProgram && activeProgramIndex === 1 && /* @__PURE__ */ jsxs("div", { className: "mb-6 bg-white p-4 rounded-xl border border-zinc-200", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-zinc-700 mb-1", children: "Pilih Atlet untuk Program Sekunder" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 mb-3", children: "Atlet yang dipilih akan menjalankan program ini dan TIDAK menjalankan Program Utama." }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 pt-3 border-t border-zinc-100", children: data.attendee_ids.map((attId) => {
              const athlete = (typeof availableAthletes !== "undefined" ? availableAthletes.find((a) => a.id === attId) : null) || (typeof group !== "undefined" ? group?.members?.find((m) => m.id === attId) : null);
              if (!athlete) return null;
              const isSelected = data.programs[1]?.athlete_ids?.includes(attId);
              return /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${isSelected ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"}`, children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "hidden",
                    checked: isSelected,
                    onChange: (e) => {
                      const newProgs = [...data.programs];
                      if (!newProgs[1]) newProgs[1] = { name: "Program Sekunder", athlete_ids: [], blocks: [] };
                      let newIds = newProgs[1].athlete_ids ? [...newProgs[1].athlete_ids] : [];
                      if (e.target.checked) newIds.push(attId);
                      else newIds = newIds.filter((id) => id !== attId);
                      newProgs[1].athlete_ids = newIds;
                      const allIds = data.attendee_ids;
                      newProgs[0].athlete_ids = allIds.filter((id) => !newIds.includes(id));
                      setData("programs", newProgs);
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: athlete?.name || "Atlet" })
              ] }, attId);
            }) })
          ] }),
          hasSecondaryProgram && activeProgramIndex === 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6 bg-orange-50 p-4 rounded-xl border border-orange-200", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-orange-800", children: "Informasi Program Utama" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-orange-600 mt-1", children: [
              "Program ini akan diterapkan ke semua atlet dalam sesi ini, ",
              /* @__PURE__ */ jsx("strong", { children: "KECUALI" }),
              " atlet yang sudah Anda centang di tab ",
              /* @__PURE__ */ jsx("strong", { children: "Program Sekunder" }),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsx(DragDropContext, { onDragEnd, children: /* @__PURE__ */ jsx(Droppable, { droppableId: "blocks", type: "block", children: (provided) => /* @__PURE__ */ jsxs(
            "div",
            {
              ...provided.droppableProps,
              ref: provided.innerRef,
              className: "space-y-6",
              children: [
                data.programs[activeProgramIndex].blocks.map((block, index) => /* @__PURE__ */ jsx(
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
                            onChange: (field, val) => updateBlock(index, field, val),
                            onRemove: () => removeBlock(index),
                            onDuplicate: () => duplicateBlock(index)
                          }
                        ) : /* @__PURE__ */ jsx(
                          PhaseBlock,
                          {
                            blockIndex: index,
                            dragHandleProps: provided2.dragHandleProps,
                            block,
                            exercises: exercisesList,
                            exercisePackages: packagesList,
                            onChange: (field, val) => updateBlock(index, field, val),
                            onRemove: () => removeBlock(index),
                            onDuplicate: () => duplicateBlock(index),
                            onOpenExerciseModal: () => setIsExModalOpen(true)
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
          data.programs[activeProgramIndex].blocks.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 bg-white border border-zinc-200 border-dashed rounded-xl mt-4", children: [
            /* @__PURE__ */ jsx(Dumbbell, { size: 32, className: "mx-auto text-zinc-300 mb-3" }),
            /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-zinc-900", children: "Belum ada blok program latihan" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500 mt-1", children: "Gunakan tombol di bawah untuk mulai menyusun program. Anda bisa menyeret (drag) blok yang telah dibuat untuk mengatur urutannya." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3", children: [
            /* @__PURE__ */ jsxs("button", { type: "button", onClick: addTextBlock, className: "text-sm font-bold bg-orange-50 border border-orange-200 text-orange-500 px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-orange-100 hover:border-orange-300 shadow-sm hover:shadow-md", children: [
              /* @__PURE__ */ jsx(Type, { size: 16, className: "text-orange-500" }),
              " Tambah Catatan Teks"
            ] }),
            /* @__PURE__ */ jsxs("button", { type: "button", onClick: addPhaseBlock, className: "text-sm font-bold bg-orange-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-orange-600 shadow-md shadow-orange-500/20 hover:shadow-lg", children: [
              /* @__PURE__ */ jsx(Activity, { size: 16 }),
              " Tambah Fase Latihan"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ExerciseQuickModal, { isOpen: isExModalOpen, onClose: () => setIsExModalOpen(false) })
  ] });
}
export {
  EditSession as default
};
