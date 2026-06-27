<?php

namespace App\Http\Controllers\Admin;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use App\Models\Setting;

use App\Models\User;
use App\Models\WellnessRpe;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\WellnessRpeDailyExport;

class WellnessRpeController extends Controller
{
    /**
     * Halaman Utama: Menampilkan Kalender per Minggu
     */
    public function index()
    {
        // Gunakan tabel WellnessSetting alih-alih Club
        $setting = Setting::where('key', 'season_start_date')->first();
        
        // PENGAMAN: Mencegah error 1970-01-01 jika data kosong atau tidak valid
        $season_start_date = ($setting && $setting->value && $setting->value != '1970-01-01') 
            ? Carbon::parse($setting->value)->format('Y-m-d') 
            : null;

        $calendarWeeks = [];

        if ($season_start_date) {
            $start = Carbon::parse($season_start_date)->startOfWeek(); // Paksa mulai dari Senin
            $end = Carbon::today()->endOfWeek(); // Sampai hari Minggu di minggu ini

            $currentDate = $start->copy();
            $weekNumber = 1;

            while ($currentDate <= $end) {
                $weekStart = $currentDate->copy();
                $weekEnd = $currentDate->copy()->endOfWeek();
                
                $days = [];
                for ($i = 0; $i < 7; $i++) {
                    $days[] = [
                        'date' => $currentDate->format('Y-m-d'),
                        'day_name' => $currentDate->locale(app()->getLocale())->translatedFormat('l'),
                        'formatted_date' => $currentDate->locale(app()->getLocale())->translatedFormat('d M Y'),
                    ];
                    $currentDate->addDay();
                }

                $calendarWeeks[] = [
                    'week_number' => $weekNumber,
                    'week_range' => $weekStart->locale(app()->getLocale())->translatedFormat('d M Y') . ' - ' . $weekEnd->locale(app()->getLocale())->translatedFormat('d M Y'),
                    'days' => $days
                ];

                $weekNumber++;
            }
        }

        return Inertia::render('Admin/WellnessRpe/Index', [
            'season_start_date' => $season_start_date,
            'calendarWeeks' => array_reverse($calendarWeeks), 
        ]);
    }

    /**
     * Simpan / Update Tanggal Awal Musim
     */
    public function updateStartDate(Request $request)
    {
        $request->validate([
            'season_start_date' => 'required|date'
        ]);
        
        $setting = Setting::where('key', 'season_start_date')->first();
        
        if (!$setting) {
            Setting::create([
                'key' => 'season_start_date',
                'value' => $request->season_start_date
            ]);
        } else {
            $setting->update([
                'value' => $request->season_start_date
            ]);
        }
        
        return back();
    }

    /**
     * Halaman Detail (Show) per Tanggal (Berisi Tab Input & Analysis)
     */
    public function sessionForm(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date)->format('Y-m-d') : Carbon::today()->format('Y-m-d');
        
        $user = \Illuminate\Support\Facades\Auth::user();
        $isAthlete = $user && $user->role === 'athlete';
        
        $targetPlayerId = $isAthlete ? $user->user_id : null;
        $isCompleted = false;

        if ($request->query('training_id')) {
            $pivot = \DB::table('individual_training_player')
                ->where('individual_training_id', $request->query('training_id'))
                ->first();

            if ($pivot) {
                $currentMode = $request->query('mode', 'all');
                // If admin, use the user_id from the training
                if (!$isAthlete) {
                    $targetPlayerId = $pivot->user_id;
                    // Admins: only lock wellness, RPE is always editable
                    $isCompleted = $currentMode !== 'rpe';
                } else if ($pivot->user_id == $targetPlayerId && $pivot->is_completed) {
                    // Athletes: only lock wellness, RPE is always editable
                    $isCompleted = $currentMode !== 'rpe';
                }
            }
        }

        $log = null;
        if ($targetPlayerId) {
            $log = \App\Models\WellnessRpe::where('user_id', $targetPlayerId)
                ->where('record_date', $date)
                ->first();
        }

