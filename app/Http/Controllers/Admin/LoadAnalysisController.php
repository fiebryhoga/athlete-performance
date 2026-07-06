<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\IndividualTraining;
use App\Models\GroupTraining;
use App\Models\TrainingBlock;
use App\Models\TrainingBlockItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class LoadAnalysisController extends Controller
{
    /**
     * Index: List all athletes for load analysis
     */
    public function index()
    {
        if (Auth::user()->role === 'athlete') {
            return redirect()->route('admin.load-analysis.show', Auth::id());
        }

        $query = User::where('role', 'athlete')->with('sport');

        if (Auth::user()->role === 'coach') {
            $query->whereHas('coaches', function ($q) {
                $q->where('coach_id', Auth::id());
            });
        }

        $athletes = $query->get()->map(function ($user) {
            // Count individual training sessions with load data
            $individualCount = IndividualTraining::where('user_id', $user->id)
                ->whereHas('blocks.items', function ($q) {
                    $q->whereNotNull('load')->where('load', '!=', '');
                })
                ->count();

            // Count group training sessions with load data
            $groupIds = $user->groups()->pluck('training_groups.id');
            $groupCount = GroupTraining::whereIn('training_group_id', $groupIds)
                ->whereHas('blocks.items', function ($q) {
                    $q->whereNotNull('load')->where('load', '!=', '');
                })
                ->count();

            $user->load_session_count = $individualCount + $groupCount;
            return $user;
        });

        return Inertia::render('Admin/LoadAnalysis/Index', [
            'athletes' => $athletes,
        ]);
    }

    /**
     * Show: Detailed load analysis for a specific athlete
     */
    public function show(User $user)
    {
        if ($user->role !== 'athlete') {
            abort(404);
        }

        $user->load(['sport', 'package']);

        // 1. Get individual training sessions with blocks
        $individualTrainings = IndividualTraining::where('user_id', $user->id)
            ->with(['blocks.items.exercise.category'])
            ->orderBy('date', 'asc')
            ->get();

        // 2. Get group training sessions where this athlete participates
        $groupIds = $user->groups()->pluck('training_groups.id');
        $groupTrainings = GroupTraining::whereIn('training_group_id', $groupIds)
            ->with(['blocks.items.exercise.category', 'group'])
            ->orderBy('date', 'asc')
            ->get();

        // 3. Calculate volume load per session
        $sessionsData = collect();

        foreach ($individualTrainings as $training) {
            $sessionLoad = $this->calculateSessionLoad($training->blocks);
            if ($sessionLoad['total_volume'] > 0) {
                $sessionsData->push([
                    'id' => $training->id,
                    'type' => 'individual',
                    'date' => $training->date->format('Y-m-d'),
                    'name' => $training->name ?: "Sesi {$training->session_number}",
                    'session_number' => $training->session_number,
                    'training_type' => $training->training_type,
                    'total_volume' => $sessionLoad['total_volume'],
                    'exercise_count' => $sessionLoad['exercise_count'],
                    'exercises' => $sessionLoad['exercises'],
                    'max_load' => $sessionLoad['max_load'],
                ]);
            }
        }

        foreach ($groupTrainings as $training) {
            $sessionLoad = $this->calculateSessionLoad($training->blocks);
            if ($sessionLoad['total_volume'] > 0) {
                $sessionsData->push([
                    'id' => $training->id,
                    'type' => 'group',
                    'date' => $training->date->format('Y-m-d'),
                    'name' => $training->name ?: ($training->group ? $training->group->name : "Sesi Grup {$training->session_number}"),
                    'session_number' => $training->session_number,
                    'training_type' => $training->training_type ?? 'Grup',
                    'total_volume' => $sessionLoad['total_volume'],
                    'exercise_count' => $sessionLoad['exercise_count'],
                    'exercises' => $sessionLoad['exercises'],
                    'max_load' => $sessionLoad['max_load'],
                ]);
            }
        }

        // Sort by date
        $sessionsData = $sessionsData->sortBy('date')->values();

        // 4. Aggregate per-exercise stats
        $exerciseStats = [];
        foreach ($sessionsData as $session) {
            foreach ($session['exercises'] as $exercise) {
                $exName = $exercise['name'];
                if (!isset($exerciseStats[$exName])) {
                    $exerciseStats[$exName] = [
                        'name' => $exName,
                        'category' => $exercise['category'] ?? 'Lainnya',
                        'total_volume' => 0,
                        'max_load' => 0,
                        'session_count' => 0,
                        'total_sets' => 0,
                        'total_reps' => 0,
                    ];
                }
                $exerciseStats[$exName]['total_volume'] += $exercise['volume'];
                $exerciseStats[$exName]['max_load'] = max($exerciseStats[$exName]['max_load'], $exercise['max_load']);
                $exerciseStats[$exName]['session_count']++;
                $exerciseStats[$exName]['total_sets'] += $exercise['sets'];
                $exerciseStats[$exName]['total_reps'] += $exercise['reps'];
            }
        }

        // Sort by total volume desc, take top exercises
        $exerciseStats = collect($exerciseStats)->sortByDesc('total_volume')->values()->all();

        // 5. Weekly aggregation with Monotony, Strain, ACWR, and StdDev
        $weeklyData = [];
        
        if ($sessionsData->count() > 0) {
            // Find start date (Monday of the first session)
            $firstDate = new \DateTime($sessionsData->first()['date']);
            $startDay = (int) $firstDate->format('N') - 1;
            $currentMonday = clone $firstDate;
            $currentMonday->modify("-{$startDay} days");
            
            // Find end date (Sunday of the last session)
            $lastDate = new \DateTime($sessionsData->last()['date']);
            $endDay = (int) $lastDate->format('N') - 1;
            $endLimit = clone $lastDate;
            $endLimit->modify("+" . (6 - $endDay) . " days");

            $groupedByDate = $sessionsData->groupBy('date')->map(function($daySessions) {
                return $daySessions->sum('total_volume');
            });

            $weekIndex = 0;
            while ($currentMonday <= $endLimit) {
                $weekEnd = clone $currentMonday;
                $weekEnd->modify('+6 days');
                
                $dailyVolumes = [];
                $weeklyLoad = 0;
                $sessionCount = 0;
                $maxSingleSession = 0;

                for ($i = 0; $i < 7; $i++) {
                    $d = clone $currentMonday;
                    $d->modify("+{$i} days");
                    $dateStr = $d->format('Y-m-d');
                    
                    $dayVolume = $groupedByDate->get($dateStr, 0);
                    $dailyVolumes[] = $dayVolume;
                    $weeklyLoad += $dayVolume;
                    
                    // Count sessions in this day for max/count tracking
                    $sessionsInDay = $sessionsData->where('date', $dateStr);
                    $sessionCount += $sessionsInDay->count();
                    $maxSingleSession = max($maxSingleSession, $sessionsInDay->max('total_volume') ?? 0);
                }

                $meanLoad = $weeklyLoad / 7;
                
                // Calculate sample variance (divide by 6)
                $variance = 0;
                foreach ($dailyVolumes as $vol) {
                    $variance += pow($vol - $meanLoad, 2);
                }
                $variance = $variance / 6;
                $stdDev = sqrt($variance);
                
                $monotony = $stdDev > 0 ? ($meanLoad / $stdDev) : ($meanLoad > 0 ? $meanLoad : 0);
                $strain = $weeklyLoad * $monotony;

                $weeklyData[] = [
                    'week_start' => $currentMonday->format('Y-m-d'),
                    'week_end' => $weekEnd->format('Y-m-d'),
                    'label' => $currentMonday->format('d M') . ' - ' . $weekEnd->format('d M Y'),
                    'total_volume' => $weeklyLoad,
                    'session_count' => $sessionCount,
                    'max_single_session' => $maxSingleSession,
                    'mean_load' => round($meanLoad, 1),
                    'std_dev' => round($stdDev, 1),
                    'monotony' => round($monotony, 2),
                    'strain' => round($strain, 1),
                    'acwr' => 0, // Calculated in next step
                    'daily_volumes' => [
                        'mon' => round($dailyVolumes[0], 1),
                        'tue' => round($dailyVolumes[1], 1),
                        'wed' => round($dailyVolumes[2], 1),
                        'thu' => round($dailyVolumes[3], 1),
                        'fri' => round($dailyVolumes[4], 1),
                        'sat' => round($dailyVolumes[5], 1),
                        'sun' => round($dailyVolumes[6], 1),
                    ]
                ];

                $currentMonday->modify('+7 days');
                $weekIndex++;
            }

            // Calculate ACWR
            foreach ($weeklyData as $index => &$week) {
                if ($index > 0) {
                    $sumPrevLoad = 0;
                    $countPrevWeeks = 0;
                    
                    $startPrev = max(0, $index - 4);
                    for ($j = $index - 1; $j >= $startPrev; $j--) {
                        $sumPrevLoad += $weeklyData[$j]['total_volume'];
                        $countPrevWeeks++;
                    }
                    
                    // For ACWR we usually divide by 4 (chronic load over 4 weeks), but if less weeks exist, we average what we have.
                    // Usually it's strictly a 4-week moving average. Let's use 4 if possible, else the count.
                    $chronicLoad = $sumPrevLoad / ($countPrevWeeks === 4 ? 4 : max(1, $countPrevWeeks));
                    $week['acwr'] = $chronicLoad > 0 ? round($week['total_volume'] / $chronicLoad, 2) : 0;
                }
            }
        }

        // 6. Summary stats
        $totalVolume = $sessionsData->sum('total_volume');
        $avgPerSession = $sessionsData->count() > 0 ? round($totalVolume / $sessionsData->count()) : 0;
        $maxSingleSession = $sessionsData->max('total_volume') ?? 0;
        $overallMaxLoad = $sessionsData->max('max_load') ?? 0;

        return Inertia::render('Admin/LoadAnalysis/Show', [
            'athlete' => $user,
            'sessions' => $sessionsData->all(),
            'exerciseStats' => $exerciseStats,
            'weeklyData' => $weeklyData,
            'summary' => [
                'total_volume' => $totalVolume,
                'avg_per_session' => $avgPerSession,
                'max_single_session' => $maxSingleSession,
                'max_load' => $overallMaxLoad,
                'total_sessions' => $sessionsData->count(),
            ],
        ]);
    }

    /**
     * Calculate total volume load for a set of training blocks
     */
    private function calculateSessionLoad($blocks)
    {
        $totalVolume = 0;
        $exercises = [];
        $maxLoad = 0;
        $exerciseCount = 0;

        foreach ($blocks as $block) {
            foreach ($block->items as $item) {
                if (!$item->exercise) continue;

                $exerciseName = $item->exercise->name;
                $categoryName = $item->exercise->category ? $item->exercise->category->name : 'Lainnya';

                // Calculate volume from array data if available, otherwise from simple fields
                $itemVolume = 0;
                $itemSets = 0;
                $itemReps = 0;
                $itemMaxLoad = 0;

                if (!empty($item->load_array) && !empty($item->reps_array)) {
                    // Use detailed per-set data
                    $loads = is_array($item->load_array) ? $item->load_array : [];
                    $reps = is_array($item->reps_array) ? $item->reps_array : [];

                    $setCount = max(count($loads), count($reps));
                    $itemSets = $setCount;

                    for ($i = 0; $i < $setCount; $i++) {
                        $setLoad = isset($loads[$i]) ? floatval($loads[$i]) : 0;
                        $setReps = isset($reps[$i]) ? floatval($reps[$i]) : 0;
                        $itemVolume += $setReps * $setLoad;
                        $itemMaxLoad = max($itemMaxLoad, $setLoad);
                        $itemReps += $setReps;
                    }
                } else {
                    // Fallback to simple sets × reps × load
                    $sets = floatval($item->sets ?? 0);
                    $reps = floatval($item->reps ?? 0);
                    $load = floatval($item->load ?? 0);

                    if ($sets > 0 && $reps > 0 && $load > 0) {
                        $itemVolume = $sets * $reps * $load;
                        $itemSets = $sets;
                        $itemReps = $sets * $reps;
                        $itemMaxLoad = $load;
                    }
                }

                if ($itemVolume > 0) {
                    $exercises[] = [
                        'name' => $exerciseName,
                        'category' => $categoryName,
                        'volume' => round($itemVolume),
                        'sets' => $itemSets,
                        'reps' => $itemReps,
                        'max_load' => $itemMaxLoad,
                    ];

                    $totalVolume += $itemVolume;
                    $maxLoad = max($maxLoad, $itemMaxLoad);
                    $exerciseCount++;
                }
            }
        }

        return [
            'total_volume' => round($totalVolume),
            'exercise_count' => $exerciseCount,
            'exercises' => $exercises,
            'max_load' => $maxLoad,
        ];
    }
}
