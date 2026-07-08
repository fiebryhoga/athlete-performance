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

        
        
        
        if ($user->role === 'athlete') {
            
            // For new dashboard:
            // 1. Pending trainings (not completed)
            $today = Carbon::today();

            // 1a. Individual Trainings Today
            $individualTrainings = \App\Models\IndividualTraining::where('user_id', $user->id)
                ->where('is_completed', false)
                ->whereDate('date', $today)
                ->get()
                ->map(function ($training) {
                    return [
                        'id' => $training->id,
                        'name' => $training->name ?? 'Latihan Individu',
                        'date' => Carbon::parse($training->date)->format('d M Y'),
                        'raw_date' => Carbon::parse($training->date)->startOfDay(),
                        'training_type' => $training->training_type,
                        'status' => $training->status,
                        'session_number' => $training->session_number,
                        'is_group' => false,
                        'route' => route('admin.individual-trainings.session.show', $training->id),
                    ];
                });

            // 1b. Group Trainings Today
            $groupTrainings = \App\Models\GroupTrainingMember::where('athlete_id', $user->id)
                ->where('is_completed', false)
                ->whereHas('groupTraining', function($q) use ($today) {
                    $q->whereDate('date', $today);
                })
                ->with('groupTraining')
                ->get()
                ->map(function ($member) {
                    $training = $member->groupTraining;
                    return [
                        'id' => $training->id,
                        'name' => $training->name ?? 'Latihan Grup',
                        'date' => Carbon::parse($training->date)->format('d M Y'),
                        'raw_date' => Carbon::parse($training->date)->startOfDay(),
                        'training_type' => $training->training_type ?? 'Group',
                        'status' => $training->status,
                        'session_number' => $training->session_number,
                        'is_group' => true,
                        'route' => route('admin.group-trainings.session.show', $training->id), // Fixed route
                    ];
                });

            // Merge and sort
            $todayAgendas = $individualTrainings->concat($groupTrainings)->sortBy('raw_date')->values();

            // 2. Wellness Status Today (specifically wellness fields)
            $wellnessRecord = \App\Models\WellnessRpe::where('user_id', $user->id)
                ->whereDate('record_date', $today)
                ->first();
                
            $hasWellnessToday = $wellnessRecord && !is_null($wellnessRecord->quality_of_sleep);
            $hasRpeToday = $wellnessRecord && (!is_null($wellnessRecord->am_rpe) || !is_null($wellnessRecord->pm_rpe));

            // 4. Quick Stats
            $totalSessions = PerformanceTest::where('user_id', $user->id)->count();

            return Inertia::render('Athlete/Dashboard', [
                'user' => $user,
                'today_agendas' => $todayAgendas,
                'has_wellness_today' => $hasWellnessToday,
                'has_rpe_today' => $hasRpeToday,
                'today_date' => $today->format('Y-m-d'),
                'stats' => [
                    'sport' => $user->sport->name ?? '-',
                    'total_sessions' => $totalSessions,
                ],
            ]);
        }

        
        
        
        
        
        $athletes = User::where('role', 'athlete')->get();
        
        
        $totalAtlet = $athletes->count();
        $sesiBulanIni = PerformanceTest::whereMonth('date', Carbon::now()->month)
            ->whereYear('date', Carbon::now()->year)
            ->count();
        $avgSkorGlobal = TestResult::avg('score') ?? 0;

        
        $avgAge = $athletes->avg('age') ?? 0;
        $avgHeight = $athletes->avg('height') ?? 0;
        $avgWeight = $athletes->avg('weight') ?? 0;

        
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

        
        $genderCounts = $athletes->groupBy('gender')->map->count();
        $genderChart = [
            ['name' => 'Male', 'value' => $genderCounts->get('L') ?? 0],
            ['name' => 'Female', 'value' => $genderCounts->get('P') ?? 0]
        ];

        
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

        
        
        $radarData = [
            ['subject' => 'Strength', 'A' => 70, 'B' => 100],
            ['subject' => 'Speed', 'A' => 65, 'B' => 100],
            ['subject' => 'Endurance', 'A' => 80, 'B' => 100],
            ['subject' => 'Agility', 'A' => 75, 'B' => 100],
        ];

        // Today's Agendas
        $today = Carbon::today();
        $adminUser = Auth::user();

        // Fetch all coaches to resolve coach_ids array
        $allCoaches = \App\Models\User::whereIn('role', ['coach', 'superadmin'])->get()->keyBy('id');

        // 1. Group Trainings Today
        $groupQuery = \App\Models\GroupTraining::whereDate('date', $today)->where('status', 'scheduled');
        if ($adminUser->role === 'coach') {
            $groupQuery->whereJsonContains('coach_ids', $adminUser->id);
        }
        $groupTrainings = $groupQuery->with(['coach', 'group'])->get()->map(function ($training) use ($allCoaches) {
            $actualCoaches = collect($training->coach_ids ?? [])->map(function ($id) use ($allCoaches) {
                return $allCoaches->get($id)->name ?? '';
            })->filter()->implode(', ');

            return [
                'id' => $training->id,
                'name' => $training->name ?? 'Latihan Grup',
                'participant_name' => $training->group->name ?? 'Grup',
                'date' => Carbon::parse($training->date)->format('d M Y'),
                'raw_date' => Carbon::parse($training->date)->startOfDay(),
                'training_type' => 'Group',
                'status' => $training->status,
                'session_number' => $training->session_number,
                'coach_name' => $actualCoaches ?: ($training->coach->name ?? 'Tidak Ada'),
                'is_group' => true,
                'route' => route('admin.group-trainings.session.show', $training->id),
            ];
        });

        // 2. Individual Trainings Today
        $individualQuery = \App\Models\IndividualTraining::whereDate('date', $today)->where('is_completed', false);
        if ($adminUser->role === 'coach') {
            $individualQuery->whereJsonContains('coach_ids', $adminUser->id);
        }
        $individualTrainings = $individualQuery->with(['user', 'coach'])->get()->map(function ($training) use ($allCoaches) {
            $actualCoaches = collect($training->coach_ids ?? [])->map(function ($id) use ($allCoaches) {
                return $allCoaches->get($id)->name ?? '';
            })->filter()->implode(', ');

            return [
                'id' => $training->id,
                'name' => 'Latihan Individu',
                'participant_name' => $training->user->name ?? 'Atlet',
                'date' => Carbon::parse($training->date)->format('d M Y'),
                'raw_date' => Carbon::parse($training->date)->startOfDay(),
                'training_type' => $training->training_type ?? 'Private',
                'status' => $training->status,
                'session_number' => $training->session_number,
                'coach_name' => $actualCoaches ?: ($training->coach->name ?? 'Tidak Ada'),
                'is_group' => false,
                'route' => route('admin.individual-trainings.session.show', $training->id),
            ];
        });

        $todayAgendas = $individualTrainings->concat($groupTrainings)->sortBy('raw_date')->values();

        return Inertia::render('Dashboard', [ 
            'today_agendas' => $todayAgendas,
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

    
    private function getStatusBadge($score)
    {
        if ($score >= 80) return ['label' => 'Sangat Baik', 'color' => 'bg-emerald-50 text-emerald-600 border-emerald-200'];
        if ($score >= 60) return ['label' => 'Baik', 'color' => 'bg-blue-50 text-blue-600 border-blue-200'];
        if ($score >= 40) return ['label' => 'Cukup', 'color' => 'bg-amber-50 text-amber-600 border-amber-200'];
        return ['label' => 'Kurang', 'color' => 'bg-red-50 text-red-600 border-red-200'];
    }

    public function profiling()
    {
        $user = Auth::user();

        if ($user->role !== 'athlete') {
            abort(403, 'Unauthorized access.');
        }

        $user->load('sport');
        $tests = PerformanceTest::where('user_id', $user->id)
            ->with(['results.testItem.category'])
            ->orderBy('date', 'asc') 
            ->get();

        $hasData = $tests->count() > 0;
        $latestTest = $tests->last();

        $dailyMetrics = \App\Models\DailyMetric::where('user_id', $user->id)
            ->where('recovery_status', '!=', 'KOSONG') 
            ->orderBy('record_date', 'asc')
            ->take(30)
            ->get()
            ->map(function($metric) {
                return [
                    'date' => date('d/m', strtotime($metric->record_date)),
                    'recovery' => (float) $metric->quick_recovery_score,
                ];
            });

        $trainingLoads = \App\Models\WellnessRpe::where('user_id', $user->id)
            ->orderBy('record_date', 'asc')
            ->take(30)
            ->get()
            ->map(function($load) {
                return [
                    'date' => date('d/m', strtotime($load->record_date)),
                    'daily_load' => (float) $load->daily_load,
                    'wellness' => (float) $load->daily_wellness_score,
                ];
            });

        $avgScore = $hasData ? round($tests->flatMap(function($test) { return $test->results; })->avg('score'), 1) : 0;
        $maxScore = $hasData ? round($tests->map(function($t) { return $t->results->avg('score'); })->max(), 1) : 0;
        
        $bestCategory = '-';
        if ($hasData) {
            $catScores = $tests->flatMap(function ($test) { return $test->results; })
                ->groupBy(function ($result) { return optional(optional($result->testItem)->category)->name; })
                ->map(function ($items) { return $items->avg('score'); })
                ->sortDesc();
            $bestCategory = $catScores->keys()->first() ?? '-';
        }

        $radarData = [];
        if ($latestTest) {
            $radarData = $latestTest->results->groupBy('testItem.category.name')
                ->map(function ($results, $categoryName) {
                    return [ 'subject' => $categoryName, 'A' => round($results->avg('score'), 1), 'B' => 100, 'fullMark' => 100 ];
                })->values()->toArray();
        }

        $trendData = $tests->take(-6)->map(function ($test) {
            return [ 'date' => Carbon::parse($test->date)->format('d/m'), 'score' => round($test->results->avg('score'), 1) ?? 0 ];
        })->values();

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

        $latest_phv = \App\Models\PhvAssessment::where('user_id', $user->id)->orderBy('assessment_date', 'desc')->first();
        $latest_composition = \App\Models\CompositionTest::where('user_id', $user->id)->orderBy('date', 'desc')->first();
        $latest_wellness = \App\Models\WellnessRpe::where('user_id', $user->id)->orderBy('record_date', 'desc')->first();
        $latest_dpa = \App\Models\DpaAssessment::where('user_id', $user->id)->orderBy('assessment_date', 'desc')->first();

        return Inertia::render('Athlete/Profiling', [
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
            'daily_metrics' => $dailyMetrics, 
            'training_loads' => $trainingLoads,
            'latest_phv' => $latest_phv,
            'latest_composition' => $latest_composition,
            'latest_wellness' => $latest_wellness,
            'latest_dpa' => $latest_dpa
        ]);
    }
}