import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import "react";
import { PlayCircle } from "lucide-react";
function ExerciseItem({
  item,
  bIdx,
  iIdx,
  block,
  columns,
  openModal,
  data,
  rpeRecords,
  handleExerciseChange,
  handleSetRpeChange,
  handleExerciseArrayChange,
  isReadOnly,
  isCoachOrAdmin,
  handleTargetChange,
  handleTargetArrayChange
}) {
  const exercise = item.exercise;
  const imagesRaw = exercise?.images || [];
  const images = typeof imagesRaw === "string" ? (() => {
    try {
      return JSON.parse(imagesRaw);
    } catch (e) {
      return [];
    }
  })() : Array.isArray(imagesRaw) ? imagesRaw : [];
  const videosRaw = exercise?.videos || [];
  const videos = (typeof videosRaw === "string" ? (() => {
    try {
      return JSON.parse(videosRaw);
    } catch (e) {
      return [];
    }
  })() : Array.isArray(videosRaw) ? videosRaw : []).filter((v) => v && v.trim() !== "");
  const maxSets = Math.max(...(String(item.sets || "0").match(/\d+/g) || [0]).map(Number), 0);
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/storage/")) return path;
    return `/storage/${path}`;
  };
  const exerciseData = data.rpes?.[item.id] || {
    rpes: [],
    load_array: [],
    reps_array: [],
    distance_array: []
  };
  const playerRecord = rpeRecords.find(
    (r) => r.training_block_item_id == item.id
  );
  const recordData = playerRecord?.rpe_data || {
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
  if (Array.isArray(recordData)) {
    ({
      rpes: recordData.map((d) => (typeof d === "object" && d !== null ? d.rpe : d) || ""),
      load: recordData[0]?.load || "",
      reps: recordData[0]?.reps || "",
      tempo: recordData[0]?.tempo || "",
      rir: recordData[0]?.rir || "",
      rest: recordData[0]?.rest || ""
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-4 hover:bg-zinc-50/50 :bg-zinc-900/20 transition-colors flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full lg:w-auto", children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-bold text-zinc-900 text-base mb-1.5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-zinc-400" }),
          exercise?.name || item.name || "-"
        ] }),
        exercise?.description && /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed ml-3.5 mb-2 mt-1 bg-zinc-100/50 p-2.5 rounded-lg border border-zinc-200 ", children: exercise.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 ml-3.5 mt-2", children: [
          item.sets && /* @__PURE__ */ jsxs("div", { className: "flex flex-col bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 min-w-[60px]", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-zinc-500 mb-0.5", children: "Sets" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-zinc-900 leading-none", children: item.sets })
          ] }),
          maxSets > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5 w-full mt-1.5", children: Array.from({ length: maxSets }).map((_, sIdx) => {
            const playerTarget = data.targets?.[item.id];
            const d = playerTarget?.distance_array?.[sIdx] ?? item.distance_array?.[sIdx] ?? item.distance;
            const r = playerTarget?.reps_array?.[sIdx] ?? (item.reps_array?.[sIdx] ?? (item.reps || item.minutes));
            const l = playerTarget?.load_array?.[sIdx] ?? item.load_array?.[sIdx] ?? item.load;
            const tmp = playerTarget?.tempo_array?.[sIdx] ?? item.tempo_array?.[sIdx] ?? item.tempo;
            const rir = playerTarget?.rir_array?.[sIdx] ?? item.rir_array?.[sIdx] ?? item.rir;
            const rst = playerTarget?.rest_per_set_array?.[sIdx] ?? item.rest_per_set_array?.[sIdx] ?? item.rest_per_set;
            const isEditableTarget = isCoachOrAdmin && block.target_filled_by !== "athlete";
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-zinc-100/50 rounded-lg p-1.5 border border-zinc-200/50 flex-wrap", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-zinc-500 w-10 text-center border-r border-zinc-300 ", children: [
                "S ",
                sIdx + 1
              ] }),
              columns === "cardio" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold", children: "Dist" }),
                  isEditableTarget ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.targets?.[item.id]?.distance_array?.[sIdx] ?? "",
                        onChange: (e) => handleTargetArrayChange(item.id, "distance_array", sIdx, e.target.value),
                        className: "w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6",
                        placeholder: "-"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-zinc-500", children: "m" })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-900 ", children: block.target_filled_by === "athlete" ? /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-400 italic", children: "Diisi Atlet" }) : d ? `${d}m` : "-" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2 border-l border-zinc-200 ", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold", children: "Time" }),
                  isEditableTarget ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.targets?.[item.id]?.reps_array?.[sIdx] ?? "",
                        onChange: (e) => handleTargetArrayChange(item.id, "reps_array", sIdx, e.target.value),
                        className: "w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6",
                        placeholder: "-"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-zinc-500", children: item.reps_unit || "mins" })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-900 ", children: block.target_filled_by === "athlete" ? /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-400 italic", children: "Diisi Atlet" }) : r ? `${r} ${item.reps_unit || "minutes"}` : "-" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2 border-l border-zinc-200 ", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold", children: "Rest" }),
                  isEditableTarget ? /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: data.targets?.[item.id]?.rest_per_set_array?.[sIdx] ?? "",
                      onChange: (e) => handleTargetArrayChange(item.id, "rest_per_set_array", sIdx, e.target.value),
                      className: "w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6",
                      placeholder: "-"
                    }
                  ) : /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-900 ", children: rst || "-" })
                ] })
              ] }),
              (columns === "full" || columns === "medium") && /* @__PURE__ */ jsxs(Fragment, { children: [
                columns === "full" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold", children: "Load" }),
                  isEditableTarget ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.targets?.[item.id]?.load_array?.[sIdx] ?? "",
                        onChange: (e) => handleTargetArrayChange(item.id, "load_array", sIdx, e.target.value),
                        className: "w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6",
                        placeholder: "-"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-zinc-500", children: item.load_unit || "kg" })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-900 ", children: block.target_filled_by === "athlete" ? /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-400 italic", children: "Diisi Atlet" }) : l ? `${l} ${item.load_unit || "kg"}` : "-" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2 border-l border-zinc-200 ", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold", children: "Reps" }),
                  isEditableTarget ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.targets?.[item.id]?.reps_array?.[sIdx] ?? "",
                        onChange: (e) => handleTargetArrayChange(item.id, "reps_array", sIdx, e.target.value),
                        className: "w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6",
                        placeholder: "-"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-zinc-500", children: item.reps_unit === "seconds" ? "Secs" : item.reps_unit === "minutes" ? "Mins" : "Reps" })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-900 ", children: block.target_filled_by === "athlete" ? /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-400 italic", children: "Diisi Atlet" }) : r ? `${r} ${item.reps_unit === "seconds" ? "Secs" : item.reps_unit === "minutes" ? "Mins" : "Reps"}` : "-" })
                ] }),
                columns === "full" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2 border-l border-zinc-200 ", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold", children: "Tempo" }),
                    isEditableTarget ? /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.targets?.[item.id]?.tempo_array?.[sIdx] ?? "",
                        onChange: (e) => handleTargetArrayChange(item.id, "tempo_array", sIdx, e.target.value),
                        className: "w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6",
                        placeholder: "-"
                      }
                    ) : /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-900 ", children: tmp || "-" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2 border-l border-zinc-200 ", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold", children: ["interval", "cardio"].includes(block.category) ? "RPE" : "RIR" }),
                    isEditableTarget ? /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: data.targets?.[item.id]?.rir_array?.[sIdx] ?? "",
                        onChange: (e) => handleTargetArrayChange(item.id, "rir_array", sIdx, e.target.value),
                        className: "w-12 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6",
                        placeholder: "-"
                      }
                    ) : /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-900 ", children: rir || "-" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2 border-l border-zinc-200 ", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-zinc-500 font-bold", children: "Rest" }),
                  isEditableTarget ? /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: data.targets?.[item.id]?.rest_per_set_array?.[sIdx] ?? "",
                      onChange: (e) => handleTargetArrayChange(item.id, "rest_per_set_array", sIdx, e.target.value),
                      className: "w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6",
                      placeholder: "-"
                    }
                  ) : /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-900 ", children: rst || "-" })
                ] })
              ] })
            ] }, sIdx);
          }) })
        ] }),
        item.note && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-zinc-500 italic ml-3.5 border-l-2 border-zinc-200 pl-2", children: item.note })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-4 ml-0 mt-3 lg:mt-0 w-full lg:w-auto", children: [
        images.length > 0 && images[0] && /* @__PURE__ */ jsx(
          "img",
          {
            src: getImageUrl(images[0]),
            alt: "Exercise preview",
            className: "w-full sm:w-48 xl:w-64 h-auto rounded-lg border border-zinc-200 object-cover shadow-sm cursor-pointer hover:opacity-80 transition-opacity",
            onClick: () => openModal(getImageUrl(images[0]), "image")
          }
        ),
        videos.length > 0 && /* @__PURE__ */ jsx("div", { className: "w-full sm:w-80 xl:w-64 shrink-0", children: /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => openModal(videos[0], "video"),
            className: "aspect-video bg-zinc-900 rounded-lg border border-zinc-200 shadow-sm cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center group",
            children: /* @__PURE__ */ jsx(PlayCircle, { size: 32, className: "text-white opacity-50 group-hover:opacity-100 transition-opacity" })
          }
        ) })
      ] })
    ] }),
    (block.target_filled_by === "athlete" && ["full", "medium", "cardio"].includes(columns) || ["strength_training", "interval", "cardio"].includes(block.category)) && /* @__PURE__ */ jsxs("div", { className: "bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 sm:p-4 ml-0 lg:ml-3.5 mt-2 flex flex-col gap-4 w-full", children: [
      block.target_filled_by === "athlete" && ["full", "medium", "cardio"].includes(columns) && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h5", { className: "text-[10px] font-bold text-zinc-500 mb-3", children: "Exercise Actuals" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: Array.from({ length: Math.max(1, maxSets) }).map((_, sIdx) => /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 items-end p-2 bg-white rounded-lg border border-zinc-200 ", children: [
          /* @__PURE__ */ jsx("div", { className: "w-full flex items-center gap-2 mb-1 border-b border-zinc-100 pb-1", children: /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-zinc-500", children: [
            "Set ",
            sIdx + 1
          ] }) }),
          columns === "full" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 w-[calc(50%-6px)] md:w-[calc(25%-9px)]", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-zinc-500", children: [
              "LOAD ",
              item.load_unit ? `(${item.load_unit})` : "(KG)",
              " *"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: exerciseData.load_array?.[sIdx] || "",
                onChange: (e) => handleExerciseArrayChange(item.id, "load_array", sIdx, e.target.value),
                placeholder: item.load_array?.[sIdx] ?? item.load ?? "",
                className: "w-full border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-lg shadow-sm sm:text-xs h-8 placeholder:text-zinc-300 :text-zinc-700 font-bold disabled:opacity-50 disabled:bg-zinc-100",
                disabled: isReadOnly || block.target_filled_by === "admin"
              }
            )
          ] }),
          (columns === "full" || columns === "medium") && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 w-[calc(50%-6px)] md:w-[calc(25%-9px)]", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-zinc-500", children: [
              "REPS ",
              item.reps_unit === "seconds" ? "(SECS)" : item.reps_unit === "minutes" ? "(MINS)" : "",
              " *"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: exerciseData.reps_array?.[sIdx] || "",
                onChange: (e) => handleExerciseArrayChange(item.id, "reps_array", sIdx, e.target.value),
                placeholder: item.reps_array?.[sIdx] ?? item.reps ?? "",
                className: "w-full border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-lg shadow-sm sm:text-xs h-8 placeholder:text-zinc-300 :text-zinc-700 font-bold disabled:opacity-50 disabled:bg-zinc-100",
                disabled: isReadOnly || block.target_filled_by === "admin"
              }
            )
          ] }),
          columns === "cardio" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 w-[calc(50%-6px)] md:w-[calc(33%-8px)]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-zinc-500", children: "DIST (M) *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: exerciseData.distance_array?.[sIdx] || "",
                  onChange: (e) => handleExerciseArrayChange(item.id, "distance_array", sIdx, e.target.value),
                  placeholder: item.distance_array?.[sIdx] ?? item.distance ?? "",
                  className: "w-full border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-lg shadow-sm sm:text-xs h-8 placeholder:text-zinc-300 :text-zinc-700 font-bold disabled:opacity-50 disabled:bg-zinc-100",
                  disabled: isReadOnly || block.target_filled_by === "admin"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 w-[calc(50%-6px)] md:w-[calc(33%-8px)]", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-zinc-500", children: [
                "TIME ",
                item.reps_unit ? `(${item.reps_unit.toUpperCase()})` : "(MINS)",
                " *"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: exerciseData.reps_array?.[sIdx] || "",
                  onChange: (e) => handleExerciseArrayChange(item.id, "reps_array", sIdx, e.target.value),
                  placeholder: item.reps_array?.[sIdx] ?? (item.reps || item.minutes) ?? "",
                  className: "w-full border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-lg shadow-sm sm:text-xs h-8 placeholder:text-zinc-300 :text-zinc-700 font-bold disabled:opacity-50 disabled:bg-zinc-100",
                  disabled: isReadOnly || block.target_filled_by === "admin"
                }
              )
            ] })
          ] })
        ] }, `actual-${sIdx}`)) })
      ] }),
      ["strength_training", "interval", "cardio"].includes(block.category) && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h5", { className: "text-[10px] font-bold text-zinc-500 mb-3", children: ["interval", "cardio"].includes(block.category) ? "RPE" : "RIR" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: Array.from({ length: Math.max(1, maxSets) }).map((_, sIdx) => {
          const valRpe = (Array.isArray(exerciseData.rpes) ? exerciseData.rpes[sIdx] : data.rpes?.[item.id]?.rpes?.[sIdx]) || "";
          return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 w-24 border border-zinc-200 rounded-lg p-2 bg-white shadow-sm shrink-0", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-zinc-500 font-bold text-center border-b border-zinc-100 pb-1", children: [
              "Set ",
              sIdx + 1
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "1",
                max: "10",
                step: "any",
                className: "w-full text-center bg-zinc-50 border-none rounded text-lg font-bold p-2 text-zinc-900 disabled:opacity-50",
                value: valRpe || "",
                onChange: (e) => handleSetRpeChange(item.id, sIdx, e.target.value),
                placeholder: "-",
                disabled: isReadOnly
              }
            )
          ] }, sIdx);
        }) })
      ] })
    ] })
  ] });
}
export {
  ExerciseItem as default
};
