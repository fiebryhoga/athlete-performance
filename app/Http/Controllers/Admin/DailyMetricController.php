<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyMetric;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Auth; // 1. Tambahkan Facade Auth

class DailyMetricController extends Controller
{
    /**
     * Menampilkan daftar semua atlet beserta total data hariannya
     */
    public function index(Request $request)
    {
        $currentUser = Auth::user();

        // ==========================================================
        // LOMPATAN KHUSUS ATLET: Langsung ke halamannya sendiri
        // ==========================================================
        if ($currentUser->role === 'athlete') {
            return redirect()->route('admin.daily-metrics.show', $currentUser->id);
        }

        $query = User::where('role', 'athlete')->with('sport');

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $athletes = $query->get()->map(function($user) {
            $user->total_records = DailyMetric::where('user_id', $user->id)
                                    ->where('recovery_status', '!=', 'KOSONG')
                                    ->count();
            return $user;
        });

        return Inertia::render('Admin/DailyMetrics/Index', [
            'athletes' => $athletes,
            'filters' => $request->only(['search']),
            'auth_role' => $currentUser->role
        ]);
    }

    /**
     * Menampilkan detail kalender history per atlet
     */
    public function show(User $user)
    {
        $currentUser = Auth::user();

        // --- PROTEKSI AKSES: Cegah atlet melihat data atlet lain ---
        if ($currentUser->role === 'athlete' && $user->id != $currentUser->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat melihat data pemantauan Anda sendiri.');
        }

        $user->load('sport');
        $dailyHistory = [];

        if ($user->training_start_date) {
            $startDate = Carbon::parse($user->training_start_date)->startOfDay();
            $endDate = Carbon::today();
            
            // Ambil semua data metrik yang ada di DB untuk atlet ini
            $metricsDB = DailyMetric::where('user_id', $user->id)
                            ->get()
                            ->keyBy('record_date');

            $period = CarbonPeriod::create($startDate, $endDate);

            foreach ($period as $date) {
                $dateString = $date->format('Y-m-d');
                
                // JIKA DATA DI TANGGAL INI BELUM ADA, BUAT OTOMATIS DENGAN NILAI 0 (HARI LIBUR)
                if (!$metricsDB->has($dateString)) {
                    $diffInDays = $startDate->diffInDays($date);
                    $week = floor($diffInDays / 7) + 1;
                    $day = ($diffInDays % 7) + 1;

                    $newMetric = DailyMetric::create([
                        'user_id' => $user->id,
                        'record_date' => $dateString,
                        'week' => "Week $week, Day $day",
                        'rhr' => 0,
                        'spo2' => 0,
                        'weight' => $user->weight ?? 0, // Mengambil BB profil sebagai default
                        'vj' => 0,
                        'peak_power' => 0,
                        'quick_recovery_score' => 0,
                        'hr_max' => 0,
                        'hr_ratio' => 0,
                        'vo2_max' => 0,
                        'recovery_status' => 'KOSONG', // Menandakan hari libur/kosong
                        'notes' => null
                    ]);
                    
                    $metricsDB->put($dateString, $newMetric);
                }

                $metric = $metricsDB[$dateString];

                $dailyHistory[] = [
                    'record_date' => $dateString,
                    'week_label' => $metric->week,
                    'is_today' => $date->isToday(),
                    'data' => $metric
                ];
            }
            
            // Balik urutan array agar hari ini (terbaru) berada di baris paling atas tabel
            $dailyHistory = array_reverse($dailyHistory);
        } else {
            // Jika Start Date belum disetting, tampilkan apa adanya dari Database
            $metricsDB = DailyMetric::where('user_id', $user->id)->orderBy('record_date', 'desc')->get();
            foreach ($metricsDB as $metric) {
                $dailyHistory[] = [
                    'record_date' => $metric->record_date,
                    'week_label' => $metric->week,
                    'is_today' => Carbon::parse($metric->record_date)->isToday(),
                    'data' => $metric
                ];
            }
        }

        return Inertia::render('Admin/DailyMetrics/Show', [
            'athlete' => $user,
            'dailyHistory' => $dailyHistory
        ]);
    }

    /**
     * Menyimpan pengaturan Tanggal Mulai Latihan dari form UI
     */
    public function setStartDate(Request $request, User $user)
    {
        $currentUser = Auth::user();

        // --- PROTEKSI AKSES ---
        if ($currentUser->role === 'athlete' && $user->id !== $currentUser->id) {
            abort(403, 'Akses Ditolak. Anda tidak berhak mengubah data ini.');
        }

        $request->validate(['training_start_date' => 'required|date']);
        
        // 1. Update Start Date di profil User
        $user->update(['training_start_date' => $request->training_start_date]);

        // 2. REKALKULASI SEMUA LABEL MINGGU DI TABEL DAILY METRIC
        $startDate = Carbon::parse($request->training_start_date)->startOfDay();
        
        // Ambil semua riwayat metrik atlet ini
        $metrics = DailyMetric::where('user_id', $user->id)->get();

        foreach ($metrics as $metric) {
            $recordDate = Carbon::parse($metric->record_date)->startOfDay();

            // Hitung ulang posisi minggu dan hari
            if ($recordDate->greaterThanOrEqualTo($startDate)) {
                $diffInDays = $startDate->diffInDays($recordDate);
                $week = floor($diffInDays / 7) + 1;
                $day = ($diffInDays % 7) + 1;
                $weekLabel = "Week $week, Day $day";
            } else {
                // Jika ternyata ada data yang tanggalnya mendahului Start Date yang baru
                $weekLabel = 'Sebelum Program'; 
            }

            // Simpan label minggu yang sudah diperbarui ke database
            $metric->update(['week' => $weekLabel]);
        }

        return redirect()->back()->with('message', 'Tanggal mulai latihan berhasil disetting dan seluruh kalender minggu telah disesuaikan ulang!');
    }

