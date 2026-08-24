import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { HeartPulse, UserCircle, Save, Activity, Info } from "lucide-react";
import "axios";
const phvLookupData = [
  { years: -3, early: 39.69, average: 35.04, late: 30.27 },
  { years: -2.9, early: 39.1, average: 34.544, late: 29.83 },
  { years: -2.8, early: 38.51, average: 34.048, late: 29.39 },
  { years: -2.7, early: 37.92, average: 33.552, late: 28.95 },
  { years: -2.6, early: 37.33, average: 33.056, late: 28.51 },
  { years: -2.5, early: 36.74, average: 32.56, late: 28.07 },
  { years: -2.4, early: 36.15, average: 32.064, late: 27.63 },
  { years: -2.3, early: 35.56, average: 31.559, late: 27.157 },
  { years: -2.2, early: 34.97, average: 31.054, late: 26.684 },
  { years: -2.1, early: 34.38, average: 30.549, late: 26.211 },
  { years: -2, early: 33.79, average: 30.044, late: 25.738 },
  { years: -1.9, early: 33.2, average: 29.539, late: 25.265 },
  { years: -1.8, early: 32.61, average: 29.034, late: 24.792 },
  { years: -1.7, early: 32, average: 28.468, late: 24.235 },
  { years: -1.6, early: 31.39, average: 27.902, late: 23.678 },
  { years: -1.5, early: 30.784, average: 27.336, late: 23.121 },
  { years: -1.4, early: 30.178, average: 26.77, late: 22.564 },
  { years: -1.3, early: 29.572, average: 26.204, late: 22.007 },
  { years: -1.2, early: 28.966, average: 25.638, late: 21.45 },
  { years: -1.1, early: 28.25, average: 24.951, late: 20.822 },
  { years: -1, early: 27.534, average: 24.264, late: 20.194 },
  { years: -0.9, early: 26.818, average: 23.577, late: 19.566 },
  { years: -0.8, early: 26.102, average: 22.89, late: 18.938 },
  { years: -0.7, early: 25.386, average: 22.203, late: 18.31 },
  { years: -0.6, early: 24.67, average: 21.516, late: 17.682 },
  { years: -0.5, early: 23.73, average: 20.624, late: 16.91 },
  { years: -0.4, early: 22.79, average: 19.732, late: 16.138 },
  { years: -0.3, early: 21.85, average: 18.84, late: 15.366 },
  { years: -0.2, early: 20.91, average: 17.948, late: 14.594 },
  { years: -0.1, early: 19.97, average: 17.056, late: 13.822 },
  { years: 0, early: 18.965, average: 16.164, late: 13.05 },
  { years: 0.1, early: 17.96, average: 15.246, late: 12.253 },
  { years: 0.2, early: 16.955, average: 14.328, late: 11.456 },
  { years: 0.3, early: 15.95, average: 13.41, late: 10.659 },
  { years: 0.4, early: 14.945, average: 12.492, late: 9.862 },
  { years: 0.5, early: 13.94, average: 11.574, late: 9.065 },
  { years: 0.6, early: 12.935, average: 10.656, late: 8.268 },
  { years: 0.7, early: 12.155, average: 9.979, late: 7.646 },
  { years: 0.8, early: 11.375, average: 9.302, late: 7.024 },
  { years: 0.9, early: 10.595, average: 8.625, late: 6.402 },
  { years: 1, early: 9.815, average: 7.948, late: 5.78 },
  { years: 1.1, early: 9.035, average: 7.271, late: 5.158 },
  { years: 1.2, early: 8.255, average: 6.594, late: 4.536 },
  { years: 1.3, early: 7.725, average: 6.129, late: 4.099 },
  { years: 1.4, early: 7.195, average: 5.664, late: 3.662 },
  { years: 1.5, early: 6.665, average: 5.199, late: 3.225 },
  { years: 1.6, early: 6.135, average: 4.734, late: 2.788 },
  { years: 1.7, early: 5.605, average: 4.269, late: 2.351 },
  { years: 1.8, early: 5.075, average: 3.804, late: 1.914 },
  { years: 1.9, early: 4.705, average: 3.497, late: 1.691 },
  { years: 2, early: 4.335, average: 3.19, late: 1.468 },
  { years: 2.1, early: 3.965, average: 2.883, late: 1.245 },
  { years: 2.2, early: 3.595, average: 2.576, late: 1.022 },
  { years: 2.3, early: 3.225, average: 2.269, late: 0.799 },
  { years: 2.4, early: 2.855, average: 1.962, late: 0.576 },
  { years: 2.5, early: 2.605, average: 1.78, late: 0.48 },
  { years: 2.6, early: 2.355, average: 1.598, late: 0.384 },
  { years: 2.7, early: 2.105, average: 1.416, late: 0.288 },
  { years: 2.8, early: 1.855, average: 1.234, late: 0.192 },
  { years: 2.9, early: 1.605, average: 1.052, late: 0.096 },
  { years: 3, early: 1.355, average: 0.87, late: 0 }
];
const getRemainingGrowth = (maturityOffset, maturityStatus) => {
  if (maturityOffset < -3) maturityOffset = -3;
  if (maturityOffset > 3) maturityOffset = 3;
  const roundedOffset = Math.round(maturityOffset * 10) / 10;
  let closestRow = phvLookupData[0];
  let minDiff = Infinity;
  for (const row of phvLookupData) {
    const diff = Math.abs(row.years - roundedOffset);
    if (diff < minDiff) {
      minDiff = diff;
      closestRow = row;
    }
  }
  if (maturityStatus === "Early") return closestRow.early;
  if (maturityStatus === "Late") return closestRow.late;
  return closestRow.average;
};
const isMaleGender = (g) => {
  if (!g) return true;
  const clean = String(g).trim().toUpperCase();
  return clean === "MALE" || clean === "LAKI-LAKI" || clean === "L" || clean === "M" || clean === "BOYS" || clean === "BOY";
};
const isFemaleGender = (g) => {
  if (!g) return false;
  const clean = String(g).trim().toUpperCase();
  return clean === "FEMALE" || clean === "PEREMPUAN" || clean === "P" || clean === "F" || clean === "GIRLS" || clean === "GIRL";
};
const calculateMaturityOffset = (gender, age, heightCm, weightKg, sittingHeightCm, legLengthCm) => {
  const height = heightCm;
  const weight = weightKg;
  const sittingHeight = sittingHeightCm;
  const legLength = legLengthCm;
  let mo = 0;
  if (isMaleGender(gender)) {
    mo = -9.236 + 2708e-7 * legLength * sittingHeight - 1663e-6 * age * legLength + 7216e-6 * age * sittingHeight + 0.02292 * (weight / height * 100);
  } else {
    mo = -9.376 + 1882e-7 * legLength * sittingHeight + 22e-4 * age * legLength + 5841e-6 * age * sittingHeight - 2658e-6 * age * weight + 0.07693 * (weight / height * 100);
  }
  return mo;
};
function Form({ auth, athlete, assessment }) {
  const isEditing = !!assessment;
  const defaultGender = isFemaleGender(athlete?.gender) ? "female" : "male";
  const { data, setData, post, put, processing, errors, recentlySuccessful } = useForm({
    assessment_date: assessment?.assessment_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    gender: defaultGender,
    age: assessment?.age || athlete.age || "",
    weight: assessment?.weight || athlete.weight || "",
    standing_height: assessment?.standing_height || athlete.height || "",
    sitting_height: assessment?.sitting_height || "",
    leg_length: assessment?.leg_length || "",
    maturity_offset: assessment?.maturity_offset || "",
    phv_age: assessment?.phv_age || "",
    maturity_status: assessment?.maturity_status || "",
    remaining_growth: assessment?.remaining_growth || "",
    predicted_adult_height: assessment?.predicted_adult_height || "",
    adult_height_percentage: assessment?.adult_height_percentage || ""
  });
  const [result, setResult] = useState(
    assessment ? {
      mo: assessment.maturity_offset,
      phvAge: assessment.phv_age,
      status: assessment.maturity_status,
      remGrowth: assessment.remaining_growth,
      adultHeight: assessment.predicted_adult_height,
      percentage: assessment.adult_height_percentage
    } : null
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
    if (data.age && data.weight && data.standing_height && data.sitting_height && data.leg_length) {
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
          leg
        );
        const phvAge = age - mo;
        let status = "Average";
        if (isMaleGender(data.gender)) {
          if (phvAge < 13) status = "Early";
          else if (phvAge > 15) status = "Late";
        } else {
          if (phvAge < 11) status = "Early";
          else if (phvAge > 13) status = "Late";
        }
        const offsetToUse = manualMaturity !== null ? parseFloat(manualMaturity) : mo;
        const remGrowth = getRemainingGrowth(offsetToUse, status);
        const adultHeight = height + remGrowth;
        const percentage = height / adultHeight * 100;
        setResult({
          mo: mo.toFixed(2),
          phvAge: phvAge.toFixed(2),
          status,
          remGrowth: remGrowth.toFixed(2),
          adultHeight: adultHeight.toFixed(1),
          percentage: percentage.toFixed(2)
        });
        setData((prev) => ({
          ...prev,
          maturity_offset: mo.toFixed(2),
          phv_age: phvAge.toFixed(2),
          maturity_status: status,
          remaining_growth: remGrowth.toFixed(2),
          predicted_adult_height: adultHeight.toFixed(1),
          adult_height_percentage: percentage.toFixed(2)
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
    manualMaturity
  ]);
  const submit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(route("admin.phv-calculator.update", assessment.id));
    } else {
      post(route("admin.phv-calculator.store", athlete.id));
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: isEditing ? "Edit PHV" : "Kalkulator PHV Baru" }),
    /* @__PURE__ */ jsx("div", { className: "pb-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: isEditing ? "Edit Kalkulasi PHV" : "Kalkulator PHV Baru",
          subtitle: `Untuk Profil: ${athlete.name}`,
          icon: HeartPulse,
          badge: "Tools",
          actions: /* @__PURE__ */ jsx(
            Link,
            {
              href: route(
                "admin.phv-calculator.show",
                athlete.id
              ),
              className: "px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200 transition-colors",
              children: "Batal"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full lg:w-5/12 flex flex-col gap-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-6 shadow-sm border border-slate-200", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-slate-800 mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(UserCircle, { className: "w-5 h-5 text-orange-500" }),
            "Data Atlet & Pengukuran"
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Atlet" }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-lg px-4 py-2.5 font-semibold", children: athlete.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Tanggal Asesmen" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  className: "w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5",
                  value: data.assessment_date,
                  onChange: (e) => setData(
                    "assessment_date",
                    e.target.value
                  ),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Jenis Kelamin" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: "w-full bg-white border border-slate-300 text-slate-800 rounded-lg px-4 py-2.5",
                    value: data.gender,
                    onChange: (e) => setData(
                      "gender",
                      e.target.value
                    ),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "male", children: "Laki-laki (Boys)" }),
                      /* @__PURE__ */ jsx("option", { value: "female", children: "Perempuan (Girls)" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Usia (Tahun)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    className: "w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5",
                    value: data.age,
                    onChange: (e) => setData(
                      "age",
                      e.target.value
                    ),
                    placeholder: "20",
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Tinggi Badan (cm)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.1",
                    className: "w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5",
                    value: data.standing_height,
                    onChange: (e) => handleHeightOrSittingChange(
                      "standing_height",
                      e.target.value
                    ),
                    placeholder: "170",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Berat Badan (kg)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.1",
                    className: "w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5",
                    value: data.weight,
                    onChange: (e) => setData(
                      "weight",
                      e.target.value
                    ),
                    placeholder: "70",
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Tinggi Duduk (cm)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.1",
                    className: "w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 placeholder:opacity-20 font-medium",
                    value: data.sitting_height,
                    onChange: (e) => handleHeightOrSittingChange(
                      "sitting_height",
                      e.target.value
                    ),
                    placeholder: "70",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Panjang Tungkai (cm)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    step: "0.1",
                    className: "w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 font-semibold text-slate-800 placeholder:opacity-20",
                    value: data.leg_length,
                    onChange: (e) => setData(
                      "leg_length",
                      e.target.value
                    ),
                    placeholder: "90",
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-slate-200 mt-6 flex justify-end", children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: processing || !result,
                className: "px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-orange-500/20",
                children: [
                  /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                  isEditing ? "Update Hasil" : "Simpan Hasil"
                ]
              }
            ) }),
            recentlySuccessful && /* @__PURE__ */ jsx("div", { className: "p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium mt-3 border border-green-200", children: "Berhasil disimpan!" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "w-full lg:w-7/12 flex flex-col gap-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-slate-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-slate-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Activity, { className: "text-orange-500 w-6 h-6" }),
              "Hasil & Proyeksi"
            ] }),
            result && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-slate-600 uppercase tracking-wider", children: "Maturity:" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-md px-10 py-1.5 text-sm",
                  value: manualMaturity !== null ? manualMaturity : Math.round(
                    parseFloat(
                      result.mo
                    ) * 10
                  ) / 10,
                  onChange: (e) => setManualMaturity(
                    e.target.value
                  ),
                  children: [
                    /* @__PURE__ */ jsxs(
                      "option",
                      {
                        value: Math.round(
                          parseFloat(
                            result.mo
                          ) * 10
                        ) / 10,
                        children: [
                          "Auto (",
                          Math.round(
                            parseFloat(result.mo) * 10
                          ) / 10,
                          ")"
                        ]
                      }
                    ),
                    phvLookupData.map((row) => /* @__PURE__ */ jsx(
                      "option",
                      {
                        value: row.years,
                        children: row.years
                      },
                      row.years
                    ))
                  ]
                }
              )
            ] })
          ] }),
          !result ? /* @__PURE__ */ jsxs("div", { className: "text-slate-400 py-10 text-center flex flex-col items-center", children: [
            /* @__PURE__ */ jsx(Info, { className: "w-10 h-10 mb-3 opacity-50" }),
            /* @__PURE__ */ jsx("p", { children: "Silakan lengkapi formulir di sebelah kiri untuk melihat hasil prediksi." })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-6 justify-between items-center bg-slate-50 rounded-xl p-6 border border-slate-200", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center w-1/2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mb-2", children: [
                  /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4" }),
                  " ",
                  "Maturity"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-baseline justify-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "text-5xl font-bold text-slate-800", children: Number(
                  result.mo
                ).toFixed(1) }) }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium text-sm", children: "years from PHV" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-16 w-px bg-slate-300 hidden sm:block" }),
              /* @__PURE__ */ jsxs("div", { className: "text-center w-1/2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mb-2", children: [
                  /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
                  " ",
                  "Age at PHV"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-4xl font-bold text-slate-800", children: result.phvAge }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "years" })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold px-2 py-1 bg-slate-200 text-slate-700 rounded mt-2 inline-block uppercase tracking-widest", children: [
                  result.status,
                  " MATURER"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider", children: "Predicted Growth Remain" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 mt-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-slate-800", children: result.remGrowth }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium text-sm", children: "cm" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider", children: "Predicted Adult Height" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 mt-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-slate-800", children: result.adultHeight }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium text-sm", children: "cm" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider", children: "Current % Adult Height" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 mt-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-slate-800", children: result.percentage }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium text-sm", children: "%" })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  Form as default
};
