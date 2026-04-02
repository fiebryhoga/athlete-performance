<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PerformanceTest;
use App\Models\TestResult;
use App\Models\Sport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // ==========================================================
        // SCENARIO 1: DASHBOARD KHUSUS ATLET
        // ==========================================================
        if ($user->role === 'athlete') {
            
            // 1. Load Data User & Tes
            $user->load('sport');
            $tests = PerformanceTest::where('user_id', $user->id)
                ->with(['results.testItem.category'])
                ->orderBy('date', 'asc') // Urutkan dari lama ke baru untuk Trend
                ->get();

            $hasData = $tests->count() > 0;
            $latestTest = $tests->last();

            // --- TAMBAHAN BARU: Ambil data Daily Metric & Training Load (30 Hari Terakhir) ---
            $dailyMetrics = \App\Models\DailyMetric::where('user_id', $user->id)
                ->where('recovery_status', '!=', 'KOSONG') // Hanya ambil hari yang ada datanya
                ->orderBy('record_date', 'asc')
                ->take(30)
                ->get()
                ->map(function($metric) {
                    return [
                        'date' => date('d/m', strtotime($metric->record_date)),
                        'recovery' => (float) $metric->quick_recovery_score,
                    ];
                });

            $trainingLoads = \App\Models\TrainingLoad::where('user_id', $user->id)
                ->orderBy('record_date', 'asc')
                ->take(30)
                ->get()
                ->map(function($load) {
                    return [
                        'date' => date('d/m', strtotime($load->record_date)),
                        'daily_load' => (float) $load->daily_load,
                        'wellness' => (float) $load->wellness_score,
                    ];
                });
            // -------------------------------------------------------------------

            // 2. Statistik Utama
            $avgScore = $hasData ? round($tests->flatMap(function($test) { return $test->results; })->avg('score'), 1) : 0;
            $maxScore = $hasData ? round($tests->map(function($t) { return $t->results->avg('score'); })->max(), 1) : 0;
            
            // Cari Kategori Terbaik
            $bestCategory = '-';
            if ($hasData) {
                $catScores = $tests->flatMap(function ($test) { return $test->results; })
                    ->groupBy(function ($result) { return optional(optional($result->testItem)->category)->name; })
                    ->map(function ($items) { return $items->avg('score'); })
                    ->sortDesc();
                $bestCategory = $catScores->keys()->first() ?? '-';
            }

            // 3. Radar Chart Data
            $radarData = [];
            if ($latestTest) {
                $radarData = $latestTest->results->groupBy('testItem.category.name')
                    ->map(function ($results, $categoryName) {
                        return [ 'subject' => $categoryName, 'A' => round($results->avg('score'), 1), 'B' => 100, 'fullMark' => 100 ];
                    })->values()->toArray();
            }

            // 4. Trend Data (Grafik Area - 6 Sesi Terakhir)
            $trendData = $tests->take(-6)->map(function ($test) {
                return [ 'date' => Carbon::parse($test->date)->format('d/m'), 'score' => round($test->results->avg('score'), 1) ?? 0 ];
            })->values();

            // 5. History List (Untuk Tabel)
            $history = $tests->sortByDesc('date')->take(5)->map(function ($test) {
                $score = $test->results->avg('score') ?? 0;
                return [
                    'id' => $test->id,
                    'date' => Carbon::parse($test->date)->format('d M Y'),
                    'name' => $test->name ?? 'Sesi Latihan',
                    'items_count' => $test->results->count(),
                    'score' => $score,
                    'status' => $this->getStatusBadge($score)
                ];
            })->values();

            // Return ke Tampilan Atlet
            return Inertia::render('Athlete/Dashboard', [
                'user' => $user,
                'stats' => [
                    'sport' => $user->sport->name ?? '-',
                    'sessions' => $tests->count(),
                    'avg_score' => $avgScore,
                    'max_score' => $maxScore,
                    'best_category' => $bestCategory
                ],
                'radarData' => $radarData,
                'trendData' => $trendData,
                'history' => $history,
                // Kirim variabel baru ke React
                'daily_metrics' => $dailyMetrics, 
                'training_loads' => $trainingLoads 
            ]);
        }

        // ==========================================================
        // SCENARIO 2: DASHBOARD ADMIN & COACH (Global Stats)
        // ==========================================================
        
        // 1. DATA ATLET
        $athletes = User::where('role', 'athlete')->get();
        
        // 2. STATISTIK UTAMA
        $totalAtlet = $athletes->count();
        $sesiBulanIni = PerformanceTest::whereMonth('date', Carbon::now()->month)
            ->whereYear('date', Carbon::now()->year)
            ->count();
        $avgSkorGlobal = TestResult::avg('score') ?? 0;

        // 3. STATISTIK FISIK
        $avgAge = $athletes->avg('age') ?? 0;
        $avgHeight = $athletes->avg('height') ?? 0;
        $avgWeight = $athletes->avg('weight') ?? 0;

        // 4. TOP 5 ATHLETES
        $topAthletes = User::where('role', 'athlete')
            ->whereHas('performanceTests.results')
            ->with(['performanceTests.results', 'sport'])
            ->get()
            ->map(function ($atlet) {
                $allScores = $atlet->performanceTests->flatMap->results->pluck('score');
                $avgScore = $allScores->avg() ?? 0;
                return [
                    'name' => $atlet->name,
                    'sport' => $atlet->sport->name ?? '-',
                    'score' => round($avgScore, 1),
                    'raw_score' => $avgScore
                ];
            })
            ->sortByDesc('raw_score')
            ->take(5)
            ->values();

        // 5. SPORT RANKINGS
        $caborPerformance = Sport::with(['athletes.performanceTests.results'])
            ->get()
            ->map(function ($sport) {
                $totalScore = 0;
                $count = 0;
                foreach ($sport->athletes as $atlet) {
                    foreach ($atlet->performanceTests as $test) {
                        $avgTest = $test->results->avg('score');
                        if ($avgTest) {
                            $totalScore += $avgTest;
                            $count++;
                        }
                    }
                }
                $finalScore = $count > 0 ? ($totalScore / $count) : 0;
                return [
                    'name' => $sport->name,
                    'score' => round($finalScore, 1),
                    'raw_score' => $finalScore
                ];
            })
            ->sortByDesc('raw_score')
            ->values();

        $caborUnggulan = $caborPerformance->first()['name'] ?? '-';

        // 6. GENDER CHART
        $genderCounts = $athletes->groupBy('gender')->map->count();
        $genderChart = [
            ['name' => 'Male', 'value' => $genderCounts->get('L') ?? 0],
            ['name' => 'Female', 'value' => $genderCounts->get('P') ?? 0]
        ];

        // 7. RECENT ACTIVITY
        $recentActivity = PerformanceTest::with(['athlete.sport', 'results'])
            ->latest('date')
            ->take(5)
            ->get()
            ->map(function ($test) {
                $avg = $test->results->avg('score') ?? 0;
                return [
                    'title' => $test->name ?? 'Latihan Fisik',
                    'user' => $test->athlete->name ?? 'Unknown',
                    'sport' => $test->athlete->sport->name ?? '-',
                    'date' => Carbon::parse($test->date)->diffForHumans(),
                    'score' => round($avg, 1)
                ];
            });

        // 8. RADAR GLOBAL (Opsional: Rata-rata global per kategori)
        // Disini kita hardcode atau hitung query complex jika perlu
        $radarData = [
            ['subject' => 'Strength', 'A' => 70, 'B' => 100],
            ['subject' => 'Speed', 'A' => 65, 'B' => 100],
            ['subject' => 'Endurance', 'A' => 80, 'B' => 100],
            ['subject' => 'Agility', 'A' => 75, 'B' => 100],
        ];

        return Inertia::render('Dashboard', [ // Tampilan Admin
            'stats' => [
                'total_atlet' => $totalAtlet,
                'sesi_bulan_ini' => $sesiBulanIni,
                'avg_skor_global' => round($avgSkorGlobal, 1),
                'cabor_unggulan' => $caborUnggulan,
                'avg_age' => round($avgAge, 1),
                'avg_height' => round($avgHeight, 1),
                'avg_weight' => round($avgWeight, 1),
            ],
            'charts' => [
                'gender' => $genderChart,
                'radar' => $radarData
            ],
            'lists' => [
                'recent_activity' => $recentActivity,
                'top_athletes' => $topAthletes,
                'cabor_performance' => $caborPerformance
            ]
        ]);
    }

    // Helper untuk Warna Badge Status
    private function getStatusBadge($score)
    {
        if ($score >= 90) return ['label' => 'Excellent', 'color' => 'bg-emerald-100 text-emerald-700 border-emerald-200'];
        if ($score >= 80) return ['label' => 'Good', 'color' => 'bg-blue-100 text-blue-700 border-blue-200'];
        if ($score >= 60) return ['label' => 'Fair', 'color' => 'bg-yellow-100 text-yellow-700 border-yellow-200'];
        return ['label' => 'Poor', 'color' => 'bg-red-100 text-red-700 border-red-200'];
    }
}