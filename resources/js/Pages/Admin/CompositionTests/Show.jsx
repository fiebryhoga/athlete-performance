import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage } from '@inertiajs/react';
import { Activity, Plus } from 'lucide-react';

import ProfileHeader from './Partials/ProfileHeader';
import TrendHighlights from './Partials/TrendHighlights';
import CompositionAnatomy from './Partials/CompositionAnatomy';
import AnalyticsDashboard from './Partials/AnalyticsDashboard';
import SmartInsights from './Partials/SmartInsights';
import HistoryTable from './Partials/HistoryTable';
import CompositionFormModal from './Partials/CompositionFormModal';

export default function Show({ auth, player, history, benchmarks }) {
 const { permissions } = usePage().props;
 const canCreate = permissions?.body_composition?.create ?? false;
 const canUpdate = permissions?.body_composition?.update ?? false;
 const canDelete = permissions?.body_composition?.delete ?? false;

 const [isFormModalOpen, setIsFormModalOpen] = useState(false);
 const [editingRecord, setEditingRecord] = useState(null);

 const latestTest = history.length > 0 ? history[0] : null;

 const handleEdit = (record) => {
 setEditingRecord(record);
 setIsFormModalOpen(true);
 };

 const handleAddRecord = () => {
 setEditingRecord(null);
 setIsFormModalOpen(true);
 };

 const [isExportModalOpen, setIsExportModalOpen] = useState(false);
 const [isExporting, setIsExporting] = useState(false);

 const renderAnatomyCanvas = (test) => {
 return new Promise((resolve) => {
 if (!test) return resolve(null);

 const w = parseFloat(test.weight) || 1;
 const muscle = parseFloat(test.muscle_mass) || 0;
 const essFat = parseFloat(test.essential_fat_mass) || 0;
 const storFat = parseFloat(test.storage_fat_mass) || 0;
 const bone = parseFloat(test.bone_mass) || 0;
 const calculatedOther = Math.max(0, w - muscle - essFat - storFat - bone);
 const other = parseFloat(test.other_mass) || calculatedOther;
 const totalMass = muscle + essFat + storFat + bone + other;

 const pMuscle = (muscle / totalMass) * 100;
 const pEssFat = (essFat / totalMass) * 100;
 const pStorFat = (storFat / totalMass) * 100;
 const pBone = (bone / totalMass) * 100;
 const pOther = (other / totalMass) * 100;

 const stop1 = pMuscle;
 const stop2 = stop1 + pEssFat;
 const stop3 = stop2 + pStorFat;
 const stop4 = stop3 + pBone;

 const sections = [
 { value: pMuscle, weight: muscle, bg: '#4f46e5', label: 'Muscle Tissue' },
 { value: pEssFat, weight: essFat, bg: '#0ea5e9', label: 'Essential Fat' },
 { value: pStorFat, weight: storFat, bg: '#0d9488', label: 'Non-Essential Fat' },
 { value: pBone, weight: bone, bg: '#f97316', label: 'Bone Mass' },
 { value: pOther, weight: other, bg: '#f59e0b', label: 'Other (Fluids)' },
 ];

 const img = new Image();
 img.crossOrigin = 'anonymous';
 img.onload = () => {
 const cW = 900, cH = 700;
 const canvas = document.createElement('canvas');
 canvas.width = cW;
 canvas.height = cH;
 const ctx = canvas.getContext('2d');

 ctx.fillStyle = '#ffffff';
 ctx.fillRect(0, 0, cW, cH);

 ctx.fillStyle = '#18181b';
 ctx.font = 'bold 22px Helvetica, Arial, sans-serif';
 ctx.textAlign = 'left';
 ctx.fillText('Human Body Composition', 30, 40);
 ctx.font = '13px Helvetica, Arial, sans-serif';
 ctx.fillStyle = '#71717a';
 ctx.fillText(`Body anatomy distribution based on total body weight (${w} kg).`, 30, 62);

 const bodyX = 80, bodyY = 90, bodyW = 260, bodyH = 580;

 const offCanvas = document.createElement('canvas');
 offCanvas.width = bodyW;
 offCanvas.height = bodyH;
 const offCtx = offCanvas.getContext('2d');

 const grad = offCtx.createLinearGradient(0, 0, 0, bodyH);
 grad.addColorStop(0, sections[0].bg);
 grad.addColorStop(stop1 / 100, sections[0].bg);
 grad.addColorStop(stop1 / 100, sections[1].bg);
 grad.addColorStop(stop2 / 100, sections[1].bg);
 grad.addColorStop(stop2 / 100, sections[2].bg);
 grad.addColorStop(stop3 / 100, sections[2].bg);
 grad.addColorStop(stop3 / 100, sections[3].bg);
 grad.addColorStop(stop4 / 100, sections[3].bg);
 grad.addColorStop(stop4 / 100, sections[4].bg);
 grad.addColorStop(1, sections[4].bg);
 offCtx.fillStyle = grad;
 offCtx.fillRect(0, 0, bodyW, bodyH);

 offCtx.globalCompositeOperation = 'destination-in';
 offCtx.drawImage(img, 0, 0, bodyW, bodyH);

 ctx.drawImage(offCanvas, bodyX, bodyY);

 ctx.textAlign = 'center';
 ctx.font = 'bold 13px Helvetica, Arial, sans-serif';
 const stops = [0, stop1, stop2, stop3, stop4, 100];
 sections.forEach((sec, i) => {
 if (sec.value >= 2) {
 const midPct = (stops[i] + stops[i + 1]) / 2 / 100;
 const lY = bodyY + midPct * bodyH;
 ctx.fillStyle = 'rgba(255,255,255,0.95)';
 ctx.fillText(`${Math.round(sec.value)}%`, bodyX + bodyW / 2, lY + 4);
 }
 });

 const legendX = 420, legendStartY = 110, cardH = 68, cardGap = 18;
 sections.forEach((sec, i) => {
 const y = legendStartY + i * (cardH + cardGap);

 ctx.fillStyle = '#fafafa';
 ctx.strokeStyle = '#e4e4e7';
 ctx.lineWidth = 1;
 const rr = 10;
 ctx.beginPath();
 ctx.roundRect(legendX, y, 440, cardH, rr);
 ctx.fill();
 ctx.stroke();

 ctx.fillStyle = sec.bg;
 ctx.beginPath();
 ctx.roundRect(legendX, y, 6, cardH, [rr, 0, 0, rr]);
 ctx.fill();

 ctx.fillStyle = sec.bg;
 ctx.beginPath();
 ctx.roundRect(legendX + 20, y + 14, 55, 40, 8);
 ctx.fill();
 ctx.fillStyle = '#ffffff';
 ctx.font = 'bold 14px Helvetica, Arial, sans-serif';
 ctx.textAlign = 'center';
 ctx.fillText(`${sec.value.toFixed(1)}%`, legendX + 47, y + 40);

 ctx.fillStyle = '#18181b';
 ctx.font = 'bold 14px Helvetica, Arial, sans-serif';
 ctx.textAlign = 'left';
 ctx.fillText(sec.label, legendX + 90, y + 32);

 ctx.fillStyle = '#18181b';
 ctx.font = 'bold 20px Helvetica, Arial, sans-serif';
 ctx.textAlign = 'right';
 ctx.fillText(sec.weight.toFixed(1), legendX + 400, y + 36);
 ctx.fillStyle = '#a1a1aa';
 ctx.font = 'bold 11px Helvetica, Arial, sans-serif';
 ctx.fillText('kg', legendX + 425, y + 36);
 });

 ctx.setLineDash([4, 4]);
 ctx.lineWidth = 1;
 sections.forEach((sec, i) => {
 if (sec.value < 1) return;
 const midPct = (stops[i] + stops[i + 1]) / 2 / 100;
 const fromY = bodyY + midPct * bodyH;
 const toY = legendStartY + i * (cardH + cardGap) + cardH / 2;
 ctx.strokeStyle = sec.bg + '60';
 ctx.beginPath();
 ctx.moveTo(bodyX + bodyW + 10, fromY);
 ctx.bezierCurveTo(bodyX + bodyW + 80, fromY, legendX - 40, toY, legendX, toY);
 ctx.stroke();
 });
 ctx.setLineDash([]);

 resolve(canvas.toDataURL('image/png'));
 };

 img.onerror = () => {
 console.error('Failed to load silhouette image');
 resolve(null);
 };

 img.src = '/assets/images/siluet-tubuh.png';
 });
 };

    const handleExportPdf = async (filename, title, note, options = {}) => {
        setIsExportModalOpen(false);
        setIsExporting(true);

        const images = [];

        if (latestTest) {
            try {
                const anatomyDataUrl = await renderAnatomyCanvas(latestTest);
                if (anatomyDataUrl) {
                    images.push({
                        id: 'composition-anatomy',
                        image: anatomyDataUrl
                    });
                }
            } catch (err) {
                console.error("Failed to render anatomy canvas", err);
            }
        }

        const tableData = {
            latest: history[0] || null,
            history: history
        };

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        submitDownloadForm(route('admin.composition-tests.export-pdf', player.id), {
            _token: csrfToken,
            table_data: JSON.stringify(tableData),
            chart_images: JSON.stringify(images),
            filename: filename,
            title: title,
            note: note,
            include_insights: options.includeInsights ? 1 : 0
        });
        
        setIsExporting(false);
    };

    return (
        <AppLayout
            title={"Body Composition Analytics"}
            description={"Detailed analysis of body composition, muscle mass, fat percentage, and cellular performance."}
        >
            <Head title={`Composition - ${player.name}`} />

            <div className="mx-auto pb-12 space-y-6">
                
                <ProfileHeader 
                    player={player} 
                    latestTest={latestTest} 
                    totalTests={history.length} 
                    onAddRecord={true ? handleAddRecord : null}
                    onExport={() => {}}
                    isExporting={isExporting}
                />

                {latestTest ? (
                    <>
                        <TrendHighlights history={history} />

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <div className="xl:col-span-2 flex flex-col space-y-6">
                                <AnalyticsDashboard test={latestTest} player={player} benchmarks={benchmarks} />
                                <CompositionAnatomy test={latestTest} player={player} />
                            </div>

                            <div className="xl:col-span-1 flex flex-col h-full">
                                <SmartInsights test={latestTest} player={player} benchmarks={benchmarks} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center shadow-sm transition-colors mt-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-60 -ml-10 -mb-10 pointer-events-none"></div>
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-5 shadow-sm relative z-10">
                            <Activity size={32} className="text-[#ff4d00]" />
                        </div>
                        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 mb-2 relative z-10">
                            {"No Analytics Data"}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed relative z-10">
                            {"This player doesn't have any body composition history records yet. Add the first data to generate the analytics dashboard and smart insights."}
                        </p>
                        {true && (
                            <button
                                onClick={handleAddRecord}
                                className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all bg-[#ff4d00] text-white hover:bg-[#e64500] h-10 px-6 shadow-lg shadow-[#ff4d00]/20 focus:outline-none focus:ring-2 focus:ring-[#ff4d00] focus:ring-offset-2 relative z-10"
                            >
                                <Plus size={16} className="mr-2" /> 
                                {"Input Data Now"}
                            </button>
                        )}
                    </div>
                )}

                <div className="pt-2">
                    <HistoryTable history={history} onEdit={true ? handleEdit : null} canDelete={true} />
                </div>
            </div>

            <CompositionFormModal 
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                player={player}
                record={editingRecord}
            />
        </AppLayout>
    );
}