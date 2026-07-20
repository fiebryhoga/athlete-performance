import React, { useState, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import {
    Ruler,
    Scale,
    Activity,
    User,
    Save,
    Info,
    AlertTriangle,
    ArrowRight,
    UserCircle,
    HeartPulse,
    ChevronDown,
} from "lucide-react";
import { getRemainingGrowth, phvLookupData } from "./PhvLookupTable";

// Mirwald PHV Formula
const calculateMaturityOffset = (
    gender,
    age,
    heightCm,
    weightKg,
    sittingHeightCm,
    legLengthCm,
) => {
    const height = heightCm;
    const weight = weightKg;
    const sittingHeight = sittingHeightCm;
    const legLength = legLengthCm;

    let mo = 0;

    if (gender === "male" || gender === "Laki-laki") {
        mo =
            -9.236 +
            0.0002708 * legLength * sittingHeight -
            0.001663 * age * legLength +
            0.007216 * age * sittingHeight +
            0.02292 * ((weight / height) * 100);
    } else {
        mo =
            -9.376 +
            0.0001882 * legLength * sittingHeight +
            0.0022 * age * legLength +
            0.005841 * age * sittingHeight -
            0.002658 * age * weight +
            0.07693 * ((weight / height) * 100);
    }

    return mo;
};

export default function Form({ auth, athlete, assessment }) {
    const isEditing = !!assessment;

    const defaultGender =
        athlete.gender === "Perempuan" || athlete.gender === "female"
            ? "female"
            : "male";

    const { data, setData, post, put, processing, errors, recentlySuccessful } =
        useForm({
            assessment_date:
                assessment?.assessment_date ||
                new Date().toISOString().split("T")[0],
            gender: defaultGender,
            age: assessment?.age || athlete.age || "",
            weight: assessment?.weight || athlete.weight || "",
            standing_height:
                assessment?.standing_height || athlete.height || "",
            sitting_height: assessment?.sitting_height || "",
            leg_length: assessment?.leg_length || "",
            maturity_offset: assessment?.maturity_offset || "",
            phv_age: assessment?.phv_age || "",
            maturity_status: assessment?.maturity_status || "",
            remaining_growth: assessment?.remaining_growth || "",
            predicted_adult_height: assessment?.predicted_adult_height || "",
            adult_height_percentage: assessment?.adult_height_percentage || "",
        });

    const [result, setResult] = useState(
        assessment
            ? {
                  mo: assessment.maturity_offset,
                  phvAge: assessment.phv_age,
                  status: assessment.maturity_status,
                  remGrowth: assessment.remaining_growth,
                  adultHeight: assessment.predicted_adult_height,
                  percentage: assessment.adult_height_percentage,
              }
            : null,
    );

    const [manualMaturity, setManualMaturity] = useState(null);

    const handleHeightOrSittingChange = (field, value) => {
        const newData = { ...data, [field]: value };
        const height = parseFloat(newData.standing_height);
        const sitting = parseFloat(newData.sitting_height);

        if (height > 0 && sitting > 0 && sitting < height) {
            const calculatedLeg = (height - sitting).toFixed(1);
            if (!newData.leg_length || newData.leg_length === "") {
                newData.leg_length = calculatedLeg;
            }
        }
        setData(newData);
    };

    useEffect(() => {
        if (
            data.age &&
            data.weight &&
            data.standing_height &&
            data.sitting_height &&
            data.leg_length
        ) {
            const age = parseFloat(data.age);
            const height = parseFloat(data.standing_height);
            const weight = parseFloat(data.weight);
            const sitting = parseFloat(data.sitting_height);
            const leg = parseFloat(data.leg_length);

            if (age > 0 && height > 0 && weight > 0 && sitting > 0 && leg > 0) {
                const mo = calculateMaturityOffset(
                    data.gender,
                    age,
                    height,
                    weight,
                    sitting,
                    leg,
                );
                const phvAge = age - mo;

                let status = "Average";
                if (data.gender === "male") {
                    if (phvAge < 13.0) status = "Early";
                    else if (phvAge > 15.0) status = "Late";
                } else {
                    if (phvAge < 11.0) status = "Early";
                    else if (phvAge > 13.0) status = "Late";
                }

                const offsetToUse =
                    manualMaturity !== null ? parseFloat(manualMaturity) : mo;
                const remGrowth = getRemainingGrowth(offsetToUse, status);

                const adultHeight = height + remGrowth;
                const percentage = (height / adultHeight) * 100;

                setResult({
                    mo: mo.toFixed(2),
                    phvAge: phvAge.toFixed(2),
                    status: status,
                    remGrowth: remGrowth.toFixed(2),
                    adultHeight: adultHeight.toFixed(1),
                    percentage: percentage.toFixed(2),
                });

                setData((prev) => ({
                    ...prev,
                    maturity_offset: mo.toFixed(2),
                    phv_age: phvAge.toFixed(2),
                    maturity_status: status,
                    remaining_growth: remGrowth.toFixed(2),
                    predicted_adult_height: adultHeight.toFixed(1),
                    adult_height_percentage: percentage.toFixed(2),
                }));
            }
        }
    }, [
        data.age,
        data.weight,
        data.standing_height,
        data.sitting_height,
        data.leg_length,
        data.gender,
        manualMaturity,
    ]);

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.phv-calculator.update", assessment.id));
        } else {
            post(route("admin.phv-calculator.store", athlete.id));
        }
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={isEditing ? "Edit PHV" : "Kalkulator PHV Baru"} />

            <div className="pb-8">
                <div className="mx-auto">
                    <PageHeader
                        title={
                            isEditing
                                ? "Edit Kalkulasi PHV"
                                : "Kalkulator PHV Baru"
                        }
                        subtitle={`Untuk Profil: ${athlete.name}`}
                        icon={HeartPulse}
                        badge="Tools"
                        actions={
                            <Link
                                href={route(
                                    "admin.phv-calculator.show",
                                    athlete.id,
                                )}
                                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </Link>
                        }
                    />

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* LEFT COLUMN: Input Form */}
                        <div className="w-full lg:w-5/12 flex flex-col gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <UserCircle className="w-5 h-5 text-orange-500" />
                                    Data Atlet & Pengukuran
                                </h3>

                                <form onSubmit={submit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Atlet
                                        </label>
                                        <div className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-lg px-4 py-2.5 font-semibold">
                                            {athlete.name}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Tanggal Asesmen
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5"
                                            value={data.assessment_date}
                                            onChange={(e) =>
                                                setData(
                                                    "assessment_date",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Gender
                                            </label>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-4 py-2.5"
                                                value={data.gender}
                                                disabled
                                            >
                                                <option value="male">
                                                    Boys
                                                </option>
                                                <option value="female">
                                                    Girls
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Usia (Tahun)
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5"
                                                value={data.age}
                                                onChange={(e) =>
                                                    setData(
                                                        "age",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="20"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Tinggi Badan (cm)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5"
                                                value={data.standing_height}
                                                onChange={(e) =>
                                                    handleHeightOrSittingChange(
                                                        "standing_height",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="170"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Berat Badan (kg)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5"
                                                value={data.weight}
                                                onChange={(e) =>
                                                    setData(
                                                        "weight",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="70"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Tinggi Duduk (cm)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 placeholder:opacity-20 font-medium"
                                                value={data.sitting_height}
                                                onChange={(e) =>
                                                    handleHeightOrSittingChange(
                                                        "sitting_height",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="70"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Panjang Tungkai (cm)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 font-semibold text-slate-800 placeholder:opacity-20"
                                                value={data.leg_length}
                                                onChange={(e) =>
                                                    setData(
                                                        "leg_length",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="90"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200 mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing || !result}
                                            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-orange-500/20"
                                        >
                                            <Save className="w-4 h-4" />
                                            {isEditing
                                                ? "Update Hasil"
                                                : "Simpan Hasil"}
                                        </button>
                                    </div>

                                    {recentlySuccessful && (
                                        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium mt-3 border border-green-200">
                                            Berhasil disimpan!
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Results */}
                        <div className="w-full lg:w-7/12 flex flex-col gap-6">
                            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-slate-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <Activity className="text-orange-500 w-6 h-6" />
                                        Hasil & Proyeksi
                                    </h3>

                                    {result && (
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                                                Maturity:
                                            </label>
                                            <select
                                                className="bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-md px-10 py-1.5 text-sm"
                                                value={
                                                    manualMaturity !== null
                                                        ? manualMaturity
                                                        : Math.round(
                                                              parseFloat(
                                                                  result.mo,
                                                              ) * 10,
                                                          ) / 10
                                                }
                                                onChange={(e) =>
                                                    setManualMaturity(
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option
                                                    value={
                                                        Math.round(
                                                            parseFloat(
                                                                result.mo,
                                                            ) * 10,
                                                        ) / 10
                                                    }
                                                >
                                                    Auto (
                                                    {Math.round(
                                                        parseFloat(result.mo) *
                                                            10,
                                                    ) / 10}
                                                    )
                                                </option>
                                                {phvLookupData.map((row) => (
                                                    <option
                                                        key={row.years}
                                                        value={row.years}
                                                    >
                                                        {row.years}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {!result ? (
                                    <div className="text-slate-400 py-10 text-center flex flex-col items-center">
                                        <Info className="w-10 h-10 mb-3 opacity-50" />
                                        <p>
                                            Silakan lengkapi formulir di sebelah
                                            kiri untuk melihat hasil prediksi.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center bg-slate-50 rounded-xl p-6 border border-slate-200">
                                            <div className="text-center w-1/2">
                                                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">
                                                    <Activity className="w-4 h-4" />{" "}
                                                    Maturity
                                                </div>
                                                <div className="flex items-baseline justify-center gap-2">
                                                    <span className="text-5xl font-bold text-slate-800">
                                                        {Number(
                                                            result.mo,
                                                        ).toFixed(1)}
                                                    </span>
                                                </div>
                                                <span className="text-slate-500 font-medium text-sm">
                                                    years from PHV
                                                </span>
                                            </div>

                                            <div className="h-16 w-px bg-slate-300 hidden sm:block"></div>

                                            <div className="text-center w-1/2">
                                                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">
                                                    <Info className="w-4 h-4" />{" "}
                                                    Age at PHV
                                                </div>
                                                <div className="flex items-baseline justify-center gap-2">
                                                    <span className="text-4xl font-bold text-slate-800">
                                                        {result.phvAge}
                                                    </span>
                                                    <span className="text-slate-500 font-medium">
                                                        years
                                                    </span>
                                                </div>
                                                <span className="text-xs font-bold px-2 py-1 bg-slate-200 text-slate-700 rounded mt-2 inline-block uppercase tracking-widest">
                                                    {result.status} MATURER
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                                <span className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Predicted Growth Remain</span>
                                                <div className="flex items-baseline gap-1 mt-1">
                                                    <span className="text-2xl font-bold text-slate-800">
                                                        {result.remGrowth}
                                                    </span>
                                                    <span className="text-slate-500 font-medium text-sm">
                                                        cm
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                                <span className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Predicted Adult Height</span>
                                                <div className="flex items-baseline gap-1 mt-1">
                                                    <span className="text-2xl font-bold text-slate-800">
                                                        {result.adultHeight}
                                                    </span>
                                                    <span className="text-slate-500 font-medium text-sm">
                                                        cm
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                                <span className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Current % Adult Height</span>
                                                <div className="flex items-baseline gap-1 mt-1">
                                                    <span className="text-2xl font-bold text-slate-800">
                                                        {result.percentage}
                                                    </span>
                                                    <span className="text-slate-500 font-medium text-sm">
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
