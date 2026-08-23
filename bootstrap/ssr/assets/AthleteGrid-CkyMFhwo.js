import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Search, ChevronRight, Activity, HeartPulse } from "lucide-react";
const getInitials = (name) => {
  if (!name) return "UN";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};
const getAthletePhotoUrl = (athlete) => {
  if (athlete.photo_url) return athlete.photo_url;
  const dbPhoto = athlete.profile_photo || athlete.photo;
  if (dbPhoto) {
    if (dbPhoto.startsWith("http")) return dbPhoto;
    if (dbPhoto.startsWith("storage/")) return `/${dbPhoto}`;
    return `/storage/${dbPhoto}`;
  }
  return null;
};
function AthleteGrid({ athletes, weeklyData, onSelectAthlete }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAthletes = athletes.filter((p) => {
    const q = searchQuery.toLowerCase();
    const np = p.jersey_number || p.np || p.nomor_punggung || "";
    return p.name.toLowerCase().includes(q) || np.toString().includes(q);
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center max-w-xl bg-white  border border-slate-200  rounded-xl px-4 py-3 shadow-sm transition-colors focus-within:border-slate-400 ", children: [
      /* @__PURE__ */ jsx(Search, { size: 18, className: "text-slate-400 mr-3" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search by athlete name...",
          className: "bg-transparent border-none focus:ring-0 p-0 w-full text-sm font-medium text-slate-900  placeholder:text-slate-400",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: [
      filteredAthletes.map((athlete) => {
        const pData = weeklyData?.data?.find((d) => d.user_id === athlete.id);
        const np = athlete.jersey_number || athlete.np || athlete.nomor_punggung;
        const validPhotoUrl = getAthletePhotoUrl(athlete);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onSelectAthlete(athlete.id),
            className: "group w-full bg-white  border border-slate-200  rounded-xl p-5 hover:border-slate-400  transition-all duration-200 flex flex-col shadow-sm text-left",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between w-full", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
                    validPhotoUrl ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: validPhotoUrl,
                        alt: athlete.name,
                        className: "w-12 h-12 rounded-full object-cover border border-slate-200 ",
                        onError: (e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }
                      }
                    ) : null,
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-12 h-12 rounded-full bg-slate-100  flex items-center justify-center text-slate-900  font-semibold border border-slate-200  tracking-tight text-sm",
                        style: { display: validPhotoUrl ? "none" : "flex" },
                        children: getInitials(athlete.name)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "overflow-hidden", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-slate-900  group-hover:underline decoration-1 underline-offset-2 line-clamp-1 text-sm md:text-base", children: athlete.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-slate-500  font-medium mt-0.5", children: np ? `No. ${np}` : "Athlete" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 shrink-0 rounded-md bg-transparent flex items-center justify-end text-slate-400 group-hover:text-slate-900  transition-colors", children: /* @__PURE__ */ jsx(ChevronRight, { size: 18 }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-between border-t border-slate-100  pt-4 w-full", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-500  font-medium flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(Activity, { size: 12, className: "text-slate-400" }),
                    "Weekly Load"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-slate-900 ", children: [
                    pData?.weekly_load || 0,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-xs font-normal text-slate-500", children: "AU" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-500  font-medium flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(HeartPulse, { size: 12, className: "text-slate-400" }),
                    "Wellness"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-slate-900 ", children: [
                    pData?.weekly_wellness_score || 0,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-xs font-normal text-slate-500", children: "/196" })
                  ] })
                ] })
              ] })
            ]
          },
          athlete.id
        );
      }),
      filteredAthletes.length === 0 && /* @__PURE__ */ jsxs("div", { className: "col-span-full py-16 text-center border border-dashed border-slate-300  rounded-xl bg-slate-50/50  flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-white  border border-slate-200  rounded-full mb-3 shadow-sm", children: /* @__PURE__ */ jsx(Search, { size: 24, className: "text-slate-400 " }) }),
        /* @__PURE__ */ jsx("h4", { className: "font-semibold text-slate-900  mb-1", children: "Athlete Not Found" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500  text-sm", children: `Search "${searchQuery}" yielded no results.` })
      ] })
    ] })
  ] });
}
export {
  AthleteGrid as default
};
