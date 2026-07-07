                                {/* Grid 7 Days (Monday - Sunday) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                    {week.days.map((day) => {
                                        // Pengecekan apakah hari ini
                                        const isToday =
                                            day.date ===
                                            new Date()
                                                .toISOString()
                                                .split("T")[0];
                                        const targetRoute = route("admin.wellness-rpe.athlete.date.show", {
                                            user: athlete.id,
                                            date: day.date,
                                        });

                                        return (
                                            <Link
                                                key={day.date}
                                                href={targetRoute}
                                                className={`group relative overflow-hidden flex flex-col justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer ${
                                                    isToday 
                                                    ? "border-[#ff4d00] ring-1 ring-[#ff4d00]/30 shadow-[0_4px_12px_rgba(255,77,0,0.1)]" 
                                                    : "border-slate-200 hover:border-[#ff4d00]/50"
                                                }`}
                                            >
                                                {isToday && (
                                                    <div className="absolute top-0 right-0 w-8 h-8 bg-orange-50 rounded-bl-full flex items-start justify-end p-1.5 z-10">
                                                        <div className="w-2 h-2 rounded-full bg-[#ff4d00] animate-pulse"></div>
                                                    </div>
                                                )}

                                                <div className="flex flex-col gap-1 mb-4 z-10">
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? "text-[#ff4d00]" : "text-slate-400"}`}>
                                                            {day.day_name}
                                                        </span>
                                                        {day.has_data ? (
                                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                                        ) : (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                                        )}
                                                    </div>
                                                    <h5 className={`text-base font-black tracking-tight ${isToday ? "text-slate-900" : "text-slate-900"}`}>
                                                        {day.formatted_date.split(' ')[0]} <span className="font-bold text-sm text-slate-500">{day.formatted_date.split(' ')[1]}</span>
                                                    </h5>
                                                </div>

                                                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between z-10">
                                                    {day.has_data ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Load</span>
                                                                <span className="text-[13px] font-black text-slate-700">{day.daily_load}</span>
                                                            </div>
                                                            <div className="w-[1px] h-5 bg-slate-200"></div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Wlns</span>
                                                                <span className="text-[13px] font-black text-slate-700">{day.wellness_score}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-medium text-slate-400 italic">Belum ada data</span>
                                                    )}
                                                    <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#ff4d00] group-hover:text-white text-slate-400 transition-colors shrink-0">
                                                        <ChevronRight size={12} />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
