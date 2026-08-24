import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { usePage, useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, Target, MapPin, User, FileText, Edit2, X, Info, CheckCircle2, Clock, FileImage, AlignLeft, Eye } from "lucide-react";
import ActionFooter from "./ActionFooter-DXTAXn43.js";
import ExerciseItem from "./ExerciseItem-DVwY5i8R.js";
import "axios";
function ShowSession({
  auth,
  training,
  rpeRecords = [],
  coaches = []
}) {
  const { permissions } = usePage().props;
  permissions?.individual_training?.update ?? false;
  permissions?.individual_training?.create ?? false;
  const isAthlete = auth.user.role === "athlete";
  const isAdmin = auth.user?.role === "admin" || auth.user?.role === "superadmin";
  const isCoachOrAdmin = isAdmin || auth.user?.role === "coach";
  const [modalMedia, setModalMedia] = useState(null);
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1280;
          const MAX_HEIGHT = 1280;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(
                new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now()
                })
              );
            },
            "image/jpeg",
            0.7
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };
  const getInitialRpes = () => {
    const rpes = {};
    rpeRecords.forEach((record) => {
      let rpeData = record.rpe_data || {
        rpes: [],
        load: "",
        reps: "",
        tempo: "",
        rir: "",
        rest: ""
      };
      if (Array.isArray(rpeData)) {
        const legacyArray = rpeData;
        rpeData = {
          rpes: legacyArray.map(
            (item) => (typeof item === "object" && item !== null ? item.rpe : item) || ""
          ),
          load: legacyArray[0]?.load || "",
          reps: legacyArray[0]?.reps || "",
          tempo: legacyArray[0]?.tempo || "",
          rir: legacyArray[0]?.rir || "",
          rest: legacyArray[0]?.rest || ""
        };
      }
      rpes[record.training_block_item_id] = rpeData;
    });
    return rpes;
  };
  const getTargetArray = (templateArray, templateSingle, maxSets) => {
    const arr = [];
    for (let i = 0; i < maxSets; i++) {
      const val = templateArray?.[i] ?? templateSingle ?? "";
      arr.push(val);
    }
    return arr;
  };
  const getInitialTargets = () => {
    const targets = {};
    training.blocks.forEach((block) => {
      if (block.items) {
        block.items.forEach((item) => {
          const maxSets = Math.max(
            ...(String(item.sets || "0").match(/\d+/g) || [0]).map(
              Number
            ),
            0
          );
          targets[item.id] = {
            load: item.load ?? "",
            load_unit: item.load_unit ?? "kg",
            load_array: getTargetArray(
              item.load_array,
              item.load,
              maxSets
            ),
            reps: item.reps ?? "",
            reps_unit: item.reps_unit ?? "reps",
            reps_array: getTargetArray(
              item.reps_array,
              item.reps,
              maxSets
            ),
            distance: item.distance ?? "",
            distance_array: getTargetArray(
              item.distance_array,
              item.distance,
              maxSets
            ),
            minutes: item.minutes ?? "",
            minutes_array: getTargetArray(
              item.minutes_array,
              item.minutes,
              maxSets
            ),
            tempo: item.tempo ?? "",
            tempo_array: getTargetArray(
              item.tempo_array,
              item.tempo,
              maxSets
            ),
            rir: item.rir ?? "",
            rir_array: getTargetArray(
              item.rir_array,
              item.rir,
              maxSets
            ),
            rest_per_set: item.rest_per_set ?? "",
            rest_per_set_array: getTargetArray(
              item.rest_per_set_array,
              item.rest_per_set,
              maxSets
            ),
            intensity: item.intensity ?? ""
          };
        });
      }
    });
    return targets;
  };
  const isCompleted = training.is_completed;
  const tDate = new Date(training.date);
  tDate.setHours(0, 0, 0, 0);
  const todayDate = /* @__PURE__ */ new Date();
  todayDate.setHours(0, 0, 0, 0);
  const {
    data,
    setData,
    post,
    processing,
    recentlySuccessful,
    errors,
    isDirty
  } = useForm({
    rpes: getInitialRpes(),
    targets: getInitialTargets(),
    athlete_note: training.athlete_note || "",
    proof_photo: null,
    remove_proof_photo: false
  });
  const [mainTab, setMainTab] = useState("detail");
  const [warningMessage, setWarningMessage] = useState("");
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [isEditingActuals, setIsEditingActuals] = useState(false);
  const isLocked = isCompleted && !isEditingActuals;
  const isReadOnly = isLocked || !isAthlete && !isCoachOrAdmin;
  const openModal = (url, type) => {
    setModalMedia({ url, type });
  };
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const ytMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    return url;
  };
  const handlePhotoChange = async (file) => {
    if (!file) return;
    try {
      const compressedFile = await compressImage(file);
      setData("proof_photo", compressedFile);
    } catch (e) {
      console.error("Compression failed", e);
      setData("proof_photo", file);
    }
  };
  const handleExerciseChange = (itemId, field, value) => {
    const newRpes = { ...data.rpes };
    if (!newRpes[itemId])
      newRpes[itemId] = {
        rpes: [],
        load: "",
        reps: "",
        tempo: "",
        rir: "",
        rest: ""
      };
    newRpes[itemId][field] = value;
    setData("rpes", newRpes);
  };
  const handleSetRpeChange = (itemId, setIndex, value) => {
    const newRpes = { ...data.rpes };
    if (!newRpes[itemId])
      newRpes[itemId] = {
        rpes: [],
        load: "",
        reps: "",
        tempo: "",
        rir: "",
        rest: ""
      };
    if (!Array.isArray(newRpes[itemId].rpes)) newRpes[itemId].rpes = [];
    newRpes[itemId].rpes[setIndex] = value;
    setData("rpes", newRpes);
  };
  const handleExerciseArrayChange = (itemId, field, arrayIndex, value) => {
    const newRpes = { ...data.rpes };
    if (!newRpes[itemId])
      newRpes[itemId] = {
        rpes: [],
        load: "",
        reps: "",
        tempo: "",
        rir: "",
        rest: "",
        load_array: [],
        reps_array: [],
        distance_array: [],
        tempo_array: [],
        rir_array: [],
        rest_per_set_array: []
      };
    if (!Array.isArray(newRpes[itemId][field])) newRpes[itemId][field] = [];
    newRpes[itemId][field][arrayIndex] = value;
    setData("rpes", newRpes);
  };
  const handleTargetChange = (itemId, field, value) => {
    const newTargets = { ...data.targets };
    if (!newTargets[itemId]) {
      newTargets[itemId] = {};
    }
    newTargets[itemId][field] = value;
    setData("targets", newTargets);
  };
  const handleTargetArrayChange = (itemId, field, arrayIndex, value) => {
    const newTargets = { ...data.targets };
    if (!newTargets[itemId]) {
      newTargets[itemId] = {};
    }
    if (!Array.isArray(newTargets[itemId][field])) {
      newTargets[itemId][field] = [];
    }
    newTargets[itemId][field][arrayIndex] = value;
    setData("targets", newTargets);
  };
  const submitRpe = (e) => {
    e.preventDefault();
    post(route("admin.individual-trainings.session.rpe", training.id), {
      preserveScroll: true,
      forceFormData: true
    });
  };
  const getMissingRequiredActuals = () => {
    if (!isAthlete) return [];
    let missing = [];
    training.blocks.forEach((block) => {
      if (block.target_filled_by === "athlete") {
        const categoryMap = {
          warm_up: "medium",
          mobility: "medium",
          activation: "medium",
          strength_training: "full",
          stretching: "note_only",
          interval: "cardio",
          free_strength: "note_only",
          cardio: "cardio"
        };
        const columns = categoryMap[block.category] || "basic";
        const blockName = block.title || block.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        block.items.forEach((item) => {
          const exerciseData = data.rpes[item.id] || {};
          const mSets = Math.max(
            1,
            ...(String(item.sets || "0").match(/\d+/g) || [0]).map(
              Number
            )
          );
          const exName = item.exercise?.name || "Exercise";
          if (columns === "full") {
            for (let i = 0; i < mSets; i++) {
              if (!exerciseData.load_array?.[i])
                missing.push(
                  `Load (${item.load_unit || "kg"}) di exercise ${exName} pada fase ${blockName} (Set ke-${i + 1})`
                );
              if (!exerciseData.reps_array?.[i])
                missing.push(
                  `Reps di exercise ${exName} pada fase ${blockName} (Set ke-${i + 1})`
                );
            }
          } else if (columns === "medium") {
            for (let i = 0; i < mSets; i++) {
              if (!exerciseData.reps_array?.[i])
                missing.push(
                  `Reps di exercise ${exName} pada fase ${blockName} (Set ke-${i + 1})`
                );
            }
          } else if (columns === "cardio") {
            for (let i = 0; i < mSets; i++) {
              if (!exerciseData.distance_array?.[i])
                missing.push(
                  `Distance (m) di exercise ${exName} pada fase ${blockName} (Set ke-${i + 1})`
                );
              if (!exerciseData.reps_array?.[i])
                missing.push(
                  `Reps/Duration di exercise ${exName} pada fase ${blockName} (Set ke-${i + 1})`
                );
            }
          }
        });
      }
    });
    return missing;
  };
  const completeTraining = () => {
    const hasPhoto = data.proof_photo || training.proof_photo && !data.remove_proof_photo;
    const missingFields = getMissingRequiredActuals();
    if (isAthlete && !hasPhoto) {
      missingFields.push("Foto Bukti (wajib diunggah)");
    }
    if (missingFields.length > 0) {
      const formattedMissing = missingFields.map((m) => `• ${m}`).join("\n");
      setWarningMessage(
        `Pengisian belum lengkap. Anda belum mengisi:

${formattedMissing}`
      );
      return;
    }
    setConfirmComplete(true);
  };
  const confirmAndComplete = () => {
    post(
      route("admin.individual-trainings.session.complete", training.id),
      {
        forceFormData: true,
        onSuccess: () => setConfirmComplete(false)
      }
    );
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Detail Sesi - ${training.name || "Latihan"}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Detail Sesi - ${training.name || "Latihan"}` }),
    /* @__PURE__ */ jsxs("div", { className: "pb-12 mx-auto space-y-8 relative", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-start justify-between gap-6 text-white", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-slate-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-5 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => window.history.back(), className: "flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors text-sm font-semibold mr-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md", children: [
              /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
              " Kembali"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-white bg-orange-500/80 px-3 py-1.5 rounded-full backdrop-blur-md border border-orange-400/30 shadow-inner tracking-wide", children: [
              "Sesi ",
              training.session_number
            ] }),
            /* @__PURE__ */ jsx("span", { className: `text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border shadow-inner tracking-wide ${training.status === "completed" || training.is_completed ? "bg-emerald-500/30 text-emerald-50 border-emerald-400/30" : "bg-white/10 text-slate-50 border-white/20"}`, children: training.status === "completed" || training.is_completed ? "Selesai" : "Terjadwal" })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md", children: training.name || "Program Latihan" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-slate-300", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm", children: [
              /* @__PURE__ */ jsx(Calendar, { size: 16, className: "text-orange-400" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: training.date })
            ] }),
            training.training_type && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm", children: [
              /* @__PURE__ */ jsx(Target, { size: 16, className: "text-orange-400" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: training.training_type })
            ] }),
            training.location && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-orange-400" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: training.location })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-3 flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Coach:" }),
            coaches && coaches.length > 0 ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: coaches.map((c) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full py-1 pr-4 pl-1 shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-orange-500 text-white flex items-center justify-center shadow-inner", children: /* @__PURE__ */ jsx(User, { size: 14 }) }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-white tracking-wide", children: c.name })
            ] }, c.id)) }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full py-1 pr-4 pl-1 shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-full bg-white/20 text-slate-300 flex items-center justify-center shadow-inner", children: /* @__PURE__ */ jsx(User, { size: 14 }) }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-white tracking-wide", children: "Admin" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-end gap-3 md:pt-8 w-full md:w-auto", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: route("admin.individual-trainings.session.export-pdf", training.id),
              className: "flex-1 sm:flex-none items-center justify-center flex gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl text-sm font-bold shadow-lg transition-all",
              children: [
                /* @__PURE__ */ jsx(FileText, { size: 18 }),
                " Download PDF"
              ]
            }
          ),
          isCoachOrAdmin && /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("admin.individual-trainings.session.edit", training.id),
              className: "flex-1 sm:flex-none items-center justify-center flex gap-2 px-5 py-3 bg-orange-500 text-white border border-transparent rounded-xl text-sm font-extrabold shadow-xl hover:bg-orange-600 hover:scale-105 transition-all transform duration-200",
              children: [
                /* @__PURE__ */ jsx(Edit2, { size: 18 }),
                " Edit Sesi"
              ]
            }
          )
        ] })
      ] }) }),
      (!isCoachOrAdmin || mainTab === "detail") && /* @__PURE__ */ jsxs(Fragment, { children: [
        errors.error && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3 text-sm text-red-800 shadow-sm", children: [
          /* @__PURE__ */ jsx(X, { size: 20, className: "mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold mb-1", children: "Gagal Menyimpan" }),
            /* @__PURE__ */ jsx("p", { className: "leading-relaxed opacity-90", children: errors.error })
          ] })
        ] }),
        isAthlete && training.status === "needs_update" && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-4 rounded-xl border border-blue-200 bg-blue-50 flex items-start gap-3 text-sm text-blue-800 shadow-sm", children: [
          /* @__PURE__ */ jsx(Info, { size: 20, className: "mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold mb-1", children: "Pembaruan Latihan" }),
            /* @__PURE__ */ jsx("p", { className: "leading-relaxed opacity-90", children: "Admin atau Pelatih baru saja menambahkan atau mengubah program latihan ini. Silakan lengkapi bagian yang belum dikerjakan, lalu tekan tombol Selesaikan Latihan kembali." })
          ] })
        ] }),
        training.blocks.filter((block) => Number(block.step) === 1).map((block, bIdx) => {
          const isNB = block.category?.toLowerCase() === "nb" || block.title?.toLowerCase() === "nb";
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: `p-5 rounded-2xl border-l-4 shadow-sm mb-4 ${isNB ? "bg-rose-50 border-rose-500" : "bg-blue-50 border-blue-500"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: `mt-0.5 ${isNB ? "text-rose-500" : "text-blue-500"}`, children: /* @__PURE__ */ jsx(Info, { size: 20 }) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: `font-extrabold text-sm uppercase tracking-wider ${isNB ? "text-rose-700" : "text-blue-700"}`, children: block.title || block.category.replace("_", " ").replace(
                    /\b\w/g,
                    (l) => l.toUpperCase()
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: `text-sm whitespace-pre-wrap leading-relaxed max-w-4xl font-medium ${isNB ? "text-rose-900/80" : "text-blue-900/80"}`, children: block.items?.[0]?.note || block.description || "" })
                ] })
              ] })
            },
            `inst-${bIdx}`
          );
        }),
        isAdmin && (() => {
          const isProgress = training.status === "in_progress";
          const isNeedsUpdate = training.status === "needs_update";
          if (isCompleted) {
            return /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center gap-2 text-sm text-emerald-800", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { size: 16 }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Selesai Dikerjakan" }),
              training.completed_at && /* @__PURE__ */ jsxs("span", { className: "opacity-75", children: [
                "pada",
                " ",
                new Date(
                  training.completed_at
                ).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              ] })
            ] });
          } else if (isNeedsUpdate) {
            return /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 rounded-lg border border-blue-200 bg-blue-50 flex items-center gap-2 text-sm text-blue-800", children: [
              /* @__PURE__ */ jsx(Info, { size: 16 }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Perlu Update" }),
              training.updated_at && /* @__PURE__ */ jsxs("span", { className: "opacity-75", children: [
                " ",
                "(Terakhir disimpan:",
                " ",
                new Date(
                  training.updated_at
                ).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }),
                ")"
              ] })
            ] });
          } else if (isProgress) {
            return /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 rounded-lg border border-amber-200 bg-amber-50 flex items-center gap-2 text-sm text-amber-800", children: [
              /* @__PURE__ */ jsx(Clock, { size: 16 }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Sedang Dikerjakan" }),
              training.updated_at && /* @__PURE__ */ jsxs("span", { className: "opacity-75", children: [
                " ",
                "(Terakhir disimpan:",
                " ",
                new Date(
                  training.updated_at
                ).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }),
                ")"
              ] })
            ] });
          } else {
            return /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center gap-2 text-sm text-zinc-600", children: [
              /* @__PURE__ */ jsx(Clock, { size: 16 }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Belum Dikerjakan" })
            ] });
          }
        })(),
        /* @__PURE__ */ jsx("div", { className: "mt-8 border-b border-zinc-200 pb-2 mb-4", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-zinc-900 tracking-tight", children: "Detail Program" }) }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: submitRpe,
            className: " rounded-xl shadow-sm mt-4 relative",
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-5 bg-transparent", children: training.blocks.filter((block) => Number(block.step) === 2).map((block, bIdx) => {
                const categoryMap = {
                  warm_up: "medium",
                  mobility: "medium",
                  activation: "medium",
                  strength_training: "full",
                  stretching: "note_only",
                  interval: "cardio",
                  free_strength: "note_only",
                  cardio: "cardio"
                };
                const columns = categoryMap[block.category] || "full";
                const phaseLabel = block.title || block.category.replace("_", " ").replace(
                  /\b\w/g,
                  (l) => l.toUpperCase()
                );
                if (columns === "note_only") {
                  return /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col sm:flex-row overflow-hidden",
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "bg-zinc-100/50 border-b sm:border-b-0 sm:border-r border-zinc-200 p-4 sm:w-1/4 flex flex-col justify-center gap-2", children: [
                          /* @__PURE__ */ jsx("h3", { className: "font-bold text-zinc-900 text-sm", children: phaseLabel }),
                          block.description && /* @__PURE__ */ jsx("div", { className: "bg-white/50 border-l-2 border-zinc-400 pl-3 py-1.5 rounded-r", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-600 leading-relaxed", children: block.description }) })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "p-4 sm:w-3/4 flex items-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed", children: block.items?.[0]?.note || "-" }) })
                      ]
                    },
                    `block-${bIdx}`
                  );
                }
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "bg-white border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col mb-8",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 px-6 py-5 flex flex-col gap-3 relative", children: [
                        /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-l-3xl" }),
                        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("h3", { className: "font-extrabold text-slate-800 text-lg flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx("div", { className: "bg-orange-100 p-1.5 rounded-lg text-orange-600", children: /* @__PURE__ */ jsx(Target, { size: 18, strokeWidth: 2.5 }) }),
                          phaseLabel
                        ] }) }),
                        block.description && /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-100 shadow-sm pl-4 pr-3 py-3 rounded-xl ml-9", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap", children: block.description }) })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100 ", children: block.items.map(
                        (item, iIdx) => {
                          const exercise = item.exercise;
                          exercise?.images || [];
                          exercise?.videos?.filter(
                            (v) => v && v.trim() !== ""
                          ) || [];
                          Math.max(
                            ...(String(
                              item.sets || "0"
                            ).match(
                              /\d+/g
                            ) || [0]).map(
                              Number
                            ),
                            0
                          );
                          return /* @__PURE__ */ jsx(
                            ExerciseItem,
                            {
                              item,
                              bIdx,
                              iIdx,
                              block,
                              columns,
                              openModal,
                              data,
                              isReadOnly,
                              isCoachOrAdmin,
                              rpeRecords,
                              handleExerciseChange,
                              handleSetRpeChange,
                              handleExerciseArrayChange,
                              handleTargetChange,
                              handleTargetArrayChange
                            },
                            `item-${bIdx}-${iIdx}`
                          );
                        }
                      ) })
                    ]
                  },
                  `block-${bIdx}`
                );
              }) }),
              isAthlete && /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6 bg-white border-t border-zinc-200 flex flex-col gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "block text-sm font-bold text-zinc-700 mb-2 flex items-center gap-2", children: [
                    "Training Feedback Note",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-lg font-medium lowercase tracking-normal", children: "Opsional" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      value: data.athlete_note,
                      disabled: isReadOnly,
                      onChange: (e) => setData(
                        "athlete_note",
                        e.target.value
                      ),
                      placeholder: "Tambahkan catatan tambahan mengenai sesi latihanmu...",
                      className: "w-full bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 p-3 min-h-[100px] resize-y placeholder:text-zinc-400 focus:ring-1 focus:ring-zinc-900 :ring-zinc-100 disabled:opacity-50"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "block text-sm font-bold text-zinc-700 mb-2 flex items-center gap-2", children: [
                    "Proof Photo",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-lg font-bold", children: "Wajib" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    data.proof_photo ? /* @__PURE__ */ jsxs("div", { className: "relative group shrink-0", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: URL.createObjectURL(
                            data.proof_photo
                          ),
                          className: "h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-zinc-200 shadow-sm cursor-pointer",
                          onClick: () => openModal(
                            URL.createObjectURL(
                              data.proof_photo
                            ),
                            "image"
                          )
                        }
                      ),
                      isCompleted && isAthlete ? null : /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setData(
                            "proof_photo",
                            null
                          ),
                          className: "absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full border-2 border-white shadow-sm hover:bg-red-200 transition-colors",
                          title: "Delete Photo",
                          children: /* @__PURE__ */ jsx(
                            X,
                            {
                              size: 14,
                              strokeWidth: 3
                            }
                          )
                        }
                      )
                    ] }) : training?.proof_photo && !data.remove_proof_photo ? /* @__PURE__ */ jsxs("div", { className: "relative group shrink-0", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: "/storage/" + training.proof_photo,
                          className: "h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-zinc-200 shadow-sm cursor-pointer",
                          onClick: () => openModal(
                            "/storage/" + training.proof_photo,
                            "image"
                          )
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setData(
                            "remove_proof_photo",
                            true
                          ),
                          className: "absolute -top-2 -right-2 bg-zinc-900 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity",
                          title: "Delete Draft Photo",
                          children: /* @__PURE__ */ jsx(
                            X,
                            {
                              size: 10,
                              strokeWidth: 3
                            }
                          )
                        }
                      )
                    ] }) : null,
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "file",
                        accept: "image/*",
                        id: "proof-photo",
                        className: "hidden",
                        disabled: isReadOnly,
                        onChange: (e) => {
                          setData((data2) => ({
                            ...data2,
                            remove_proof_photo: false
                          }));
                          handlePhotoChange(
                            e.target.files[0]
                          );
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "label",
                      {
                        htmlFor: "proof-photo",
                        className: `flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-700 border border-zinc-200 rounded-lg text-sm font-bold cursor-pointer hover:bg-zinc-50 :bg-zinc-800 transition-colors shadow-sm ${isReadOnly ? "opacity-50 pointer-events-none" : ""}`,
                        children: [
                          /* @__PURE__ */ jsx(FileImage, { size: 16 }),
                          " ",
                          data.proof_photo || training?.proof_photo && !data.remove_proof_photo ? "Change Photo" : "Upload Proof Photo"
                        ]
                      }
                    )
                  ] })
                ] })
              ] }),
              isAdmin && (training.athlete_note || training.proof_photo) && /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6 bg-zinc-50 border-t border-zinc-200 flex flex-col gap-4", children: [
                /* @__PURE__ */ jsxs("h4", { className: "text-sm font-bold text-zinc-900 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    AlignLeft,
                    {
                      size: 16,
                      className: "text-zinc-400"
                    }
                  ),
                  " ",
                  "Feedback Atlet"
                ] }),
                training.athlete_note && /* @__PURE__ */ jsx("div", { className: "bg-white border border-zinc-200 p-4 rounded-xl shadow-sm", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-700 italic", children: [
                  '"',
                  training.athlete_note,
                  '"'
                ] }) }),
                training.proof_photo && /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => openModal(
                      "/storage/" + training.proof_photo,
                      "image"
                    ),
                    className: "flex items-center justify-center gap-2 px-4 h-10 w-max bg-white text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors text-xs font-bold shadow-sm",
                    children: [
                      /* @__PURE__ */ jsx(FileImage, { size: 14 }),
                      " Lihat Foto Bukti"
                    ]
                  }
                ),
                errors.proof_photo && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm mt-2", children: errors.proof_photo })
              ] }),
              /* @__PURE__ */ jsx(
                ActionFooter,
                {
                  isAthlete,
                  isLocked,
                  isCompleted,
                  recentlySuccessful,
                  processing,
                  onComplete: completeTraining,
                  data,
                  isMissingRequiredActuals: () => getMissingRequiredActuals().length > 0,
                  training,
                  isEditingActuals,
                  setIsEditingActuals
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center pt-8 pb-4", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-zinc-400", children: "Power by: Olympus Training Surabaya X Unesa | All Rights Reserved" }) })
    ] }),
    modalMedia && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-sm transition-opacity", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-200 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 ", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-zinc-900 ", children: modalMedia.type === "image" ? "Preview Image" : "Preview Video" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: modalMedia.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "p-2 text-zinc-500 hover:text-zinc-900 :text-zinc-100 bg-white rounded-lg shadow-sm border border-zinc-200 transition-colors flex items-center gap-2 text-xs font-bold",
              children: [
                /* @__PURE__ */ jsx(Eye, { size: 14 }),
                " Buka Tab Baru"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setModalMedia(null),
              className: "p-2 text-zinc-400 hover:text-red-500 transition-colors bg-white rounded-lg shadow-sm border border-zinc-200 ",
              children: "Tutup"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-4 flex-1 overflow-auto flex items-center justify-center bg-zinc-100 min-h-[50vh]", children: modalMedia.type === "image" ? /* @__PURE__ */ jsx(
        "img",
        {
          src: modalMedia.url,
          alt: "Preview Full",
          className: "max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm bg-white "
        }
      ) : /* @__PURE__ */ jsx(
        "iframe",
        {
          src: getEmbedUrl(modalMedia.url),
          className: "w-full aspect-video rounded-xl shadow-sm bg-black",
          allowFullScreen: true
        }
      ) })
    ] }) }),
    warningMessage && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border-[4px] border-amber-50", children: /* @__PURE__ */ jsx("span", { className: " text-2xl", children: "!" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-800 mb-2", children: "Peringatan" }),
      /* @__PURE__ */ jsx("div", { className: "max-h-64 overflow-y-auto mb-6 px-2", children: /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm leading-relaxed whitespace-pre-wrap text-left", children: warningMessage }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setWarningMessage(""),
          className: "w-full py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20",
          children: "OK, Mengerti"
        }
      )
    ] }) }),
    confirmComplete && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold text-slate-800 mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          CheckCircle2,
          {
            className: "text-green-500",
            size: 24
          }
        ),
        "Konfirmasi Selesai"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-600 mb-6 text-sm leading-relaxed", children: [
        "Apakah Anda yakin ingin menyelesaikan dan menyerahkan program latihan ini? Setelah diserahkan, data aktual sudah",
        " ",
        /* @__PURE__ */ jsx("strong", { className: "text-slate-800", children: "tidak bisa diedit lagi" }),
        "."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setConfirmComplete(false),
            className: "px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors",
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: confirmAndComplete,
            disabled: processing,
            className: "px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md shadow-orange-500/20",
            children: [
              /* @__PURE__ */ jsx(CheckCircle2, { size: 16 }),
              " Ya, Selesai"
            ]
          }
        )
      ] }),
      errors.error && /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm font-bold text-right mt-3", children: errors.error })
    ] }) })
  ] });
}
export {
  ShowSession as default
};