        return Inertia::render('Admin/WellnessRpe/SessionForm', [
            'date' => $date,
            'log' => $log,
            'redirectTo' => $request->query('redirect_to'),
            'mode' => $request->query('mode', 'all'),
            'training_id' => $request->query('training_id'),
            'isCompleted' => $isCompleted
        ]);
    }

    public function storeSession(Request $request)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || !$user->user_id) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized']);
        }

        $request->validate([
            'date' => 'required|date',
            'session_type' => 'nullable|in:am,pm',
            'rpe' => 'nullable|numeric|min:1|max:10',
            'duration' => 'nullable|integer|min:1',
            'quality_of_sleep' => 'nullable|integer|min:1|max:7',
            'fatigue' => 'nullable|integer|min:1|max:7',
            'stress' => 'nullable|integer|min:1|max:7',
            'muscle_soreness' => 'nullable|integer|min:1|max:7',
            'muscle_pain_areas' => 'nullable|array',
        ]);

        $date = Carbon::parse($request->date)->format('Y-m-d');
        
        $log = WellnessRpe::firstOrNew([
            'user_id' => $user->user_id,
            'record_date' => $date
        ]);

        if ($request->has('session_type') && $request->session_type) {
            if ($request->session_type === 'am') {
                $log->am_rpe = $request->rpe;
                $log->am_duration = $request->duration;
            } else {
                $log->pm_rpe = $request->rpe;
                $log->pm_duration = $request->duration;
            }
        }

        if ($request->has('quality_of_sleep')) $log->quality_of_sleep = $request->quality_of_sleep;
        if ($request->has('fatigue')) $log->fatigue = $request->fatigue;
        if ($request->has('stress')) $log->stress = $request->stress;
        if ($request->has('muscle_soreness')) $log->muscle_soreness = $request->muscle_soreness;
        if ($request->has('muscle_pain_areas')) $log->muscle_pain_areas = $request->muscle_pain_areas;

        // Calculate load
        $amLoad = ($log->am_rpe && $log->am_duration) ? ($log->am_rpe * $log->am_duration) : 0;
        $pmLoad = ($log->pm_rpe && $log->pm_duration) ? ($log->pm_rpe * $log->pm_duration) : 0;
        $log->daily_load = $amLoad + $pmLoad;

        // Calculate Daily Wellness Score (Max 28)
        $log->daily_wellness_score = (int)$log->quality_of_sleep + (int)$log->fatigue + (int)$log->stress + (int)$log->muscle_soreness;

        $log->save();

        if ($request->has('redirect_to') && $request->redirect_to) {
            return redirect($request->redirect_to)->with('success', 'RPE & Wellness Session berhasil disimpan.');
        }

        return redirect()->route('individual-trainings.index')->with('success', 'RPE & Wellness Session berhasil disimpan.');
    }

    public function show(Request $request, $date)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        $query = User::where('role', 'athlete')->orderBy('name');
        if ($user && $user->role === 'athlete' && $user->user_id) {
            $query->where('id', $user->user_id);
        }
        $players = $query->get();
        $formattedDate = Carbon::parse($date)->locale(app()->getLocale())->translatedFormat('l, d F Y');

        return Inertia::render('Admin/WellnessRpe/Show', [
            'selectedDate' => $date,
            'formattedDate' => $formattedDate,
            'athletes' => $players,
            'redirectTo' => $request->query('redirect_to')
        ]);
    }

    /**
     * Mengambil dan menghitung data untuk satu minggu penuh (Senin - Minggu)
     */
    /**
     * Mengambil dan menghitung data untuk satu minggu penuh (Senin - Minggu)
     */
    public function getWeeklyData(Request $request)
    {
        $date = $request->date ? Carbon::parse($request->date) : Carbon::today();
        
        $startOfWeek = $date->copy()->startOfWeek()->format('Y-m-d');
        $endOfWeek = $date->copy()->endOfWeek()->format('Y-m-d');     

        $targetEndOfWeek = Carbon::parse($endOfWeek);

        $user = \Illuminate\Support\Facades\Auth::user();
        $query = User::where('role', 'athlete')->orderBy('name');
        if ($user && $user->role === 'athlete' && $user->user_id) {
            $query->where('id', $user->user_id);
        }
        $players = $query->get();

        // Tarik semua data log untuk semua player sampai akhir minggu terpilih
        $allLogs = WellnessRpe::where('record_date', '<=', $targetEndOfWeek->format('Y-m-d'))
            ->orderBy('record_date', 'asc') // Urutkan untuk mencari data pertama dengan mudah
            ->get();

        $weeklyReport = $players->map(function ($player) use ($targetEndOfWeek, $allLogs, $startOfWeek, $endOfWeek) {
            $playerLogs = $allLogs->where('user_id', $player->id);

            // CARI DATA PERTAMA PEMAIN INI
            $firstLog = $playerLogs->first();
            
            $weekly_history = [];
            
            // Default metrik untuk minggu yang sedang aktif (jika kosong)
            $targetWeekMetrics = [
                'weekly_load' => 0,
                'acwr' => 0,
                'mean_daily_load' => 0,
                'standard_deviation' => 0,
                'training_monotony' => 0,
                'strain' => 0,
            ];

            if ($firstLog) {
                // Mulai iterasi tepat dari minggu di mana data PERTAMA pemain tersebut berada
                $playerStartMonday = Carbon::parse($firstLog->record_date)->startOfWeek();
                $currentWeekIter = $playerStartMonday->copy();
                
                $weeklyLoads = [];
                $index = 0;
                
                // LOOPING DARI MINGGU PERTAMA PEMAIN SAMPAI MINGGU TERPILIH
                while ($currentWeekIter <= $targetEndOfWeek) {
                    $wStart = $currentWeekIter->copy()->startOfWeek()->format('Y-m-d');
                    $wEnd = $currentWeekIter->copy()->endOfWeek()->format('Y-m-d');

                    $wLogs = $playerLogs->filter(function($log) use ($wStart, $wEnd) {
                        $logDate = Carbon::parse($log->record_date)->format('Y-m-d');
                        return $logDate >= $wStart && $logDate <= $wEnd;
                    });

                    $weekLoad = (float)$wLogs->sum('daily_load');
                    $weeklyLoads[$index] = $weekLoad;

                    // --- LOGIKA ACWR (Sesuai dengan rumus iterasi JS Anda) ---
                    if ($index === 0) {
                        $acwr = 0; // Minggu pertama selalu 0
                    } else {
                        $sumPrevLoad = 0;
                        $countPrevWeeks = 0;
                        $limit = max(0, $index - 4);
                        
                        // Tarik mundur maksimal 4 minggu
                        for ($j = $index - 1; $j >= $limit; $j--) {
                            $sumPrevLoad += $weeklyLoads[$j];
                            $countPrevWeeks++;
                        }
                        
                        // Hitung chronic (Rata-rata 4 minggu / minggu tersedia)
                        $chronicLoad = $countPrevWeeks > 0 ? ($sumPrevLoad / $countPrevWeeks) : 0;
                        
                        // Hitung ACWR
                        $acwr = $chronicLoad > 0 ? round($weekLoad / $chronicLoad, 2) : 0;
                    }

                    // --- Perhitungan Monotony & Strain ---
                    $daily_loads_w = [];
                    for ($i = 0; $i < 7; $i++) {
                        $cDate = Carbon::parse($wStart)->addDays($i)->format('Y-m-d');
                        $logToday = $wLogs->first(function($l) use ($cDate) {
                            return Carbon::parse($l->record_date)->format('Y-m-d') === $cDate;
                        });
                        $daily_loads_w[] = $logToday ? (float)$logToday->daily_load : 0;
                    }
                    
                    $mean_daily_load = $weekLoad / 7;
                    $standard_deviation = $this->calculateStandardDeviation($daily_loads_w);
                    $training_monotony = $standard_deviation > 0 ? round($mean_daily_load / $standard_deviation, 2) : 0;
                    $strain = round($weekLoad * $training_monotony, 2);

                    // -------- TAMBAHAN BARU DI SINI --------
                    $weekly_wellness_score = $wLogs->sum('daily_wellness_score');

                    $history_item = [
                        'week_number' => $index + 1,
                        'start_date' => $wStart,
                        'end_date' => $wEnd,
                        'weekly_load' => $weekLoad,
                        'acwr' => $acwr,
                        'mean_daily_load' => round($mean_daily_load, 2),
                        'standard_deviation' => round($standard_deviation, 2),
                        'training_monotony' => $training_monotony,
                        'strain' => $strain,
                        // Masukkan data log harian per minggu ke dalam riwayat
                        'weekly_wellness_score' => $weekly_wellness_score,
                        'logs' => $wLogs->keyBy(function($item) { 
                            return \Carbon\Carbon::parse($item->record_date)->format('Y-m-d'); 
                        }),
                    ];

                    $weekly_history[] = $history_item;

                    // Tangkap metrik khusus untuk minggu yang sedang ditampilkan di layar Frontend
                    if ($wStart === $startOfWeek) {
                        $targetWeekMetrics = $history_item;
                    }

                    $index++;
                    $currentWeekIter->addWeek();
                }
            }

            // Ambil data detail Harian hanya untuk minggu target Frontend
            $currentWeekLogs = $playerLogs->filter(function($log) use ($startOfWeek, $endOfWeek) {
                $logDate = Carbon::parse($log->record_date)->format('Y-m-d');
                return $logDate >= $startOfWeek && $logDate <= $endOfWeek;
            });

            $weekly_wellness_score = $currentWeekLogs->sum('daily_wellness_score');

            return [
                'user_id' => $player->id,
                'name' => $player->name,
                'position' => $player->position,
                'weekly_wellness_score' => $weekly_wellness_score,
                
                // Meneruskan metrik minggu aktif ke Grid Frontend
                'weekly_load' => $targetWeekMetrics['weekly_load'] ?? 0,
                'acwr' => $targetWeekMetrics['acwr'] ?? 0,
                'mean_daily_load' => $targetWeekMetrics['mean_daily_load'] ?? 0,
                'standard_deviation' => $targetWeekMetrics['standard_deviation'] ?? 0,
                'training_monotony' => $targetWeekMetrics['training_monotony'] ?? 0,
                'strain' => $targetWeekMetrics['strain'] ?? 0,
                
                // Riwayat dibalik agar minggu terbaru di posisi paling atas tabel
                'weekly_history' => array_reverse($weekly_history),

                'logs' => $currentWeekLogs->keyBy(function($item) { 
                    return Carbon::parse($item->record_date)->format('Y-m-d'); 
                }),
            ];
        });

        return response()->json([
            'start_of_week' => $startOfWeek,
            'end_of_week' => $endOfWeek,
            'data' => $weeklyReport
        ]);
    }

    /**
     * Fungsi Helper untuk Menghitung Standard Deviation (STDEV)
     */
    private function calculateStandardDeviation(array $arr)
    {
        $num_of_elements = count($arr);
        $variance = 0.0;
        
        // hitung rata-rata
        $average = array_sum($arr) / $num_of_elements;
          
        foreach($arr as $i) {
            $variance += pow(($i - $average), 2);
        }
          
        // Kita gunakan STDEV.P (Populasi). Jika ingin STDEV.S (Sample) dibagi ($num_of_elements - 1)
        return (float)sqrt($variance / $num_of_elements);
    }

    /**
     * Menyimpan data inputan Wellness & RPE ke Database
     */
    public function store(Request $request)
    {
        $request->validate([
            'record_date' => 'required|date',
            'data' => 'nullable|array'
        ]);

        $date = Carbon::parse($request->record_date)->format('Y-m-d');
        
        // Simpan ID pemain yang ada di dalam tabel untuk patokan penghapusan
        $userIdsInTable = [];

        if ($request->has('data') && is_array($request->data)) {
            foreach ($request->data as $index => $item) {
                $userIdsInTable[] = $item['user_id'];
                $metrics = $item['metrics'] ?? [];
                
                // Cek apakah semua metrik kosong
                $isEmpty = true;
                $colsToCheck = ['quality_of_sleep', 'fatigue', 'muscle_soreness', 'stress', 'am_rpe', 'am_duration', 'pm_rpe', 'pm_duration', 'notes'];
                foreach ($colsToCheck as $col) {
                    if (isset($metrics[$col]) && $metrics[$col] !== '' && !is_null($metrics[$col])) {
                        $isEmpty = false;
                        break;
                    }
                }

                if ($isEmpty) {
                    WellnessRpe::where('user_id', $item['user_id'])
                        ->where('record_date', $date)
                        ->delete();
                    continue;
                }

                // Kalkulasi Load Harian (AM + PM)
                $amLoad = (float)($metrics['am_rpe'] ?? 0) * (int)($metrics['am_duration'] ?? 0);
                $pmLoad = (float)($metrics['pm_rpe'] ?? 0) * (int)($metrics['pm_duration'] ?? 0);
                $dailyLoad = $amLoad + $pmLoad;

                // Kalkulasi Total Skor Wellness (Maks 28)
                $wellnessCols = ['quality_of_sleep', 'fatigue', 'muscle_soreness', 'stress'];
                $wellnessScore = 0;
                foreach ($wellnessCols as $col) {
                    $wellnessScore += (int)($metrics[$col] ?? 0);
                }

                // Kita cari record yang ada untuk tidak menimpa array muscle_pain_areas yang sudah ada jika tidak dikirim dari form admin
                $existingLog = WellnessRpe::where('user_id', $item['user_id'])->where('record_date', $date)->first();
                $existingMusclePain = $existingLog ? $existingLog->muscle_pain_areas : null;

                // Gunakan updateOrCreate: Update jika data sudah ada, Create jika belum.
                WellnessRpe::updateOrCreate(
                    [
                        'user_id' => $item['user_id'],
                        'record_date' => $date,
                    ],
                    [
                        'quality_of_sleep' => $metrics['quality_of_sleep'] ?? null,
                        'fatigue' => $metrics['fatigue'] ?? null,
                        'muscle_soreness' => $metrics['muscle_soreness'] ?? null,
                        'stress' => $metrics['stress'] ?? null,
                        // Obsolete columns ignored
                        'am_rpe' => $metrics['am_rpe'] ?? null,
                        'am_duration' => $metrics['am_duration'] ?? null,
                        'pm_rpe' => $metrics['pm_rpe'] ?? null,
                        'pm_duration' => $metrics['pm_duration'] ?? null,
                        'daily_load' => $dailyLoad,
                        'daily_wellness_score' => $wellnessScore,
                        'sort_order' => $index,
                        'notes' => $metrics['notes'] ?? null,
                        'muscle_pain_areas' => $existingMusclePain, // Preserve existing data from Athlete input
                    ]
                );
            }
        }

        // PENTING: Hapus data log di database HANYA JIKA pemain tersebut tidak ada di dalam $userIdsInTable 
        // (artinya dia dikeluarkan dengan tombol 'X' di tabel)
        if (empty($userIdsInTable)) {
            WellnessRpe::whereDate('record_date', $date)->delete();
        } else {
            WellnessRpe::whereDate('record_date', $date)
                ->whereNotIn('user_id', $userIdsInTable)
                ->delete();
        }

        if ($request->has('redirect_to') && $request->redirect_to) {
            return redirect($request->redirect_to)->with('success', 'Data Wellness berhasil disimpan. Silakan lanjutkan sesi latihan Anda.');
        }

        return back()->with('success', 'Data Wellness berhasil disimpan.');
    }

    /**
     * Ekspor PDF Histori Wellness & ACWR
     */
    public function exportPdf(Request $request, $userId)
    {
        $charts = json_decode($request->input('charts', '{}'), true);
        $player = User::where('role', 'athlete')->findOrFail($userId);
        
        // --- PROSES FOTO PEMAIN KE BASE64 ---
        $player->photo_url = null;
        // Kita periksa properti profile_photo atau photo untuk toleransi penamaan kolom
        $playerPhotoColumn = $player->profile_photo ?? $player->photo ?? null;
        
        if ($playerPhotoColumn) { 
            $cleanPhotoName = ltrim(str_replace('players/', '', $playerPhotoColumn), '/'); 
            $photoPath1 = public_path('storage/players/' . $cleanPhotoName);
            $photoPath2 = storage_path('app/public/players/' . $cleanPhotoName);
            $finalPhotoPath = file_exists($photoPath1) ? $photoPath1 : (file_exists($photoPath2) ? $photoPath2 : null);

            if ($finalPhotoPath) {
                $ext = pathinfo($finalPhotoPath, PATHINFO_EXTENSION);
                $data = file_get_contents($finalPhotoPath);
                $player->photo_url = 'data:image/' . $ext . ';base64,' . base64_encode($data);
            }
        }

        // --- PROSES LOGO KLUB KE BASE64 ---
        $club = (object) ['name' => 'Athlete Performance', 'logo' => null];
        if ($club && $club->logo) {
            $cleanLogoName = ltrim(str_replace('clubs/', '', $club->logo), '/');
            $fullPath1 = public_path('storage/clubs/' . $cleanLogoName);
            $fullPath2 = storage_path('app/public/clubs/' . $cleanLogoName);
            $finalLogoPath = file_exists($fullPath1) ? $fullPath1 : (file_exists($fullPath2) ? $fullPath2 : null);

            if ($finalLogoPath) {
                $ext = pathinfo($finalLogoPath, PATHINFO_EXTENSION);
                $data = file_get_contents($finalLogoPath);
                $club->logo_url = 'data:image/' . $ext . ';base64,' . base64_encode($data);
            } else {
                $club->logo_url = null;
            }
        } else {
            if($club) $club->logo_url = null;
        }

        $targetEndOfWeek = Carbon::today()->endOfWeek();

        // Tarik semua data log untuk pemain ini dari awal beraktivitas
        $playerLogs = WellnessRpe::where('user_id', $player->id)
            ->where('record_date', '<=', $targetEndOfWeek->format('Y-m-d'))
            ->orderBy('record_date', 'asc')
            ->get();

        $firstLog = $playerLogs->first();
        $weekly_history = [];
        
        if ($firstLog) {
            $currentWeekIter = Carbon::parse($firstLog->record_date)->startOfWeek();
            $weeklyLoads = [];
            $index = 0;
            
            while ($currentWeekIter <= $targetEndOfWeek) {
                $wStart = $currentWeekIter->copy()->startOfWeek()->format('Y-m-d');
                $wEnd = $currentWeekIter->copy()->endOfWeek()->format('Y-m-d');

                // PERBAIKAN FORMAT PERIODE: Contoh "23 April 2026 - 29 April 2026"
                $formattedStartDate = Carbon::parse($wStart)->locale(app()->getLocale())->translatedFormat('d F Y');
                $formattedEndDate = Carbon::parse($wEnd)->locale(app()->getLocale())->translatedFormat('d F Y');
                $fullPeriodText = $formattedStartDate . ' - ' . $formattedEndDate;

                $wLogs = $playerLogs->filter(function($log) use ($wStart, $wEnd) {
                    $logDate = Carbon::parse($log->record_date)->format('Y-m-d');
                    return $logDate >= $wStart && $logDate <= $wEnd;
                });

                $weekLoad = (float)$wLogs->sum('daily_load');
                $weeklyLoads[$index] = $weekLoad;

                if ($index === 0) {
                    $acwr = 0;
                } else {
                    $sumPrevLoad = 0;
                    $countPrevWeeks = 0;
                    $limit = max(0, $index - 4);
                    
                    for ($j = $index - 1; $j >= $limit; $j--) {
                        $sumPrevLoad += $weeklyLoads[$j];
                        $countPrevWeeks++;
                    }
                    $chronicLoad = $countPrevWeeks > 0 ? ($sumPrevLoad / $countPrevWeeks) : 0;
                    $acwr = $chronicLoad > 0 ? round($weekLoad / $chronicLoad, 2) : 0;
                }

                $daily_loads_w = [];
                $daysData = [];
                $daysName = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

                for ($i = 0; $i < 7; $i++) {
                    $cDate = Carbon::parse($wStart)->addDays($i)->format('Y-m-d');
                    $cDateLabel = Carbon::parse($wStart)->addDays($i)->locale(app()->getLocale())->translatedFormat('d M');
                    
                    $logToday = $wLogs->first(function($l) use ($cDate) {
                        return Carbon::parse($l->record_date)->format('Y-m-d') === $cDate;
                    });
                    
                    $dailyLoad = $logToday ? (float)$logToday->daily_load : 0;
                    $daily_loads_w[] = $dailyLoad;

                    $daysData[] = [
                        'dayName' => $daysName[$i],
                        'dateLabel' => $cDateLabel,
                        
                        // Detail Variabel Kebugaran Atlet (4 Metrik)
                        'quality_of_sleep' => $logToday && $logToday->quality_of_sleep !== null ? $logToday->quality_of_sleep : '-',
                        'fatigue' => $logToday && $logToday->fatigue !== null ? $logToday->fatigue : '-',
                        'muscle_soreness' => $logToday && $logToday->muscle_soreness !== null ? $logToday->muscle_soreness : '-',
                        'stress' => $logToday && $logToday->stress !== null ? $logToday->stress : '-',
                        
                        // Detail Sesi AM & PM
                        'am_rpe' => $logToday && $logToday->am_rpe !== null ? $logToday->am_rpe : '-',
                        'am_duration' => $logToday && $logToday->am_duration !== null ? $logToday->am_duration : '-',
                        'pm_rpe' => $logToday && $logToday->pm_rpe !== null ? $logToday->pm_rpe : '-',
                        'pm_duration' => $logToday && $logToday->pm_duration !== null ? $logToday->pm_duration : '-',
                        
                        'muscle_pain_areas' => $logToday && $logToday->muscle_pain_areas ? $logToday->muscle_pain_areas : [],
                        
                        'daily_wellness_score' => $logToday && $logToday->daily_wellness_score > 0 ? $logToday->daily_wellness_score : '-',
                        'daily_load' => $dailyLoad > 0 ? $dailyLoad : '-',
                    ];
                }
                
                $mean_daily_load = $weekLoad / 7;
                $standard_deviation = $this->calculateStandardDeviation($daily_loads_w);
                $training_monotony = $standard_deviation > 0 ? round($mean_daily_load / $standard_deviation, 2) : 0;
                $strain = round($weekLoad * $training_monotony, 2);

                $weekly_history[] = [
                    'week_number' => $index + 1,
                    'start_date' => $wStart,
                    'end_date' => $wEnd,
                    'formatted_period' => $fullPeriodText, // Simpan teks periode panjang
                    'weekly_load' => $weekLoad,
                    'acwr' => $acwr,
                    'mean_daily_load' => round($mean_daily_load, 2),
                    'standard_deviation' => round($standard_deviation, 2),
                    'training_monotony' => $training_monotony,
                    'strain' => $strain,
                    'weekly_wellness_score' => $wLogs->sum('daily_wellness_score'),
                    'days_data' => $daysData, 
                ];

                $index++;
                $currentWeekIter->addWeek();
            }
        }

        $historyReversed = array_reverse($weekly_history);
        $latestWeek = $historyReversed[0] ?? null;

        $customTitle = trim($request->input('title'));
        $reqFilename = trim($request->input('filename'));
        $note = $request->input('note', '');
        $includeInsights = $request->input('include_insights') == 1;

        $title = !empty($customTitle) ? $customTitle : 'Wellness & ACWR Report';

        $insights = [];
        if ($includeInsights && $latestWeek) {
            $acwr = $latestWeek['acwr'];
            $monotony = $latestWeek['training_monotony'];
            $strain = $latestWeek['strain'];

            // 1. ACWR Insight
            if ($acwr < 0.8) {
                $insights[] = "<strong>Rekomendasi / Recommendation: Under-training Terdeteksi (Under-training Detected)</strong><br/>Rasio Beban Kerja Akut vs Kronis (ACWR: {$acwr}) sangat rendah. Pemain berisiko cedera saat intensitas pertandingan tiba-tiba naik karena kurang adaptasi beban.<br/><span style='color: #52525b; font-style: italic; font-size: 10px;'>Acute:Chronic Workload Ratio (ACWR: {$acwr}) is very low. High risk of injury during sudden match intensity increases due to poor load adaptation.</span>";
            } elseif ($acwr <= 1.3) {
                $insights[] = "<strong>Kesimpulan / Conclusion: Beban Optimal (Sweet Spot / Optimal Load)</strong><br/>Rasio Beban Kerja (ACWR: {$acwr}) berada dalam zona aman dan optimal. Progres latihan berjalan seimbang dengan pemulihan.<br/><span style='color: #52525b; font-style: italic; font-size: 10px;'>Workload Ratio (ACWR: {$acwr}) is in the safe and optimal zone. Training progress is well-balanced with recovery.</span>";
            } elseif ($acwr <= 1.5) {
                $insights[] = "<strong>Rekomendasi / Recommendation: Zona Hati-hati (Caution Zone)</strong><br/>Rasio Beban Kerja (ACWR: {$acwr}) meningkat melebihi batas aman ideal. Waspadai tanda kelelahan pada pemain.<br/><span style='color: #52525b; font-style: italic; font-size: 10px;'>Workload Ratio (ACWR: {$acwr}) exceeds the ideal safe limit. Watch out for signs of player fatigue.</span>";
            } else {
                $insights[] = "<strong>Rekomendasi Kritis / Critical Recommendation: Bahaya Over-training (Over-training Danger Zone)</strong><br/>Rasio Beban Kerja (ACWR: {$acwr}) melonjak drastis (>1.5). Pemain berada di ambang cedera. Wajib terapkan hari pemulihan aktif (recovery) segera.<br/><span style='color: #52525b; font-style: italic; font-size: 10px;'>Workload Ratio (ACWR: {$acwr}) spiked drastically (>1.5). The player is on the brink of injury. Mandatory active recovery days required immediately.</span>";
            }

            // 2. Training Monotony Insight
            if ($monotony > 2.0) {
                $insights[] = "<strong>Rekomendasi Kritis / Critical Recommendation: Monotoni Tinggi (High Monotony)</strong><br/>Skor monoton latihan sangat tinggi ({$monotony}). Variasi beban harian terlalu sedikit. Meningkatkan potensi cedera over-use, penyakit, dan kebosanan psikologis.<br/><span style='color: #52525b; font-style: italic; font-size: 10px;'>Training monotony score is extremely high ({$monotony}). Too little daily load variation. Increases potential for over-use injury, illness, and psychological staleness.</span>";
            } elseif ($monotony >= 1.5) {
                $insights[] = "<strong>Rekomendasi / Recommendation: Kurang Variasi (Poor Variation)</strong><br/>Skor monoton batas atas ({$monotony}). Beri variasi antara hari latihan keras (Hard) dan ringan (Light) untuk memicu superkompensasi.<br/><span style='color: #52525b; font-style: italic; font-size: 10px;'>Upper limit monotony score ({$monotony}). Introduce variation between Hard and Light training days to trigger supercompensation.</span>";
            } else {
                $insights[] = "<strong>Analisis Klinis / Clinical Analysis: Variasi Beban Baik (Good Load Variation)</strong><br/>Skor monoton ideal ({$monotony}), mengindikasikan program pelatihan memiliki distribusi beban harian (undulating) yang sehat.<br/><span style='color: #52525b; font-style: italic; font-size: 10px;'>Ideal monotony score ({$monotony}), indicating the training program has a healthy undulating daily load distribution.</span>";
            }

            // 3. Strain Insight
            if ($strain > 5000) {
                $insights[] = "<strong>Rekomendasi Kritis / Critical Recommendation: Tekanan Beban Ekstrem (Extreme Strain)</strong><br/>Akumulasi tekanan latihan (Strain: {$strain}) sangat kritis akibat kombinasi beban tinggi dan monoton tinggi. Hentikan intensitas berat sementara waktu.<br/><span style='color: #52525b; font-style: italic; font-size: 10px;'>Accumulated training strain (Strain: {$strain}) is extremely critical due to combined high load and monotony. Pause heavy intensity temporarily.</span>";
            }
        }

        $pdf = Pdf::loadView('exports.wellness_acwr_pdf', compact('player', 'club', 'historyReversed', 'latestWeek', 'title', 'note', 'includeInsights', 'insights'))
            ->setPaper('a3', 'landscape');

        $playerName = str_replace(' ', '_', $player->name);
        $fileNamePrefix = !empty($reqFilename) 
            ? preg_replace('/[^A-Za-z0-9_\-]/', '_', $reqFilename) 
            : (!empty($customTitle) 
                ? preg_replace('/[^A-Za-z0-9_\-]/', '_', $customTitle) 
                : 'Wellness_ACWR_Report_' . $playerName);

        return $pdf->download($fileNamePrefix . '.pdf');
    }

    public function exportExcel(Request $request, $date)
    {
        $options = [
            'wellness' => $request->include_wellness == 'true' || $request->include_wellness == '1',
            'rpe' => $request->include_rpe == 'true' || $request->include_rpe == '1',
            'pain' => $request->include_pain == 'true' || $request->include_pain == '1',
        ];

        if (!$options['wellness'] && !$options['rpe'] && !$options['pain']) {
            return back()->with('error', 'Pilih minimal satu metrik untuk diunduh.');
        }

        $filename = $request->filename ? $request->filename . '.xlsx' : 'Wellness_RPE_Recap_' . $date . '.xlsx';
        $reportTitle = $request->title;
        $note = $request->note;

        $club = (object) ['name' => 'Athlete Performance', 'logo' => null];

        return Excel::download(new WellnessRpeDailyExport($date, $options, $club, $reportTitle), $filename);
    }

    public function exportDailyPdf(Request $request, $date)
    {
        $options = [
            'wellness' => $request->include_wellness == 'true' || $request->include_wellness == '1',
            'rpe' => $request->include_rpe == 'true' || $request->include_rpe == '1',
            'pain' => $request->include_pain == 'true' || $request->include_pain == '1',
        ];

        if (!$options['wellness'] && !$options['rpe'] && !$options['pain']) {
            return back()->with('error', 'Pilih minimal satu metrik untuk diunduh.');
        }

        $club = (object) ['name' => 'Athlete Performance', 'logo' => null];
        $players = User::where('role', 'athlete')->orderBy('name')->get();
        $logs = WellnessRpe::where('record_date', $date)->get()->keyBy('user_id');
        
        $mappedPlayers = $players->map(function($player) use ($logs) {
            return (object) [
                'player' => $player,
                'log' => $logs->get($player->id)
            ];
        });

        $reportTitle = $request->title ?? 'DAILY WELLNESS & RPE REPORT';
        $note = $request->note;

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.wellness_daily_pdf', compact(
            'mappedPlayers', 'date', 'club', 'options', 'reportTitle', 'note'
        ))->setPaper('a4', 'landscape');

        $filename = $request->filename ? $request->filename . '.pdf' : 'Wellness_RPE_Daily_' . $date . '.pdf';
        
        return $pdf->download($filename);
    }
}