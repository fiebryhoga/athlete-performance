import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import { ActivitySquare } from "lucide-react";
import HeaderProfile from "./HeaderProfile-ClGXlnz6.js";
import WeeklyGroup from "./WeeklyGroup-CCSQuw9y.js";
import TrainingModal from "./TrainingModal-BugBbEcP.js";
import "axios";
import "recharts";
function Show({ athlete, trainingHistory }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const todayStr = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [searchDate, setSearchDate] = useState("");
  const activeData = trainingHistory || [];
  const physicalPrepTypes = ["Power", "Strength/Power", "Strength UB", "Strength LB", "Strength Full Body", "Speed/Agility", "Injury Prevention", "General Strength", "Other activity", "Recovery", "Conditioning"];
  const skillTypes = ["Tactical", "Technical", "Skills"];
  const matchTypes = ["Match", "Competition"];
  const travelTypes = ["Travel"];
  const sessionTypes = [...physicalPrepTypes, ...skillTypes, ...matchTypes, ...travelTypes];
  const rpeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const formLoad = useForm({
    user_id: athlete?.id,
    record_date: todayStr,
    sleep_quality: "",
    fatigue: "",
    muscle_soreness: "",
    stress: "",
    motivation: "",
    health: "",
    mood: "",
    study_attitude: "",
    am_session_type: "",
    am_rpe: "",
    am_duration: "",
    pm_session_type: "",
    pm_rpe: "",
    pm_duration: "",
    notes: ""
  });
  const openModal = (dateToEdit = selectedDate) => {
    const existingData = activeData.find((item) => item.record_date === dateToEdit);
    if (existingData) {
      formLoad.setData({
        user_id: athlete?.id,
        record_date: dateToEdit,
        ...existingData,
        notes: existingData.notes || ""
      });
    } else {
      formLoad.setData({
        user_id: athlete?.id,
        record_date: dateToEdit,
        sleep_quality: "",
        fatigue: "",
        muscle_soreness: "",
        stress: "",
        motivation: "",
        health: "",
        mood: "",
        study_attitude: "",
        am_session_type: "",
        am_rpe: "",
        am_duration: "",
        pm_session_type: "",
        pm_rpe: "",
        pm_duration: "",
        notes: ""
      });
    }
    setSelectedDate(dateToEdit);
    setIsModalOpen(true);
  };
  const submitLoad = (e) => {
    e.preventDefault();
    formLoad.post(route("admin.training-loads.store"), {
      onSuccess: () => {
        setIsModalOpen(false);
        formLoad.reset();
      },
      preserveScroll: true
    });
  };
  const formatDateToIndo = (dateObj, formatType = "full") => {
    if (!dateObj) return "-";
    const options = formatType === "full" ? { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" } : { day: "numeric", month: "short", timeZone: "Asia/Jakarta" };
    return new Date(dateObj).toLocaleDateString("id-ID", options);
  };
  const generateWeeklyData = () => {
    if (!activeData || activeData.length === 0) return [];
    const sortedData = [...activeData].sort((a, b) => new Date(a.record_date) - new Date(b.record_date));
    const firstDate = new Date(sortedData[0].record_date);
    const startDay = firstDate.getDay();
    const startDiff = firstDate.getDate() - startDay + (startDay === 0 ? -6 : 1);
    let currentMonday = new Date(firstDate.setDate(startDiff));
    currentMonday.setHours(0, 0, 0, 0);
    const endLimit = /* @__PURE__ */ new Date();
    endLimit.setHours(23, 59, 59, 999);
    let weeksArray = [];
    while (currentMonday <= endLimit) {
      const weekDays = [];
      const dailyLoadsForMath = [];
      const frequency = {};
      sessionTypes.forEach((t) => frequency[t] = 0);
      let totals = { all: 0, physical: 0, skill: 0, matches: 0, travel: 0 };
      let weeklyWellnessScore = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(currentMonday);
        d.setDate(d.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;
        const existingRecord = sortedData.find((item) => item.record_date === dateStr);
        const load = existingRecord ? Number(existingRecord.daily_load || 0) : 0;
        const wellness = existingRecord ? Number(existingRecord.wellness_score || 0) : 0;
        weekDays.push({
          dateStr,
          dateObj: d,
          dayName: d.toLocaleDateString("id-ID", { weekday: "long" }),
          data: existingRecord || null,
          load,
          wellness
        });
        dailyLoadsForMath.push(load);
        weeklyWellnessScore += wellness;
        if (existingRecord) {
          [existingRecord.am_session_type, existingRecord.pm_session_type].forEach((t) => {
            if (t && frequency[t] !== void 0) {
              frequency[t]++;
              totals.all++;
              if (physicalPrepTypes.includes(t)) totals.physical++;
              else if (skillTypes.includes(t)) totals.skill++;
              else if (matchTypes.includes(t)) totals.matches++;
              else if (travelTypes.includes(t)) totals.travel++;
            }
          });
        }
      }
      const weeklyLoad = dailyLoadsForMath.reduce((acc, val) => acc + val, 0);
      const meanLoad = weeklyLoad / 7;
      const variance = dailyLoadsForMath.reduce((acc, val) => acc + Math.pow(val - meanLoad, 2), 0) / 6;
      const stdDev = Math.sqrt(variance);
      const monotony = stdDev > 0 ? meanLoad / stdDev : meanLoad > 0 ? meanLoad : 0;
      const strain = weeklyLoad * monotony;
      weeksArray.push({
        startObj: new Date(currentMonday),
        endObj: new Date(weekDays[6].dateObj),
        label: `${formatDateToIndo(currentMonday, "short")} - ${formatDateToIndo(weekDays[6].dateObj, "short")}`,
        days: weekDays,
        metrics: {
          weeklyLoad,
          weeklyWellnessScore,
          meanLoad: parseFloat(meanLoad.toFixed(1)),
          stdDev: parseFloat(stdDev.toFixed(1)),
          monotony: parseFloat(monotony.toFixed(2)),
          strain: parseFloat(strain.toFixed(1)),
          frequency,
          totals: { ...totals, training: totals.physical + totals.skill }
        }
      });
      currentMonday.setDate(currentMonday.getDate() + 7);
    }
    weeksArray.forEach((week, index) => {
      if (index === 0) {
        week.metrics.acwr = 0;
      } else {
        let sumPrevLoad = 0;
        let countPrevWeeks = 0;
        for (let j = index - 1; j >= Math.max(0, index - 4); j--) {
          sumPrevLoad += weeksArray[j].metrics.weeklyLoad;
          countPrevWeeks++;
        }
        let chronicLoad = sumPrevLoad / (countPrevWeeks === 4 ? 4 : countPrevWeeks);
        week.metrics.acwr = chronicLoad > 0 ? parseFloat((week.metrics.weeklyLoad / chronicLoad).toFixed(2)) : 0;
      }
    });
    return weeksArray.reverse();
  };
  const groupedWeeks = generateWeeklyData();
  const displayedWeeks = searchDate ? groupedWeeks.filter((week) => {
    const sDate = new Date(searchDate);
    sDate.setHours(12, 0, 0, 0);
    const wStart = new Date(week.startObj);
    wStart.setHours(0, 0, 0, 0);
    const wEnd = new Date(week.endObj);
    wEnd.setHours(23, 59, 59, 999);
    return sDate >= wStart && sDate <= wEnd;
  }) : groupedWeeks;
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Wellness & Load - ${athlete?.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Wellness & Load - ${athlete?.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 md:gap-8 mb-8 md:mb-12 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        HeaderProfile,
        {
          athlete,
          selectedDate,
          setSelectedDate,
          openModal,
          searchDate,
          setSearchDate
        }
      ),
      displayedWeeks.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-24 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50 text-slate-400", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-white border border-slate-200 rounded-full shadow-sm mb-4", children: /* @__PURE__ */ jsx(ActivitySquare, { className: "w-8 h-8 md:w-10 md:h-10 text-orange-500" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-bold text-slate-900 tracking-tight", children: searchDate ? "DATA MINGGU TIDAK DITEMUKAN" : "BELUM ADA DATA LOAD" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-medium text-slate-500 mt-2 max-w-md mx-auto text-center", children: searchDate ? `Tidak ada aktivitas yang tercatat pada minggu yang mengandung tanggal ${formatDateToIndo(searchDate, "short")}.` : "Silakan input data Wellness & RPE pertama Anda." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-6 md:space-y-10", children: displayedWeeks.map((week, index) => /* @__PURE__ */ jsx(
        WeeklyGroup,
        {
          week,
          formatDateToIndo,
          openModal,
          sessionTypes,
          physicalPrepTypes,
          skillTypes,
          matchTypes,
          travelTypes
        },
        index
      )) })
    ] }),
    /* @__PURE__ */ jsx(
      TrainingModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        formLoad,
        submitLoad,
        activeData,
        selectedDate,
        formatDateToIndo,
        sessionTypes,
        rpeOptions,
        athleteId: athlete?.id
      }
    )
  ] });
}
export {
  Show as default
};
