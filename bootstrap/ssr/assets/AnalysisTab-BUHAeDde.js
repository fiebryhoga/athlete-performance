import { jsx } from "react/jsx-runtime";
import "react";
import AthleteGrid from "./AthleteGrid-CkyMFhwo.js";
import AnalysisDetail from "./AnalysisDetail-D8gW87Rm.js";
import "lucide-react";
import "@inertiajs/react";
import "recharts";
import "./Modal-DUGk5ZHw.js";
import "@headlessui/react";
import "react-quill";
function AnalysisTab({ weeklyData, athletes, selectedAthleteId, onSelectAthlete }) {
  const isAthlete = athletes.length === 1;
  const effectiveAthleteId = isAthlete ? athletes[0].id : selectedAthleteId;
  const athleteWeeklyInfo = effectiveAthleteId ? weeklyData?.data?.find((p) => p.user_id === parseInt(effectiveAthleteId)) : null;
  return /* @__PURE__ */ jsx("div", { className: "w-full animate-in fade-in duration-300", children: !effectiveAthleteId || !athleteWeeklyInfo ? (
    // Tampilkan Grid Card
    /* @__PURE__ */ jsx(
      AthleteGrid,
      {
        athletes,
        weeklyData,
        onSelectAthlete
      }
    )
  ) : (
    // Tampilkan Rincian Detail Data Pemain
    /* @__PURE__ */ jsx(
      AnalysisDetail,
      {
        weeklyData,
        athleteWeeklyInfo,
        onBack: isAthlete ? void 0 : () => onSelectAthlete("")
      }
    )
  ) });
}
export {
  AnalysisTab as default
};
