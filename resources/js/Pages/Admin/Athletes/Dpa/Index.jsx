import React, { useState, useMemo } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    Users,
    ChevronRight,
    Activity,
    Stethoscope,
    X,
} from "lucide-react";
import PageHeader from "@/Components/Layout/PageHeader";

export default function DpaIndex({ auth, players }) {
    const t = (text) => text;
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPlayers = useMemo(() => {
        if (!searchQuery.trim()) return players;
        const q = searchQuery.toLowerCase();
        return players.filter(
            (player) =>
                player.name.toLowerCase().includes(q) ||
                player.position?.toLowerCase().includes(q) ||
                (player.position_number &&
                    String(player.position_number).includes(q)),
        );
    }, [searchQuery, players]);

    const getInitials = (name) => {
        if (!name) return "??";
        const words = name.trim().split(" ");
        if (words.length >= 2) {
            return `${words[0][0]}${words[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <AppLayout title="Analisis DPA">
            <Head title="Analisis DPA" />

            <div className="pb-12 space-y-6">
            <PageHeader 
                title="Analisis DPA"
                subtitle={t("Evaluasi pola postur dinamis dan kompensasi otot.")}
                badge="Evaluasi DPA"
                icon={Users}
                searchPlaceholder={t("Cari klien atau posisi...")}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
            />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPlayers.map((player) => (
                        <Link
                            key={player.id}
                            href={route("admin.athletes.dpa.show", player.id)}
                            className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 flex flex-col shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        {player.profile_photo ||
                                        player.photo_url ? (
                                            <img
                                                src={
                                                    player.profile_photo
                                                        ? `/storage/${player.profile_photo}`
                                                        : player.photo_url
                                                }
                                                alt={player.name}
                                                className="w-12 h-12 rounded-full object-cover border border-slate-200 "
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-semibold border border-slate-200 tracking-tight text-sm">
                                                {getInitials(player.name)}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                                            {player.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                                            {player.position || "Klien"}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-md bg-orange-50 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <ChevronRight size={18} />
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                                        <Activity size={12} /> {t("Riwayat")}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900 ">
                                        {player.total_records || 0}{" "}
                                        <span className="text-xs font-normal text-slate-500">
                                            {t("Tes")}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                                        <Stethoscope size={12} /> {t("Status")}
                                    </span>

                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                                            player.total_records > 0
                                                ? "bg-orange-500 text-slate-50 "
                                                : "bg-slate-100 text-slate-500 border border-slate-200 "
                                        }`}
                                    >
                                        {player.total_records > 0
                                            ? "Telah Dievaluasi"
                                            : "Belum Ada Data"}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {filteredPlayers.length === 0 && (
                        <div className="col-span-full py-16 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center">
                            <div className="p-3 bg-white border border-slate-200 rounded-full mb-3 shadow-sm">
                                <Search
                                    size={24}
                                    className="text-slate-400 "
                                />
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">
                                {t("Klien Tidak Ditemukan")}
                            </h4>
                            <p className="text-slate-500 text-sm">
                                Pencarian untuk "{searchQuery}" tidak menemukan hasil.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
