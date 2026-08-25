import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Printer, ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const resolveFullImageUrl = (path) => {
    if (!path) return null;
    if (typeof path !== "string") return null;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
        return path;
    }
    let clean = path;
    if (!clean.startsWith("/") && !clean.startsWith("storage/")) {
        clean = `/storage/${clean}`;
    } else if (!clean.startsWith("/")) {
        clean = `/${clean}`;
    }
    if (typeof window !== "undefined" && window.location?.origin) {
        return `${window.location.origin}${clean}`;
    }
    return clean;
};

export default function ProfilingPdf({
    athlete = {},
    stats = {},
    radarData = [],
    comparisonData = [],
    itemAnalysis = [],
    strengths = [],
    weaknesses = [],
    latest_phv,
    latest_composition,
    latest_wellness,
    latest_dpa,
    galleries = [],
    history = [],
    clubLogo,
    printDate,
}) {
    const handlePrint = () => {
        window.print();
    };

    const formattedDate =
        printDate || new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const athleteName = (athlete?.name || "ATHLETE NAME").toUpperCase();
    const sportName = (
        stats?.sport ||
        athlete?.sport?.name ||
        "All-Around"
    ).toUpperCase();

    const calculateAge = (dob) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const ageVal =
        athlete?.age !== undefined && athlete?.age !== null
            ? `${athlete.age}`
            : athlete?.date_of_birth
              ? `${calculateAge(athlete.date_of_birth)}`
              : "-";

    const heightVal = athlete?.height ? `${athlete.height}` : "-";
    const weightVal = athlete?.weight ? `${athlete.weight}` : "-";
    const bmrVal =
        latest_composition?.bmr !== undefined && latest_composition?.bmr !== null
            ? `${latest_composition.bmr}`
            : athlete?.bmr
              ? `${athlete.bmr}`
              : "-";

    // Group items by category
    const categoriesMap = {};
    (itemAnalysis || []).forEach((item) => {
        const cat = item.category || "General";
        if (!categoriesMap[cat]) {
            categoriesMap[cat] = [];
        }
        categoriesMap[cat].push(item);
    });

    const categoryNames = Object.keys(categoriesMap);

    const getScoreBadge = (score) => {
        const val = parseFloat(score);
        if (val >= 90)
            return {
                label: "Sangat Baik",
                color: "text-emerald-600",
            };
        if (val >= 80)
            return {
                label: "Baik",
                color: "text-teal-600",
            };
        if (val >= 70)
            return {
                label: "Cukup",
                color: "text-amber-600",
            };
        if (val >= 60)
            return {
                label: "Kurang",
                color: "text-orange-600",
            };
        return {
            label: "Sangat Kurang",
            color: "text-rose-600",
        };
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased print:bg-white print:p-0">
            <Head title={`Fitness Testing Report - ${athleteName}`} />

            {/* ─── ACTION BAR (HIDDEN IN PRINT) ─── */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs print:hidden">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#ea580c] transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={15} /> Kembali
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                            Format Cetak: A4 Portrait
                        </span>
                        <button
                            onClick={handlePrint}
                            className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-md font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                        >
                            <Printer size={15} /> Cetak / Simpan PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── PRINTABLE DOCUMENT CONTAINER (A4 PORTRAIT) ─── */}
            <div
                className="max-w-[794px] mx-auto my-6 p-7 bg-white shadow-xl border border-slate-300 print:m-0 print:p-6 print:border-none print:shadow-none print:w-full space-y-3"
                style={{ minHeight: "1122px" }}
            >
                {/* ─── 1. TOP MAIN HEADER BANNER ─── */}
                <div className="bg-white border-b-2 border-slate-900 pb-2.5 mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-black text-slate-900 uppercase tracking-tight leading-tight">
                            {sportName} PHYSICAL TEST REPORT
                        </h1>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                            Olympus Athlete Performance & Development System
                        </p>
                    </div>
                    <div className="flex items-center">
                        <img
                            src={clubLogo || "/assets/images/otslogo2.png"}
                            alt="OTS Logo"
                            className="h-16 w-auto object-contain"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    </div>
                </div>

                {/* ─── 2. MAIN 2-COLUMN LAYOUT ─── */}
                <div className="grid grid-cols-2 gap-3.5 items-start">
                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KIRI (LEFT COLUMN):
                        - ATHLETE PROFILE (RADAR CHART)
                        ═══════════════════════════════════════════════════════ */}
                    <div className="space-y-2.5">
                        {/* ── A. ATHLETE NAME BANNER & BOX ── */}
                        <div>
                            <div className="bg-[#ea580c] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider">
                                {athleteName}
                            </div>
                            <div className="border border-slate-800 flex flex-row bg-white">
                                {/* Photo / Silhouette */}
                                <div className="w-[36%] border-r border-slate-800 p-2 flex items-center justify-center bg-slate-50">
                                    {athlete?.profile_photo_url ? (
                                        <img
                                            src={athlete.profile_photo_url}
                                            alt={athlete.name}
                                            className="w-20 h-20 object-cover rounded-sm"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-black text-2xl">
                                            {athleteName.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Specs Table */}
                                <div className="w-[64%] text-xs divide-y divide-slate-800">
                                    <div className="flex divide-x divide-slate-800 min-h-[22px] items-center">
                                        <span className="w-[52%] px-2 py-1 bg-slate-50 font-bold text-[10px] text-slate-800">
                                            Sport
                                        </span>
                                        <span className="w-[48%] px-2 py-1 font-bold text-[11px] text-center text-slate-900 truncate">
                                            {stats?.sport || athlete?.sport?.name || "Volleyball"}
                                        </span>
                                    </div>
                                    <div className="flex divide-x divide-slate-800 min-h-[22px] items-center">
                                        <span className="w-[52%] px-2 py-1 bg-slate-50 font-bold text-[10px] text-slate-800">
                                            Age
                                        </span>
                                        <span className="w-[48%] px-2 py-1 font-bold text-[11px] text-center text-slate-900">
                                            {ageVal}
                                        </span>
                                    </div>
                                    <div className="flex divide-x divide-slate-800 min-h-[22px] items-center">
                                        <span className="w-[52%] px-2 py-1 bg-slate-50 font-bold text-[10px] text-slate-800">
                                            Height (cm)
                                        </span>
                                        <span className="w-[48%] px-2 py-1 font-bold text-[11px] text-center text-slate-900">
                                            {heightVal}
                                        </span>
                                    </div>
                                    <div className="flex divide-x divide-slate-800 min-h-[22px] items-center">
                                        <span className="w-[52%] px-2 py-1 bg-slate-50 font-bold text-[10px] text-slate-800">
                                            Weight (kg)
                                        </span>
                                        <span className="w-[48%] px-2 py-1 font-bold text-[11px] text-center text-slate-900">
                                            {weightVal}
                                        </span>
                                    </div>
                                    <div className="flex divide-x divide-slate-800 min-h-[22px] items-center">
                                        <span className="w-[52%] px-2 py-1 bg-slate-50 font-bold text-[10px] text-slate-800">
                                            BMR
                                        </span>
                                        <span className="w-[48%] px-2 py-1 font-bold text-[11px] text-center text-slate-900">
                                            {bmrVal}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── B. RADAR KATEGORI FISIK (SPIDER / RADAR CHART) ── */}
                        <div>
                            <div className="bg-[#ea580c] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider">
                                RADAR KATEGORI FISIK
                            </div>
                            <div className="border border-slate-800 bg-white p-1.5 h-[175px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="72%"
                                        data={
                                            (radarData && radarData.length >= 3
                                                ? radarData
                                                : [
                                                      { subject: "STRENGTH", A: 85 },
                                                      { subject: "POWER", A: 90 },
                                                      { subject: "AGILITY", A: 75 },
                                                      { subject: "SPEED", A: 95 },
                                                      { subject: "VOLLEYBALL", A: 80 },
                                                      { subject: "STABILITY", A: 70 },
                                                  ]
                                            ).map((d) => ({
                                                ...d,
                                                subjectWithScore: `${d.subject || d.name} (${d.A ?? d.score ?? 0})`,
                                            }))
                                        }
                                    >
                                        <PolarGrid stroke="#cbd5e1" strokeDasharray="2 2" />
                                        <PolarAngleAxis
                                            dataKey="subjectWithScore"
                                            tick={{
                                                fill: "#1e293b",
                                                fontSize: 8,
                                                fontWeight: "bold",
                                            }}
                                        />
                                        <PolarRadiusAxis
                                            angle={30}
                                            domain={[0, 100]}
                                            tick={false}
                                            axisLine={false}
                                        />
                                        <Radar
                                            name="Athlete"
                                            dataKey="A"
                                            stroke="#ea580c"
                                            strokeWidth={2}
                                            fill="#ea580c"
                                            fillOpacity={0.25}
                                            dot={{
                                                r: 3,
                                                fill: "#ea580c",
                                            }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* ── C. KOMPARASI SESI TERKINI (BAR CHART) ── */}
                        <div>
                            <div className="bg-[#ea580c] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider">
                                KOMPARASI SESI TERKINI
                            </div>
                            <div className="border border-slate-800 bg-white p-2.5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        Perbandingan kategori sesi terkini vs sebelumnya (0 – 100)
                                    </span>
                                    <div className="flex items-center gap-3 text-[9.5px]">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2.5 h-2.5 bg-slate-300 rounded-xs" />
                                            <span className="text-slate-500">Sesi Sebelumnya</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="w-2.5 h-2.5 bg-orange-500 rounded-xs" />
                                            <span className="font-bold text-orange-600">Sesi Terkini</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[140px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={
                                                comparisonData && comparisonData.length > 0
                                                    ? comparisonData.map((d) => ({
                                                          name: d.name,
                                                          previous: Number(d.previous || 0),
                                                          latest: Number(d.latest || 0),
                                                      }))
                                                    : [
                                                          { name: "Agility", previous: 56.2, latest: 100 },
                                                          { name: "Speed", previous: 97.0, latest: 75.6 },
                                                          { name: "Strength", previous: 32.4, latest: 93.3 },
                                                          { name: "Endurance", previous: 56.4, latest: 88.9 },
                                                      ]
                                            }
                                            margin={{ top: 12, right: 10, left: -25, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fill: "#334155", fontSize: 9, fontWeight: "bold" }}
                                                axisLine={{ stroke: "#cbd5e1" }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                ticks={[0, 25, 50, 75, 100]}
                                                tick={{ fill: "#94a3b8", fontSize: 8.5 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Bar dataKey="previous" fill="#cbd5e1" radius={[2, 2, 0, 0]} maxBarSize={16} />
                                            <Bar dataKey="latest" fill="#f97316" radius={[2, 2, 0, 0]} maxBarSize={16} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="border-t border-slate-100 pt-1.5 mt-1 text-[10px] text-slate-500">
                                    Total Kategori:{" "}
                                    <strong className="text-slate-800">
                                        {comparisonData?.length || 0} Elemen
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* ── D. STATUS MULTI-DOMAIN ASESMEN (2x2 BALANCED GRID) ── */}
                        <div>
                            <div className="bg-[#ea580c] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider">
                                STATUS MULTI-DOMAIN ASESMEN
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                                {/* Card 1: PHV & Pertumbuhan */}
                                <div className="border border-slate-800 bg-white flex flex-col justify-between">
                                    <div className="bg-slate-100 px-2 py-0.5 border-b border-slate-200 text-[9px] font-bold text-slate-800 uppercase tracking-wide text-center">
                                        PHV & PERTUMBUHAN
                                    </div>
                                    {latest_phv ? (
                                        <div className="grid grid-cols-3 gap-1 text-center p-1.5 text-[9px] my-auto">
                                            <div>
                                                <span className="text-[7.5px] font-bold text-slate-400 uppercase block">Offset</span>
                                                <strong className="text-slate-900 font-bold block">
                                                    {Number(latest_phv.maturity_offset).toFixed(1)} thn
                                                </strong>
                                            </div>
                                            <div>
                                                <span className="text-[7.5px] font-bold text-slate-400 uppercase block">Prediksi</span>
                                                <strong className="text-slate-900 font-bold block">
                                                    {latest_phv.predicted_adult_height || "-"} cm
                                                </strong>
                                            </div>
                                            <div>
                                                <span className="text-[7.5px] font-bold text-slate-400 uppercase block">Sisa Tumbuh</span>
                                                <strong className="text-orange-600 font-bold block">
                                                    +{latest_phv.remaining_growth || "-"} cm
                                                </strong>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-[8.5px] text-slate-400 italic py-3 my-auto">Belum ada data PHV</div>
                                    )}
                                </div>

                                {/* Card 2: Komposisi Tubuh */}
                                <div className="border border-slate-800 bg-white flex flex-col justify-between">
                                    <div className="bg-slate-100 px-2 py-0.5 border-b border-slate-200 text-[9px] font-bold text-slate-800 uppercase tracking-wide text-center">
                                        KOMPOSISI TUBUH
                                    </div>
                                    {latest_composition ? (
                                        <div className="p-1.5 space-y-1 text-[9px] my-auto">
                                            <div className="grid grid-cols-2 gap-1 text-center">
                                                <div>
                                                    <span className="text-[7.5px] font-bold text-slate-400 uppercase block">Body Fat</span>
                                                    <strong className="text-orange-600 font-bold block">
                                                        {latest_composition.body_fat_percentage ?? "-"}%
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span className="text-[7.5px] font-bold text-slate-400 uppercase block">Muscle</span>
                                                    <strong className="text-slate-900 font-bold block">
                                                        {latest_composition.muscle_mass ?? "-"} kg
                                                    </strong>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1 text-center">
                                                <div>
                                                    <span className="text-[7.5px] font-bold text-slate-400 uppercase block">BMR</span>
                                                    <strong className="text-slate-900 font-bold block">
                                                        {latest_composition.bmr ?? "-"} kcal
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span className="text-[7.5px] font-bold text-slate-400 uppercase block">Visceral</span>
                                                    <strong className="text-slate-900 font-bold block">
                                                        Lvl {latest_composition.visceral_fat_level ?? "-"}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-[8.5px] text-slate-400 italic py-3 my-auto">Belum ada data komposisi</div>
                                    )}
                                </div>

                                {/* Card 3: Beban Latihan & Wellness */}
                                <div className="border border-slate-800 bg-white flex flex-col justify-between">
                                    <div className="bg-slate-100 px-2 py-0.5 border-b border-slate-200 text-[9px] font-bold text-slate-800 uppercase tracking-wide text-center">
                                        BEBAN LATIHAN & WELLNESS
                                    </div>
                                    {latest_wellness ? (
                                        <div className="grid grid-cols-3 gap-1 text-center p-1.5 text-[9px] my-auto">
                                            <div>
                                                <span className="text-[7.5px] font-bold text-slate-400 uppercase block">Wellness</span>
                                                <strong className="text-emerald-600 font-bold block">
                                                    {latest_wellness.daily_wellness_score ?? "-"}/30
                                                </strong>
                                            </div>
                                            <div>
                                                <span className="text-[7.5px] font-bold text-slate-400 uppercase block">Session RPE</span>
                                                <strong className="text-slate-900 font-bold block">
                                                    {latest_wellness.session_rpe ?? "-"}/10
                                                </strong>
                                            </div>
                                            <div>
                                                <span className="text-[7.5px] font-bold text-slate-400 uppercase block">Daily Load</span>
                                                <strong className="text-orange-600 font-bold block">
                                                    {latest_wellness.daily_load ?? 0} AU
                                                </strong>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-[8.5px] text-slate-400 italic py-3 my-auto">Belum ada data wellness</div>
                                    )}
                                </div>

                                {/* Card 4: Postur Dinamis (DPA) */}
                                <div className="border border-slate-800 bg-white flex flex-col justify-between">
                                    <div className="bg-slate-100 px-2 py-0.5 border-b border-slate-200 text-[9px] font-bold text-slate-800 uppercase tracking-wide text-center">
                                        POSTUR DINAMIS (DPA)
                                    </div>
                                    {latest_dpa ? (
                                        <div className="p-2 text-center text-[9px] my-auto">
                                            <span className="text-[7.5px] font-bold text-slate-400 uppercase block">Hasil Postur</span>
                                            <strong className="text-slate-900 font-bold block mt-0.5">
                                                {latest_dpa.conclusion || "Normal"}
                                            </strong>
                                        </div>
                                    ) : (
                                        <div className="text-center text-[8.5px] text-slate-400 italic py-3 my-auto">Belum ada data postur (DPA)</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KANAN (RIGHT COLUMN):
                        - PERFORMANCE TRENDS TABLE
                        - ATHLETE FITNESS SCORES (GROUPED BY CATEGORY)
                        ═══════════════════════════════════════════════════════ */}
                    <div className="space-y-2.5">
                        {/* ── A. PERFORMANCE TRENDS (SKOR PER KATEGORI & TREND) ── */}
                        <div>
                            <div className="bg-[#ea580c] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider">
                                PERFORMANCE TRENDS
                            </div>
                            <div className="border border-slate-800 bg-white">
                                <table className="w-full text-left text-[9.5px]">
                                    <thead className="bg-slate-100 border-b border-slate-800 font-bold text-slate-800 uppercase text-[8.5px]">
                                        <tr>
                                            <th className="px-1.5 py-1">CATEGORY</th>
                                            <th className="px-1 py-1 text-center">PREV</th>
                                            <th className="px-1 py-1 text-center">CURRENT</th>
                                            <th className="px-1.5 py-1 text-center">CHANGE</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {(() => {
                                            let catTrends = [];
                                            if (comparisonData && comparisonData.length > 0) {
                                                catTrends = comparisonData.map((cd) => {
                                                    const prev = Number(cd.previous || 0);
                                                    const curr = Number(cd.latest || 0);
                                                    const diff = prev > 0 ? curr - prev : 0;
                                                    return {
                                                        name: cd.name,
                                                        prev: prev > 0 ? prev : null,
                                                        curr: curr,
                                                        change: diff,
                                                        hasPrev: prev > 0,
                                                    };
                                                });
                                            } else {
                                                const cNames =
                                                    categoryNames.length > 0
                                                        ? categoryNames
                                                        : ["STRENGTH", "POWER", "AGILITY", "SPEED", "SPORT", "STABILITY"];

                                                catTrends = cNames.map((cName) => {
                                                    const items = categoriesMap[cName] || [];
                                                    const currScores = items
                                                        .map((it) => Number(it.score))
                                                        .filter((s) => !isNaN(s) && s > 0);
                                                    const prevScores = items
                                                        .map((it) => Number(it.previous_score || it.previous_value))
                                                        .filter((s) => !isNaN(s) && s > 0);

                                                    const currAvg =
                                                        currScores.length > 0
                                                            ? currScores.reduce((a, b) => a + b, 0) / currScores.length
                                                            : 75;
                                                    const prevAvg =
                                                        prevScores.length > 0
                                                            ? prevScores.reduce((a, b) => a + b, 0) / prevScores.length
                                                            : null;

                                                    const diff = prevAvg !== null ? currAvg - prevAvg : 0;

                                                    return {
                                                        name: cName,
                                                        prev: prevAvg,
                                                        curr: currAvg,
                                                        change: diff,
                                                        hasPrev: prevAvg !== null,
                                                    };
                                                });
                                            }

                                            return catTrends.map((cat, idx) => {
                                                const isPositive = cat.change > 0;
                                                const isNegative = cat.change < 0;

                                                return (
                                                    <tr
                                                        key={idx}
                                                        className={idx % 2 === 1 ? "bg-slate-50/70" : "bg-white"}
                                                    >
                                                        <td className="px-1.5 py-0.5 font-bold text-slate-900 truncate max-w-[100px]">
                                                            {cat.name}
                                                        </td>
                                                        <td className="px-1 py-0.5 text-center text-slate-500">
                                                            {cat.hasPrev && cat.prev !== null
                                                                ? `${cat.prev.toFixed(1)}%`
                                                                : "-"}
                                                        </td>
                                                        <td className="px-1 py-0.5 text-center font-bold text-slate-900">
                                                            {cat.curr.toFixed(1)}%
                                                        </td>
                                                        <td
                                                            className={`px-1.5 py-0.5 text-center font-bold ${
                                                                !cat.hasPrev
                                                                    ? "text-slate-400"
                                                                    : isPositive
                                                                      ? "text-emerald-600"
                                                                      : isNegative
                                                                        ? "text-rose-600"
                                                                        : "text-slate-500"
                                                            }`}
                                                        >
                                                            {!cat.hasPrev
                                                                ? "-"
                                                                : `${isPositive ? "+" : ""}${cat.change.toFixed(1)}%`}
                                                        </td>
                                                    </tr>
                                                );
                                            });
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ── B. PHYSICAL TEST SCORE (BY CATEGORY) ── */}
                        <div>
                            <div className="bg-[#ea580c] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider">
                                PHYSICAL TEST SCORE
                            </div>

                            <div className="space-y-1.5 mt-1.5">
                                {(categoryNames.length > 0
                                    ? categoryNames
                                    : ["STRENGTH", "POWER", "AGILITY", "SPEED", "SPORT SPECIFIC", "STABILITY"]
                                ).map((catName, cIdx) => {
                                    const catItems =
                                        categoriesMap[catName] ||
                                        (catName === "STRENGTH"
                                            ? [
                                                  { name: "Chin Up", result_value: "13", score: 77 },
                                                  { name: "BF %", result_value: "5.7", score: 97 },
                                                  { name: "Lean Mass", result_value: "101", score: 77 },
                                              ]
                                            : catName === "POWER"
                                              ? [
                                                    { name: "Broad Jump", result_value: "297", score: 94 },
                                                    { name: "Jump Mat NCM", result_value: "30.5", score: 81 },
                                                    { name: "Jump Mat CMJ", result_value: "32.5", score: 88 },
                                                ]
                                              : catName === "AGILITY"
                                                ? [
                                                      { name: "Pro Agil R", result_value: "4.1", score: 85 },
                                                      { name: "Pro Agil L", result_value: "4.0", score: 87 },
                                                  ]
                                                : catName === "SPEED"
                                                  ? [{ name: "10m Sprint", result_value: "1.617", score: 100 }]
                                                  : catName === "SPORT SPECIFIC"
                                                    ? [
                                                          { name: "Approach Raw", result_value: "142", score: 100 },
                                                          { name: "Block Raw", result_value: "131.5", score: 97 },
                                                      ]
                                                    : [
                                                          { name: "FMS OHS", result_value: "2", score: 66 },
                                                          { name: "Dorsi-L", result_value: "5", score: 78 },
                                                          { name: "Dorsi-R", result_value: "5", score: 75 },
                                                      ]);

                                    return (
                                        <div key={cIdx} className="space-y-0.5">
                                            <h3 className="font-bold text-xs uppercase text-slate-900">
                                                {catName}
                                            </h3>
                                            <div className="border border-slate-800 bg-white">
                                                <table className="w-full text-left text-[9.5px]">
                                                    <thead className="bg-slate-100 border-b border-slate-800 font-bold text-slate-800 uppercase text-[8.5px]">
                                                        <tr>
                                                            <th className="px-1.5 py-0.5">ITEM TEST</th>
                                                            <th className="px-1 py-0.5 text-center">PREV</th>
                                                            <th className="px-1 py-0.5 text-center">CURRENT</th>
                                                            <th className="px-1 py-0.5 text-center">TARGET</th>
                                                            <th className="px-1 py-0.5 text-center">CHANGE</th>
                                                            <th className="px-1.5 py-0.5 text-center">RATING</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-200">
                                                        {catItems.map((item, rIdx) => {
                                                            const prevVal =
                                                                item.previous_value !== undefined && item.previous_value !== null && item.previous_value !== ""
                                                                    ? String(item.previous_value)
                                                                    : item.previous_result !== undefined && item.previous_result !== null && item.previous_result !== ""
                                                                      ? String(item.previous_result)
                                                                      : item.previous !== undefined && item.previous !== null && item.previous !== ""
                                                                        ? String(item.previous)
                                                                        : item.prev !== undefined && item.prev !== null && item.prev !== ""
                                                                          ? String(item.prev)
                                                                          : item.prev_0 !== undefined && item.prev_0 !== null && item.prev_0 !== "" && Number(item.prev_0) > 0
                                                                            ? String(item.prev_0)
                                                                            : "-";

                                                            const currVal =
                                                                item.result_value !== undefined && item.result_value !== null
                                                                    ? String(item.result_value)
                                                                    : item.result !== undefined && item.result !== null
                                                                      ? String(item.result)
                                                                      : "-";

                                                            const targetVal =
                                                                item.target_value !== undefined && item.target_value !== null
                                                                    ? String(item.target_value)
                                                                    : item.target !== undefined && item.target !== null
                                                                      ? String(item.target)
                                                                      : "-";

                                                            let growthNum = null;
                                                            if (item.growth !== undefined && item.growth !== null && item.growth !== "") {
                                                                growthNum = Number(item.growth);
                                                            } else if (item.growth_rate !== undefined && item.growth_rate !== null) {
                                                                growthNum = Number(item.growth_rate);
                                                            } else if (prevVal !== "-" && currVal !== "-") {
                                                                const p = parseFloat(prevVal);
                                                                const c = parseFloat(currVal);
                                                                if (!isNaN(p) && !isNaN(c) && p > 0) {
                                                                    growthNum = ((c - p) / p) * 100;
                                                                }
                                                            }

                                                            const hasGrowth = growthNum !== null && !isNaN(growthNum) && prevVal !== "-";
                                                            const isPositive = hasGrowth && growthNum > 0;
                                                            const isNegative = hasGrowth && growthNum < 0;

                                                            const scoreNum = item.score !== undefined && item.score !== null ? Number(item.score) : 75;
                                                            const ratingObj = getScoreBadge(scoreNum);

                                                            return (
                                                                <tr
                                                                    key={rIdx}
                                                                    className={
                                                                        rIdx % 2 === 1
                                                                            ? "bg-slate-50/70"
                                                                            : "bg-white"
                                                                    }
                                                                >
                                                                    <td className="px-1.5 py-0.5 font-bold text-slate-900 truncate max-w-[90px]">
                                                                        {item.name}
                                                                    </td>
                                                                    <td className="px-1 py-0.5 text-center text-slate-500">
                                                                        {prevVal}
                                                                    </td>
                                                                    <td className="px-1 py-0.5 text-center font-bold text-slate-900">
                                                                        {currVal}
                                                                    </td>
                                                                    <td className="px-1 py-0.5 text-center text-slate-500">
                                                                        {targetVal}
                                                                    </td>
                                                                    <td
                                                                        className={`px-1 py-0.5 text-center font-bold ${
                                                                            !hasGrowth
                                                                                ? "text-slate-400"
                                                                                : isPositive
                                                                                  ? "text-emerald-600"
                                                                                  : isNegative
                                                                                    ? "text-rose-600"
                                                                                    : "text-slate-500"
                                                                        }`}
                                                                    >
                                                                        {!hasGrowth
                                                                            ? "-"
                                                                            : `${isPositive ? "+" : ""}${growthNum.toFixed(1)}%`}
                                                                    </td>
                                                                    <td
                                                                        className={`px-1.5 py-0.5 text-center font-bold ${ratingObj.color}`}
                                                                    >
                                                                        {ratingObj.label}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── 3. GALERI BIOMETRIK (2-GRID HORIZONTAL CARDS) ─── */}
                <div className="mt-4" style={{ breakBefore: "page", pageBreakBefore: "always" }}>
                    <div className="bg-[#ea580c] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider">
                        GALERI BIOMETRIK & DOKUMENTASI FISIK
                    </div>
                    <div className="mt-2">
                        {galleries && galleries.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {galleries.map((photo, pIdx) => {
                                    const photoDate = photo.created_at
                                        ? new Date(photo.created_at).toLocaleDateString("id-ID", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                          })
                                        : "-";
                                    const imgSrc = resolveFullImageUrl(photo.image_path);

                                    return (
                                        <div
                                            key={pIdx}
                                            className="border border-slate-200 bg-white rounded-xs overflow-hidden flex flex-row shadow-2xs break-inside-avoid"
                                            style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                                        >
                                            <div className="w-[42%] h-44 bg-slate-100 border-r border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                                <img
                                                    src={imgSrc}
                                                    alt="Biometric"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="w-[58%] p-3 bg-slate-50 border-l border-slate-100 flex flex-col justify-start">
                                                <span className="font-bold text-slate-900 block text-[11px] mb-1">
                                                    {photoDate}
                                                </span>
                                                {photo.notes ? (
                                                    <p className="text-[10px] text-slate-700 leading-relaxed">
                                                        {photo.notes}
                                                    </p>
                                                ) : (
                                                    <p className="text-[9.5px] text-slate-400 italic">
                                                        Tidak ada catatan tambahan.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-3 text-center text-[9px] text-slate-400 italic border border-slate-200 bg-slate-50 rounded-xs">
                                Belum ada dokumentasi foto biometrik atlet
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── 4. BOTTOM FOOTER BAR ─── */}
                <div className="pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-600">
                    <span>
                        Olympus Training Surabaya - Generated: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="font-bold text-slate-900">
                        Hal 1 / 1
                    </span>
                </div>
            </div>
        </div>
    );
}
