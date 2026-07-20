import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import {
    Building2, Clock, MapPin, ChevronLeft, ChevronRight, Trash2, X,
    CheckCircle2, Calendar, Settings, LogIn, LogOut,
    Navigation, Shield, Banknote, CircleDollarSign, Smartphone, FileText, Edit3
} from 'lucide-react';
import PageHeader from '@/Components/Layout/PageHeader';

// ─── Haversine Distance (meters) ───
function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function Index({
    auth,
    attendances = [],
    gymLocation = {},
    todayAttendance = null,
    recapData = null,
    currentMonth,
    currentYear,
}) {
    const isSuperadmin = auth.user.role === 'superadmin';
    const isCoach = auth.user.role === 'coach';

    // ─── MONTH NAVIGATION ───
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const navigateMonth = (dir) => {
        let m = currentMonth + dir;
        let y = currentYear;
        if (m < 1) { m = 12; y--; }
        if (m > 12) { m = 1; y++; }
        router.get(route('admin.gym-attendance.index'), { month: m, year: y }, { preserveState: true, replace: true });
    };

    // ─── CALENDAR DATA ───
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0=Sun
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Mon=0

    const calendarDays = [];
    for (let i = 0; i < adjustedFirstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    const getAttendancesForDay = (day) => {
        if (!day) return [];
        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return attendances.filter(a => a.date === dateStr || a.date?.startsWith(dateStr));
    };

    const getDayStatus = (atts) => {
        if (atts.length === 0) return null;
        return 'on_time';
    };

    // ─── MODALS STATE ───
    const [activeModal, setActiveModal] = useState(null); // 'checkout', 'location', 'selectedDay'
    const [selectedDay, setSelectedDay] = useState(null);

    const locationForm = useForm({
        latitude: gymLocation.latitude || '',
        longitude: gymLocation.longitude || '',
        radius: gymLocation.radius || 50,
        fee: gymLocation.fee || 0,
    });

    const submitLocation = (e) => {
        e.preventDefault();
        locationForm.post(route('admin.gym-attendance.location.update'), { onSuccess: () => setActiveModal(null) });
    };

    // ─── GPS & CHECK-IN/OUT ───
    const [gpsStatus, setGpsStatus] = useState('idle'); // idle, loading, success, error

    const getUserLocation = useCallback(() => {
        return new Promise((resolve, reject) => {
            setGpsStatus('loading');
            if (!navigator.geolocation) {
                const err = 'Browser tidak mendukung Geolocation.';
                setGpsStatus('error');
                reject(err);
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    let dist = null;
                    if (gymLocation.latitude && gymLocation.longitude) {
                        dist = haversineDistance(coords.lat, coords.lng, parseFloat(gymLocation.latitude), parseFloat(gymLocation.longitude));
                    }
                    setGpsStatus('success');
                    resolve({ coords, dist });
                },
                (err) => {
                    const errorMsg = 'Gagal mendapatkan lokasi: ' + err.message;
                    setGpsStatus('error');
                    reject(errorMsg);
                },
                { enableHighAccuracy: true, timeout: 15000 }
            );
        });
    }, [gymLocation]);

    const handleCheckIn = async () => {
        if (!confirm('Apakah Anda yakin ingin memulai sesi jaga gym sekarang?')) return;
        
        try {
            const { coords, dist } = await getUserLocation();
            const maxRadius = parseInt(gymLocation.radius) || 50;
            if (dist !== null && dist > maxRadius) {
                alert(`Gagal: Anda berada di luar radius gym! (${Math.round(dist)}m / maks ${maxRadius}m)`);
                return;
            }

            router.post(route('admin.gym-attendance.check-in'), {
                latitude: coords.lat,
                longitude: coords.lng,
            });
        } catch (error) {
            alert(error);
        }
    };

    const checkoutForm = useForm({ notes: '', latitude: '', longitude: '' });

    const openCheckoutModal = () => {
        checkoutForm.reset();
        setActiveModal('checkout');
    };

    const submitCheckout = async (e) => {
        e.preventDefault();
        try {
            const { coords, dist } = await getUserLocation();
            const maxRadius = parseInt(gymLocation.radius) || 50;
            if (dist !== null && dist > maxRadius) {
                alert(`Gagal: Anda berada di luar radius gym! (${Math.round(dist)}m / maks ${maxRadius}m)`);
                return;
            }

            checkoutForm.transform((data) => ({
                ...data,
                latitude: coords.lat,
                longitude: coords.lng,
            }));
            
            checkoutForm.post(route('admin.gym-attendance.check-out'), {
                onSuccess: () => setActiveModal(null)
            });
        } catch (error) {
            alert(error);
        }
    };

    const deleteAttendance = (id) => {
        if (confirm('Hapus riwayat absensi ini?')) {
            router.delete(route('admin.gym-attendance.destroy', id), {
                onSuccess: () => {
                    if (activeModal === 'selectedDay') setActiveModal(null);
                }
            });
        }
    };

    // Note: Payout is now handled in Reports -> Session Recap

    return (
        <AppLayout title="Manajemen Jaga Gym">
            <Head title="Manajemen Jaga Gym" />
            
            <PageHeader 
                title="Manajemen Jaga Gym"
                subtitle="Kelola dan pantau absensi shift gym untuk para pelatih."
                badge="Absensi"
                icon={Building2}
            />

            <div className="pb-8 bg-slate-50 min-h-screen">
                <div className="mx-auto space-y-6">

                    {/* ─── COACH: TODAY'S PANEL ─── */}
                    {isCoach && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-orange-500" />
                                Panel Absensi Hari Ini
                            </h3>

                            {!todayAttendance ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h4 className="text-md font-bold text-slate-700 mb-2">Belum Mulai Bertugas</h4>
                                    <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">Anda dapat melakukan check-in kapan saja secara fleksibel saat Anda berada di lokasi gym.</p>
                                    
                                    <button
                                        onClick={handleCheckIn}
                                        disabled={gpsStatus === 'loading'}
                                        className="w-full max-w-sm mx-auto py-3 rounded-lg bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {gpsStatus === 'loading' ? (
                                            <><Navigation className="w-4 h-4 animate-pulse" /> Memverifikasi Lokasi...</>
                                        ) : (
                                            <><LogIn className="w-4 h-4" /> Mulai Bertugas (Check-in)</>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Sedang Bertugas
                                            </span>
                                            <h4 className="font-bold text-slate-800 mb-1">Check-in berhasil!</h4>
                                            <div className="flex flex-col gap-1 text-xs text-slate-600">
                                                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Waktu: {new Date(todayAttendance.check_in_time).toLocaleTimeString('id-ID')}</div>
                                                <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Jarak ke Gym: {todayAttendance.check_in_distance} meter</div>
                                                <div className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Device: {todayAttendance.check_in_device?.substring(0, 30)}...</div>
                                            </div>
                                        </div>

                                        {!todayAttendance.check_out_time ? (
                                            <button
                                                onClick={openCheckoutModal}
                                                className="px-5 py-2.5 rounded-lg bg-slate-800 text-white font-bold text-xs shadow-md hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" /> Selesai Bertugas
                                            </button>
                                        ) : (
                                            <div className="text-right">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold mb-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Tugas Selesai
                                                </span>
                                                <div className="text-xs text-slate-600">Check-out: {new Date(todayAttendance.check_out_time).toLocaleTimeString('id-ID')}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ────── LEFT COLUMN: Calendar ────── */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* ─── CALENDAR WIDGET ─── */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-orange-500" />
                                        Jadwal Jaga {monthNames[currentMonth - 1]} {currentYear}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => navigateMonth(-1)} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
                                        <button onClick={() => navigateMonth(1)} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600"><ChevronRight className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => <div key={d}>{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {calendarDays.map((day, idx) => {
                                            if (!day) return <div key={idx} className="aspect-square bg-slate-50/50 rounded-lg"></div>;
                                            
                                            const dayAtts = getAttendancesForDay(day);
                                            const status = getDayStatus(dayAtts);
                                            
                                            let bgClass = "bg-white hover:border-orange-500";
                                            let badgeColor = "bg-slate-200";
                                            if (status === 'on_time') { bgClass = "bg-emerald-50/30"; badgeColor = "bg-emerald-400"; }
                                            
                                            const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() + 1 && currentYear === new Date().getFullYear();

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => { setSelectedDay(day); setActiveModal('selectedDay'); }}
                                                    className={`relative aspect-square border ${isToday ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200'} rounded-lg p-1.5 flex flex-col items-center justify-start transition-all group ${bgClass}`}
                                                >
                                                    <span className={`text-xs font-bold ${isToday ? 'text-orange-500' : 'text-slate-600'}`}>{day}</span>
                                                    {dayAtts.length > 0 && (
                                                        <div className="mt-auto flex flex-wrap gap-1 justify-center">
                                                            {dayAtts.slice(0, 3).map((a, i) => (
                                                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${badgeColor}`}></div>
                                                            ))}
                                                            {dayAtts.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>}
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Ada yang berjaga</div>
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full border border-slate-300"></div> Kosong</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ────── RIGHT COLUMN: Superadmin Settings & Recap ────── */}
                        <div className="space-y-6">
                            
                            {isSuperadmin && (
                                <>
                                    {/* Location Settings */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                                <Settings className="w-4 h-4 text-slate-400" />
                                                Pengaturan Lokasi
                                            </h3>
                                            <button onClick={() => setActiveModal('location')} className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><Edit3 className="w-3.5 h-3.5" /></button>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                            <div className="flex justify-between"><span>Latitude:</span> <span className="font-mono font-medium">{gymLocation.latitude || '-'}</span></div>
                                            <div className="flex justify-between"><span>Longitude:</span> <span className="font-mono font-medium">{gymLocation.longitude || '-'}</span></div>
                                            <div className="flex justify-between"><span>Radius Maks:</span> <span className="font-medium text-slate-800">{gymLocation.radius || 50} meter</span></div>
                                            <div className="flex justify-between"><span>Fee Jaga (Rp):</span> <span className="font-medium text-emerald-600">{Number(gymLocation.fee || 0).toLocaleString('id-ID')}</span></div>
                                        </div>
                                    </div>

                                    {/* Recap Only */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
                                            <Shield className="w-4 h-4 text-emerald-500" />
                                            Rekap Jaga Gym
                                        </h3>
                                        <div className="space-y-4">
                                            {recapData?.map(guard => (
                                                <div key={guard.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                                                                {guard.profile_photo ? <img src={guard.profile_photo} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-500">{guard.name.charAt(0)}</div>}
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-800">{guard.name}</span>
                                                        </div>
                                                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">{guard.total_shifts} Total Hari</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60">
                                                        <div>
                                                            <div className="text-[10px] text-slate-500">Belum dicairkan (honor)</div>
                                                            <div className="text-sm font-black text-rose-500">{guard.unpaid_shifts} Hari</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {recapData?.length === 0 && (
                                                <div className="text-center text-xs text-slate-400 py-4">Belum ada penjaga gym terdaftar.</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── MODAL: CHECKOUT (WITH NOTES) ─── */}
            {activeModal === 'checkout' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><LogOut className="w-4 h-4 text-orange-500" /> Check-out & Catatan</h3>
                            <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={submitCheckout} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Harian <span className="text-rose-500">*</span></label>
                                <p className="text-[10px] text-slate-500 mb-2">Mohon ceritakan apa saja yang Anda kerjakan atau pantau selama berjaga hari ini.</p>
                                <textarea
                                    value={checkoutForm.data.notes}
                                    onChange={e => checkoutForm.setData('notes', e.target.value)}
                                    className="w-full border-slate-200 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 h-24"
                                    required
                                    placeholder="Contoh: Merapikan barbel, mendampingi member baru, dan membersihkan treadmill."
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors">Batal</button>
                                <button type="submit" disabled={checkoutForm.processing || gpsStatus === 'loading'} className="flex-1 py-2 rounded-lg bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                    {gpsStatus === 'loading' || checkoutForm.processing ? (
                                        <><Navigation className="w-3.5 h-3.5 animate-pulse" /> Memproses...</>
                                    ) : (
                                        <><LogOut className="w-3.5 h-3.5" /> Konfirmasi Check-out</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── MODAL: DAY DETAIL ─── */}
            {activeModal === 'selectedDay' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-orange-500" />
                                Detail Absensi - {selectedDay} {monthNames[currentMonth - 1]} {currentYear}
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="p-4 overflow-y-auto space-y-3">
                            {getAttendancesForDay(selectedDay).length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-sm">Tidak ada absen jaga di tanggal ini.</div>
                            ) : (
                                getAttendancesForDay(selectedDay).map(att => {
                                    const isOwn = isCoach && auth.user.id === att.user_id;
                                    const canDelete = isSuperadmin || isOwn;

                                    return (
                                        <div key={att.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 group relative">
                                            {canDelete && (
                                                <button onClick={() => deleteAttendance(att.id)} className="absolute top-3 right-3 p-1.5 bg-rose-50 text-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100" title="Hapus Data">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs uppercase">{att.user?.name?.substring(0,2)}</div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800">{att.user?.name}</div>
                                                    <div className="text-[10px] text-slate-500">
                                                        Check-in: <span className="font-mono text-slate-700">{att.check_in_time ? new Date(att.check_in_time).toLocaleTimeString('id-ID') : '-'}</span> 
                                                        &nbsp;|&nbsp; Check-out: <span className="font-mono text-slate-700">{att.check_out_time ? new Date(att.check_out_time).toLocaleTimeString('id-ID') : '-'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-100 mb-2">
                                                <div className="flex items-start gap-1.5"><MapPin className="w-3 h-3 mt-0.5 text-slate-400 shrink-0" /> <div>In: {att.check_in_distance}m<br/>Out: {att.check_out_distance ?? '-'}m</div></div>
                                                <div className="flex items-start gap-1.5"><Smartphone className="w-3 h-3 mt-0.5 text-slate-400 shrink-0" /> <div className="truncate" title={att.check_in_device}>{att.check_in_device?.substring(0,25)}...</div></div>
                                            </div>

                                            {att.notes && (
                                                <div className="bg-amber-50 border border-amber-100 rounded p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                                                    <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                                                    <div className="italic leading-relaxed">{att.notes}</div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── MODAL: LOCATION ─── */}
            {isSuperadmin && activeModal === 'location' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800">Koordinat Gym</h3>
                            <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={submitLocation} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Latitude</label>
                                <input type="text" value={locationForm.data.latitude} onChange={e => locationForm.setData('latitude', e.target.value)} className="w-full border-slate-200 rounded-lg text-sm" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Longitude</label>
                                <input type="text" value={locationForm.data.longitude} onChange={e => locationForm.setData('longitude', e.target.value)} className="w-full border-slate-200 rounded-lg text-sm" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Radius Toleransi (Meter)</label>
                                <input type="number" value={locationForm.data.radius} onChange={e => locationForm.setData('radius', e.target.value)} className="w-full border-slate-200 rounded-lg text-sm" min="10" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Fee Sekali Jaga (Rp)</label>
                                <input type="number" value={locationForm.data.fee} onChange={e => locationForm.setData('fee', e.target.value)} className="w-full border-slate-200 rounded-lg text-sm" min="0" required />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-200">Batal</button>
                                <button type="submit" disabled={locationForm.processing} className="flex-1 py-2 bg-orange-500 text-white rounded-lg font-bold text-xs hover:bg-orange-600">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
