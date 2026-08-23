<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PerformanceTest;
use App\Models\TestResult;
use App\Models\Sport;
use App\Models\WellnessRpe;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        
        
        
        if ($user->role === 'athlete') {
            $user->load(['sport', 'package', 'coaches']);
            $today = Carbon::today();
            $agendaDateParam = $request->query('agenda_date');
            $targetDate = $agendaDateParam ? Carbon::parse($agendaDateParam) : Carbon::today();

            // 1a. Individual Trainings for target date
            $individualTrainings = \App\Models\IndividualTraining::where('user_id', $user->id)
                ->whereDate('date', $targetDate)
                ->with('coach')
                ->get()
                ->map(function ($training) {
                    return [
                        'id' => $training->id,
                        'name' => $training->name ?? 'Latihan Individu',
                        'participant_name' => $training->name ?? 'Latihan Privat',
                        'date' => Carbon::parse($training->date)->format('d M Y'),
                        'raw_date' => Carbon::parse($training->date)->startOfDay(),
                        'training_type' => $training->training_type,
                        'status' => $training->status,
                        'session_number' => $training->session_number,
                        'coach_name' => $training->coach->name ?? 'Pelatih',
                        'is_completed' => (bool)$training->is_completed,
                        'is_group' => false,
                        'route' => route('admin.individual-trainings.session.show', $training->id),
                    ];
                });

            // 1b. Group Trainings for target date
            $groupTrainings = \App\Models\GroupTrainingMember::where('athlete_id', $user->id)
                ->whereHas('groupTraining', function($q) use ($targetDate) {
                    $q->whereDate('date', $targetDate);
                })
                ->with(['groupTraining.coach'])
                ->get()
                ->map(function ($member) {
                    $training = $member->groupTraining;
                    return [
                        'id' => $training->id,
                        'name' => $training->name ?? 'Latihan Grup',
                        'participant_name' => $training->name ?? 'Latihan Grup',
                        'date' => Carbon::parse($training->date)->format('d M Y'),
                        'raw_date' => Carbon::parse($training->date)->startOfDay(),
                        'training_type' => $training->training_type ?? 'Group',
                        'status' => $training->status,
                        'session_number' => $training->session_number,
                        'coach_name' => $training->coach->name ?? 'Pelatih',
                        'is_completed' => (bool)$member->is_completed,
                        'is_group' => true,
                        'route' => route('admin.group-trainings.session.show', $training->id),
                    ];
                });

            // Merge and sort
            $todayAgendas = $individualTrainings->concat($groupTrainings)->sortBy('raw_date')->values();

            // 2. Wellness & RPE Status Today
            $wellnessRecord = \App\Models\WellnessRpe::where('user_id', $user->id)
                ->whereDate('record_date', $today)
                ->first();
                
            $hasWellnessToday = $wellnessRecord && !is_null($wellnessRecord->quality_of_sleep);
            $hasRpeToday = $wellnessRecord && (!is_null($wellnessRecord->am_rpe) || !is_null($wellnessRecord->pm_rpe));

            // 3. Completed Sessions
            $completedIndCount = \App\Models\IndividualTraining::where('user_id', $user->id)->where('is_completed', true)->count();
            $completedGrpCount = \App\Models\GroupTrainingMember::where('athlete_id', $user->id)->where('is_completed', true)->count();
            $totalCompletedSessions = $completedIndCount + $completedGrpCount;

            // 4. Latest Physical Test & Category Averages
            $allTests = PerformanceTest::where('user_id', $user->id)
                ->with(['results.testItem.category'])
                ->orderBy('date', 'desc')
                ->take(2)
                ->get();

            $latestTest = $allTests->first();
            $previousTest = $allTests->count() > 1 ? $allTests->last() : null;

            $latestTestScore = $latestTest && $latestTest->results->isNotEmpty() 
                ? round($latestTest->results->avg('score'), 1) 
                : null;
            $latestTestDate = $latestTest ? Carbon::parse($latestTest->date)->format('d M Y') : null;

            $previousTestScore = $previousTest && $previousTest->results->isNotEmpty()
                ? round($previousTest->results->avg('score'), 1)
                : null;

            $scoreDiff = ($latestTestScore !== null && $previousTestScore !== null) 
                ? round($latestTestScore - $previousTestScore, 1) 
                : null;

            $categoryAverages = [];
            if ($latestTest && $latestTest->results->isNotEmpty()) {
                $categoryAverages = $latestTest->results
                    ->groupBy(function ($result) {
                        return $result->testItem->category->name ?? 'Lainnya';
                    })
                    ->map(function ($group, $categoryName) {
                        return [
                            'name' => $categoryName,
                            'value' => round($group->avg('score'), 1),
                        ];
                    })
                    ->values()
                    ->toArray();
            }

            return Inertia::render('Athlete/Dashboard', [
                'user' => $user,
                'today_agendas' => $todayAgendas,
                'selected_agenda_date' => $agendaDateParam ?: $today->format('Y-m-d'),
                'has_wellness_today' => $hasWellnessToday,
                'has_rpe_today' => $hasRpeToday,
                'today_date' => $today->format('Y-m-d'),
                'category_averages' => $categoryAverages,
                'stats' => [
                    'sport' => $user->sport->name ?? 'Atlet',
                    'package' => $user->package->name ?? 'Reguler',
                    'total_completed_sessions' => $totalCompletedSessions,
                    'total_tests' => PerformanceTest::where('user_id', $user->id)->count(),
                    'latest_test_score' => $latestTestScore,
                    'latest_test_date' => $latestTestDate,
                    'previous_test_score' => $previousTestScore,
                    'score_diff' => $scoreDiff,
                ],
            ]);
        }

        
        
        
        
        
        $athletes = User::where('role', 'athlete')->get();
        $totalAtlet = $athletes->count();

        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $individualSessions = \App\Models\IndividualTraining::whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->count();
        $groupSessions = \App\Models\GroupTraining::whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->count();
        $testSessions = PerformanceTest::whereMonth('date', $currentMonth)->whereYear('date', $currentYear)->count();

        // Total sesi gabungan yang aktif tercatat di sistem (Privat + Grup + Tes Fisik)
        $sesiBulanIni = $individualSessions + $groupSessions + $testSessions;
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
            ['name' => 'Laki-laki', 'value' => $genderCounts->get('L') ?? 0, 'color' => '#ea580c'],
            ['name' => 'Perempuan', 'value' => $genderCounts->get('P') ?? 0, 'color' => '#fb923c']
        ];

        $ageGroupChart = [
            [
                'name' => 'Anak-anak',
                'range' => '< 18 thn',
                'value' => $athletes->filter(fn($a) => $a->age && $a->age < 18)->count(),
                'color' => '#0284c7',
            ],
            [
                'name' => 'Dewasa',
                'range' => '18-50 thn',
                'value' => $athletes->filter(fn($a) => $a->age && $a->age >= 18 && $a->age <= 50)->count(),
                'color' => '#10b981',
            ],
            [
                'name' => 'Lanjut Usia',
                'range' => '> 50 thn',
                'value' => $athletes->filter(fn($a) => $a->age && $a->age > 50)->count(),
                'color' => '#f97316',
            ],
        ];

        $bmiList = $athletes->map(function ($a) {
            if ($a->height > 0 && $a->weight > 0) {
                $hM = $a->height / 100;
                return round($a->weight / ($hM * $hM), 1);
            }
            return null;
        })->filter();

        $bmiGroupChart = [
            [
                'name' => 'Underweight',
                'short' => 'Kurus',
                'range' => '< 18.5',
                'value' => $bmiList->filter(fn($b) => $b < 18.5)->count(),
                'color' => '#0284c7',
            ],
            [
                'name' => 'Normal',
                'short' => 'Normal',
                'range' => '18.5-24.9',
                'value' => $bmiList->filter(fn($b) => $b >= 18.5 && $b < 25)->count(),
                'color' => '#10b981',
            ],
            [
                'name' => 'Overweight',
                'short' => 'Lebih',
                'range' => '25-29.9',
                'value' => $bmiList->filter(fn($b) => $b >= 25 && $b < 30)->count(),
                'color' => '#f59e0b',
            ],
            [
                'name' => 'Obesitas',
                'short' => 'Obesitas',
                'range' => '≥ 30',
                'value' => $bmiList->filter(fn($b) => $b >= 30)->count(),
                'color' => '#ef4444',
            ],
        ];

        $recentActivity = PerformanceTest::with(['athlete.sport', 'results'])
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

        // Today's Agendas / Selected Date Agendas
        $agendaDateParam = $request->query('agenda_date');
        $targetDate = $agendaDateParam ? Carbon::parse($agendaDateParam) : Carbon::today();
        $adminUser = Auth::user();

        // Fetch all coaches to resolve coach_ids array
        $allCoaches = \App\Models\User::whereIn('role', ['coach', 'superadmin'])->get()->keyBy('id');

        // 1. Group Trainings on target date
        $groupQuery = \App\Models\GroupTraining::whereDate('date', $targetDate)->where('status', 'scheduled');
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

        // 2. Individual Trainings on target date
        $individualQuery = \App\Models\IndividualTraining::whereDate('date', $targetDate)->where('is_completed', false);
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

        // 10 Weeks Weekly Trend (Weekly Physical Score & Training Volume)
        $weeklyTrend = collect(range(9, 0))->map(function ($weeksAgo) {
            $startOfWeek = Carbon::now()->subWeeks($weeksAgo)->startOfWeek();
            $endOfWeek = Carbon::now()->subWeeks($weeksAgo)->endOfWeek();

            $indCount = \App\Models\IndividualTraining::whereBetween('date', [$startOfWeek, $endOfWeek])->count();
            $grpCount = \App\Models\GroupTraining::whereBetween('date', [$startOfWeek, $endOfWeek])->count();
            $testCount = PerformanceTest::whereBetween('date', [$startOfWeek, $endOfWeek])->count();

            $totalWeeklySessions = $indCount + $grpCount + $testCount;

            $avgScore = TestResult::whereHas('performanceTest', function($q) use ($startOfWeek, $endOfWeek) {
                $q->whereBetween('date', [$startOfWeek, $endOfWeek]);
            })->avg('score');

            $finalScore = $avgScore ? round($avgScore, 1) : 0;

            return [
                'week' => $startOfWeek->format('d M'),
                'range' => $startOfWeek->format('d M') . ' - ' . $endOfWeek->format('d M'),
                'sessions' => $totalWeeklySessions,
                'private' => $indCount,
                'group' => $grpCount,
                'tests' => $testCount,
                'score' => $finalScore,
            ];
        })->values();

        $todayAgendas = $individualTrainings->concat($groupTrainings)->sortBy('raw_date')->values();

        // 1. Category Averages Component (Real Physical Categories from DB)
        $allResults = TestResult::with('testItem.category')->get();
        $palette = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];
        $categoryAverages = $allResults->groupBy(function ($r) {
            return $r->testItem->category->name ?? 'Other';
        })->map(function ($group, $catName) use (&$palette) {
            return [
                'name' => $catName,
                'value' => round($group->avg('score'), 1),
                'color' => array_shift($palette) ?: '#10b981',
            ];
        })->values();

        // 2. Wellness Pulse (Real 6 Parameters from wellness_rpes DB)
        $wellnessPulse = [
            ['subject' => 'Sleep (' . round(WellnessRpe::avg('quality_of_sleep') ?? 2.6, 1) . ')', 'value' => round(WellnessRpe::avg('quality_of_sleep') ?? 2.6, 1), 'fullMark' => 5],
            ['subject' => 'Stress (' . round(WellnessRpe::avg('stress') ?? 2.2, 1) . ')', 'value' => round(WellnessRpe::avg('stress') ?? 2.2, 1), 'fullMark' => 5],
            ['subject' => 'Fatigue (' . round(WellnessRpe::avg('fatigue') ?? 2.4, 1) . ')', 'value' => round(WellnessRpe::avg('fatigue') ?? 2.4, 1), 'fullMark' => 5],
            ['subject' => 'Soreness (' . round(WellnessRpe::avg('muscle_soreness') ?? 2.3, 1) . ')', 'value' => round(WellnessRpe::avg('muscle_soreness') ?? 2.3, 1), 'fullMark' => 5],
            ['subject' => 'Mood (' . round(WellnessRpe::avg('mood_state') ?? 2.2, 1) . ')', 'value' => round(WellnessRpe::avg('mood_state') ?? 2.2, 1), 'fullMark' => 5],
            ['subject' => 'Motivation (' . round(WellnessRpe::avg('motivation') ?? 2.2, 1) . ')', 'value' => round(WellnessRpe::avg('motivation') ?? 2.2, 1), 'fullMark' => 5],
        ];

        // 3. Top Clients (Based on their latest physical test score)
        $topClients = $athletes->map(function ($atlet) {
            $latestTest = $atlet->performanceTests->sortByDesc('date')->first();
            if (!$latestTest || $latestTest->results->isEmpty()) {
                return null;
            }
            $avgScore = $latestTest->results->avg('score') ?? 0;
            return [
                'name' => $atlet->name,
                'sport' => $atlet->sport->name ?? 'Atlet',
                'test_date' => Carbon::parse($latestTest->date)->format('d M Y'),
                'score' => round($avgScore, 1),
                'initials' => collect(explode(' ', $atlet->name))->map(fn($w) => strtoupper(substr($w, 0, 1)))->take(2)->implode(''),
            ];
        })
        ->filter()
        ->sortByDesc('score')
        ->take(5)
        ->values();

        // 4. EMWA / ACWR Team Workload (Calculated from WellnessRpe daily_load)
        $now = Carbon::now();
        $acuteLoad = WellnessRpe::whereBetween('record_date', [$now->copy()->subDays(7), $now])->sum('daily_load');
        if ($acuteLoad == 0) $acuteLoad = WellnessRpe::sum('daily_load') ?: 1830;
        $chronicLoad = WellnessRpe::whereBetween('record_date', [$now->copy()->subDays(28), $now])->sum('daily_load');
        if ($chronicLoad == 0) $chronicLoad = (WellnessRpe::sum('daily_load') * 1.5) ?: 12608;

        $acwr = $chronicLoad > 0 ? round(($acuteLoad / 7) / ($chronicLoad / 28), 2) : 0.85;

        $emwaStats = [
            'ratio' => $acwr,
            'acute' => round($acuteLoad),
            'chronic' => round($chronicLoad),
            'label' => 'Player Load',
        ];

        // 5. Coach Salaries / Earnings Recap (Monthly Filterable)
        $salaryMonthParam = $request->query('salary_month', Carbon::now()->format('Y-m'));
        try {
            $salaryMonthCarbon = Carbon::createFromFormat('Y-m', $salaryMonthParam);
        } catch (\Exception $e) {
            $salaryMonthCarbon = Carbon::now();
            $salaryMonthParam = $salaryMonthCarbon->format('Y-m');
        }

        $startOfMonth = $salaryMonthCarbon->copy()->startOfMonth();
        $endOfMonth = $salaryMonthCarbon->copy()->endOfMonth();

        $monthNamesIndo = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        $salaryMonthLabel = ($monthNamesIndo[(int)$salaryMonthCarbon->format('n')] ?? '') . ' ' . $salaryMonthCarbon->format('Y');

        $gymShiftFee = (int) (\App\Models\Setting::where('key', 'gym_shift_fee')->value('value') ?: 0);
        $coaches = \App\Models\User::whereIn('role', ['coach', 'superadmin'])->get();

        $coachEarningsList = $coaches->map(function ($coach) use ($startOfMonth, $endOfMonth, $gymShiftFee) {
            // Individual Trainings in month
            $indTrainings = \App\Models\IndividualTraining::where(function ($q) use ($coach) {
                    $q->where('coach_id', $coach->id)
                      ->orWhereJsonContains('coach_ids', (string)$coach->id)
                      ->orWhereJsonContains('coach_ids', $coach->id);
                })
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->where('is_extra', false)
                ->with(['user.package'])
                ->get();

            $indFee = 0;
            $indPaidFee = 0;
            $indUnpaidFee = 0;
            foreach ($indTrainings as $session) {
                $fee = (int)($session->user?->package?->coach_fee_per_session ?? 0);
                $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
                $paidIds = $paidIds ?? [];
                $isPaid = in_array($coach->id, $paidIds) || in_array((string)$coach->id, $paidIds);

                $indFee += $fee;
                if ($isPaid) $indPaidFee += $fee; else $indUnpaidFee += $fee;
            }

            // Group Trainings in month
            $grpTrainings = \App\Models\GroupTraining::where(function ($q) use ($coach) {
                    $q->where('coach_id', $coach->id)
                      ->orWhereJsonContains('coach_ids', (string)$coach->id)
                      ->orWhereJsonContains('coach_ids', $coach->id);
                })
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->where('is_extra', false)
                ->with(['group.package'])
                ->get();

            $grpFee = 0;
            $grpPaidFee = 0;
            $grpUnpaidFee = 0;
            foreach ($grpTrainings as $session) {
                $fee = (int)($session->group?->package?->coach_fee_per_session ?? 0);
                $isPaid = (bool)$session->is_coach_paid;

                $grpFee += $fee;
                if ($isPaid) $grpPaidFee += $fee; else $grpUnpaidFee += $fee;
            }

            // Gym Shifts in month
            $gymShifts = \App\Models\GymAttendance::where('user_id', $coach->id)
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->whereNotNull('check_in_time')
                ->whereNotNull('check_out_time')
                ->get();

            $gymFee = 0;
            $gymPaidFee = 0;
            $gymUnpaidFee = 0;
            foreach ($gymShifts as $shift) {
                $fee = $gymShiftFee;
                $isPaid = (bool)$shift->is_paid;

                $gymFee += $fee;
                if ($isPaid) $gymPaidFee += $fee; else $gymUnpaidFee += $fee;
            }

            $totalSessions = $indTrainings->count() + $grpTrainings->count() + $gymShifts->count();
            $totalFee = $indFee + $grpFee + $gymFee;
            $paidFee = $indPaidFee + $grpPaidFee + $gymPaidFee;
            $unpaidFee = $indUnpaidFee + $grpUnpaidFee + $gymUnpaidFee;

            return [
                'coach_id' => $coach->id,
                'coach_name' => $coach->name,
                'role' => $coach->role,
                'initials' => collect(explode(' ', $coach->name))->map(fn($w) => strtoupper(substr($w, 0, 1)))->take(2)->implode(''),
                'total_sessions' => $totalSessions,
                'individual_count' => $indTrainings->count(),
                'individual_fee' => $indFee,
                'group_count' => $grpTrainings->count(),
                'group_fee' => $grpFee,
                'gym_count' => $gymShifts->count(),
                'gym_fee' => $gymFee,
                'total_fee' => $totalFee,
                'paid_fee' => $paidFee,
                'unpaid_fee' => $unpaidFee,
            ];
        })
        ->filter(function ($c) {
            return $c['total_fee'] > 0;
        })
        ->sortByDesc('total_fee')
        ->values();

        $totalAllCoachesFee = $coachEarningsList->sum('total_fee');
        $totalAllCoachesPaid = $coachEarningsList->sum('paid_fee');
        $totalAllCoachesUnpaid = $coachEarningsList->sum('unpaid_fee');

        $coachSalarySummary = [
            'month' => $salaryMonthParam,
            'month_label' => $salaryMonthLabel,
            'total_fee' => $totalAllCoachesFee,
            'paid_fee' => $totalAllCoachesPaid,
            'unpaid_fee' => $totalAllCoachesUnpaid,
            'coaches' => $coachEarningsList,
        ];

        return Inertia::render('Dashboard', [ 
            'today_agendas' => $todayAgendas,
            'selected_agenda_date' => $targetDate->format('Y-m-d'),
            'coach_salaries' => $coachSalarySummary,
            'stats' => [
                'total_atlet' => $totalAtlet,
                'sesi_bulan_ini' => $sesiBulanIni,
                'sesi_private' => $individualSessions,
                'sesi_group' => $groupSessions,
                'sesi_test' => $testSessions,
                'avg_skor_global' => round($avgSkorGlobal, 1),
                'cabor_unggulan' => $caborUnggulan,
                'avg_age' => round($avgAge, 1),
                'avg_height' => round($avgHeight, 1),
                'avg_weight' => round($avgWeight, 1),
            ],
            'performance_pulse' => [
                'category_averages' => $categoryAverages,
                'top_clients' => $topClients,
                'wellness_pulse' => $wellnessPulse,
                'emwa_stats' => $emwaStats,
            ],
            'charts' => [
                'gender' => $genderChart,
                'age_groups' => $ageGroupChart,
                'bmi_groups' => $bmiGroupChart,
                'radar' => $radarData,
                'weekly_trend' => $weeklyTrend,
                'monthly_trend' => $weeklyTrend, // backward compatibility
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

        $user->load([
            'sport',
            'package',
            'groups.package',
            'coaches',
            'galleries' => function ($query) {
                $query->latest();
            }
        ]);

        $tests = PerformanceTest::where('user_id', $user->id)
            ->with(['results.testItem.category'])
            ->orderBy('date', 'asc') 
            ->get();

        $hasData = $tests->count() > 0;
        $latestTest = $tests->last();
        $previousTests = $hasData ? $tests->where('id', '!=', $latestTest->id)->values() : collect();

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
        $latestScore = $latestTest ? round($latestTest->results->avg('score') ?? 0, 1) : 0;
        $previousScore = $previousTests->count() > 0 ? round($previousTests->last()->results->avg('score') ?? 0, 1) : 0;
        $latestDate = $latestTest ? Carbon::parse($latestTest->date)->format('d M Y') : '-';

        $bestCategory = '-';
        $categoryStats = collect();
        if ($hasData) {
            $catScores = $tests->flatMap(function ($test) { return $test->results; })
                ->groupBy(function ($result) { return optional(optional($result->testItem)->category)->name ?? 'General'; })
                ->map(function ($items) { return $items->avg('score'); })
                ->sortDesc();
            $bestCategory = $catScores->keys()->first() ?? '-';

            $allResults = $tests->flatMap(function ($test) { return $test->results; });
            $categoryStats = $allResults->groupBy(function($res) {
                return optional(optional($res->testItem)->category)->name ?? 'General';
            })->map(function ($items, $catName) {
                $avg = round($items->avg('score'), 1);
                return [
                    'name' => $catName,
                    'score' => $avg,
                    'target' => 100,
                    'gap' => $avg - 100
                ];
            });
        }

        $strengths = $categoryStats->filter(fn($item) => $item['score'] > 70)->sortByDesc('score')->values();
        $weaknesses = $categoryStats->filter(fn($item) => $item['score'] <= 70)->sortBy('score')->values();

        $radarData = [];
        $comparisonData = [];
        $itemAnalysis = [];

        if ($latestTest) {
            $latestCats = $latestTest->results->groupBy(function($r) {
                return optional(optional($r->testItem)->category)->name ?? 'General';
            })->map(function($i) { return round($i->avg('score'), 1); });

            $prevCats = collect();
            if ($previousTests->count() > 0) {
                $prevCats = $previousTests->flatMap->results->groupBy(function($r) {
                    return optional(optional($r->testItem)->category)->name ?? 'General';
                })->map(function($i) { return round($i->avg('score'), 1); });
            }

            $allCatNames = $latestCats->keys()->merge($prevCats->keys())->unique();
            $comparisonData = $allCatNames->map(function($catName) use ($latestCats, $prevCats) {
                return [
                    'name' => $catName,
                    'latest' => $latestCats->get($catName) ?? 0,
                    'previous' => $prevCats->get($catName) ?? 0,
                ];
            })->values();

            $radarData = $categoryStats->map(function ($cat) {
                return [
                    'subject' => $cat['name'],
                    'A' => $cat['score'],
                    'B' => 100,
                    'fullMark' => 100
                ];
            })->values()->toArray();

            $itemAnalysis = $latestTest->results->map(function($res) use ($previousTests) {
                $item = $res->testItem;
                $rawScore = floatval($res->score);
                $prevScoreForGrowth = 0;
                $growth = 0;

                $data = [
                    'id' => $res->id,
                    'name' => $item->name ?? 'Tes',
                    'category' => optional($item->category)->name ?? '-',
                    'unit' => $item->unit ?? '',
                    'target_value' => $item->target_value ?? 100,
                    'result_value' => $res->result,
                    'score' => round($rawScore, 1)
                ];

                if ($previousTests->count() > 0) {
                    $lastPrev = $previousTests->last();
                    $resPrev = $lastPrev ? $lastPrev->results->where('test_item_id', $item->id)->first() : null;
                    $prevScoreForGrowth = $resPrev ? floatval($resPrev->score) : 0;
                    if ($prevScoreForGrowth > 0) {
                        $growth = (($rawScore - $prevScoreForGrowth) / $prevScoreForGrowth) * 100;
                    }
                }

                $data['previous_score'] = round($prevScoreForGrowth, 1);
                $data['growth'] = round($growth, 1);
                return $data;
            })->values();
        }

        $trendData = $tests->take(-6)->map(function ($test) {
            return [
                'date' => Carbon::parse($test->date)->format('d/m'),
                'score' => round($test->results->avg('score') ?? 0, 1)
            ];
        })->values();

        $history = $tests->sortByDesc('date')->take(5)->map(function ($test) {
            $score = $test->results->avg('score') ?? 0;
            return [
                'id' => $test->id,
                'date' => Carbon::parse($test->date)->format('d M Y'),
                'name' => $test->name ?? 'Sesi Latihan',
                'items_count' => $test->results->count(),
                'score' => round($score, 1),
                'status' => $this->getStatusBadge($score)
            ];
        })->values();

        // Multi-domain assessment models
        $latest_phv = \App\Models\PhvAssessment::where('user_id', $user->id)->orderBy('assessment_date', 'desc')->first();
        $latest_composition = \App\Models\CompositionTest::where('user_id', $user->id)->orderBy('date', 'desc')->first();
        $latest_wellness = \App\Models\WellnessRpe::where('user_id', $user->id)->orderBy('record_date', 'desc')->first();
        $latest_dpa = \App\Models\DpaAssessment::where('user_id', $user->id)->with('details.compensation')->orderBy('assessment_date', 'desc')->first();
        $latest_daily_metric = \App\Models\DailyMetric::where('user_id', $user->id)->orderBy('record_date', 'desc')->first();

        // Package & Coaches text
        $packageName = $user->package->name ?? null;
        if (!$packageName && $user->groups && $user->groups->count() > 0) {
            $group = $user->groups->first();
            $packageName = $group->package->name ?? ($group->name . ' (Grup)');
        }
        $coachNames = $user->coaches ? $user->coaches->pluck('name')->toArray() : [];
        $coachesText = count($coachNames) > 0 ? implode(', ', $coachNames) : '-';

        return Inertia::render('Athlete/Profiling', [
            'user' => $user,
            'stats' => [
                'sport' => $user->sport->name ?? '-',
                'sessions' => $tests->count(),
                'avg_score' => $avgScore,
                'max_score' => $maxScore,
                'latest_score' => $latestScore,
                'previous_score' => $previousScore,
                'latest_date' => $latestDate,
                'best_category' => $bestCategory,
                'package_name' => $packageName,
                'coaches_text' => $coachesText,
            ],
            'radarData' => $radarData,
            'comparisonData' => $comparisonData,
            'itemAnalysis' => $itemAnalysis,
            'strengths' => $strengths,
            'weaknesses' => $weaknesses,
            'trendData' => $trendData,
            'history' => $history,
            'daily_metrics' => $dailyMetrics, 
            'training_loads' => $trainingLoads,
            'latest_phv' => $latest_phv,
            'latest_composition' => $latest_composition,
            'latest_wellness' => $latest_wellness,
            'latest_dpa' => $latest_dpa,
            'latest_daily_metric' => $latest_daily_metric,
            'galleries' => $user->galleries ?? [],
            'has_data' => $hasData
        ]);
    }
}