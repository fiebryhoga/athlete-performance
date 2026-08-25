import React, { useState, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { 
    ChevronLeft, Save, Upload, User, Lock, Mail, Shield, Trophy, 
    Calendar, Scale, Ruler, Users, Building2, Package, Check, X, ShieldCheck, Camera 
} from 'lucide-react';
import PageHeader from '@/Components/Common/PageHeader';

export default function UserForm({ auth, mode = 'create', defaultRole = 'athlete', targetUser = null, sports = [], coachesList = [], packagesList = [] }) {
    const isEdit = mode === 'edit';
    const isCoachRole = auth.user.role === 'coach';

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        role: targetUser?.role || defaultRole,
        name: targetUser?.name || '',
        username: targetUser?.username || '',
        password: '',
        profile_photo: null,
        sport_id: targetUser?.sport_id || '',
        gender: targetUser?.gender || 'L',
        age: targetUser?.age || '',
        height: targetUser?.height || '',
        weight: targetUser?.weight || '',
        training_exp_date: targetUser?.training_exp_date || '',
        subscription_package_id: targetUser?.subscription_package_id || '',
        is_gym_guard: targetUser?.is_gym_guard || false,
        gym_fee: targetUser?.gym_fee || '',
        coach_ids: targetUser?.coach_ids || [],
    });

    const [photoPreview, setPhotoPreview] = useState(targetUser?.profile_photo_url || null);
    const fileInputRef = useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_photo', file);
            const reader = new FileReader();
            reader.onload = (e) => setPhotoPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setData('profile_photo', null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const toggleCoach = (coachId) => {
        let current = [...data.coach_ids];
        if (current.includes(coachId)) {
            current = current.filter(id => id !== coachId);
        } else {
            if (current.length >= 2) {
                alert('Maksimal hanya dapat memilih 2 pelatih pendamping.');
                return;
            }
            current.push(coachId);
        }
        setData('coach_ids', current);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('admin.users.update', targetUser.id), {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post(route('admin.users.store'), {
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout title={isEdit ? `Edit Pengguna: ${targetUser?.name}` : 'Tambah Akun Pengguna'}>
            <Head title={isEdit ? `Edit: ${targetUser?.name}` : 'Tambah Akun Pengguna'} />

            <div className="space-y-4 pb-12 max-w-[1400px] mx-auto">
                
                {/* Modern PageHeader */}
                <PageHeader
                    title={isEdit ? `Edit Akun: ${targetUser?.name}` : 'Tambah Akun Pengguna Baru'}
                    description={isEdit 
                        ? 'Perbarui data akun, profil fisik klien, paket langganan, atau penugasan pelatih.' 
                        : 'Buat akun pengguna baru dan tentukan hak akses peran dalam sistem.'
                    }
                    actions={
                        <Link 
                            href={route('admin.users.index', { tab: data.role })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md text-xs font-semibold shadow-2xs transition-all"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Kembali ke Manajemen Pengguna</span>
                        </Link>
                    }
                />

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-start gap-4">
                    
                    {/* ─── KOLOM KIRI (Main Form Area) ─── */}
                    <div className="flex-1 min-w-0 w-full space-y-3.5">
                        
                        {/* CARD 1: Informasi Utama Akun */}
                        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3.5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                    <User className="w-4 h-4 text-orange-500" />
                                    <span>Informasi Utama Akun</span>
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {/* Role / Peran */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Role / Hak Akses <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        disabled={isCoachRole || isEdit}
                                        className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs font-medium text-slate-800 disabled:opacity-60"
                                    >
                                        <option value="athlete">Athlete / Klien</option>
                                        <option value="coach">Coach / Pelatih</option>
                                        <option value="superadmin">Superadmin</option>
                                    </select>
                                    {errors.role && <p className="text-[11px] text-rose-500 mt-1">{errors.role}</p>}
                                </div>

                                {/* Nama Lengkap */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Nama Lengkap <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={isCoachRole}
                                        placeholder="Contoh: Budi Santoso"
                                        className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs font-medium text-slate-800 disabled:opacity-60"
                                        required
                                    />
                                    {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                                </div>

                                {/* Login ID (Username) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Login ID (Username) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        disabled={isCoachRole}
                                        placeholder="Contoh: budi_s"
                                        className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs font-mono text-slate-800 disabled:opacity-60"
                                        required
                                    />
                                    {errors.username && <p className="text-[11px] text-rose-500 mt-1">{errors.username}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Password {isEdit ? <span className="text-slate-400 font-normal">(Kosongkan bila tidak diubah)</span> : <span className="text-rose-500">*</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={isCoachRole}
                                        placeholder={isEdit ? "••••••••" : "Minimal 6 karakter"}
                                        className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 disabled:opacity-60"
                                        required={!isEdit}
                                    />
                                    {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
                                </div>
                            </div>
                        </div>

                        {/* CARD 2: Data Fisik & Profil Olahraga (Khusus Athlete / Klien) */}
                        {data.role === 'athlete' && (
                            <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-amber-500" />
                                        <span>Profil Olahraga, Fisik & Langganan</span>
                                    </h3>
                                </div>

                                {/* Bagian 1: Cabor & Jenis Kelamin */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Cabang Olahraga</label>
                                        <select
                                            value={data.sport_id}
                                            onChange={(e) => setData('sport_id', e.target.value)}
                                            disabled={isCoachRole}
                                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 disabled:opacity-60"
                                        >
                                            <option value="">-- Umum / Kebugaran --</option>
                                            {sports.map(sport => (
                                                <option key={sport.id} value={sport.id}>{sport.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                                        <select
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800"
                                        >
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Bagian 2: Data Fisik (Usia, TB, BB) */}
                                <div className="bg-slate-50/70 p-3 rounded-md border border-slate-100 space-y-2">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Pengukuran Fisik Tubuh</span>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Usia</label>
                                            <div className="relative flex items-center">
                                                <input
                                                    type="number"
                                                    value={data.age}
                                                    onChange={(e) => setData('age', e.target.value)}
                                                    placeholder="20"
                                                    className="w-full pl-2.5 pr-10 py-1.5 rounded-md border border-slate-200 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs font-medium text-slate-800"
                                                />
                                                <span className="absolute right-2.5 text-[10px] font-bold text-slate-400 pointer-events-none">tahun</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tinggi Badan</label>
                                            <div className="relative flex items-center">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.height}
                                                    onChange={(e) => setData('height', e.target.value)}
                                                    placeholder="175"
                                                    className="w-full pl-2.5 pr-8 py-1.5 rounded-md border border-slate-200 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs font-medium text-slate-800"
                                                />
                                                <span className="absolute right-2.5 text-[10px] font-bold text-slate-400 pointer-events-none">cm</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Berat Badan</label>
                                            <div className="relative flex items-center">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.weight}
                                                    onChange={(e) => setData('weight', e.target.value)}
                                                    placeholder="68.5"
                                                    className="w-full pl-2.5 pr-8 py-1.5 rounded-md border border-slate-200 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs font-medium text-slate-800"
                                                />
                                                <span className="absolute right-2.5 text-[10px] font-bold text-slate-400 pointer-events-none">kg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bagian 3: Paket Latihan Privat & Masa Berlaku */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Paket Latihan Privat</label>
                                        <select
                                            value={data.subscription_package_id}
                                            onChange={(e) => setData('subscription_package_id', e.target.value)}
                                            disabled={isCoachRole}
                                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 disabled:opacity-60"
                                        >
                                            <option value="">-- Tanpa Paket Privat --</option>
                                            {packagesList.map(pkg => (
                                                <option key={pkg.id} value={pkg.id}>
                                                    {pkg.name} ({pkg.package_type === 'per_session' ? 'Per Pertemuan' : `${pkg.session_count} Sesi`})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Kedaluwarsa Paket Privat</label>
                                        <input
                                            type="date"
                                            value={data.training_exp_date}
                                            onChange={(e) => setData('training_exp_date', e.target.value)}
                                            disabled={isCoachRole}
                                            className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 disabled:opacity-60"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CARD 3: Pelatih Pendamping (Khusus Athlete) */}
                        {data.role === 'athlete' && !isCoachRole && (
                            <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                            <span>Pilih Pelatih Pendamping</span>
                                        </h3>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Maksimal 2 coach pendamping untuk klien ini.</p>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500">
                                        {data.coach_ids.length}/2 Terpilih
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                                    {coachesList.map(coach => {
                                        const isSelected = data.coach_ids.includes(coach.id);
                                        return (
                                            <button
                                                key={coach.id}
                                                type="button"
                                                onClick={() => toggleCoach(coach.id)}
                                                className={`flex items-center gap-2 p-2 rounded-md border text-left transition-all ${
                                                    isSelected 
                                                    ? 'border-orange-500 bg-orange-50/80 text-orange-950 shadow-2xs' 
                                                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 text-slate-700'
                                                }`}
                                            >
                                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                                    isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                                                }`}>
                                                    {isSelected && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                                                </div>
                                                <span className="text-xs font-bold truncate">{coach.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* CARD 4: Konfigurasi Coach / Gym Guard (Khusus Coach) */}
                        {data.role === 'coach' && (
                            <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3.5">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-indigo-600" />
                                        <span>Konfigurasi Penjaga Gym & Fee</span>
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_gym_guard}
                                            onChange={(e) => setData('is_gym_guard', e.target.checked)}
                                            className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 w-4 h-4"
                                        />
                                        <span className="text-xs font-semibold text-slate-800">
                                            Tugaskan Coach Ini Sebagai Penjaga Gym (Bisa Melakukan Absensi Gym)
                                        </span>
                                    </label>

                                    {data.is_gym_guard && (
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Jaga Gym Per Sesi (Rp)</label>
                                            <input
                                                type="number"
                                                value={data.gym_fee}
                                                onChange={(e) => setData('gym_fee', e.target.value)}
                                                placeholder="Contoh: 50000"
                                                className="w-full sm:w-1/2 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ─── KOLOM KANAN (Sidebar Ringkas: Foto Profil & Aksi) ─── */}
                    <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 space-y-3.5">
                        
                        {/* Card Foto Profil */}
                        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3.5 text-center">
                            <div className="border-b border-slate-100 pb-2 text-left">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Foto Profil</span>
                                </h3>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group shadow-2xs">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-slate-300" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-slate-900/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Camera className="w-5 h-5 mb-0.5" />
                                        <span className="text-[9px] font-bold">Ganti</span>
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handlePhotoChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                <div className="flex items-center gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors shadow-2xs"
                                    >
                                        Pilih Foto
                                    </button>
                                    {photoPreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemovePhoto}
                                            className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-md transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2">Maks. 10MB (JPG, PNG, GIF)</p>
                            </div>
                        </div>

                        {/* Card Eksekusi & Simpan */}
                        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3">
                            <div className="border-b border-slate-100 pb-2">
                                <h3 className="text-xs font-bold text-slate-900">Aksi Formulir</h3>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-md shadow-2xs hover:shadow-xs transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Save size={14} />
                                <span>{processing ? "Menyimpan..." : (isEdit ? "Perbarui Pengguna" : "Simpan Pengguna Baru")}</span>
                            </button>

                            <Link
                                href={route('admin.users.index', { tab: data.role })}
                                className="w-full flex items-center justify-center py-1.5 px-3 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
