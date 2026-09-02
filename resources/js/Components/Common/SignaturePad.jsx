import React, { useRef, useState, useEffect, useCallback } from "react";
import { RotateCcw, PenTool } from "lucide-react";

export default function SignaturePad({
    value = null,
    onChange,
    onClear,
    disabled = false,
    label = "Tanda Tangan Digital Klien",
    height = 180,
}) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Save existing canvas image if present
        let tempImage = null;
        if (hasDrawn && canvas.width > 0 && canvas.height > 0) {
            tempImage = canvas.toDataURL();
        }

        canvas.width = rect.width * dpr;
        canvas.height = height * dpr;

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#0f172a"; // slate-900

        if (tempImage) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, rect.width, height);
            };
            img.src = tempImage;
        } else if (value && typeof value === "string" && value.startsWith("data:image")) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, rect.width, height);
                setHasDrawn(true);
            };
            img.src = value;
        }
    }, [height, hasDrawn, value]);

    useEffect(() => {
        setupCanvas();
        window.addEventListener("resize", setupCanvas);
        return () => window.removeEventListener("resize", setupCanvas);
    }, [setupCanvas]);

    const getCanvasCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        if (e.touches && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const startDrawing = (e) => {
        if (disabled) return;
        const pos = getCanvasCoordinates(e);
        setIsDrawing(true);
        setLastPos(pos);
    };

    const draw = (e) => {
        if (!isDrawing || disabled) return;
        e.preventDefault(); // prevent scrolling on touch devices

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const currentPos = getCanvasCoordinates(e);

        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();

        setLastPos(currentPos);
        if (!hasDrawn) {
            setHasDrawn(true);
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const canvas = canvasRef.current;
        if (canvas && onChange) {
            const dataUrl = canvas.toDataURL("image/png");
            onChange(dataUrl);
        }
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        if (onClear) onClear();
        if (onChange) onChange(null);
    };

    return (
        <div className="space-y-1.5 w-full select-none">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <PenTool size={13} className="text-orange-500" />
                    <span>{label}</span>
                    <span className="text-rose-500 text-xs">*</span>
                </label>
                {hasDrawn && !disabled && (
                    <button
                        type="button"
                        onClick={clearSignature}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                        <RotateCcw size={11} />
                        <span>Bersihkan</span>
                    </button>
                )}
            </div>

            <div
                className={`relative border-2 border-dashed rounded-lg bg-white overflow-hidden transition-all ${
                    disabled
                        ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                        : hasDrawn
                        ? "border-emerald-400 ring-1 ring-emerald-400/30"
                        : "border-slate-300 hover:border-orange-400 focus-within:border-orange-500"
                }`}
                style={{ height: `${height}px`, touchAction: "none" }}
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full cursor-crosshair block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                />

                {!hasDrawn && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400">
                        <PenTool size={20} className="mb-1 text-slate-300" />
                        <span className="text-xs font-medium">Bubuhi tanda tangan di area ini</span>
                        <span className="text-[10px] text-slate-400">(Sentuh layar atau gunakan mouse)</span>
                    </div>
                )}

                {/* Subtle base baseline */}
                <div className="absolute bottom-6 left-6 right-6 border-b border-dashed border-slate-200 pointer-events-none" />
                <span className="absolute bottom-1.5 right-3 text-[9px] text-slate-300 font-medium pointer-events-none">
                    Digital Signature Pad
                </span>
            </div>
        </div>
    );
}
