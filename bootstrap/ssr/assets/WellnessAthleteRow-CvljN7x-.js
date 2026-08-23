import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { GripVertical, X } from "lucide-react";
const STICKY_COLS = {
  drag: {
    left: 0,
    width: 30,
    minWidth: 30,
    maxWidth: 30,
    boxSizing: "border-box"
  },
  c1: {
    left: 30,
    width: 40,
    minWidth: 40,
    maxWidth: 40,
    boxSizing: "border-box"
  },
  c2: {
    left: 70,
    width: 50,
    minWidth: 50,
    maxWidth: 50,
    boxSizing: "border-box"
  },
  c3: {
    left: 120,
    width: 40,
    minWidth: 40,
    maxWidth: 40,
    boxSizing: "border-box"
  },
  c4: {
    left: 160,
    width: 180,
    minWidth: 180,
    maxWidth: 180,
    boxSizing: "border-box"
  }
};
function WellnessAthleteRow({ athlete, visibleIdx, actions }) {
  const rowStyle = "bg-white  group-hover:bg-slate-50/80  transition-colors duration-200";
  const wellnessCols = [
    "quality_of_sleep",
    "fatigue",
    "muscle_soreness",
    "stress"
  ];
  const handleKeyDown = (e, currentRow, currentCol) => {
    let targetRow = currentRow;
    let targetCol = currentCol;
    switch (e.key) {
      case "ArrowUp":
        targetRow = currentRow - 1;
        break;
      case "ArrowDown":
        targetRow = currentRow + 1;
        break;
      case "ArrowLeft":
        if (e.target.selectionStart === 0 || e.target.selectionStart === null) {
          targetCol = currentCol - 1;
        } else {
          return;
        }
        break;
      case "ArrowRight":
        if (e.target.selectionStart === e.target.value.length || e.target.selectionStart === null) {
          targetCol = currentCol + 1;
        } else {
          return;
        }
        break;
      default:
        return;
    }
    const targetInput = document.querySelector(
      `input[data-row="${targetRow}"][data-col="${targetCol}"]`
    );
    if (targetInput) {
      e.preventDefault();
      targetInput.focus();
      targetInput.select();
    }
  };
  const amLoad = (parseFloat(athlete.metrics?.am_rpe) || 0) * (parseInt(athlete.metrics?.am_duration) || 0);
  const pmLoad = (parseFloat(athlete.metrics?.pm_rpe) || 0) * (parseInt(athlete.metrics?.pm_duration) || 0);
  const dailyLoad = amLoad + pmLoad;
  let dailyWellnessScore = 0;
  wellnessCols.forEach((col) => {
    dailyWellnessScore += parseInt(athlete.metrics?.[col]) || 0;
  });
  const currentWeeklyWellness = (athlete.baseWeeklyWellness || 0) + dailyWellnessScore;
  const getDailyLoadTextClass = (val) => {
    if (!val || val === 0) return "text-slate-800 ";
    if (val < 1500) return "text-emerald-600 ";
    if (val <= 3e3) return "text-amber-500 ";
    return "text-red-600 ";
  };
  const getDailyWellnessTextClass = (val) => {
    if (!val || val === 0) return "text-slate-400 ";
    if (val <= 9) return "text-emerald-600 ";
    if (val <= 13) return "text-lime-600 ";
    if (val <= 17) return "text-blue-600 ";
    if (val <= 20) return "text-yellow-500 ";
    if (val <= 23) return "text-amber-500 ";
    if (val <= 27) return "text-orange-500 ";
    return "text-red-600 ";
  };
  const getWeeklyWellnessTextClass = (val) => {
    if (!val || val === 0) return "text-slate-400 ";
    if (val <= 66) return "text-emerald-600 ";
    if (val <= 90) return "text-lime-600 ";
    if (val <= 119) return "text-blue-600 ";
    if (val <= 140) return "text-yellow-500 ";
    if (val <= 162) return "text-amber-500 ";
    if (val <= 189) return "text-orange-500 ";
    return "text-red-600 ";
  };
  const getDailyWellnessText = (val) => {
    if (!val || val === 0) return "";
    if (val <= 9) return "Sangat Baik";
    if (val <= 13) return "Baik";
    if (val <= 17) return "Cukup Baik";
    if (val <= 20) return "Sedang";
    if (val <= 23) return "Cukup Buruk";
    if (val <= 27) return "Buruk";
    return "Sangat Buruk";
  };
  const getWeeklyWellnessText = (val) => {
    if (!val || val === 0) return "";
    if (val <= 66) return "Sangat Baik";
    if (val <= 90) return "Baik";
    if (val <= 119) return "Cukup Baik";
    if (val <= 140) return "Sedang";
    if (val <= 162) return "Cukup Buruk";
    if (val <= 189) return "Buruk";
    return "Sangat Buruk";
  };
  const amRpeVal = athlete.metrics?.am_rpe ?? "";
  const isAmRpeError = amRpeVal !== "" && (parseFloat(amRpeVal) < 1 || parseFloat(amRpeVal) > 10);
  const pmRpeVal = athlete.metrics?.pm_rpe ?? "";
  const isPmRpeError = pmRpeVal !== "" && (parseFloat(pmRpeVal) < 1 || parseFloat(pmRpeVal) > 10);
  return /* @__PURE__ */ jsxs(
    "tr",
    {
      draggable: true,
      onDragStart: (e) => actions.handleDragStart(e, athlete.id),
      onDragOver: actions.handleDragOver,
      onDrop: (e) => actions.handleDrop(e, athlete.id),
      className: "group cursor-move hover:bg-slate-50 ",
      children: [
        /* @__PURE__ */ jsx(
          "td",
          {
            style: STICKY_COLS.drag,
            className: `p-1.5 cursor-grab active:cursor-grabbing sticky z-20 border-r border-slate-100  text-center text-slate-300  group-hover:text-slate-500 transition-colors ${rowStyle}`,
            children: /* @__PURE__ */ jsx(GripVertical, { size: 14, className: "mx-auto" })
          }
        ),
        /* @__PURE__ */ jsx(
          "td",
          {
            style: STICKY_COLS.c1,
            className: `p-1.5 font-bold text-[11px] text-slate-400  border-r border-slate-100  sticky z-20 text-center ${rowStyle}`,
            children: visibleIdx + 1
          }
        ),
        /* @__PURE__ */ jsx(
          "td",
          {
            style: STICKY_COLS.c2,
            className: `p-1.5 sticky z-20 border-r border-slate-100  text-center ${rowStyle}`,
            children: /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded border text-[9px] font-bold border-slate-200  text-slate-500  bg-slate-50 ", children: athlete.gender === "P" ? "P" : athlete.gender === "L" ? "L" : "-" })
          }
        ),
        /* @__PURE__ */ jsx(
          "td",
          {
            style: STICKY_COLS.c3,
            className: `p-1.5 font-mono font-bold text-[10px] text-slate-500 border-r border-slate-100  sticky z-20 text-center ${rowStyle}`,
            children: String(athlete.position_number || visibleIdx + 1).padStart(2, "0")
          }
        ),
        /* @__PURE__ */ jsx(
          "td",
          {
            style: STICKY_COLS.c4,
            className: `p-1.5 font-bold text-[11px] text-slate-900  sticky z-20 shadow-[4px_0_12px_rgba(0,0,0,0.04)] border-r border-slate-200  ${rowStyle}`,
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                style: { width: "164px" },
                className: "flex items-center justify-between",
                title: athlete.name,
                children: [
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: athlete.name }),
                  athlete.metrics?.muscle_pain_areas?.length > 0 && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => actions.openPainModal(athlete),
                      className: "ml-1 px-1 py-0.5 bg-red-100  hover:bg-red-200  text-red-600  rounded text-[9px] cursor-pointer shrink-0 transition-colors",
                      title: `Click to view ${athlete.metrics.muscle_pain_areas.length} pain areas`,
                      children: [
                        athlete.metrics.muscle_pain_areas.length,
                        " ",
                        '"Pain"'
                      ]
                    }
                  )
                ]
              }
            )
          }
        ),
        wellnessCols.map((col, idx) => {
          const val = athlete.metrics?.[col] ?? "";
          const isError = val !== "" && (val < 1 || val > 7);
          return /* @__PURE__ */ jsx(
            "td",
            {
              className: `p-1 border-l border-slate-100  relative transition-colors ${isError ? "bg-red-50 " : ""}`,
              children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: val,
                  "data-row": visibleIdx,
                  "data-col": idx,
                  onKeyDown: (e) => handleKeyDown(e, visibleIdx, idx),
                  onChange: (e) => actions.handleWellnessChange(
                    athlete.id,
                    col,
                    e.target.value
                  ),
                  onPaste: (e) => actions.handleLocalPaste(e, visibleIdx, col),
                  className: `w-full bg-transparent border-none rounded-md text-[11px] py-1 px-1 text-center font-bold tabular-nums transition-all outline-none focus:ring-1 focus:ring-slate-500  ${isError ? "text-red-600 " : "text-slate-900 "}
 `,
                  placeholder: "-"
                }
              )
            },
            col
          );
        }),
        /* @__PURE__ */ jsx(
          "td",
          {
            className: `p-1 border-l border-slate-200  transition-colors ${isAmRpeError ? "bg-red-50 " : "bg-slate-50/50 "}`,
            children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: amRpeVal,
                "data-row": visibleIdx,
                "data-col": 4,
                onKeyDown: (e) => handleKeyDown(e, visibleIdx, 4),
                onChange: (e) => actions.handleNumericChange(
                  athlete.id,
                  "am_rpe",
                  e.target.value
                ),
                onPaste: (e) => actions.handleLocalPaste(e, visibleIdx, "am_rpe"),
                className: `w-full bg-transparent border-none rounded-md text-[11px] py-1 px-1 text-center font-bold outline-none focus:ring-1 focus:ring-slate-500 transition-colors ${isAmRpeError ? "text-red-600 " : "text-slate-900 "}`,
                placeholder: "-"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("td", { className: "p-1 border-l border-slate-100  bg-slate-50/50 ", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: athlete.metrics?.am_duration ?? "",
            "data-row": visibleIdx,
            "data-col": 5,
            onKeyDown: (e) => handleKeyDown(e, visibleIdx, 5),
            onChange: (e) => actions.handleNumericChange(
              athlete.id,
              "am_duration",
              e.target.value
            ),
            onPaste: (e) => actions.handleLocalPaste(e, visibleIdx, "am_duration"),
            className: "w-full bg-transparent rounded-md border-none text-[11px] py-1 px-1 text-center font-bold outline-none text-slate-900  focus:ring-1 focus:ring-slate-500",
            placeholder: "-"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "p-1 border-l border-slate-100  bg-slate-100/50 ", children: /* @__PURE__ */ jsx("div", { className: "w-full text-[11px] py-1 px-1 text-center font-bold tabular-nums text-slate-400  cursor-not-allowed", children: amLoad > 0 ? amLoad.toFixed(1) : "-" }) }),
        /* @__PURE__ */ jsx(
          "td",
          {
            className: `p-1 border-l border-slate-200  transition-colors ${isPmRpeError ? "bg-red-50 " : "bg-slate-50/50 "}`,
            children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: pmRpeVal,
                "data-row": visibleIdx,
                "data-col": 6,
                onKeyDown: (e) => handleKeyDown(e, visibleIdx, 6),
                onChange: (e) => actions.handleNumericChange(
                  athlete.id,
                  "pm_rpe",
                  e.target.value
                ),
                onPaste: (e) => actions.handleLocalPaste(e, visibleIdx, "pm_rpe"),
                className: `w-full bg-transparent rounded-md border-none text-[11px] py-1 px-1 text-center font-bold outline-none focus:ring-1 focus:ring-slate-500 transition-colors ${isPmRpeError ? "text-red-600 " : "text-slate-900 "}`,
                placeholder: "-"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("td", { className: "p-1 border-l border-slate-100  bg-slate-50/50 ", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: athlete.metrics?.pm_duration ?? "",
            "data-row": visibleIdx,
            "data-col": 7,
            onKeyDown: (e) => handleKeyDown(e, visibleIdx, 7),
            onChange: (e) => actions.handleNumericChange(
              athlete.id,
              "pm_duration",
              e.target.value
            ),
            onPaste: (e) => actions.handleLocalPaste(e, visibleIdx, "pm_duration"),
            className: "w-full bg-transparent rounded-md border-none text-[11px] py-1 px-1 text-center font-bold outline-none text-slate-900  focus:ring-1 focus:ring-slate-500",
            placeholder: "-"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "p-1 border-l border-slate-100  bg-slate-100/50 ", children: /* @__PURE__ */ jsx("div", { className: "w-full text-[11px] py-1 px-1 text-center font-bold tabular-nums text-slate-400  cursor-not-allowed", children: pmLoad > 0 ? pmLoad.toFixed(1) : "-" }) }),
        /* @__PURE__ */ jsx("td", { className: "p-1 border-l-2 border-slate-300  bg-slate-100/50 ", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `w-full text-[12px] py-1 px-1 text-center font-bold tabular-nums ${getDailyLoadTextClass(dailyLoad)}`,
            children: dailyLoad > 0 ? dailyLoad.toFixed(1) : "-"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "p-1 border-l border-slate-200  bg-slate-200/50 ", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-1", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `w-full text-[12px] px-1 text-center font-bold tabular-nums ${getDailyWellnessTextClass(dailyWellnessScore)}`,
              children: dailyWellnessScore > 0 ? `${dailyWellnessScore}` : "-"
            }
          ),
          dailyWellnessScore > 0 && /* @__PURE__ */ jsx(
            "div",
            {
              className: `text-[8px] font-bold leading-none mt-0.5 ${getDailyWellnessTextClass(dailyWellnessScore)}`,
              children: getDailyWellnessText(dailyWellnessScore)
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "p-1 border-l border-slate-200  bg-slate-300/50 ", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-1", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `w-full text-[12px] px-1 text-center font-bold tabular-nums ${getWeeklyWellnessTextClass(currentWeeklyWellness)}`,
              children: currentWeeklyWellness > 0 ? `${currentWeeklyWellness}/196` : "-"
            }
          ),
          currentWeeklyWellness > 0 && /* @__PURE__ */ jsx(
            "div",
            {
              className: `text-[8px] font-bold leading-none mt-0.5 ${getWeeklyWellnessTextClass(currentWeeklyWellness)}`,
              children: getWeeklyWellnessText(currentWeeklyWellness)
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "p-1 border-l border-slate-200  bg-white ", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: athlete.metrics?.notes ?? "",
            "data-row": visibleIdx,
            "data-col": 8,
            onKeyDown: (e) => handleKeyDown(e, visibleIdx, 8),
            onChange: (e) => actions.handleTextChange(
              athlete.id,
              "notes",
              e.target.value
            ),
            className: "w-full bg-transparent border-none text-[11px] py-1 px-2 rounded-md font-medium outline-none text-slate-900  focus:ring-1 focus:ring-slate-500 placeholder-zinc-300 ",
            placeholder: "Write notes..."
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "p-1 border-l border-slate-200  bg-slate-50 ", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => actions.removeAthlete(athlete),
            className: "w-full flex justify-center text-slate-300 hover:text-slate-800 transition-colors",
            title: "Remove from table",
            children: /* @__PURE__ */ jsx(X, { size: 14, strokeWidth: 3 })
          }
        ) })
      ]
    }
  );
}
export {
  WellnessAthleteRow as default
};