    /**
     * Memproses, menghitung rumus sains olahraga, dan menyimpan data harian (Upsert)
     */
    public function store(Request $request)
    {
        $currentUser = Auth::user();

        // 1. Validasi Input
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'record_date' => 'required|date',
            'rhr' => 'required|numeric',
            'spo2' => 'required|numeric',
            'weight' => 'required|numeric',
            'vj' => 'required|numeric',
            'notes' => 'nullable|string|max:1000', // <-- Validasi notes ditambahkan di sini
        ]);

        // --- PROTEKSI AKSES: Cegah atlet simpan data untuk atlet lain melalui manipulasi form ---
        if ($currentUser->role === 'athlete' && $validated['user_id'] != $currentUser->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat mengisi data untuk diri sendiri.');
        }

        $athlete = User::findOrFail($validated['user_id']);
        
        // --- 2. KALKULASI LABEL WEEK & DAY (Dinamis berdasarkan Start Date) ---
        $weekLabel = 'Belum Set Tanggal Mulai';
        if ($athlete->training_start_date) {
            $startDate = Carbon::parse($athlete->training_start_date)->startOfDay();
            $recordDate = Carbon::parse($validated['record_date'])->startOfDay();

            if ($recordDate->greaterThanOrEqualTo($startDate)) {
                $diffInDays = $startDate->diffInDays($recordDate);
                $week = floor($diffInDays / 7) + 1;
                $day = ($diffInDays % 7) + 1;
                $weekLabel = "Week $week, Day $day";
            }
        }

        // --- 3. EKSEKUSI RUMUS MATEMATIKA ---
        
        // A. VO2Max Prediksi
        $age = $athlete->age ?? 20; 
        $hr_max = 208 - (0.7 * $age);
        $hr_ratio = $validated['rhr'] > 0 ? ($hr_max / $validated['rhr']) : 0;
        $vo2_max = 15.3 * $hr_ratio;

        // B. Peak Power
        $peak_power = (60.7 * $validated['vj']) + (45.3 * $validated['weight']) - 2055;

        // C. Quick Recovery Score (Berdasarkan Aturan Kondisional RHR & SpO2)
        $rhr = $validated['rhr'];
        $spo2 = $validated['spo2'];
        
        $base_score = 100;
        
        // 1. Aturan Pengurangan Skor dari RHR
        $rhr_deduction = 0;
        if ($rhr <= 25) {
            $rhr_deduction = 8;
        } elseif ($rhr >= 67) {
            if ($rhr > 75) {
                $rhr_deduction = 45; // Maksimal pengurangan 45 untuk RHR > 75
            } else {
                $rhr_deduction = ($rhr - 66) * 5; // Kelipatan 5 untuk 67 sampai 75
            }
        }

        // 2. Aturan Pengurangan Skor dari SpO2
        $spo2_deduction = 0;
        if ($spo2 >= 99) {
            $spo2_deduction = 0;
        } elseif ($spo2 == 98) {
            $spo2_deduction = 8;
        } elseif ($spo2 == 97) {
            $spo2_deduction = 17;
        } elseif ($spo2 == 96) {
            $spo2_deduction = 25;
        } elseif ($spo2 == 95) {
            $spo2_deduction = 33;
        } elseif ($spo2 <= 94) {
            $spo2_deduction = 42; // Berlaku untuk 94 dan ke bawah
        }

        // 3. Kalkulasi Skor Akhir
        $raw_recovery = $base_score - $rhr_deduction - $spo2_deduction;
        $quick_recovery_score = max(0, min(100, $raw_recovery));

        // --- 4. TENTUKAN STATUS RECOVERY ---
        $recovery_status = 'RECOVERY KURANG';
        if ($quick_recovery_score >= 75) {
            $recovery_status = 'RECOVERY BAIK';
        } elseif ($quick_recovery_score >= 35) {
            $recovery_status = 'RECOVERY CUKUP';
        }

        // --- 5. SIMPAN KE DATABASE (UPDATE OR CREATE) ---
        DailyMetric::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'record_date' => $validated['record_date']
            ],
            [
                'week' => $weekLabel,
                'rhr' => $validated['rhr'],
                'spo2' => $validated['spo2'],
                'weight' => $validated['weight'],
                'vj' => $validated['vj'],
                'peak_power' => round($peak_power, 3), 
                'quick_recovery_score' => round($quick_recovery_score, 2),
                'hr_max' => round($hr_max, 2),
                'hr_ratio' => round($hr_ratio, 2),
                'vo2_max' => round($vo2_max, 2),
                'recovery_status' => $validated['rhr'] > 0 ? $recovery_status : 'KOSONG',
                'notes' => $validated['notes'] ?? null // <-- Simpan notes di sini
            ]
        );

        return redirect()->back()->with('message', 'Data berhasil disimpan dan dikalkulasi secara otomatis!');
    }
}