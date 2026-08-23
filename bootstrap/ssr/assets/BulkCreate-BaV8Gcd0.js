import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ChevronLeft, UploadCloud, Info, Plus, X, Save } from "lucide-react";
import "axios";
function BulkCreate() {
  const { data, setData, post, processing, errors } = useForm({
    users: [
      { id: 1, name: "", username: "", password: "", age: "", weight: "", height: "", gender: "L" }
    ]
  });
  const [counter, setCounter] = useState(2);
  const addRow = () => {
    setData("users", [
      ...data.users,
      { id: counter, name: "", username: "", password: "", age: "", weight: "", height: "", gender: "L" }
    ]);
    setCounter((c) => c + 1);
  };
  const removeRow = (id) => {
    if (data.users.length <= 1) return;
    setData("users", data.users.filter((row) => row.id !== id));
  };
  const updateRow = (id, field, value) => {
    const newUsers = data.users.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setData("users", newUsers);
  };
  const handlePaste = (e, targetRowId) => {
    const pastedData = e.clipboardData.getData("Text");
    if (!pastedData || !pastedData.includes("	") && !pastedData.includes("\n")) {
      return;
    }
    e.preventDefault();
    const rows = pastedData.split(/\r?\n/).filter((row) => row.trim() !== "");
    const newUsers = [...data.users];
    const targetIndex = newUsers.findIndex((r) => r.id === targetRowId);
    if (targetIndex === -1) return;
    let currentCounter = counter;
    const newRowsToAdd = [];
    let startIndex = 0;
    const firstCols = rows[0].split("	");
    if (firstCols[0] && firstCols[0].toLowerCase().includes("nama")) {
      startIndex = 1;
    }
    for (let i = startIndex; i < rows.length; i++) {
      const cols = rows[i].split("	");
      const name = cols[0] ? cols[0].trim() : "";
      const username = cols[1] ? cols[1].trim() : "";
      const password = cols[2] ? cols[2].trim() : "";
      const age = cols[3] ? cols[3].trim() : "";
      const weight = cols[4] ? cols[4].trim() : "";
      const height = cols[5] ? cols[5].trim() : "";
      const gender = cols[6] && cols[6].trim().toUpperCase() === "P" ? "P" : "L";
      const rowIndex = targetIndex + (i - startIndex);
      if (rowIndex < newUsers.length) {
        if (!newUsers[rowIndex].name) {
          newUsers[rowIndex].name = name;
          newUsers[rowIndex].username = username;
          newUsers[rowIndex].password = password;
          newUsers[rowIndex].age = age;
          newUsers[rowIndex].weight = weight;
          newUsers[rowIndex].height = height;
          newUsers[rowIndex].gender = gender;
        } else {
          newRowsToAdd.push({
            id: currentCounter++,
            name,
            username,
            password,
            age,
            weight,
            height,
            gender
          });
        }
      } else {
        newRowsToAdd.push({
          id: currentCounter++,
          name,
          username,
          password,
          age,
          weight,
          height,
          gender
        });
      }
    }
    setData("users", [...newUsers, ...newRowsToAdd]);
    setCounter(currentCounter);
  };
  const submit = (e) => {
    e.preventDefault();
    const validUsers = data.users.filter((u) => u.name.trim() !== "");
    if (validUsers.length === 0) {
      alert("Harap isi setidaknya satu nama klien.");
      return;
    }
    post(route("admin.users.bulk"), {
      forceFormData: true,
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Bulk Create Klien", children: [
    /* @__PURE__ */ jsx(Head, { title: "Buat Klien Massal" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 mx-auto max-w-[1400px]", children: [
      /* @__PURE__ */ jsxs(Link, { href: route("admin.users.index"), className: "inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
        " Kembali ke Manajemen Klien"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-white border border-slate-200 rounded-xl shadow-sm", children: /* @__PURE__ */ jsx(UploadCloud, { size: 24, className: "text-orange-500" }) }),
        "Buat Klien (Bulk)"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: "Buat banyak klien sekaligus dengan cepat. Copy dari Excel dan Paste langsung ke dalam tabel." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto space-y-6 max-w-[1400px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-slate-600 text-sm shadow-sm", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-slate-400 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("p", { className: "mb-1", children: [
            /* @__PURE__ */ jsx("strong", { children: "Petunjuk:" }),
            " Anda dapat menempel (paste) data dari Excel. Kolom harus berurutan: ",
            /* @__PURE__ */ jsx("strong", { children: "Nama (Wajib) | Username | Password | Umur | BB | TB | Gender (L/P)" }),
            "."
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
            "Klik pada kotak masukan ",
            /* @__PURE__ */ jsx("strong", { children: "Nama" }),
            " di baris kosong, lalu tekan ",
            /* @__PURE__ */ jsx("strong", { children: "Ctrl+V" }),
            " (atau Cmd+V). Sistem akan otomatis mengisi baris ke bawah. Jika Username dikosongkan, sistem akan otomatis men-generate-nya. Jika password dikosongkan, defaultnya adalah ",
            /* @__PURE__ */ jsx("strong", { children: "12345678" }),
            "."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-bold text-slate-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "bg-orange-500 text-white text-xs px-2 py-0.5 rounded-md", children: data.users.length }),
              " Baris Data"
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: addRow,
                className: "flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(Plus, { size: 14 }),
                  " Tambah Baris"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse min-w-[1000px]", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 w-12 text-center", children: "No" }),
              /* @__PURE__ */ jsxs("th", { className: "px-4 py-3 min-w-[200px]", children: [
                "Nama ",
                /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 min-w-[150px]", children: "Username" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 min-w-[150px]", children: "Password" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 w-24 text-center", children: "Umur" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 w-24 text-center", children: "BB (kg)" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 w-24 text-center", children: "TB (cm)" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 w-32", children: "Gender" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 w-16 text-center", children: "Action" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 bg-white", children: data.users.map((row, index) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center text-xs font-medium text-slate-400", children: index + 1 }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: row.name,
                    onPaste: (e) => handlePaste(e, row.id),
                    onChange: (e) => updateRow(row.id, "name", e.target.value),
                    placeholder: "Nama Klien",
                    className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                  }
                ),
                errors[`users.${index}.name`] && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-rose-500 mt-1 font-medium", children: errors[`users.${index}.name`] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: row.username,
                  onChange: (e) => updateRow(row.id, "username", e.target.value),
                  placeholder: "Auto-generate",
                  className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: row.password,
                  onChange: (e) => updateRow(row.id, "password", e.target.value),
                  placeholder: "12345678",
                  className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: row.age,
                  onChange: (e) => updateRow(row.id, "age", e.target.value),
                  placeholder: "-",
                  className: "w-full bg-white text-center border border-slate-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.1",
                  value: row.weight,
                  onChange: (e) => updateRow(row.id, "weight", e.target.value),
                  placeholder: "-",
                  className: "w-full bg-white text-center border border-slate-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.1",
                  value: row.height,
                  onChange: (e) => updateRow(row.id, "height", e.target.value),
                  placeholder: "-",
                  className: "w-full bg-white text-center border border-slate-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs(
                "select",
                {
                  value: row.gender,
                  onChange: (e) => updateRow(row.id, "gender", e.target.value),
                  className: "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-700",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "L", children: "Laki-laki" }),
                    /* @__PURE__ */ jsx("option", { value: "P", children: "Perempuan" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removeRow(row.id),
                  disabled: data.users.length <= 1,
                  className: "p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                  title: "Hapus baris",
                  children: /* @__PURE__ */ jsx(X, { size: 16 })
                }
              ) })
            ] }, row.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2",
            children: [
              /* @__PURE__ */ jsx(Save, { size: 16 }),
              processing ? "Menyimpan..." : "Simpan Semua Data"
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  BulkCreate as default
};
