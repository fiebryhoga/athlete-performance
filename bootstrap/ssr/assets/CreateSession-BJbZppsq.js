import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ClipboardEdit, ChevronLeft, Activity, Calendar, Target, MapPin, Sparkles, UserCheck, Check, Users, X, UserPlus, ChevronDown, Search, Dumbbell, Type } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PhaseBlock from "./PhaseBlock-B4ubJl7i.js";
import TextBlock from "./TextBlock-CkGgVHqe.js";
import ExerciseQuickModal from "./ExerciseQuickModal-D2LIRvjM.js";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
import "./ExerciseSelect-DipOfk37.js";
import "react-dom";
function CreateSession({
  auth,
  group,
  exercises = [],
  packages = [],
  coaches = [],
  date,
  nextSessionNumber,
  availableAthletes
}) {
  const { data, setData, post, processing, errors, transform } = useForm({
    date: date || "",
    name: "",
    training_type: "",
    location: "",
    coach_ids: [],
    attendee_ids: group?.members?.map((m) => m.id) || [],
    programs: [{ name: "Program Utama", athlete_ids: null, blocks: [] }],
    is_extra: false
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
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [guestSearchQuery, setGuestSearchQuery] = useState("");
  const handleSelectAllAthletes = () => {
    const allMemberIds = group?.members?.map((m) => m.id) || [];
    const guestIds = data.attendee_ids.filter((id) => !allMemberIds.includes(id));
    const newIds = [.../* @__PURE__ */ new Set([...allMemberIds, ...guestIds])];
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
  };
  const handleDeselectAllAthletes = () => {
    let newData = { ...data, attendee_ids: [] };
    if (typeof hasSecondaryProgram !== "undefined" && hasSecondaryProgram) {
      const newProgs = [...data.programs];
      if (newProgs[1]) newProgs[1].athlete_ids = [];
      if (newProgs[0]) newProgs[0].athlete_ids = [];
      newData.programs = newProgs;
    }
    setData(newData);
  };
  const submitSession = (e) => {
    e.preventDefault();
    const submitData = { ...data };
    if (!hasSecondaryProgram) {
      submitData.programs = [{ ...submitData.programs[0], athlete_ids: null }];
    }
    post(route("admin.group-trainings.session.store", group.id), {
      data: submitData
    });
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
    newPrograms[activeProgramIndex].blocks.push({
      step: 1,
      category: "instruction",
      title: "",
      items: [{ note: "" }]
    });
    setData("programs", newPrograms);
  };
  const addPhaseBlock = () => {
    const newPrograms = [...data.programs];
    newPrograms[activeProgramIndex].blocks.push({
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
    if (blockToCopy.items) {
      blockToCopy.items = blockToCopy.items.map((item) => {
        const newItem = { ...item };
        return newItem;
      });
    }
    newPrograms[activeProgramIndex].blocks.splice(index + 1, 0, blockToCopy);
    setData("programs", newPrograms);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Tambah Sesi - ${group.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Tambah Sesi - ${group.name}` }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Perancang Sesi Latihan",
        subtitle: `Buat rancangan program latihan untuk ${group.name} pada ${date}.`,
        badge: "Training",
        icon: ClipboardEdit,
        actions: /* @__PURE__ */ jsxs(
          Link,
          {
            href: route(
              "admin.group-trainings.show",
              group.id
            ),
            className: "inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
              " Batal & Kembali"
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("form", { onSubmit: submitSession, className: "space-y-6 md:space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm space-y-8 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-[#ed4e18]/10 border border-[#ed4e18]/20 flex items-center justify-center text-[#ed4e18] shrink-0 shadow-2xs", children: /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: "Informasi Dasar Sesi" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Tentukan jadwal, judul, fokus latihan, dan lokasi pelaksanaan sesi." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2", children: [
              /* @__PURE__ */ jsx(Calendar, { size: 14, className: "text-[#ed4e18]" }),
              /* @__PURE__ */ jsx("span", { children: "Tanggal Sesi" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: data.date,
                onChange: (e) => setData("date", e.target.value),
                className: "w-full py-2.5 px-3.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#ed4e18]/25 focus:border-[#ed4e18] outline-none transition-all shadow-2xs"
              }
            ),
            errors.date && /* @__PURE__ */ jsx("div", { className: "text-rose-500 text-xs mt-1.5 font-semibold", children: errors.date })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2", children: [
              /* @__PURE__ */ jsx("span", { children: "Judul Sesi Latihan" }),
              /* @__PURE__ */ jsx("span", { className: "text-[#ed4e18] font-bold", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                placeholder: "Contoh: Recovery Training",
                className: "w-full py-2.5 px-3.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#ed4e18]/25 focus:border-[#ed4e18] outline-none transition-all placeholder:text-slate-400 shadow-2xs",
                required: true
              }
            ),
            errors.name && /* @__PURE__ */ jsx("div", { className: "text-rose-500 text-xs mt-1.5 font-semibold", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2", children: [
              /* @__PURE__ */ jsx(Target, { size: 14, className: "text-[#ed4e18]" }),
              /* @__PURE__ */ jsx("span", { children: "Fokus Latihan" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.training_type,
                onChange: (e) => setData("training_type", e.target.value),
                placeholder: "Contoh: Strength, Endurance...",
                className: "w-full py-2.5 px-3.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#ed4e18]/25 focus:border-[#ed4e18] outline-none transition-all placeholder:text-slate-400 shadow-2xs"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 14, className: "text-[#ed4e18]" }),
              /* @__PURE__ */ jsx("span", { children: "Lokasi" }),
              /* @__PURE__ */ jsx("span", { className: "text-[#ed4e18] font-bold", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.location,
                onChange: (e) => setData("location", e.target.value),
                placeholder: "Contoh: Gym A, Lapangan Utama...",
                className: `w-full py-2.5 px-3.5 bg-white border rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#ed4e18]/25 focus:border-[#ed4e18] outline-none transition-all placeholder:text-slate-400 shadow-2xs ${errors.location ? "border-rose-300" : "border-slate-200"}`
              }
            ),
            errors.location && /* @__PURE__ */ jsx("div", { className: "text-rose-500 text-xs mt-1.5 font-semibold", children: errors.location })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "col-span-full pt-2", children: /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setData("is_extra", !data.is_extra),
              className: `p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${data.is_extra ? "bg-[#ed4e18] text-white border-[#ed4e18] shadow-md shadow-[#ed4e18]/20" : "bg-slate-50/80 text-slate-800 border-slate-200 hover:border-[#ed4e18]/40"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start sm:items-center gap-3.5", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm transition-colors ${data.is_extra ? "bg-white/20 text-white shadow-2xs" : "bg-[#ed4e18]/10 text-[#ed4e18] border border-[#ed4e18]/20 shadow-2xs"}`, children: /* @__PURE__ */ jsx(Sparkles, { size: 18 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: "Sesi Tambahan (Turnamen / PR / Latihan Mandiri)" }),
                      data.is_extra && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold px-2 py-0.5 rounded bg-white/20", children: "Aktif" })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: `block text-xs mt-0.5 ${data.is_extra ? "text-white/90" : "text-slate-500"}`, children: "Sesi ini tidak akan memotong kuota paket latihan." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 self-end sm:self-center shrink-0", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: data.is_extra,
                      onChange: (e) => setData("is_extra", e.target.checked),
                      className: "w-4 h-4 rounded border-slate-300 text-[#ed4e18] focus:ring-[#ed4e18] pointer-events-none"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold select-none", children: data.is_extra ? "Ya, Jadikan Sesi Tambahan" : "Tidak" })
                ] })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-slate-100 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-sm font-bold text-slate-900", children: [
                /* @__PURE__ */ jsx(UserCheck, { size: 16, className: "text-[#ed4e18]" }),
                /* @__PURE__ */ jsx("span", { children: "Coach Pendamping" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Pilih 1 atau maksimal 2 pelatih yang bertugas mendampingi sesi ini." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ed4e18]/10 text-[#ed4e18] border border-[#ed4e18]/20 self-start sm:self-center shrink-0", children: [
              "Terpilih: ",
              data.coach_ids.length,
              " / 2 Coach"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", children: coaches && coaches.length > 0 ? coaches.map((coach) => {
            const isSelected = data.coach_ids.includes(coach.id);
            return /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => {
                  if (isSelected) {
                    setData("coach_ids", data.coach_ids.filter((id) => id !== coach.id));
                  } else {
                    if (data.coach_ids.length >= 2) {
                      alert("Maksimal memilih 2 pelatih");
                      return;
                    }
                    setData("coach_ids", [...data.coach_ids, coach.id]);
                  }
                },
                className: `flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected ? "bg-[#ed4e18] border-[#ed4e18] text-white shadow-md shadow-[#ed4e18]/20" : "bg-white border-slate-200 text-slate-700 hover:bg-[#ed4e18]/5 hover:border-[#ed4e18]/30"}`,
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                    /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${isSelected ? "bg-white/20 text-white" : "bg-[#ed4e18]/10 text-[#ed4e18] border border-[#ed4e18]/20"}`, children: coach.name ? coach.name.substring(0, 2).toUpperCase() : "CO" }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx("span", { className: "block text-sm font-bold truncate", children: coach.name }),
                      /* @__PURE__ */ jsx("span", { className: `block text-[11px] font-medium capitalize truncate ${isSelected ? "text-white/90" : "text-slate-500"}`, children: coach.role ? coach.role.replace("_", " ").toLowerCase() : "coach" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-all ${isSelected ? "bg-white text-[#ed4e18] border-white shadow-2xs" : "border-slate-300 text-transparent"}`, children: /* @__PURE__ */ jsx(Check, { size: 12, strokeWidth: 3 }) })
                ]
              },
              coach.id
            );
          }) : /* @__PURE__ */ jsx("div", { className: "col-span-full text-sm text-slate-500 italic py-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200", children: "Belum ada coach yang ditugaskan untuk atlet ini." }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-slate-100 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-sm font-bold text-slate-900", children: [
                /* @__PURE__ */ jsx(Users, { size: 16, className: "text-[#ed4e18]" }),
                /* @__PURE__ */ jsx("span", { children: "Daftar Hadir Atlet" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [
                "Hapus centang pada atlet yang ",
                /* @__PURE__ */ jsx("strong", { className: "text-slate-700 font-semibold", children: "tidak hadir / absen" }),
                " pada sesi ini agar tidak dimasukkan dalam catatan."
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 self-start sm:self-center shrink-0", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleSelectAllAthletes,
                  className: "px-3 py-1.5 rounded-lg text-xs font-bold bg-[#ed4e18]/10 hover:bg-[#ed4e18]/20 text-[#ed4e18] transition-colors border border-[#ed4e18]/30 shadow-2xs",
                  children: [
                    "Pilih Semua (",
                    group?.members?.length || 0,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: handleDeselectAllAthletes,
                  className: "px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-500 transition-colors border border-slate-200 shadow-2xs",
                  children: "Kosongkan"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5", children: [
            group?.members && group.members.length > 0 ? group.members.map((member) => {
              const isPresent = data.attendee_ids.includes(member.id);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => {
                    let newIds = [...data.attendee_ids];
                    if (!isPresent) {
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
                  },
                  className: `flex items-center justify-between px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none ${isPresent ? "bg-[#ed4e18] border-[#ed4e18] text-white shadow-sm shadow-[#ed4e18]/15" : "bg-slate-50/60 border-dashed border-slate-200 text-slate-400 hover:bg-[#ed4e18]/5 hover:border-[#ed4e18]/30 hover:text-slate-600"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { className: `text-xs font-semibold truncate pr-1 ${!isPresent && "line-through opacity-70"}`, children: member.name }),
                    /* @__PURE__ */ jsx("div", { className: `w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] transition-colors ${isPresent ? "bg-white/20 text-white font-bold" : "border border-slate-300 text-transparent"}`, children: isPresent && "✓" })
                  ]
                },
                member.id
              );
            }) : /* @__PURE__ */ jsx("div", { className: "col-span-full text-sm text-slate-500 italic py-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200", children: "Belum ada anggota di grup ini." }),
            data.attendee_ids.filter((id) => !group?.members?.some((m) => m.id === id)).map((guestId) => {
              const guest = typeof availableAthletes !== "undefined" ? availableAthletes?.find((a) => a.id === guestId) : null;
              if (!guest) return null;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => {
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
                  },
                  className: "flex items-center justify-between px-3 py-2.5 rounded-xl border cursor-pointer transition-all bg-[#ed4e18] border-[#ed4e18] text-white shadow-sm shadow-[#ed4e18]/20 group/guest select-none",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0 pr-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "block text-xs font-semibold truncate", children: guest.name }),
                      /* @__PURE__ */ jsx("span", { className: "block text-[9px] font-bold text-white/80", children: "TAMU" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded hover:bg-white/20 flex items-center justify-center shrink-0 text-xs transition-colors", title: "Hapus tamu", children: /* @__PURE__ */ jsx(X, { size: 13 }) })
                  ]
                },
                `guest-${guest.id}`
              );
            })
          ] }),
          typeof availableAthletes !== "undefined" && availableAthletes && availableAthletes.filter((a) => !group?.members?.some((m) => m.id === a.id)).length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#ed4e18]/5 p-4 rounded-xl border border-[#ed4e18]/20 shadow-2xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-white border border-[#ed4e18]/20 flex items-center justify-center text-[#ed4e18] shrink-0 shadow-2xs", children: /* @__PURE__ */ jsx(UserPlus, { size: 16 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-slate-800", children: "Tambah Tamu (Guest Athlete)" }),
                /* @__PURE__ */ jsx("span", { className: "block text-[11px] text-slate-500 mt-0.5", children: "Undang atlet dari luar grup untuk sesi latihan gabungan / make-up" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative min-w-[280px] self-stretch sm:self-auto", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setIsGuestDropdownOpen(!isGuestDropdownOpen),
                  className: "w-full text-xs font-semibold bg-white border border-slate-200 hover:border-[#ed4e18] text-slate-700 rounded-lg px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs transition-all text-left",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: data.attendee_ids.filter((id) => !group?.members?.some((m) => m.id === id)).length > 0 ? `${data.attendee_ids.filter((id) => !group?.members?.some((m) => m.id === id)).length} Atlet Tamu Terpilih` : "+ Pilih & Tambahkan Atlet..." }),
                    /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: `text-slate-400 transition-transform duration-200 shrink-0 ${isGuestDropdownOpen ? "rotate-180 text-[#ed4e18]" : ""}` })
                  ]
                }
              ),
              isGuestDropdownOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "fixed inset-0 z-40",
                    onClick: () => setIsGuestDropdownOpen(false)
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "absolute right-0 left-0 sm:left-auto sm:right-0 sm:w-[320px] top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150 text-left", children: [
                  /* @__PURE__ */ jsxs("div", { className: "p-2.5 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10 flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                      /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          placeholder: "Cari nama atau cabor...",
                          value: guestSearchQuery,
                          onChange: (e) => setGuestSearchQuery(e.target.value),
                          onClick: (e) => e.stopPropagation(),
                          className: "w-full pl-8 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed4e18]/25 focus:border-[#ed4e18] transition-all placeholder:text-slate-400 text-slate-800"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setIsGuestDropdownOpen(false),
                        className: "p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors shrink-0",
                        title: "Tutup",
                        children: /* @__PURE__ */ jsx(X, { size: 14 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "max-h-60 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-50/80", children: (() => {
                    const externalAthletes = availableAthletes.filter((a) => !group?.members?.some((m) => m.id === a.id));
                    const filteredGuests = externalAthletes.filter((a) => {
                      if (!guestSearchQuery) return true;
                      const q = guestSearchQuery.toLowerCase();
                      return a.name && a.name.toLowerCase().includes(q) || a.sport?.name && a.sport.name.toLowerCase().includes(q);
                    });
                    if (filteredGuests.length === 0) {
                      return /* @__PURE__ */ jsx("div", { className: "py-6 text-center text-xs text-slate-400 italic", children: guestSearchQuery ? "Atlet tidak ditemukan." : "Tidak ada atlet luar yang tersedia." });
                    }
                    return filteredGuests.map((guest) => {
                      const isSelected = data.attendee_ids.includes(guest.id);
                      return /* @__PURE__ */ jsxs(
                        "div",
                        {
                          onClick: () => {
                            let newIds;
                            if (isSelected) {
                              newIds = data.attendee_ids.filter((id) => id !== guest.id);
                            } else {
                              newIds = [...data.attendee_ids, guest.id];
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
                          },
                          className: `flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all select-none ${isSelected ? "bg-[#ed4e18]/10 text-[#ed4e18] font-bold" : "hover:bg-slate-50 text-slate-700 font-medium"}`,
                          children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0 pr-2", children: [
                              /* @__PURE__ */ jsx("div", { className: `w-4 h-4 rounded flex items-center justify-center shrink-0 border text-[10px] transition-colors ${isSelected ? "bg-[#ed4e18] border-[#ed4e18] text-white font-bold" : "border-slate-300 bg-white text-transparent"}`, children: isSelected && "✓" }),
                              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                                /* @__PURE__ */ jsx("span", { className: "block text-xs truncate", children: guest.name }),
                                /* @__PURE__ */ jsx("span", { className: `block text-[10px] font-normal truncate ${isSelected ? "text-[#ed4e18]/80" : "text-slate-400"}`, children: guest.sport?.name || "Atlet" })
                              ] })
                            ] }),
                            isSelected && /* @__PURE__ */ jsx("span", { className: "text-[9px] bg-[#ed4e18] text-white px-1.5 py-0.5 rounded font-bold shrink-0 shadow-2xs", children: "TERPILIH" })
                          ]
                        },
                        `custom-guest-${guest.id}`
                      );
                    });
                  })() }),
                  /* @__PURE__ */ jsxs("div", { className: "p-2 border-t border-slate-100 bg-slate-50/60 flex justify-between items-center text-[11px] text-slate-500", children: [
                    /* @__PURE__ */ jsx("span", { children: "Bisa pilih > 1 atlet sekaligus" }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setIsGuestDropdownOpen(false),
                        className: "font-bold text-[#ed4e18] hover:underline px-2 py-0.5",
                        children: "Selesai"
                      }
                    )
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-5 bg-white border-b border-slate-200 sticky top-0 z-40", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-[#ed4e18]/10 border border-[#ed4e18]/20 flex items-center justify-center text-[#ed4e18] shrink-0 shadow-2xs", children: /* @__PURE__ */ jsx(Dumbbell, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900", children: "Skema & Program Latihan" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Atur urutan dan isi rancangan latihan untuk sesi ini." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all select-none shadow-2xs", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "rounded border-slate-300 text-[#ed4e18] focus:ring-[#ed4e18]",
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
                  className: "px-6 py-2 text-xs font-bold text-white bg-[#ed4e18] hover:bg-[#d64312] rounded-lg transition-all shadow-md shadow-[#ed4e18]/25 disabled:opacity-50 flex items-center gap-2 cursor-pointer",
                  children: processing ? "MENYIMPAN..." : "Simpan Program"
                }
              )
            ] })
          ] }),
          hasSecondaryProgram && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1 pb-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveProgramIndex(0),
                className: `px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeProgramIndex === 0 ? "bg-[#ed4e18] text-white shadow-md shadow-[#ed4e18]/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                children: data.programs[0].name
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveProgramIndex(1),
                className: `px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeProgramIndex === 1 ? "bg-[#ed4e18] text-white shadow-md shadow-[#ed4e18]/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                children: data.programs[1]?.name || "Program Sekunder"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8", children: [
          hasSecondaryProgram && activeProgramIndex === 1 && /* @__PURE__ */ jsxs("div", { className: "mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-bold text-slate-800 mb-1", children: "Pilih Atlet untuk Program Sekunder" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mb-3", children: "Atlet yang dipilih akan menjalankan program ini dan TIDAK menjalankan Program Utama." }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 pt-3 border-t border-slate-100", children: data.attendee_ids.map((attId) => {
              const athlete = (typeof availableAthletes !== "undefined" ? availableAthletes.find((a) => a.id === attId) : null) || (typeof group !== "undefined" ? group?.members?.find((m) => m.id === attId) : null);
              if (!athlete) return null;
              const isSelected = data.programs[1]?.athlete_ids?.includes(attId);
              return /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all select-none ${isSelected ? "bg-[#ed4e18] border-[#ed4e18] text-white shadow-sm shadow-[#ed4e18]/20" : "bg-white border-slate-200 text-slate-600 hover:bg-[#ed4e18]/5 hover:border-[#ed4e18]/30"}`, children: [
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
          hasSecondaryProgram && activeProgramIndex === 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6 bg-[#ed4e18]/5 p-4 rounded-xl border border-[#ed4e18]/20 shadow-2xs", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[#ed4e18]", children: "Informasi Program Utama" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-600 mt-1", children: [
              "Program ini akan diterapkan ke semua atlet dalam sesi ini, ",
              /* @__PURE__ */ jsx("strong", { className: "font-bold text-slate-800", children: "KECUALI" }),
              " atlet yang sudah Anda centang di tab ",
              /* @__PURE__ */ jsx("strong", { className: "font-bold text-slate-800", children: "Program Sekunder" }),
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
                            exercises,
                            exercisePackages: packages,
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
          data.programs[activeProgramIndex].blocks.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 bg-white border-2 border-slate-200 border-dashed rounded-xl mt-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner", children: /* @__PURE__ */ jsx(
              Dumbbell,
              {
                size: 24,
                className: "text-slate-400"
              }
            ) }),
            /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-slate-800", children: "Belum ada blok program latihan" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed", children: "Gunakan tombol di bawah untuk mulai menyusun program. Anda bisa menyeret (drag) blok yang telah dibuat untuk mengatur urutannya." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap justify-end gap-3", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: addTextBlock,
                className: "text-xs font-bold bg-white border border-[#ed4e18]/30 text-[#ed4e18] px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:bg-[#ed4e18]/5 shadow-2xs hover:shadow-sm",
                children: [
                  /* @__PURE__ */ jsx(Type, { size: 15, className: "text-[#ed4e18]" }),
                  /* @__PURE__ */ jsx("span", { children: "Tambah Catatan Teks" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: addPhaseBlock,
                className: "text-xs font-bold bg-[#ed4e18] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:bg-[#d64312] shadow-md shadow-[#ed4e18]/20 hover:shadow-lg",
                children: [
                  /* @__PURE__ */ jsx(Activity, { size: 15 }),
                  /* @__PURE__ */ jsx("span", { children: "Tambah Fase Latihan" })
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
  CreateSession as default
};
