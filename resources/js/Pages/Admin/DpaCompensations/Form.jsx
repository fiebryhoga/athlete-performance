import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronLeft, Save, X, UploadCloud } from "lucide-react";
import PageHeader from "@/Components/Layout/PageHeader";

const ImageUploader = ({ label, field, imagePath, data, setData, removeFlag }) => {
    const t = (text) => text;
    // If the user selects a new file, it's stored in data[field].
    // If it's an existing item from DB and not yet removed, it's shown from imagePath.
    
    const previewUrl = data[field] instanceof File 
        ? URL.createObjectURL(data[field]) 
        : (!data[removeFlag] && imagePath ? `/storage/${imagePath}` : null);

    const handleRemove = () => {
        setData(prev => ({ ...prev, [field]: null, [removeFlag]: true }));
    };

    return (
        <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200 ">
            <label className="block text-sm font-bold text-slate-700 ">
                {label}
            </label>
            
            {previewUrl ? (
                <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white inline-block">
                    <img src={previewUrl} alt="Preview" className="h-32 w-auto object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-sm transition-colors"
                            title="Remove Image"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100/50 :bg-slate-800/50 transition-colors cursor-pointer group">
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                setData(prev => ({ 
                                    ...prev, 
                                    [field]: e.target.files[0], 
                                    [removeFlag]: false 
                                }));
                            }
                        }}
                    />
                    <UploadCloud size={24} className="text-slate-400 group-hover:text-slate-500 :text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-600 ">{t("Click or drag image to upload")}</span>
                </div>
            )}
        </div>
    );
};

