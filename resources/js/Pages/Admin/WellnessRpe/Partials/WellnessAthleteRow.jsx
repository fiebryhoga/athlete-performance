import React from "react";

import { GripVertical, X } from "lucide-react";

const STICKY_COLS = {
    drag: {
        left: 0,
        width: 30,
        minWidth: 30,
        maxWidth: 30,
        boxSizing: "border-box",
    },
    c1: {
        left: 30,
        width: 40,
        minWidth: 40,
        maxWidth: 40,
        boxSizing: "border-box",
    },
    c2: {
        left: 70,
        width: 50,
        minWidth: 50,
        maxWidth: 50,
        boxSizing: "border-box",
    },
    c3: {
        left: 120,
        width: 40,
        minWidth: 40,
        maxWidth: 40,
        boxSizing: "border-box",
    },
    c4: {
        left: 160,
        width: 180,
        minWidth: 180,
        maxWidth: 180,
        boxSizing: "border-box",
    },
};

export default function WellnessAthleteRow({ athlete, visibleIdx, actions }) {
    
    const rowStyle =
        "bg-white  group-hover:bg-slate-50/80  transition-colors duration-200";
    const wellnessCols = [
        "quality_of_sleep",
        "fatigue",
        "muscle_soreness",
        "stress",
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

    // Hitung Load Harian
    const amLoad =
        (parseFloat(athlete.metrics?.am_rpe) || 0) *
        (parseInt(athlete.metrics?.am_duration) || 0);
    const pmLoad =
        (parseFloat(athlete.metrics?.pm_rpe) || 0) *
        (parseInt(athlete.metrics?.pm_duration) || 0);
    const dailyLoad = amLoad + pmLoad;

    // Hitung Daily Wellness (Maks 40)
    let dailyWellnessScore = 0;
    wellnessCols.forEach((col) => {
        dailyWellnessScore += parseInt(athlete.metrics?.[col]) || 0;
    });

    // Kalkulasi Real-Time Weekly Score
    const currentWeeklyWellness =
        (athlete.baseWeeklyWellness || 0) + dailyWellnessScore;

    const getDailyLoadTextClass = (val) => {
        if (!val || val === 0) return "text-slate-800 ";
        if (val < 1500) return "text-emerald-600 ";
        if (val <= 3000) return "text-amber-500 ";
        return "text-red-600 ";
    };

    const getDailyWellnessTextClass = (val) => {
        if (!val || val === 0) return "text-slate-400 ";
        if (val >= 4 && val <= 7) return "text-blue-600 ";
        if (val >= 8 && val <= 10)
            return "text-emerald-600 ";
        if (val >= 11 && val <= 13) return "text-lime-600 ";
        if (val >= 14 && val <= 16)
            return "text-yellow-500 ";
        if (val >= 17 && val <= 19) return "text-amber-500 ";
        if (val >= 20 && val <= 22)
            return "text-orange-500 ";
        if (val >= 23 && val <= 28) return "text-red-600 ";
        return "text-slate-900 ";
    };

    const getWeeklyWellnessTextClass = (val) => {
        if (!val || val === 0) return "text-slate-400 ";
        if (val >= 28 && val <= 51) return "text-blue-600 ";
        if (val >= 52 && val <= 75)
            return "text-emerald-600 ";
        if (val >= 76 && val <= 99) return "text-lime-600 ";
        if (val >= 100 && val <= 123)
            return "text-yellow-500 ";
        if (val >= 124 && val <= 147)
            return "text-amber-500 ";
        if (val >= 148 && val <= 171)
            return "text-orange-500 ";
        if (val >= 172 && val <= 196) return "text-red-600 ";
        return "text-slate-900 ";
    };

    const getDailyWellnessText = (val) => {
        if (!val || val === 0) return "";
        if (val >= 4 && val <= 7) return "Sangat Baik";
        if (val >= 8 && val <= 10) return "Baik";
        if (val >= 11 && val <= 13) return "Cukup Baik";
        if (val >= 14 && val <= 16) return "Sedang";
        if (val >= 17 && val <= 19) return "Cukup Buruk";
        if (val >= 20 && val <= 22) return "Buruk";
        if (val >= 23 && val <= 28) return "Sangat Buruk";
        return "";
    };

    const getWeeklyWellnessText = (val) => {
        if (!val || val === 0) return "";
        if (val >= 28 && val <= 51) return "Sangat Baik";
        if (val >= 52 && val <= 75) return "Baik";
        if (val >= 76 && val <= 99) return "Cukup Baik";
        if (val >= 100 && val <= 123) return "Sedang";
        if (val >= 124 && val <= 147) return "Cukup Buruk";
        if (val >= 148 && val <= 171) return "Buruk";
        if (val >= 172 && val <= 196) return "Sangat Buruk";
        return "";
    };

    // --- CEK ERROR RPE (1-10) ---
    const amRpeVal = athlete.metrics?.am_rpe ?? "";
    const isAmRpeError =
        amRpeVal !== "" &&
        (parseFloat(amRpeVal) < 1 || parseFloat(amRpeVal) > 10);

    const pmRpeVal = athlete.metrics?.pm_rpe ?? "";
    const isPmRpeError =
        pmRpeVal !== "" &&
        (parseFloat(pmRpeVal) < 1 || parseFloat(pmRpeVal) > 10);

    return (
        <tr
            draggable={true}
            onDragStart={(e) => actions.handleDragStart(e, athlete.id)}
            onDragOver={actions.handleDragOver}
            onDrop={(e) => actions.handleDrop(e, athlete.id)}
            className="group cursor-move hover:bg-slate-50 "
        >
            {/* STICKY COLUMNS */}
            <td
                style={STICKY_COLS.drag}
                className={`p-1.5 cursor-grab active:cursor-grabbing sticky z-20 border-r border-slate-100  text-center text-slate-300  group-hover:text-slate-500 transition-colors ${rowStyle}`}
            >
                <GripVertical size={14} className="mx-auto" />
            </td>
            <td
                style={STICKY_COLS.c1}
                className={`p-1.5 font-bold text-[11px] text-slate-400  border-r border-slate-100  sticky z-20 text-center ${rowStyle}`}
            >
                {visibleIdx + 1}
            </td>
            <td
                style={STICKY_COLS.c2}
                className={`p-1.5 sticky z-20 border-r border-slate-100  text-center ${rowStyle}`}
            >
                <span className="px-1.5 py-0.5 rounded border text-[9px] font-black border-slate-200  text-slate-500  bg-slate-50 ">
                    {athlete.position}
                </span>
            </td>
            <td
                style={STICKY_COLS.c3}
                className={`p-1.5 font-mono font-bold text-[10px] text-slate-500 border-r border-slate-100  sticky z-20 text-center ${rowStyle}`}
            >
                {String(athlete.position_number || 0).padStart(2, "0")}
            </td>
            <td
                style={STICKY_COLS.c4}
                className={`p-1.5 font-bold text-[11px] text-slate-900  sticky z-20 shadow-[4px_0_12px_rgba(0,0,0,0.04)] border-r border-slate-200  ${rowStyle}`}
            >
                <div
                    style={{ width: "164px" }}
                    className="flex items-center justify-between"
                    title={athlete.name}
                >
                    <span className="truncate">{athlete.name}</span>
                    {athlete.metrics?.muscle_pain_areas?.length > 0 && (
                        <button
                            type="button"
                            onClick={() => actions.openPainModal(athlete)}
                            className="ml-1 px-1 py-0.5 bg-red-100  hover:bg-red-200  text-red-600  rounded text-[9px] cursor-pointer shrink-0 transition-colors"
                            title={`Click to view ${athlete.metrics.muscle_pain_areas.length} pain areas`}
                        >
                            {athlete.metrics.muscle_pain_areas.length}{" "}
                            "Pain"
                        </button>
                    )}
                </div>
            </td>

            {/* WELLNESS INPUTS (1-5) */}
            {wellnessCols.map((col, idx) => {
                const val = athlete.metrics?.[col] ?? "";
                const isError = val !== "" && (val < 1 || val > 7);

                return (
                    <td
                        key={col}
                        className={`p-1 border-l border-slate-100  relative transition-colors ${isError ? "bg-red-50 " : ""}`}
                    >
                        <input
                            type="text"
                            value={val}
                            data-row={visibleIdx}
                            data-col={idx}
                            onKeyDown={(e) => handleKeyDown(e, visibleIdx, idx)}
                            onChange={(e) =>
                                actions.handleWellnessChange(
                                    athlete.id,
                                    col,
                                    e.target.value,
                                )
                            }
                            onPaste={(e) =>
                                actions.handleLocalPaste(e, visibleIdx, col)
                            }
                            className={`w-full bg-transparent border-none rounded-md text-[11px] py-1 px-1 text-center font-bold tabular-nums transition-all outline-none focus:ring-1 focus:ring-slate-500  ${isError ? "text-red-600 " : "text-slate-900 "}
 `}
                            placeholder="-"
                        />
                    </td>
                );
            })}

            {/* SESI AM */}
            <td
                className={`p-1 border-l border-slate-200  transition-colors ${isAmRpeError ? "bg-red-50 " : "bg-slate-50/50 "}`}
            >
                <input
                    type="text"
                    value={amRpeVal}
                    data-row={visibleIdx}
                    data-col={4}
                    onKeyDown={(e) => handleKeyDown(e, visibleIdx, 4)}
                    onChange={(e) =>
                        actions.handleNumericChange(
                            athlete.id,
                            "am_rpe",
                            e.target.value,
                        )
                    }
                    onPaste={(e) =>
                        actions.handleLocalPaste(e, visibleIdx, "am_rpe")
                    }
                    className={`w-full bg-transparent border-none rounded-md text-[11px] py-1 px-1 text-center font-bold outline-none focus:ring-1 focus:ring-slate-500 transition-colors ${isAmRpeError ? "text-red-600 " : "text-slate-900 "}`}
                    placeholder="-"
                />
            </td>
            <td className="p-1 border-l border-slate-100  bg-slate-50/50 ">
                <input
                    type="text"
                    value={athlete.metrics?.am_duration ?? ""}
                    data-row={visibleIdx}
                    data-col={5}
                    onKeyDown={(e) => handleKeyDown(e, visibleIdx, 5)}
                    onChange={(e) =>
                        actions.handleNumericChange(
                            athlete.id,
                            "am_duration",
                            e.target.value,
                        )
                    }
                    onPaste={(e) =>
                        actions.handleLocalPaste(e, visibleIdx, "am_duration")
                    }
                    className="w-full bg-transparent rounded-md border-none text-[11px] py-1 px-1 text-center font-bold outline-none text-slate-900  focus:ring-1 focus:ring-slate-500"
                    placeholder="-"
                />
            </td>
            <td className="p-1 border-l border-slate-100  bg-slate-100/50 ">
                <div className="w-full text-[11px] py-1 px-1 text-center font-bold tabular-nums text-slate-400  cursor-not-allowed">
                    {amLoad > 0 ? amLoad.toFixed(1) : "-"}
                </div>
            </td>

            {/* SESI PM */}
            <td
                className={`p-1 border-l border-slate-200  transition-colors ${isPmRpeError ? "bg-red-50 " : "bg-slate-50/50 "}`}
            >
                <input
                    type="text"
                    value={pmRpeVal}
                    data-row={visibleIdx}
                    data-col={6}
                    onKeyDown={(e) => handleKeyDown(e, visibleIdx, 6)}
                    onChange={(e) =>
                        actions.handleNumericChange(
                            athlete.id,
                            "pm_rpe",
                            e.target.value,
                        )
                    }
                    onPaste={(e) =>
                        actions.handleLocalPaste(e, visibleIdx, "pm_rpe")
                    }
                    className={`w-full bg-transparent rounded-md border-none text-[11px] py-1 px-1 text-center font-bold outline-none focus:ring-1 focus:ring-slate-500 transition-colors ${isPmRpeError ? "text-red-600 " : "text-slate-900 "}`}
                    placeholder="-"
                />
            </td>
            <td className="p-1 border-l border-slate-100  bg-slate-50/50 ">
                <input
                    type="text"
                    value={athlete.metrics?.pm_duration ?? ""}
                    data-row={visibleIdx}
                    data-col={7}
                    onKeyDown={(e) => handleKeyDown(e, visibleIdx, 7)}
                    onChange={(e) =>
                        actions.handleNumericChange(
                            athlete.id,
                            "pm_duration",
                            e.target.value,
                        )
                    }
                    onPaste={(e) =>
                        actions.handleLocalPaste(e, visibleIdx, "pm_duration")
                    }
                    className="w-full bg-transparent rounded-md border-none text-[11px] py-1 px-1 text-center font-bold outline-none text-slate-900  focus:ring-1 focus:ring-slate-500"
                    placeholder="-"
                />
            </td>
            <td className="p-1 border-l border-slate-100  bg-slate-100/50 ">
                <div className="w-full text-[11px] py-1 px-1 text-center font-bold tabular-nums text-slate-400  cursor-not-allowed">
                    {pmLoad > 0 ? pmLoad.toFixed(1) : "-"}
                </div>
            </td>

            {/* TOTAL */}
            <td className="p-1 border-l-2 border-slate-300  bg-slate-100/50 ">
                <div
                    className={`w-full text-[12px] py-1 px-1 text-center font-black tabular-nums ${getDailyLoadTextClass(dailyLoad)}`}
                >
                    {dailyLoad > 0 ? dailyLoad.toFixed(1) : "-"}
                </div>
            </td>

            <td className="p-1 border-l border-slate-200  bg-slate-200/50 ">
                <div className="flex flex-col items-center justify-center py-1">
                    <div
                        className={`w-full text-[12px] px-1 text-center font-black tabular-nums ${getDailyWellnessTextClass(dailyWellnessScore)}`}
                    >
                        {dailyWellnessScore > 0 ? `${dailyWellnessScore}` : "-"}
                    </div>
                    {dailyWellnessScore > 0 && (
                        <div
                            className={`text-[8px] font-bold uppercase tracking-wider leading-none mt-0.5 ${getDailyWellnessTextClass(dailyWellnessScore)}`}
                        >
                            {getDailyWellnessText(dailyWellnessScore)}
                        </div>
                    )}
                </div>
            </td>

            <td className="p-1 border-l border-slate-200  bg-slate-300/50 ">
                <div className="flex flex-col items-center justify-center py-1">
                    <div
                        className={`w-full text-[12px] px-1 text-center font-black tabular-nums ${getWeeklyWellnessTextClass(currentWeeklyWellness)}`}
                    >
                        {currentWeeklyWellness > 0
                            ? `${currentWeeklyWellness}/196`
                            : "-"}
                    </div>
                    {currentWeeklyWellness > 0 && (
                        <div
                            className={`text-[8px] font-bold uppercase tracking-wider leading-none mt-0.5 ${getWeeklyWellnessTextClass(currentWeeklyWellness)}`}
                        >
                            {getWeeklyWellnessText(currentWeeklyWellness)}
                        </div>
                    )}
                </div>
            </td>

            {/* CATATAN */}
            <td className="p-1 border-l border-slate-200  bg-white ">
                <input
                    type="text"
                    value={athlete.metrics?.notes ?? ""}
                    data-row={visibleIdx}
                    data-col={8}
                    onKeyDown={(e) => handleKeyDown(e, visibleIdx, 8)}
                    onChange={(e) =>
                        actions.handleTextChange(
                            athlete.id,
                            "notes",
                            e.target.value,
                        )
                    }
                    className="w-full bg-transparent border-none text-[11px] py-1 px-2 rounded-md font-medium outline-none text-slate-900  focus:ring-1 focus:ring-slate-500 placeholder-zinc-300 "
                    placeholder="Write notes..."
                />
            </td>

            {/* ACTION RETURN */}
            <td className="p-1 border-l border-slate-200  bg-slate-50 ">
                <button
                    type="button"
                    onClick={() => actions.removeAthlete(athlete)}
                    className="w-full flex justify-center text-slate-300 hover:text-slate-800 transition-colors"
                    title="Remove from table"
                >
                    <X size={14} strokeWidth={3} />
                </button>
            </td>
        </tr>
    );
}
