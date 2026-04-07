<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyMetric;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Auth; 

class DailyMetricController extends Controller
{
    public function index(Request $request)
    {
        $currentUser = Auth::user();

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

    public function show(User $user)
    {
        $currentUser = Auth::user();

        if ($currentUser->role === 'athlete' && $user->id != $currentUser->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat melihat data pemantauan Anda sendiri.');
        }

        $user->load('sport');
        $dailyHistory = [];

        if ($user->training_start_date) {
            $startDate = Carbon::parse($user->training_start_date)->startOfDay();
            $endDate = Carbon::today();
            
            $metricsDB = DailyMetric::where('user_id', $user->id)
                            ->get()
                            ->keyBy('record_date');

            $period = CarbonPeriod::create($startDate, $endDate);

            foreach ($period as $date) {
                $dateString = $date->format('Y-m-d');
                
                if (!$metricsDB->has($dateString)) {
                    $diffInDays = $startDate->diffInDays($date);
                    $week = floor($diffInDays / 7) + 1;
                    $day = ($diffInDays % 7) + 1;

                    $newMetric = DailyMetric::create([
                        'user_id' => $user->id,
                        'record_date' => $dateString,
                        'week' => "Week $week, Day $day",
                        'age' => $user->age ?? 20, // <-- DITAMBAHKAN (Fallback default data kosong)
                        'rhr' => 0,
                        'spo2' => 0,
                        'weight' => $user->weight ?? 0, 
                        'vj' => 0,
                        'peak_power' => 0,
                        'quick_recovery_score' => 0,
                        'hr_max' => 0,
                        'hr_ratio' => 0,
                        'vo2_max' => 0,
                        'recovery_status' => 'KOSONG', 
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
            
            $dailyHistory = array_reverse($dailyHistory);
        } else {
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

    public function setStartDate(Request $request, User $user)
    {
        $currentUser = Auth::user();

        if ($currentUser->role === 'athlete' && $user->id !== $currentUser->id) {
            abort(403, 'Akses Ditolak. Anda tidak berhak mengubah data ini.');
        }

        $request->validate(['training_start_date' => 'required|date']);
        
        $user->update(['training_start_date' => $request->training_start_date]);
        
        $startDate = Carbon::parse($request->training_start_date)->startOfDay();
        $metrics = DailyMetric::where('user_id', $user->id)->get();

        foreach ($metrics as $metric) {
            $recordDate = Carbon::parse($metric->record_date)->startOfDay();

            if ($recordDate->greaterThanOrEqualTo($startDate)) {
                $diffInDays = $startDate->diffInDays($recordDate);
                $week = floor($diffInDays / 7) + 1;
                $day = ($diffInDays % 7) + 1;
                $weekLabel = "Week $week, Day $day";
            } else {
                $weekLabel = 'Sebelum Program'; 
            }
            
            $metric->update(['week' => $weekLabel]);
        }

        return redirect()->back()->with('message', 'Tanggal mulai latihan berhasil disetting dan seluruh kalender minggu telah disesuaikan ulang!');
    }

    public function store(Request $request)
    {
        $currentUser = Auth::user();

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'record_date' => 'required|date',
            'age' => 'required|numeric|min:5|max:100',
            'rhr' => 'required|numeric',
            'spo2' => 'required|numeric',
            'weight' => 'required|numeric',
            'vj' => 'required|numeric',
            'notes' => 'nullable|string|max:1000', 
        ]);

        if ($currentUser->role === 'athlete' && $validated['user_id'] != $currentUser->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat mengisi data untuk diri sendiri.');
        }

        $athlete = User::findOrFail($validated['user_id']);
        
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

        // --- 1. Perhitungan Kebugaran Dasar ---
        $age = $validated['age']; 
        $hr_max = 208 - (0.7 * $age);
        $hr_ratio = $validated['rhr'] > 0 ? ($hr_max / $validated['rhr']) : 0;
        $vo2_max = 15.3 * $hr_ratio;
        $peak_power = (60.7 * $validated['vj']) + (45.3 * $validated['weight']) - 2055;

        // --- 2. ALGORITMA RECOVERY BARU (Sesuai Excel) ---
        $rhr = $validated['rhr'];
        $spo2 = $validated['spo2'];

        // A. SKOR SpO2 (1-6)
        $spo2_score = 0;
        if ($spo2 <= 94) {
            $spo2_score = 1;
        } elseif ($spo2 == 95) {
            $spo2_score = 2;
        } elseif ($spo2 == 96) {
            $spo2_score = 3;
        } elseif ($spo2 == 97) {
            $spo2_score = 4;
        } elseif ($spo2 == 98) {
            $spo2_score = 5;
        } elseif ($spo2 >= 99) {
            $spo2_score = 6;
        }
        $spo2_ratio = $spo2_score / 6;

        // B. MENCARI RHR BASELINE
        $baseline_rhr = $rhr; // Default: gunakan RHR hari ini jika tidak ada baseline
        if ($athlete->training_start_date) {
            $startDateStr = Carbon::parse($athlete->training_start_date)->format('Y-m-d');
            
            // Cari data persis di tanggal mulai latihan
            $baselineMetric = DailyMetric::where('user_id', $athlete->id)
                                ->where('record_date', $startDateStr)
                                ->first();

            if ($baselineMetric && $baselineMetric->rhr > 0) {
                $baseline_rhr = $baselineMetric->rhr;
            } else {
                // Fallback: Jika di tanggal start date kosong, cari data RHR paling pertama yang pernah diisi
                $earliestMetric = DailyMetric::where('user_id', $athlete->id)
                                    ->where('rhr', '>', 0)
                                    ->orderBy('record_date', 'asc')
                                    ->first();
                if ($earliestMetric) {
                    $baseline_rhr = $earliestMetric->rhr;
                }
            }
        }

        // C. SKOR RHR (1-10) BERDASARKAN SELISIH
        $rhr_diff = $rhr - $baseline_rhr;
        $rhr_score = 0;
        
        if ($rhr_diff <= 0.9) {
            $rhr_score = 10;
        } elseif ($rhr_diff <= 1.9) {
            $rhr_score = 9;
        } elseif ($rhr_diff <= 2.9) {
            $rhr_score = 8;
        } elseif ($rhr_diff <= 3.9) {
            $rhr_score = 7;
        } elseif ($rhr_diff <= 4.9) {
            $rhr_score = 6;
        } elseif ($rhr_diff <= 5.9) {
            $rhr_score = 5;
        } elseif ($rhr_diff <= 6.9) {
            $rhr_score = 4;
        } elseif ($rhr_diff <= 7.9) {
            $rhr_score = 3;
        } elseif ($rhr_diff <= 8.9) {
            $rhr_score = 2;
        } else { // >= 9
            $rhr_score = 1;
        }
        $rhr_ratio = $rhr_score / 10;

        // D. FINAL RECOVERY SCORE (Rata-rata dijadikan format persentase 1-100)
        $raw_recovery = (($spo2_ratio + $rhr_ratio) / 2) * 100;
        $quick_recovery_score = max(0, min(100, $raw_recovery));

        // --- 3. Status Recovery ---
        $recovery_status = 'RECOVERY KURANG';
        if ($quick_recovery_score >= 75) {
            $recovery_status = 'RECOVERY BAIK';
        } elseif ($quick_recovery_score >= 35) {
            $recovery_status = 'RECOVERY CUKUP';
        }

        // --- 4. Simpan ke Database ---
        DailyMetric::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'record_date' => $validated['record_date']
            ],
            [
                'week' => $weekLabel,
                'age' => $validated['age'], 
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
                'notes' => $validated['notes'] ?? null 
            ]
        );

        return redirect()->back()->with('message', 'Data berhasil disimpan dan Recovery Score dihitung pakai algoritma baru!');
    }
}