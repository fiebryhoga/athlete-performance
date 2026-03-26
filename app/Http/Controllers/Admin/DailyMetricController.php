<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyMetric;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class DailyMetricController extends Controller
{
    /**
     * Menampilkan daftar semua atlet beserta total data hariannya
     */
    public function index()
    {
        $athletes = User::where('role', 'athlete')
            ->with('sport')
            ->get()
            ->map(function($user) {
                // Hitung total hari yang sudah ada isinya (bukan hari libur/KOSONG)
                $user->total_records = DailyMetric::where('user_id', $user->id)
                                        ->where('recovery_status', '!=', 'KOSONG')
                                        ->count();
                return $user;
            });

        return Inertia::render('Admin/DailyMetrics/Index', [
            'athletes' => $athletes
        ]);
    }

    /**
     * Menampilkan detail kalender history per atlet
     * (Otomatis men-generate baris data bernilai 0 jika ada hari yang terlewat)
     */
    public function show(User $user)
    {
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
                        'recovery_status' => 'KOSONG' // Menandakan hari libur/kosong
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
        $request->validate(['training_start_date' => 'required|date']);
        $user->update(['training_start_date' => $request->training_start_date]);

        return redirect()->back()->with('message', 'Tanggal mulai latihan berhasil disetting!');
    }

    /**
     * Memproses, menghitung rumus sains olahraga, dan menyimpan data harian (Upsert)
     */
    public function store(Request $request)
    {
        // 1. Validasi Input (Pelatih hanya menginput Data Mentah)
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'record_date' => 'required|date',
            'rhr' => 'required|numeric',
            'spo2' => 'required|numeric',
            'weight' => 'required|numeric',
            'vj' => 'required|numeric',
        ]);

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

        // --- 3. EKSEKUSI RUMUS MATEMATIKA (100% Sesuai Excel/Standar Olahraga) ---
        
        // A. VO2Max Prediksi (Formula Tanaka & Uth–Sørensen)
        $age = $athlete->age ?? 20; // Fallback jika umur kosong
        $hr_max = 208 - (0.7 * $age);
        $hr_ratio = $validated['rhr'] > 0 ? ($hr_max / $validated['rhr']) : 0;
        $vo2_max = 15.3 * $hr_ratio;

        // B. Peak Power (Formula Sayers 1999)
        $peak_power = (60.7 * $validated['vj']) + (45.3 * $validated['weight']) - 2055;

        // C. Quick Recovery Score (Regresi Linier Khusus dari Excel ZK15)
        $raw_recovery = (-1.731 * $validated['rhr']) + (28.962 * $validated['spo2']) + (5.502 * $validated['vj']) - 2788.985;
        
        // Memastikan nilai persentase tidak kurang dari 0 dan tidak lebih dari 100
        $quick_recovery_score = max(0, min(100, $raw_recovery));

        // --- 4. TENTUKAN STATUS RECOVERY BERDASARKAN SKOR ---
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
                'peak_power' => round($peak_power, 3), // Pembulatan 3 desimal
                'quick_recovery_score' => round($quick_recovery_score, 2),
                'hr_max' => round($hr_max, 2),
                'hr_ratio' => round($hr_ratio, 2),
                'vo2_max' => round($vo2_max, 2),
                // Jika input RHR adalah 0, anggap hari tersebut diliburkan kembali (Status: KOSONG)
                'recovery_status' => $validated['rhr'] > 0 ? $recovery_status : 'KOSONG' 
            ]
        );

        return redirect()->back()->with('message', 'Data berhasil disimpan dan seluruh indikator dikalkulasi secara otomatis!');
    }
}