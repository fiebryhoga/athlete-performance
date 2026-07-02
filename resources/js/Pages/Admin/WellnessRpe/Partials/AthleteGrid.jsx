import React, { useState } from 'react';

import { Search, Activity, HeartPulse, ChevronRight } from 'lucide-react';

// Fungsi helper untuk mendapatkan inisial nama jika foto tidak tersedia
const getInitials = (name) => {
 if (!name) return 'UN';
 const parts = name.split(' ');
 if (parts.length >= 2) {
 return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
 }
 return name.substring(0, 2).toUpperCase();
};

// FUNGSI BARU: Helper untuk memproses URL foto profil pemain yang benar
const getAthletePhotoUrl = (athlete) => {
 // Jika ada accessor photo_url dari backend
 if (athlete.photo_url) return athlete.photo_url;
 
 // Jika menggunakan kolom profile_photo atau photo
 const dbPhoto = athlete.profile_photo || athlete.photo;
 
 if (dbPhoto) {
 // Jika sudah berupa link utuh (http/https)
 if (dbPhoto.startsWith('http')) return dbPhoto;
 // Jika sudah mengandung kata storage
 if (dbPhoto.startsWith('storage/')) return `/${dbPhoto}`;
 // Jika hanya nama file atau path folder (contoh: athletes/foto.jpg)
 return `/storage/${dbPhoto}`;
 }
 
 return null;
};

export default function AthleteGrid({ athletes, weeklyData, onSelectAthlete }) {
    
 const [searchQuery, setSearchQuery] = useState('');

 const filteredAthletes = athletes.filter(p => {
 const q = searchQuery.toLowerCase();
 // Pencarian dengan Nama, Position, maupun nomor punggung
 const np = p.jersey_number || p.np || p.nomor_punggung || ''; 
 
 return p.name.toLowerCase().includes(q) ||
 
 np.toString().includes(q);
 });

 return (
 <div className="space-y-6 pb-10">
 {/* SEARCH BAR */}
 <div className="flex items-center max-w-xl bg-white  border border-slate-200  rounded-xl px-4 py-3 shadow-sm transition-colors focus-within:border-slate-400 ">
 <Search size={18} className="text-slate-400 mr-3" />
 <input
 type="text"
 placeholder="Search by athlete name..."
 className="bg-transparent border-none focus:ring-0 p-0 w-full text-sm font-medium text-slate-900  placeholder:text-slate-400"
 value={searchQuery}
 onChange={e => setSearchQuery(e.target.value)}
 />
 </div>

 {/* PLAYER CARDS GRID */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {filteredAthletes.map(athlete => {
 const pData = weeklyData?.data?.find(d => d.user_id === athlete.id);
 const np = athlete.jersey_number || athlete.np || athlete.nomor_punggung;
 
 // Eksekusi fungsi helper foto untuk pemain ini
 const validPhotoUrl = getAthletePhotoUrl(athlete);
 
 return (
 <button
 key={athlete.id}
 onClick={() => onSelectAthlete(athlete.id)}
 className="group w-full bg-white  border border-slate-200  rounded-xl p-5 hover:border-slate-400  transition-all duration-200 flex flex-col shadow-sm text-left"
 >
 {/* BAGIAN ATAS: IDENTITAS PEMAIN */}
 <div className="flex items-start justify-between w-full">
 <div className="flex items-center gap-3">
 {/* FOTO / INISIAL */}
 <div className="relative shrink-0">
 {validPhotoUrl ? (
 <img 
 src={validPhotoUrl} 
 alt={athlete.name}
 className="w-12 h-12 rounded-full object-cover border border-slate-200 "
 onError={(e) => {
 // Fallback jika path foto ternyata rusak/tidak ditemukan di folder storage
 e.target.onerror = null; 
 e.target.style.display = 'none';
 e.target.nextSibling.style.display = 'flex';
 }}
 />
 ) : null}
 
 {/* Inisial cadangan akan tampil jika URL foto kosong, atau jika gambar gagal dimuat (onError) */}
 <div 
 className="w-12 h-12 rounded-full bg-slate-100  flex items-center justify-center text-slate-900  font-semibold border border-slate-200  tracking-tight text-sm"
 style={{ display: validPhotoUrl ? 'none' : 'flex' }}
 >
 {getInitials(athlete.name)}
 </div>
 </div>
 
 {/* NAMA & POSISI */}
 <div className="overflow-hidden">
 <h4 className="font-semibold text-slate-900  group-hover:underline decoration-1 underline-offset-2 line-clamp-1 text-sm md:text-base">
 {athlete.name}
 </h4>
 <p className="text-[10px] sm:text-xs text-slate-500  font-medium mt-0.5">
 {np ? `No. ${np}` : 'Athlete'}
 </p>
 </div>
 </div>
 {/* ICON PANAH KANAN */}
 <div className="w-8 h-8 shrink-0 rounded-md bg-transparent flex items-center justify-end text-slate-400 group-hover:text-slate-900  transition-colors">
 <ChevronRight size={18} />
 </div>
 </div>

 {/* BAGIAN BAWAH: METRIK MINGGUAN */}
 <div className="mt-5 flex items-center justify-between border-t border-slate-100  pt-4 w-full">
 <div className="flex flex-col gap-1">
 <span className="text-[10px] text-slate-500  font-medium flex items-center gap-1.5">
 <Activity size={12} className="text-slate-400" />Weekly Load</span>
 <span className="text-sm font-semibold text-slate-900 ">
 {pData?.weekly_load || 0} <span className="text-[10px] sm:text-xs font-normal text-slate-500">AU</span>
 </span>
 </div>
 <div className="flex flex-col items-end gap-1">
 <span className="text-[10px] text-slate-500  font-medium flex items-center gap-1.5">
 <HeartPulse size={12} className="text-slate-400" />Wellness</span>
 <span className="text-sm font-semibold text-slate-900 ">
 {pData?.weekly_wellness_score || 0} <span className="text-[10px] sm:text-xs font-normal text-slate-500">/196</span>
 </span>
 </div>
 </div>
 </button>
 )
 })}

 {/* EMPTY STATE PENCARIAN */}
 {filteredAthletes.length === 0 && (
 <div className="col-span-full py-16 text-center border border-dashed border-slate-300  rounded-xl bg-slate-50/50  flex flex-col items-center justify-center">
 <div className="p-3 bg-white  border border-slate-200  rounded-full mb-3 shadow-sm">
 <Search size={24} className="text-slate-400 " />
 </div>
 <h4 className="font-semibold text-slate-900  mb-1">Athlete Not Found</h4>
 <p className="text-slate-500  text-sm">{`Search "${searchQuery}" yielded no results.`}</p>
 </div>
 )}
 </div>
 </div>
 );
}