export default function DpaForm({ auth, dpaCompensation }) {
    const t = (text) => text;
    const isEdit = !!dpaCompensation;

    const { data, setData, post, processing, errors } = useForm({
        category: dpaCompensation?.category || "Posterior View",
        name: dpaCompensation?.name || "",
        overactive_muscles: dpaCompensation?.overactive_muscles || "",
        underactive_muscles: dpaCompensation?.underactive_muscles || "",
        possible_injuries: dpaCompensation?.possible_injuries || "",
        exercises_smr: dpaCompensation?.exercises_smr || "",
        exercises_stretching: dpaCompensation?.exercises_stretching || "",
        exercises_isometrics: dpaCompensation?.exercises_isometrics || "",
        exercises_integrated: dpaCompensation?.exercises_integrated || "",
        
        // File fields
        image: null,
        image_smr: null,
        image_stretching: null,
        image_isometrics: null,
        image_integrated: null,

        // Removal flags
        remove_image: false,
        remove_image_smr: false,
        remove_image_stretching: false,
        remove_image_isometrics: false,
        remove_image_integrated: false,
    });

    const categories = [
        "Posterior View",
        "Lateral View",
        "Anterior View",
        "Single Leg",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const routeName = isEdit ? route("admin.dpa-compensations.update", dpaCompensation.id) : route("admin.dpa-compensations.store");
        
        // Inertia post automatically handles multipart/form-data when files are present.
        // We use method spoofing `_method: 'put'` for updates as defined in the form state.
        post(routeName, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="DPA Compensations">
            <Head title={isEdit ? "Edit DPA Compensation" : "Add DPA Compensation"} />

            <div className="w-full pb-12 space-y-6">
                {/* Header Action Bar */}
                <PageHeader
                title={isEdit ? "Edit Compensation" : "New Compensation"}
                subtitle={t("Fill in the details below.")}
                badge="Master DPA"
                actions={
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.dpa-compensations.index')}
                            className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            {t("Cancel")}
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} strokeWidth={2} /> 
                            {processing ? "Saving..." : "Save Compensation"}
                        </button>
                    </div>
                }
            />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Section */}
                    <div className="bg-white [#09090b] border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 ">
                            {t("Basic Information")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">
                                        {t("Category")}
                                    </label>
                                    <select
                                        className="w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors"
                                        value={data.category}
                                        onChange={(e) => setData("category", e.target.value)}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">
                                        {t("Compensation Name")}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        placeholder={t("e.g. Foot Flattens")}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <ImageUploader 
                                    label="Reference Image (Optional)"
                                    field="image"
                                    imagePath={dpaCompensation?.image_path}
                                    data={data}
                                    setData={setData}
                                    removeFlag="remove_image"
                                />
                                {errors.image && (
                                    <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Muscles & Injuries */}
                    <div className="bg-white [#09090b] border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-6 pb-3 border-b border-slate-100 ">
                            <h3 className="text-lg font-bold text-slate-900 ">
                                {t("Muscles & Injuries")}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">
                                {t("Separate with commas or newlines for multiple items.")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    {t("Problem Overactive Muscles")}
                                </label>
                                <textarea
                                    className="w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors"
                                    rows="4"
                                    value={data.overactive_muscles}
                                    onChange={(e) => setData("overactive_muscles", e.target.value)}
                                    placeholder={t("e.g. Soleus, Lateral gastrocnemius...")}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    {t("Problem Underactive Muscles")}
                                </label>
                                <textarea
                                    className="w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors"
                                    rows="4"
                                    value={data.underactive_muscles}
                                    onChange={(e) => setData("underactive_muscles", e.target.value)}
                                    placeholder={t("e.g. Medial gastrocnemius, Anterior tibialis...")}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    {t("Possible Injuries")}
                                </label>
                                <textarea
                                    className="w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors"
                                    rows="4"
                                    value={data.possible_injuries}
                                    onChange={(e) => setData("possible_injuries", e.target.value)}
                                    placeholder={t("e.g. Plantar fasciitis, Achilles tendinopathy...")}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Muscle Exercises */}
                    <div className="bg-white [#09090b] border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-6 pb-3 border-b border-slate-100 ">
                            <h3 className="text-lg font-bold text-slate-900 ">
                                {t("Corrective Exercises (NASM)")}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">
                                {t("Provide exercise instructions and attach corresponding demonstration images.")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* SMR */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">
                                        1. Inhibit (SMR)
                                    </label>
                                    <textarea
                                        className="w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors"
                                        rows="2"
                                        value={data.exercises_smr}
                                        onChange={(e) => setData("exercises_smr", e.target.value)}
                                        placeholder={t("Exercise description...")}
                                    ></textarea>
                                </div>
                                <ImageUploader 
                                    label="SMR Image"
                                    field="image_smr"
                                    imagePath={dpaCompensation?.image_smr}
                                    data={data}
                                    setData={setData}
                                    removeFlag="remove_image_smr"
                                />
                            </div>

                            {/* Stretching */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">
                                        2. Lengthen (Static Stretching)
                                    </label>
                                    <textarea
                                        className="w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors"
                                        rows="2"
                                        value={data.exercises_stretching}
                                        onChange={(e) => setData("exercises_stretching", e.target.value)}
                                        placeholder={t("Exercise description...")}
                                    ></textarea>
                                </div>
                                <ImageUploader 
                                    label="Stretching Image"
                                    field="image_stretching"
                                    imagePath={dpaCompensation?.image_stretching}
                                    data={data}
                                    setData={setData}
                                    removeFlag="remove_image_stretching"
                                />
                            </div>

                            {/* Isometrics */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">
                                        3. Activate (Positional Isometrics)
                                    </label>
                                    <textarea
                                        className="w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors"
                                        rows="2"
                                        value={data.exercises_isometrics}
                                        onChange={(e) => setData("exercises_isometrics", e.target.value)}
                                        placeholder={t("Exercise description...")}
                                    ></textarea>
                                </div>
                                <ImageUploader 
                                    label="Isometrics Image"
                                    field="image_isometrics"
                                    imagePath={dpaCompensation?.image_isometrics}
                                    data={data}
                                    setData={setData}
                                    removeFlag="remove_image_isometrics"
                                />
                            </div>

                            {/* Integrated */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">
                                        4. Integrate (Dynamic Movement)
                                    </label>
                                    <textarea
                                        className="w-full rounded-md border-slate-300 bg-white text-slate-900 focus:border-slate-900 focus:ring-slate-900 :border-slate-100 :ring-slate-100 shadow-sm transition-colors"
                                        rows="2"
                                        value={data.exercises_integrated}
                                        onChange={(e) => setData("exercises_integrated", e.target.value)}
                                        placeholder={t("Exercise description...")}
                                    ></textarea>
                                </div>
                                <ImageUploader 
                                    label="Integrated Image"
                                    field="image_integrated"
                                    imagePath={dpaCompensation?.image_integrated}
                                    data={data}
                                    setData={setData}
                                    removeFlag="remove_image_integrated"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
