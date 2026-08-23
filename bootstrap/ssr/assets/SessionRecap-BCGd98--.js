import { jsxs, jsx } from "react/jsx-runtime";
import React, { useState, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head } from "@inertiajs/react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { Activity, UserCheck, Users, Banknote, Calendar, ChevronDown, ChevronRight, Trophy, Package, CheckCircle2, FileText, User } from "lucide-react";
import Swal from "sweetalert2";
import "axios";
function SessionRecap({
  athletes = [],
  groups = [],
  coaches = [],
  available_months = [],
  monthly_summary = []
}) {
  const [activeTab, setActiveTab] = useState("individual");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState(/* @__PURE__ */ new Set());
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [expandedCoachTab, setExpandedCoachTab] = useState({});
  const [expandedMonthDetail, setExpandedMonthDetail] = useState(/* @__PURE__ */ new Set());
  const { post, processing } = useForm();
  const monthNamesMap = {
    "01": "Januari",
    "02": "Februari",
    "03": "Maret",
    "04": "April",
    "05": "Mei",
    "06": "Juni",
    "07": "Juli",
    "08": "Agustus",
    "09": "September",
    "10": "Oktober",
    "11": "November",
    "12": "Desember"
  };
  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };
  const toggleMonthDetail = (key) => {
    const newExpanded = new Set(expandedMonthDetail);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedMonthDetail(newExpanded);
  };
  const setCoachDetailTab = (coachId, tab) => {
    setExpandedCoachTab((prev) => ({
      ...prev,
      [coachId]: tab
    }));
  };
  const getCoachMonthlyBreakdown = (coach) => {
    if (coach.monthly_breakdown && coach.monthly_breakdown.length > 0) {
      return coach.monthly_breakdown;
    }
    const sourceSessions = coach.all_sessions && coach.all_sessions.length > 0 ? coach.all_sessions : coach.sessions || [];
    if (!sourceSessions.length) return [];
    const grouped = {};
    sourceSessions.forEach((s) => {
      let mKey = s.month_key;
      if (!mKey && s.date) {
        const dStr = String(s.date).substring(0, 10);
        if (dStr.length >= 7) {
          mKey = dStr.substring(0, 7);
        }
      }
      if (!mKey) mKey = "other";
      if (!grouped[mKey]) {
        let label = mKey;
        if (mKey.includes("-")) {
          const [y, m] = mKey.split("-");
          label = `${monthNamesMap[m] || m} ${y}`;
        }
        grouped[mKey] = {
          month_key: mKey,
          month_label: label,
          total_sessions: 0,
          individual_sessions: 0,
          group_sessions: 0,
          gym_sessions: 0,
          total_fee: 0,
          paid_fee: 0,
          unpaid_fee: 0,
          unpaid_sessions: 0,
          paid_sessions: 0,
          sessions: []
        };
      }
      const fee = Number(s.fee || 0);
      grouped[mKey].total_sessions += 1;
      grouped[mKey].total_fee += fee;
      if (s.type === "Individu") grouped[mKey].individual_sessions += 1;
      else if (s.type === "Grup") grouped[mKey].group_sessions += 1;
      else if (s.type === "Jaga Gym") grouped[mKey].gym_sessions += 1;
      if (s.is_paid) {
        grouped[mKey].paid_fee += fee;
        grouped[mKey].paid_sessions += 1;
      } else {
        grouped[mKey].unpaid_fee += fee;
        grouped[mKey].unpaid_sessions += 1;
      }
      grouped[mKey].sessions.push(s);
    });
    return Object.values(grouped).sort((a, b) => b.month_key.localeCompare(a.month_key));
  };
  const computedAvailableMonths = useMemo(() => {
    if (available_months && available_months.length > 0) {
      return available_months;
    }
    const monthsSet = /* @__PURE__ */ new Map();
    coaches.forEach((c) => {
      const list = getCoachMonthlyBreakdown(c);
      list.forEach((mb) => {
        if (mb.month_key !== "other" && !monthsSet.has(mb.month_key)) {
          monthsSet.set(mb.month_key, mb.month_label);
        }
      });
    });
    return Array.from(monthsSet.entries()).sort((a, b) => b[0].localeCompare(a[0])).map(([key, label]) => ({ key, label }));
  }, [available_months, coaches]);
  const computedMonthlySummary = useMemo(() => {
    if (monthly_summary && monthly_summary.length > 0) {
      return monthly_summary;
    }
    return computedAvailableMonths.map((m) => {
      let totalFee = 0;
      let paidFee = 0;
      let unpaidFee = 0;
      let totalSessions = 0;
      coaches.forEach((c) => {
        const list = getCoachMonthlyBreakdown(c);
        const match = list.find((item) => item.month_key === m.key);
        if (match) {
          totalFee += match.total_fee;
          paidFee += match.paid_fee;
          unpaidFee += match.unpaid_fee;
          totalSessions += match.total_sessions;
        }
      });
      return {
        month_key: m.key,
        month_label: m.label,
        total_fee: totalFee,
        paid_fee: paidFee,
        unpaid_fee: unpaidFee,
        total_sessions: totalSessions
      };
    });
  }, [monthly_summary, computedAvailableMonths, coaches]);
  const totalAthleteSessions = athletes.reduce((sum, a) => sum + (a.total_sessions || 0), 0);
  const totalGroupSessions = groups.reduce((sum, g) => sum + (g.total_sessions || 0), 0);
  const activeCoachesCount = coaches.filter((c) => c.total_sessions > 0 || c.all_sessions && c.all_sessions.length > 0 || c.sessions && c.sessions.length > 0).length;
  const totalUnpaidCoachEarnings = coaches.reduce((sum, c) => sum + (c.unpaid_earnings || 0), 0);
  const filteredAthletes = athletes.filter(
    (a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || (a.sport?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredGroups = groups.filter(
    (g) => g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCoaches = coaches.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedMonth === "all") return true;
    const breakdown = getCoachMonthlyBreakdown(c);
    return breakdown.some((m) => m.month_key === selectedMonth);
  });
  const handlePayAthlete = (athlete) => {
    Swal.fire({
      title: "Tandai Lunas?",
      text: `Anda akan menandai ${athlete.unpaid_sessions} sesi belum bayar milik ${athlete.name} sebagai lunas.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Tandai Lunas!"
    }).then((result) => {
      if (result.isConfirmed) {
        post(route("admin.reports.pay-athlete", athlete.id));
      }
    });
  };
  const handlePayGroup = (group) => {
    Swal.fire({
      title: "Tandai Lunas?",
      text: `Anda akan menandai ${group.unpaid_sessions} sesi belum bayar milik grup ${group.name} sebagai lunas.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Tandai Lunas!"
    }).then((result) => {
      if (result.isConfirmed) {
        post(route("admin.reports.pay-group", group.id));
      }
    });
  };
  const handlePayCoach = (coach) => {
    Swal.fire({
      title: "Tandai Lunas?",
      text: `Anda akan mencairkan honor sebesar Rp ${Number(coach.unpaid_earnings).toLocaleString("id-ID")} untuk pelatih ${coach.name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Tandai Lunas!"
    }).then((result) => {
      if (result.isConfirmed) {
        post(route("admin.reports.pay-coach", coach.id));
      }
    });
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
  };
  const renderProgressBar = (completed, total) => {
    if (!total) {
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-700", children: [
          completed,
          " Sesi"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded", children: "Tanpa Paket" })
      ] });
    }
    const percent = Math.min(100, Math.round(completed / total * 100));
    let colorClass = "bg-orange-500";
    if (percent >= 100) colorClass = "bg-green-500";
    else if (percent > 60) colorClass = "bg-orange-500";
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 w-full max-w-[150px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[10px] font-bold", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-slate-600", children: [
          "Sesi ",
          completed,
          "/",
          total
        ] }),
        /* @__PURE__ */ jsxs("span", { className: percent >= 100 ? "text-green-600" : "text-slate-400", children: [
          percent,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-100 rounded-full h-1.5 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: `h-full ${colorClass} rounded-full`, style: { width: `${percent}%` } }) })
    ] });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Rekap Sesi", children: [
    /* @__PURE__ */ jsx(Head, { title: "Rekap Sesi & Honor Pelatih - Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full mx-auto pb-16 px-4 sm:px-6 lg:px-8 space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Rekap Sesi & Honor Pelatih",
          subtitle: "Laporan kumulatif sesi latihan atlet, grup, serta rekapitulasi honor pelatih per bulan",
          icon: Activity,
          backButton: true,
          searchPlaceholder: `Cari ${activeTab === "individual" ? "klien individu" : activeTab === "group" ? "grup" : "pelatih"}...`,
          searchValue: searchQuery,
          onSearchChange: setSearchQuery
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Total Sesi Individu" }),
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100", children: /* @__PURE__ */ jsx(UserCheck, { className: "w-5 h-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-black text-slate-800", children: totalAthleteSessions }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "Semua klien individu" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Total Sesi Grup" }),
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100", children: /* @__PURE__ */ jsx(Users, { className: "w-5 h-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-black text-slate-800", children: totalGroupSessions }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "Seluruh sesi kelas grup" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Pelatih Aktif" }),
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100", children: /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-black text-slate-800", children: activeCoachesCount }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "Pelatih bertugas" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-emerald-700 uppercase tracking-wider", children: "Total Belum Dicairkan" }),
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100", children: /* @__PURE__ */ jsx(Banknote, { className: "w-5 h-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl font-black text-emerald-700", children: formatCurrency(totalUnpaidCoachEarnings) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-emerald-600 font-semibold", children: "Honor pelatih tertunda" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("individual"),
              className: `flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === "individual" ? "bg-orange-500 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsx(UserCheck, { size: 16 }),
                " Klien Individu"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("group"),
              className: `flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === "group" ? "bg-orange-500 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsx(Users, { size: 16 }),
                " Grup Latihan"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("coach"),
              className: `flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === "coach" ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsx(Banknote, { size: 16 }),
                " Rekap Pelatih (Honor & Bulanan)"
              ]
            }
          )
        ] }),
        activeTab === "coach" && computedAvailableMonths && computedAvailableMonths.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-indigo-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-600", children: "Filter Bulan:" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: selectedMonth,
              onChange: (e) => setSelectedMonth(e.target.value),
              className: "text-xs font-bold text-slate-800 bg-slate-50 border-slate-200 rounded-md py-1 px-2.5 focus:ring-indigo-500 focus:border-indigo-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Semua Bulan" }),
                computedAvailableMonths.map((m) => /* @__PURE__ */ jsx("option", { value: m.key, children: m.label }, m.key))
              ]
            }
          )
        ] })
      ] }),
      activeTab === "coach" && computedMonthlySummary && computedMonthlySummary.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-indigo-600" }),
            " Rekapitulasi Honor Pelatih Per Bulan"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-400", children: [
            "Total ",
            computedMonthlySummary.length,
            " Bulan Terekam"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: computedMonthlySummary.map((month) => {
          const isSelected = selectedMonth === month.month_key;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setSelectedMonth(isSelected ? "all" : month.month_key),
              className: `p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${isSelected ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-black text-slate-900", children: month.month_label }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200", children: [
                    month.total_sessions,
                    " Sesi"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Total Honor:" }),
                    /* @__PURE__ */ jsx("strong", { className: "text-slate-900 font-extrabold", children: formatCurrency(month.total_fee) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Belum Dicairkan:" }),
                    /* @__PURE__ */ jsx("strong", { className: month.unpaid_fee > 0 ? "text-rose-600 font-black" : "text-emerald-600 font-bold", children: month.unpaid_fee > 0 ? formatCurrency(month.unpaid_fee) : "Lunas" })
                  ] })
                ] })
              ]
            },
            month.month_key
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden", children: [
        activeTab === "individual" && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 border-b border-slate-200", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-10" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Nama Atlet" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Paket Latihan" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Progress Sesi" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center", children: "Belum Bayar" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: filteredAthletes.length > 0 ? filteredAthletes.map((athlete) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
            /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/60 transition-colors group", children: [
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx("button", { onClick: () => toggleRow(`athlete-${athlete.id}`), className: "p-1 text-slate-400 hover:text-slate-800 rounded", children: expandedRows.has(`athlete-${athlete.id}`) ? /* @__PURE__ */ jsx(ChevronDown, { size: 18 }) : /* @__PURE__ */ jsx(ChevronRight, { size: 18 }) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: "font-extrabold text-sm text-slate-900", children: athlete.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsx(Trophy, { className: "w-3 h-3 text-slate-300" }),
                  athlete.sport?.name || "-"
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: athlete.package_name ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold", children: [
                /* @__PURE__ */ jsx(Package, { size: 12, className: "text-slate-400" }),
                athlete.package_name
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 italic", children: "Tanpa Paket" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: renderProgressBar(athlete.unpaid_sessions, athlete.package_session_count) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-center", children: athlete.unpaid_sessions > 0 ? /* @__PURE__ */ jsx("span", { className: "inline-flex min-w-[2rem] px-2 py-1 rounded bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200", children: athlete.unpaid_sessions }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-right", children: athlete.unpaid_sessions > 0 ? /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handlePayAthlete(athlete),
                  disabled: processing,
                  className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 border border-orange-200",
                  children: [
                    /* @__PURE__ */ jsx(Banknote, { className: "w-3.5 h-3.5" }),
                    " Tandai Lunas"
                  ]
                }
              ) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { size: 14 }),
                " Lunas"
              ] }) })
            ] }),
            expandedRows.has(`athlete-${athlete.id}`) && /* @__PURE__ */ jsx("tr", { className: "bg-slate-50/50", children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-8 py-4 border-b border-slate-200/80", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700", children: "Riwayat Sesi Latihan Atlet" }),
              athlete.sessions && athlete.sessions.length > 0 ? /* @__PURE__ */ jsx("table", { className: "w-full text-left", children: /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: athlete.sessions.map((session) => /* @__PURE__ */ jsxs("tr", { className: "text-xs hover:bg-slate-50 transition-colors", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-slate-600 w-32 border-r border-slate-50", children: session.date ? new Date(session.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-" }),
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900 mr-2", children: [
                    "Sesi ",
                    session.session_number,
                    ":"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: session.name || "Program Latihan" })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-500", children: session.coaches.length > 0 ? session.coaches.join(", ") : "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 w-28", children: session.status === "completed" ? /* @__PURE__ */ jsx("span", { className: "text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200", children: "Selesai" }) : /* @__PURE__ */ jsx("span", { className: "text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200", children: "Terjadwal" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 w-28 text-right", children: session.is_paid ? /* @__PURE__ */ jsxs("span", { className: "text-emerald-600 font-bold", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { size: 12, className: "inline mr-1" }),
                  " Lunas"
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-bold", children: "Belum Bayar" }) })
              ] }, session.id)) }) }) : /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-xs text-slate-400 italic", children: "Belum ada riwayat sesi." })
            ] }) }) })
          ] }, athlete.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: "px-5 py-8 text-center text-slate-400 text-sm font-medium italic", children: "Tidak ada data atlet." }) }) })
        ] }) }),
        activeTab === "group" && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 border-b border-slate-200", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-10" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Nama Grup" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Anggota" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Paket Latihan" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Progress Sesi" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center", children: "Belum Bayar" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: filteredGroups.length > 0 ? filteredGroups.map((group) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
            /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/60 transition-colors group/row", children: [
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx("button", { onClick: () => toggleRow(`group-${group.id}`), className: "p-1 text-slate-400 hover:text-slate-800 rounded", children: expandedRows.has(`group-${group.id}`) ? /* @__PURE__ */ jsx(ChevronDown, { size: 18 }) : /* @__PURE__ */ jsx(ChevronRight, { size: 18 }) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx("span", { className: "font-extrabold text-sm text-slate-900", children: group.name }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex -space-x-2 overflow-hidden", children: [
                group.member_names?.slice(0, 3).map((name, i) => /* @__PURE__ */ jsx("div", { className: "inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600", title: name, children: name.substring(0, 2).toUpperCase() }, i)),
                group.member_names?.length > 3 && /* @__PURE__ */ jsxs("div", { className: "inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500", children: [
                  "+",
                  group.member_names.length - 3
                ] }),
                (!group.member_names || group.member_names.length === 0) && /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "0 Anggota" })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: group.package_name ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold", children: [
                /* @__PURE__ */ jsx(Package, { size: 12, className: "text-slate-400" }),
                group.package_name
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 italic", children: "Tanpa Paket" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: renderProgressBar(group.unpaid_sessions, group.package_session_count) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-center", children: group.unpaid_sessions > 0 ? /* @__PURE__ */ jsx("span", { className: "inline-flex min-w-[2rem] px-2 py-1 rounded bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200", children: group.unpaid_sessions }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-right", children: group.unpaid_sessions > 0 ? /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handlePayGroup(group),
                  disabled: processing,
                  className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 border border-orange-200",
                  children: [
                    /* @__PURE__ */ jsx(Banknote, { className: "w-3.5 h-3.5" }),
                    " Tandai Lunas"
                  ]
                }
              ) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { size: 14 }),
                " Lunas"
              ] }) })
            ] }),
            expandedRows.has(`group-${group.id}`) && /* @__PURE__ */ jsx("tr", { className: "bg-slate-50/50", children: /* @__PURE__ */ jsx("td", { colSpan: "7", className: "px-8 py-4 border-b border-slate-200/80", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700", children: "Riwayat Sesi Latihan Grup" }),
              group.sessions && group.sessions.length > 0 ? /* @__PURE__ */ jsx("table", { className: "w-full text-left", children: /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: group.sessions.map((session) => /* @__PURE__ */ jsxs("tr", { className: "text-xs hover:bg-slate-50 transition-colors", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-slate-600 w-32 border-r border-slate-50", children: session.date ? new Date(session.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-" }),
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900 mr-2", children: [
                    "Sesi ",
                    session.session_number,
                    ":"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: session.name || "Program Latihan Grup" })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-500", children: session.coaches.length > 0 ? session.coaches.join(", ") : "-" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 w-28", children: session.status === "completed" ? /* @__PURE__ */ jsx("span", { className: "text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200", children: "Selesai" }) : /* @__PURE__ */ jsx("span", { className: "text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200", children: "Terjadwal" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 w-28 text-right", children: session.is_paid ? /* @__PURE__ */ jsxs("span", { className: "text-emerald-600 font-bold", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { size: 12, className: "inline mr-1" }),
                  " Lunas"
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-bold", children: "Belum Bayar" }) })
              ] }, session.id)) }) }) : /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-xs text-slate-400 italic", children: "Belum ada riwayat sesi grup." })
            ] }) }) })
          ] }, group.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "7", className: "px-5 py-8 text-center text-slate-400 text-sm font-medium italic", children: "Tidak ada data grup." }) }) })
        ] }) }),
        activeTab === "coach" && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 border-b border-slate-200", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-10" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "Nama Pelatih" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center", children: "Sesi Individu" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center", children: "Sesi Grup" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center", children: "Jaga Gym" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center", children: "Total Sesi" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right", children: "Pencairan Terakhir" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right", children: "Belum Dicairkan" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: filteredCoaches.length > 0 ? filteredCoaches.map((coach) => {
            const monthlyList = getCoachMonthlyBreakdown(coach);
            const allSessionsList = coach.all_sessions && coach.all_sessions.length > 0 ? coach.all_sessions : coach.sessions || [];
            const unpaidSessionsList = coach.sessions || allSessionsList.filter((s) => !s.is_paid);
            const currentMonthData = selectedMonth !== "all" ? monthlyList.find((m) => m.month_key === selectedMonth) : null;
            const displayIndSessions = currentMonthData ? currentMonthData.individual_sessions : coach.individual_sessions;
            const displayGrpSessions = currentMonthData ? currentMonthData.group_sessions : coach.group_sessions;
            const displayGymSessions = currentMonthData ? currentMonthData.gym_sessions : coach.gym_sessions || 0;
            const displayTotalSessions = currentMonthData ? currentMonthData.total_sessions : coach.total_sessions;
            const displayUnpaidEarnings = currentMonthData ? currentMonthData.unpaid_fee : coach.unpaid_earnings;
            const activeCoachView = expandedCoachTab[coach.id] || "monthly";
            return /* @__PURE__ */ jsxs(React.Fragment, { children: [
              /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/60 transition-colors group/row", children: [
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx("button", { onClick: () => toggleRow(`coach-${coach.id}`), className: "p-1 text-slate-400 hover:text-slate-800 rounded", children: expandedRows.has(`coach-${coach.id}`) ? /* @__PURE__ */ jsx(ChevronDown, { size: 18 }) : /* @__PURE__ */ jsx(ChevronRight, { size: 18 }) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-xs shrink-0 border border-indigo-200", children: coach.name.substring(0, 2).toUpperCase() }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-extrabold text-sm text-slate-900 block", children: coach.name }),
                    /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-400 font-mono", children: [
                      "@",
                      coach.username || "-"
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-center", children: /* @__PURE__ */ jsx("span", { className: "inline-flex min-w-[2.2rem] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200", children: displayIndSessions }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-center", children: /* @__PURE__ */ jsx("span", { className: "inline-flex min-w-[2.2rem] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200", children: displayGrpSessions }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-center", children: /* @__PURE__ */ jsx("span", { className: "inline-flex min-w-[2.2rem] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200", children: displayGymSessions }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-center", children: /* @__PURE__ */ jsx("span", { className: "inline-flex min-w-[2.2rem] px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-200 shadow-sm", children: displayTotalSessions }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-700 text-xs md:text-sm", children: formatCurrency(coach.last_payout_amount || 0) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right", children: displayUnpaidEarnings > 0 ? /* @__PURE__ */ jsx("span", { className: "font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md text-xs border border-rose-200", children: formatCurrency(displayUnpaidEarnings) }) : /* @__PURE__ */ jsx("span", { className: "text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200", children: "Lunas" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: route("admin.reports.sessions.export-coach", coach.id),
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all border border-slate-300 shadow-sm",
                      title: "Export Laporan & Slip Honor PDF",
                      children: [
                        /* @__PURE__ */ jsx(FileText, { size: 14, className: "text-slate-500" }),
                        " PDF"
                      ]
                    }
                  ),
                  coach.unpaid_sessions > 0 ? /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => handlePayCoach(coach),
                      disabled: processing,
                      className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-bold transition-all disabled:opacity-50 shadow-sm shadow-indigo-600/20",
                      children: [
                        /* @__PURE__ */ jsx(Banknote, { className: "w-3.5 h-3.5" }),
                        " Cairkan Honor"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200", children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { size: 14 }),
                    " Lunas"
                  ] })
                ] }) })
              ] }),
              expandedRows.has(`coach-${coach.id}`) && /* @__PURE__ */ jsx("tr", { className: "bg-slate-50/50", children: /* @__PURE__ */ jsx("td", { colSpan: "9", className: "px-6 md:px-8 py-5 border-b border-slate-200/80", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm", children: [
                /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => setCoachDetailTab(coach.id, "monthly"),
                        className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeCoachView === "monthly" ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`,
                        children: [
                          "📅 Rekapitulasi Per Bulan (",
                          monthlyList.length,
                          " Bulan)"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => setCoachDetailTab(coach.id, "unpaid"),
                        className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeCoachView === "unpaid" ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`,
                        children: [
                          "📋 Sesi Belum Dicairkan (",
                          unpaidSessionsList.length,
                          ")"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => setCoachDetailTab(coach.id, "all"),
                        className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeCoachView === "all" ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`,
                        children: [
                          "🗂️ Seluruh Riwayat Sesi (",
                          allSessionsList.length,
                          ")"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-slate-700", children: [
                      "Pelatih: ",
                      /* @__PURE__ */ jsx("span", { className: "text-indigo-600", children: coach.name })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: route("admin.reports.sessions.export-coach", coach.id),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-700 shadow-2xs",
                        children: [
                          /* @__PURE__ */ jsx(FileText, { size: 12, className: "text-indigo-600" }),
                          " Cetak Slip PDF"
                        ]
                      }
                    )
                  ] })
                ] }),
                activeCoachView === "monthly" && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: monthlyList.length > 0 ? /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
                  /* @__PURE__ */ jsx("thead", { className: "bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3", children: "Bulan Periode" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-center", children: "Individu" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-center", children: "Grup" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-center", children: "Jaga Gym" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-center", children: "Total Sesi" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right", children: "Total Honor" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-right", children: "Status Pencairan" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 text-xs", children: monthlyList.map((mb) => {
                    const monthDetailKey = `${coach.id}-${mb.month_key}`;
                    const isMonthExpanded = expandedMonthDetail.has(monthDetailKey);
                    return /* @__PURE__ */ jsxs(React.Fragment, { children: [
                      /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/80 transition-colors", children: [
                        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 font-extrabold text-slate-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: () => toggleMonthDetail(monthDetailKey),
                              className: "p-1 text-indigo-600 hover:bg-indigo-50 rounded",
                              title: "Lihat rincian sesi bulan ini",
                              children: isMonthExpanded ? /* @__PURE__ */ jsx(ChevronDown, { size: 14 }) : /* @__PURE__ */ jsx(ChevronRight, { size: 14 })
                            }
                          ),
                          /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-indigo-500" }),
                          /* @__PURE__ */ jsx("span", { children: mb.month_label })
                        ] }) }),
                        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-center text-slate-600", children: mb.individual_sessions }),
                        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-center text-slate-600", children: mb.group_sessions }),
                        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-center text-slate-600", children: mb.gym_sessions }),
                        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-center", children: /* @__PURE__ */ jsx("span", { className: "font-extrabold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800", children: mb.total_sessions }) }),
                        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-right font-black text-slate-900", children: formatCurrency(mb.total_fee) }),
                        /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-right", children: mb.unpaid_fee > 0 ? /* @__PURE__ */ jsxs("div", { className: "inline-flex flex-col items-end", children: [
                          /* @__PURE__ */ jsxs("span", { className: "font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200 text-[11px]", children: [
                            "Belum: ",
                            formatCurrency(mb.unpaid_fee)
                          ] }),
                          mb.paid_fee > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-400 font-semibold mt-0.5", children: [
                            "Sudah: ",
                            formatCurrency(mb.paid_fee)
                          ] })
                        ] }) : /* @__PURE__ */ jsxs("span", { className: "font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 text-[11px] inline-flex items-center gap-1", children: [
                          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }),
                          " Lunas"
                        ] }) })
                      ] }),
                      isMonthExpanded && /* @__PURE__ */ jsx("tr", { className: "bg-indigo-50/30", children: /* @__PURE__ */ jsx("td", { colSpan: "7", className: "px-6 md:px-8 py-3 border-b border-indigo-100", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs", children: [
                        /* @__PURE__ */ jsxs("h4", { className: "text-[11px] font-black text-slate-700 mb-2.5 uppercase tracking-wide flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsx(Calendar, { size: 13, className: "text-indigo-600" }),
                          "Daftar Sesi Periode ",
                          mb.month_label,
                          " (",
                          mb.sessions.length,
                          " Sesi)"
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: mb.sessions.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/80 px-2 rounded-md transition-colors gap-3", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0 flex-wrap sm:flex-nowrap", children: [
                            /* @__PURE__ */ jsx("span", { className: "font-mono text-slate-500 w-20 shrink-0 font-bold", children: item.date ? new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "-" }),
                            /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${item.type === "Grup" ? "bg-orange-50 text-orange-700 border border-orange-200" : item.type === "Jaga Gym" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`, children: item.type }),
                            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 shrink-0", children: /* @__PURE__ */ jsxs("span", { className: "font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200 flex items-center gap-1", children: [
                              /* @__PURE__ */ jsx(User, { size: 11, className: "text-slate-500" }),
                              item.client_name || item.user_name || "Klien"
                            ] }) }),
                            /* @__PURE__ */ jsxs("span", { className: "font-medium text-slate-700 truncate", children: [
                              item.session_number ? /* @__PURE__ */ jsxs("span", { className: "font-bold text-indigo-600 mr-1", children: [
                                "#",
                                item.session_number
                              ] }) : "",
                              item.name
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                            /* @__PURE__ */ jsx("span", { className: "font-black text-slate-900", children: formatCurrency(item.fee) }),
                            item.is_paid ? /* @__PURE__ */ jsx("span", { className: "text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200", children: "Lunas" }) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200", children: "Belum" })
                          ] })
                        ] }, idx)) })
                      ] }) }) })
                    ] }, mb.month_key);
                  }) })
                ] }) : /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-xs text-slate-400 italic", children: "Belum ada rekapitulasi honor bulanan untuk pelatih ini." }) }),
                activeCoachView === "unpaid" && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: unpaidSessionsList.length > 0 ? /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
                  /* @__PURE__ */ jsx("thead", { className: "bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-28", children: "Tanggal" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-24 text-center", children: "Tipe Sesi" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-40", children: "Klien / Atlet / Grup" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3", children: "Nama Sesi / Program" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-24 text-center", children: "Status" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-28 text-right", children: "Honor" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: unpaidSessionsList.map((session) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 font-semibold text-slate-700", children: session.date ? new Date(session.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-center", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${session.type === "Grup" ? "bg-orange-50 text-orange-700 border border-orange-200" : session.type === "Jaga Gym" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`, children: session.type }) }),
                    /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "font-black text-slate-900 flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsx(User, { size: 13, className: "text-slate-400" }),
                        session.client_name || "-"
                      ] }),
                      session.client_sport && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400 font-medium pl-4", children: session.client_sport })
                    ] }),
                    /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                        session.session_number ? /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900 mr-2", children: [
                          "Sesi ",
                          session.session_number,
                          ":"
                        ] }) : /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 mr-2", children: "•" }),
                        /* @__PURE__ */ jsx("span", { className: "text-slate-700 font-medium", children: session.name })
                      ] }),
                      session.notes && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-500 mt-1 italic pl-3 border-l-2 border-slate-200", children: session.notes })
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-center", children: session.status === "completed" ? /* @__PURE__ */ jsx("span", { className: "text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]", children: "Selesai" }) : /* @__PURE__ */ jsx("span", { className: "text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-[10px]", children: "Terjadwal" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right font-black text-slate-900", children: formatCurrency(session.fee) })
                  ] }, session.id)) })
                ] }) : /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-xs text-slate-400 italic", children: "Semua sesi pada pelatih ini telah dicairkan (lunas)." }) }),
                activeCoachView === "all" && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: allSessionsList.length > 0 ? /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
                  /* @__PURE__ */ jsx("thead", { className: "bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-28", children: "Tanggal" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-24 text-center", children: "Tipe Sesi" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-40", children: "Klien / Atlet / Grup" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3", children: "Nama Sesi / Program" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-24 text-center", children: "Status Sesi" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-28 text-right", children: "Honor" }),
                    /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-24 text-right", children: "Status Bayar" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: allSessionsList.map((session) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 font-semibold text-slate-700", children: session.date ? new Date(session.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-center", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${session.type === "Grup" ? "bg-orange-50 text-orange-700 border border-orange-200" : session.type === "Jaga Gym" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`, children: session.type }) }),
                    /* @__PURE__ */ jsxs("td", { className: "px-5 py-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "font-black text-slate-900 flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsx(User, { size: 13, className: "text-slate-400" }),
                        session.client_name || "-"
                      ] }),
                      session.client_sport && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400 font-medium pl-4", children: session.client_sport })
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                      session.session_number ? /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900 mr-2", children: [
                        "Sesi ",
                        session.session_number,
                        ":"
                      ] }) : /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 mr-2", children: "•" }),
                      /* @__PURE__ */ jsx("span", { className: "text-slate-700 font-medium", children: session.name })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-center", children: session.status === "completed" ? /* @__PURE__ */ jsx("span", { className: "text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]", children: "Selesai" }) : /* @__PURE__ */ jsx("span", { className: "text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-[10px]", children: "Terjadwal" }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right font-black text-slate-900", children: formatCurrency(session.fee) }),
                    /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-right", children: session.is_paid ? /* @__PURE__ */ jsxs("span", { className: "text-emerald-600 font-bold text-[11px] inline-flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }),
                      " Lunas"
                    ] }) : /* @__PURE__ */ jsx("span", { className: "text-rose-600 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200", children: "Belum" }) })
                  ] }, session.id)) })
                ] }) : /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-xs text-slate-400 italic", children: "Belum ada log sesi yang tercatat." }) })
              ] }) }) })
            ] }, coach.id);
          }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "9", className: "px-5 py-8 text-center text-slate-400 text-sm font-medium italic", children: "Tidak ada data pelatih untuk filter yang dipilih." }) }) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  SessionRecap as default
};
