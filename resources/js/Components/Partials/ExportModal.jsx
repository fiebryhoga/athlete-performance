import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import { X, Printer, Loader2, Download, FileText, Type, Sparkles, StickyNote } from "lucide-react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ExportModal({
    isOpen,
    onClose,
    onExport,
    isExporting,
    defaultTitle = "",
    defaultFilename = "",
    exportType = "pdf",
    showSmartInsightsToggle = false,
    showNotesToggle = true,
    children,
}) {
    
    const [title, setTitle] = useState("");
    const [filename, setFilename] = useState("");
    const [note, setNote] = useState("");
    const [includeInsights, setIncludeInsights] = useState(false);
    const [includeNotes, setIncludeNotes] = useState(false);

    // Reset form contents when modal opens
    useEffect(() => {
        if (isOpen) {
            setTitle("");
            setFilename("");
            setNote("");
            setIncludeInsights(false);
            setIncludeNotes(false);
        }
    }, [isOpen]);

    const handleExport = () => {
        onExport(
            filename || defaultFilename, 
            title || defaultTitle, 
            includeNotes ? note : "", 
            { includeInsights }
        );
    };

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
        ],
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-white  border border-zinc-200  shadow-lg sm:rounded-lg overflow-hidden">
                {/* Modal Header */}
                <div className="flex flex-col space-y-1.5 p-6 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4 items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100  text-zinc-900 ">
                                {exportType === "pdf" ? (
                                    <Printer className="h-5 w-5" />
                                ) : (
                                    <Download className="h-5 w-5" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold leading-none tracking-tight text-zinc-900 ">
                                    "Export" {exportType === "pdf" ? "PDF" : "Excel"} "Report"
                                </h2>
                                <p className="text-sm text-zinc-500 ">
                                    "Customize the file name, document title, and report settings."
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-500    "
                        >
                            <X className="h-4 w-4 text-zinc-500 " />
                            <span className="sr-only">"Close"</span>
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6 pt-0 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Filename Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="filename"
                                className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 "
                            >"File Name"</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 " />
                                <input
                                    id="filename"
                                    type="text"
                                    placeholder={defaultFilename || "E.g., Report.pdf"}
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50      text-zinc-900 "
                                />
                            </div>
                        </div>

                        {/* Report Title Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="title"
                                className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 "
                            >"Document Title"</label>
                            <div className="relative">
                                <Type className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 " />
                                <input
                                    id="title"
                                    type="text"
                                    placeholder={defaultTitle || "E.g., BODY COMPOSITION"}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50      text-zinc-900 "
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zinc-200  pt-5">
                        <div className="space-y-3">
                            {/* Smart Insights Toggle */}
                            {showSmartInsightsToggle && (
                                <div className="flex items-center space-x-3 rounded-md">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="insights-toggle"
                                            type="checkbox"
                                            checked={includeInsights}
                                            onChange={(e) => setIncludeInsights(e.target.checked)}
                                            className="w-4 h-4 text-zinc-900 bg-white border-zinc-300 rounded focus:ring-zinc-900   focus:ring-2  "
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="insights-toggle" className="text-sm font-medium text-zinc-900  cursor-pointer flex items-center gap-1.5">"Include Smart Insights"</label>
                                    </div>
                                </div>
                            )}

                            {/* Render Custom Children passed into Modal */}
                            {children && (
                                <div className="mt-4">
                                    {children}
                                </div>
                            )}

                            {/* Notes Toggle */}
                            {showNotesToggle && (
                                <div className="flex flex-col space-y-3 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="notes-toggle"
                                                type="checkbox"
                                                checked={includeNotes}
                                                onChange={(e) => setIncludeNotes(e.target.checked)}
                                                className="w-4 h-4 text-zinc-900 bg-white border-zinc-300 rounded focus:ring-zinc-900   focus:ring-2  "
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label htmlFor="notes-toggle" className="text-sm font-medium text-zinc-900  cursor-pointer flex items-center gap-1.5">"Add Custom Notes"</label>
                                        </div>
                                    </div>
                                        
                                    {/* Rich Text Editor for Notes (Conditional) */}
                                    {includeNotes && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="rounded-md border border-zinc-200  bg-white  overflow-hidden shadow-sm transition-colors focus-within:ring-2 focus-within:ring-zinc-950  focus-within:ring-offset-2 ring-offset-white  [&_.ql-toolbar]:bg-zinc-50/50 [&_.ql-toolbar]: [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-zinc-200 [&_.ql-toolbar]: [&_.ql-container]:border-none [&_.ql-editor]:min-h-[120px] [&_.ql-editor]:text-sm [&_.ql-editor]:text-zinc-900 [&_.ql-editor]: [&_.ql-editor.ql-blank::before]:text-zinc-500 [&_.ql-editor.ql-blank::before]: [&_.ql-editor.ql-blank::before]:font-normal [&_.ql-stroke]: [&_.ql-fill]: [&_.ql-picker]:">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={note}
                                                    onChange={setNote}
                                                    modules={quillModules}
                                                    placeholder="Type your notes here..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end p-4 border-t border-zinc-200  bg-zinc-50 ">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            disabled={isExporting}
                            className="inline-flex h-9 w-full  sm:w-auto items-center justify-center whitespace-nowrap rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium ring-offset-white transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50     "
                        >"Cancel"</button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="inline-flex h-9 w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 ring-offset-white transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50     gap-2 shadow-sm"
                        >
                            {isExporting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            {isExporting
                                ? "Processing..."
                                : `$"Export" ${exportType === "pdf" ? "PDF" : "Excel"}`}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
