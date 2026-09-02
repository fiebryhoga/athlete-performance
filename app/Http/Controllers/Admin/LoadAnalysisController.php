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
            $groupTrainingsRaw = GroupTraining::where(function($query) use ($user, $groupIds) {
                $query->whereJsonContains('attendee_ids', $user->id)
                      ->orWhereIn('training_group_id', $groupIds);
            })
            ->whereHas('blocks.items', function ($q) {
                $q->whereNotNull('load')->where('load', '!=', '');
            })
            ->get();
            
            $validGroupCount = 0;
            foreach ($groupTrainingsRaw as $training) {
                $isGroupMember = $groupIds->contains($training->training_group_id);
                $attendees = $training->attendee_ids ?: [];
                $isLegacy = is_null($training->attendee_ids) || empty($training->attendee_ids);
                $isAttending = in_array($user->id, $attendees) || ($isLegacy && $isGroupMember);
                
                if (!($isGroupMember && !$isAttending)) {
                    // Not absent
                    $validGroupCount++;
                }
            }
            $groupCount = $validGroupCount;

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
        $groupTrainingsRaw = GroupTraining::where(function($query) use ($user, $groupIds) {
                $query->whereJsonContains('attendee_ids', $user->id)
                      ->orWhereIn('training_group_id', $groupIds);
            })
            ->with(['blocks.items.exercise.category', 'group'])
            ->orderBy('date', 'asc')
            ->orderBy('session_number', 'asc')
            ->get();
            
        // Filter out absent sessions
        $groupTrainings = collect();
        foreach ($groupTrainingsRaw as $training) {
            $isGroupMember = $groupIds->contains($training->training_group_id);
            $attendees = $training->attendee_ids ?: [];
            $isLegacy = is_null($training->attendee_ids) || empty($training->attendee_ids);
            $isAttending = in_array($user->id, $attendees) || ($isLegacy && $isGroupMember);
            
            if (!($isGroupMember && !$isAttending)) {
                $groupTrainings->push($training);
            }
        }

        // 3. Calculate volume load per session
        $sessionsData = collect();

        foreach ($individualTrainings as $training) {
            $sessionLoad = $this->calculateSessionLoad($training->blocks, $user->id);
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
            $sessionLoad = $this->calculateSessionLoad($training->blocks, $user->id);
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

        // 4b. Aggregate per-body-part / muscle stats
        $bodyPartStats = [];
        foreach ($sessionsData as $session) {
            foreach ($session['exercises'] as $exercise) {
                $bodyParts = $exercise['body_parts'] ?? [];
                if (!empty($bodyParts) && is_array($bodyParts)) {
                    foreach ($bodyParts as $part) {
                        if (!isset($bodyPartStats[$part])) {
                            $bodyPartStats[$part] = [
                                'name' => $part,
                                'total_volume' => 0,
                                'total_sets' => 0,
                                'total_reps' => 0,
                                'session_count' => 0,
                                'exercises' => [],
                            ];
                        }
                        $bodyPartStats[$part]['total_volume'] += $exercise['volume'];
                        $bodyPartStats[$part]['total_sets'] += $exercise['sets'];
                        $bodyPartStats[$part]['total_reps'] += $exercise['reps'];
                        $bodyPartStats[$part]['session_count']++;

                        $exKey = $exercise['name'];
                        if (!isset($bodyPartStats[$part]['exercises'][$exKey])) {
                            $bodyPartStats[$part]['exercises'][$exKey] = [
                                'name' => $exercise['name'],
                                'category' => $exercise['category'] ?? 'Lainnya',
                                'volume' => 0,
                                'sets' => 0,
                                'reps' => 0,
                            ];
                        }
                        $bodyPartStats[$part]['exercises'][$exKey]['volume'] += $exercise['volume'];
                        $bodyPartStats[$part]['exercises'][$exKey]['sets'] += $exercise['sets'];
                        $bodyPartStats[$part]['exercises'][$exKey]['reps'] += $exercise['reps'];
                    }
                }
            }
        }

        // Convert exercises dictionary to sorted array for each body part
        foreach ($bodyPartStats as &$bp) {
            $bp['exercises'] = collect($bp['exercises'])->sortByDesc('volume')->values()->all();
            $bp['exercise_count'] = count($bp['exercises']);
        }
        unset($bp);

        $bodyPartStats = collect($bodyPartStats)->sortByDesc('total_volume')->values()->all();

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
            'bodyPartStats' => $bodyPartStats,
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
     * Helper to safely parse numeric value from strings like "60 second", "12/12", "2.5kg", etc.
     */
    private function parseNumericValue($val)
    {
        if (is_null($val)) return 0;
        if (is_numeric($val)) return floatval($val);
        if (is_string($val)) {
            $val = trim($val);
            // Handle fractional formats like "12/12"
            if (strpos($val, '/') !== false) {
                $parts = explode('/', $val);
                $sum = 0;
                foreach ($parts as $p) {
                    if (preg_match('/([0-9]+(?:\.[0-9]+)?)/', $p, $m)) {
                        $sum += floatval($m[1]);
                    }
                }
                return $sum;
            }
            if (preg_match('/([0-9]+(?:\.[0-9]+)?)/', $val, $m)) {
                return floatval($m[1]);
            }
        }
        return 0;
    }

    /**
     * Calculate total volume load for a set of training blocks across all training types
     */
    private function calculateSessionLoad($blocks, $athleteId = null)
    {
        $totalVolume = 0;
        $exercises = [];
        $maxLoad = 0;
        $exerciseCount = 0;

        foreach ($blocks as $block) {
            // Filter out blocks not assigned to this athlete
            if ($athleteId && is_array($block->athlete_ids) && count($block->athlete_ids) > 0) {
                if (!in_array($athleteId, $block->athlete_ids)) {
                    continue;
                }
            }
            foreach ($block->items as $item) {
                if (!$item->exercise) continue;

                $exerciseName = $item->exercise->name;
                $categoryName = $item->exercise->category ? $item->exercise->category->name : ($block->category ?: 'Lainnya');
                $bodyParts = $item->exercise->body_parts ?? [];

                // Calculate volume from detailed array or simple fields
                $itemVolume = 0;
                $itemSets = 0;
                $itemReps = 0;
                $itemMaxLoad = 0;

                $hasLoads = !empty($item->load_array) && is_array($item->load_array);
                $hasReps = !empty($item->reps_array) && is_array($item->reps_array);
                $hasMinutes = !empty($item->minutes_array) && is_array($item->minutes_array);
                $hasDist = !empty($item->distance_array) && is_array($item->distance_array);

                if ($hasLoads || $hasReps || $hasMinutes || $hasDist) {
                    $setCount = max(
                        $hasLoads ? count($item->load_array) : 0,
                        $hasReps ? count($item->reps_array) : 0,
                        $hasMinutes ? count($item->minutes_array) : 0,
                        $hasDist ? count($item->distance_array) : 0,
                        floatval($item->sets ?? 1)
                    );
                    $itemSets = $setCount;

                    for ($i = 0; $i < $setCount; $i++) {
                        $setLoad = $hasLoads && isset($item->load_array[$i]) ? $this->parseNumericValue($item->load_array[$i]) : $this->parseNumericValue($item->load ?? 0);
                        $setReps = $hasReps && isset($item->reps_array[$i]) ? $this->parseNumericValue($item->reps_array[$i]) : $this->parseNumericValue($item->reps ?? 0);
                        $setMins = $hasMinutes && isset($item->minutes_array[$i]) ? $this->parseNumericValue($item->minutes_array[$i]) : 0;
                        $setD = $hasDist && isset($item->distance_array[$i]) ? $this->parseNumericValue($item->distance_array[$i]) : 0;

                        if ($setLoad > 0 && $setReps > 0) {
                            $itemVolume += $setReps * $setLoad;
                        } elseif ($setReps > 0) {
                            // Bodyweight or agility reps (e.g. 1 AU per rep / second)
                            $itemVolume += $setReps * 1;
                        } elseif ($setMins > 0) {
                            // Cardio in minutes (e.g. minutes * intensity)
                            $intensity = floatval($item->intensity ?? 5);
                            $itemVolume += $setMins * max(1, $intensity);
                        } elseif ($setD > 0) {
                            // Distance in meters
                            $itemVolume += ($setD / 10);
                        } else {
                            // Nominal load for completed set
                            $itemVolume += 10;
                        }

                        $itemMaxLoad = max($itemMaxLoad, $setLoad);
                        $itemReps += $setReps;
                    }
                } else {
                    // Fallback to simple fields
                    $sets = max(1, floatval($item->sets ?? 0));
                    $reps = $this->parseNumericValue($item->reps ?? 0);
                    $load = $this->parseNumericValue($item->load ?? 0);
                    $duration = $this->parseNumericValue($item->duration ?? 0);

                    if ($reps > 0 && $load > 0) {
                        $itemVolume = $sets * $reps * $load;
                        $itemSets = $sets;
                        $itemReps = $sets * $reps;
                        $itemMaxLoad = $load;
                    } elseif ($reps > 0) {
                        // Bodyweight reps
                        $itemVolume = $sets * $reps * 1;
                        $itemSets = $sets;
                        $itemReps = $sets * $reps;
                        $itemMaxLoad = 0;
                    } elseif ($duration > 0) {
                        $intensity = floatval($item->intensity ?? 5);
                        $itemVolume = $sets * ($duration > 60 ? $duration / 60 : $duration) * max(1, $intensity);
                        $itemSets = $sets;
                    } else {
                        // Nominal set volume
                        $itemVolume = $sets * 10;
                        $itemSets = $sets;
                    }
                }

                if ($itemVolume > 0) {
                    $exercises[] = [
                        'name' => $exerciseName,
                        'category' => $categoryName,
                        'body_parts' => $bodyParts,
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
