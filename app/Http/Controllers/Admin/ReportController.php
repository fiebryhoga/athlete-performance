<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\IndividualTraining;
use App\Models\GroupTraining;
use App\Models\TrainingGroup;
use App\Models\SharedPackage;
use App\Models\GymAttendance;
use App\Models\Setting;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display a comprehensive recap of sessions for athletes, groups, and coaches.
     */
    public function sessionRecap()
    {
        // ─── ATHLETES (Individual) ───
        $athletes = User::where('role', 'athlete')
            ->with(['sport', 'package'])
            ->get()
            ->map(function ($athlete) {
                $trainings = IndividualTraining::where('user_id', $athlete->id)
                    ->with('coach')
                    ->orderBy('date', 'desc')
                    ->get();

                $packageSessionCount = $athlete->package->session_count ?? null;

                $athlete->package_name = $athlete->package->name ?? null;
                $athlete->package_type = $athlete->package->package_type ?? ($athlete->package ? 'quota' : null);
                $athlete->package_session_count = $packageSessionCount;
                $athlete->total_sessions = $trainings->count();
                $athlete->regular_sessions = $trainings->where('is_extra', false)->count();
                $athlete->extra_sessions = $trainings->where('is_extra', true)->count();
                $athlete->completed_sessions = $trainings->where('status', 'completed')->count();
                $athlete->scheduled_sessions = $trainings->whereNotIn('status', ['completed'])->count();
                $athlete->unpaid_sessions = $trainings->where('is_athlete_paid', false)->count();
                $athlete->unpaid_regular_sessions = $trainings->where('is_athlete_paid', false)->where('is_extra', false)->count();
                $athlete->unpaid_extra_sessions = $trainings->where('is_athlete_paid', false)->where('is_extra', true)->count();

                // Session list for drill-down (hanya yang belum dibayar)
                $athlete->sessions = $trainings->where('is_athlete_paid', false)->map(function ($t) {
                    $coachNames = [];
                    if ($t->coach) {
                        $coachNames[] = $t->coach->name;
                    }
                    if ($t->coach_ids && is_array($t->coach_ids)) {
                        $extraCoaches = User::whereIn('id', $t->coach_ids)
                            ->where('id', '!=', $t->coach_id)
                            ->pluck('name')
                            ->toArray();
                        $coachNames = array_merge($coachNames, $extraCoaches);
                    }

                    return [
                        'id' => $t->id,
                        'date' => $t->date,
                        'status' => $t->status,
                        'session_number' => $t->session_number,
                        'name' => $t->name,
                        'training_type' => $t->training_type,
                        'coaches' => array_unique($coachNames),
                        'is_paid' => (bool) $t->is_athlete_paid,
                        'is_extra' => (bool) $t->is_extra,
                    ];
                })->values();

                // Unset relationship to keep payload clean
                unset($athlete->package);

                return $athlete;
            });

        // ─── GROUPS ───
        $groups = TrainingGroup::with(['package', 'members'])
            ->get()
            ->map(function ($group) {
                $trainings = GroupTraining::where('training_group_id', $group->id)
                    ->with('coach')
                    ->orderBy('date', 'desc')
                    ->get();

                $packageSessionCount = $group->package->session_count ?? null;

                $group->package_name = $group->package->name ?? null;
                $group->package_type = $group->package->package_type ?? ($group->package ? 'quota' : null);
                $group->package_session_count = $packageSessionCount;
                $group->members_count = $group->members->count();
                $group->total_sessions = $trainings->count();
                $group->regular_sessions = $trainings->where('is_extra', false)->count();
                $group->extra_sessions = $trainings->where('is_extra', true)->count();
                $group->completed_sessions = $trainings->where('status', 'completed')->count();
                $group->unpaid_sessions = $trainings->where('is_group_paid', false)->count();
                $group->unpaid_regular_sessions = $trainings->where('is_group_paid', false)->where('is_extra', false)->count();
                $group->unpaid_extra_sessions = $trainings->where('is_group_paid', false)->where('is_extra', true)->count();

                // Session list for drill-down (hanya yang belum dibayar)
                $group->sessions = $trainings->where('is_group_paid', false)->map(function ($t) {
                    $coachNames = [];
                    if ($t->coach) {
                        $coachNames[] = $t->coach->name;
                    }
                    if ($t->coach_ids && is_array($t->coach_ids)) {
                        $extraCoaches = User::whereIn('id', $t->coach_ids)
                            ->where('id', '!=', $t->coach_id)
                            ->pluck('name')
                            ->toArray();
                        $coachNames = array_merge($coachNames, $extraCoaches);
                    }

                    return [
                        'id' => $t->id,
                        'date' => $t->date ? $t->date->format('Y-m-d') : null,
                        'status' => $t->status,
                        'session_number' => $t->session_number,
                        'name' => $t->name,
                        'coaches' => array_unique($coachNames),
                        'is_paid' => (bool) $t->is_group_paid,
                        'is_extra' => (bool) $t->is_extra,
                    ];
                })->values();

                // Clean up relationships
                $memberNames = $group->members->pluck('name')->toArray();
                $group->member_names = $memberNames;
                unset($group->members, $group->package);

                return $group;
            });

        // ─── COACHES ───
        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];

        $allRecordedMonths = collect();

        $coaches = User::where('role', 'coach')
            ->get()
            ->map(function ($coach) use ($monthNames, &$allRecordedMonths) {
                // Individual sessions (hanya yang sudah terselesaikan)
                $individualTrainings = IndividualTraining::where(function ($q) use ($coach) {
                        $q->where('coach_id', $coach->id)
                          ->orWhereJsonContains('coach_ids', (string)$coach->id)
                          ->orWhereJsonContains('coach_ids', $coach->id);
                    })
                    ->where(function ($q) {
                        $q->where('status', 'completed')
                          ->orWhere('is_completed', true);
                    })
                    ->with(['user.package', 'user.sport'])
                    ->get();

                // Group sessions (hanya yang sudah terselesaikan)
                $groupTrainings = GroupTraining::where(function ($q) use ($coach) {
                        $q->where('coach_id', $coach->id)
                          ->orWhereJsonContains('coach_ids', (string)$coach->id)
                          ->orWhereJsonContains('coach_ids', $coach->id);
                    })
                    ->where(function ($q) {
                        $q->where('status', 'completed')
                          ->orWhereHas('members_pivot', function ($mq) {
                              $mq->where('is_completed', true);
                          });
                    })
                    ->with(['group.package', 'members_pivot'])
                    ->get();

                // Gym shift fee
                $gymShiftFee = (int) ($coach->effective_gym_fee ?? 0);
                $gymShifts = GymAttendance::where('user_id', $coach->id)
                    ->whereNotNull('check_in_time')
                    ->whereNotNull('check_out_time')
                    ->get();

                // ── Map All Individual Sessions ──
                $allIndividual = $individualTrainings->where('is_extra', false)->map(function ($session) use ($coach) {
                    $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
                    $paidIds = $paidIds ?? [];
                    $isPaid = in_array($coach->id, $paidIds) || in_array((string)$coach->id, $paidIds);
                    $fee = (int)($session->user?->package?->coach_fee_per_session ?? 0);
                    $dateStr = $session->date ? $session->date->format('Y-m-d') : null;
                    $monthKey = $session->date ? $session->date->format('Y-m') : null;
                    $clientName = $session->user?->name ?? 'Atlet';
                    $clientSport = $session->user?->sport?->name ?? null;

                    return [
                        'id' => 'ind_'.$session->id,
                        'date' => $dateStr,
                        'month_key' => $monthKey,
                        'client_name' => $clientName,
                        'client_sport' => $clientSport,
                        'name' => $session->name ?: 'Program Latihan',
                        'session_number' => $session->session_number,
                        'status' => $session->status,
                        'type' => 'Individu',
                        'fee' => $fee,
                        'is_paid' => $isPaid,
                        'notes' => $session->coach_notes ?: $session->athlete_note,
                    ];
                });

                // ── Map All Group Sessions ──
                $allGroup = $groupTrainings->where('is_extra', false)->map(function ($session) {
                    $fee = (int)($session->group?->package?->coach_fee_per_session ?? 0);
                    $dateStr = $session->date ? $session->date->format('Y-m-d') : null;
                    $monthKey = $session->date ? $session->date->format('Y-m') : null;
                    $isPaid = (bool)$session->is_coach_paid;
                    $groupName = $session->group?->name ?? 'Grup Latihan';

                    return [
                        'id' => 'grp_'.$session->id,
                        'date' => $dateStr,
                        'month_key' => $monthKey,
                        'client_name' => $groupName,
                        'client_sport' => 'Grup',
                        'name' => $session->name ?: 'Program Latihan Grup',
                        'session_number' => $session->session_number,
                        'status' => ($session->status === 'completed' || ($session->members_pivot && $session->members_pivot->contains('is_completed', true))) ? 'completed' : $session->status,
                        'type' => 'Grup',
                        'fee' => $fee,
                        'is_paid' => $isPaid,
                        'notes' => $session->notes,
                    ];
                });

                // ── Map All Gym Shifts ──
                $allGym = $gymShifts->map(function ($shift) use ($gymShiftFee) {
                    $checkIn = $shift->check_in_time ? Carbon::parse($shift->check_in_time)->format('H:i') : '';
                    $checkOut = $shift->check_out_time ? Carbon::parse($shift->check_out_time)->format('H:i') : '';
                    $dateCarbon = $shift->date ? Carbon::parse($shift->date) : null;
                    $dateStr = $dateCarbon ? $dateCarbon->format('Y-m-d') : ($shift->date ?? null);
                    $monthKey = $dateCarbon ? $dateCarbon->format('Y-m') : null;
                    $isPaid = (bool)$shift->is_paid;

                    return [
                        'id' => 'gym_'.$shift->id,
                        'date' => $dateStr,
                        'month_key' => $monthKey,
                        'client_name' => "Jaga Gym",
                        'client_sport' => "Gym Shift",
                        'name' => "Shift ($checkIn - $checkOut)",
                        'session_number' => null,
                        'status' => 'completed',
                        'type' => 'Jaga Gym',
                        'fee' => $gymShiftFee,
                        'is_paid' => $isPaid,
                        'notes' => $shift->notes
                    ];
                });

                // Combine all sessions
                $allSessions = $allIndividual->concat($allGroup)->concat($allGym)->sortByDesc('date')->values();
                $unpaidSessions = $allSessions->where('is_paid', false)->values();
                $unpaidEarnings = $unpaidSessions->sum('fee');

                // ── Group By Month for Monthly Breakdown ──
                $monthlyGroups = $allSessions->groupBy(function ($item) {
                    return $item['month_key'] ?: 'other';
                });

                $monthlyBreakdown = [];
                foreach ($monthlyGroups as $mKey => $items) {
                    if ($mKey === 'other' || empty($mKey)) continue;

                    $allRecordedMonths->push($mKey);

                    $carbonMonth = Carbon::createFromFormat('Y-m', $mKey);
                    $mLabel = $monthNames[(int)$carbonMonth->format('n')] . ' ' . $carbonMonth->format('Y');

                    $totalFee = $items->sum('fee');
                    $paidFee = $items->where('is_paid', true)->sum('fee');
                    $unpaidFee = $items->where('is_paid', false)->sum('fee');

                    $monthlyBreakdown[] = [
                        'month_key' => $mKey,
                        'month_label' => $mLabel,
                        'total_sessions' => $items->count(),
                        'individual_sessions' => $items->where('type', 'Individu')->count(),
                        'group_sessions' => $items->where('type', 'Grup')->count(),
                        'gym_sessions' => $items->where('type', 'Jaga Gym')->count(),
                        'total_fee' => $totalFee,
                        'paid_fee' => $paidFee,
                        'unpaid_fee' => $unpaidFee,
                        'unpaid_sessions' => $items->where('is_paid', false)->count(),
                        'paid_sessions' => $items->where('is_paid', true)->count(),
                        'sessions' => $items->values(),
                    ];
                }

                // Sort monthly breakdown descending by month_key (newest first) and limit to last 4 months
                usort($monthlyBreakdown, function ($a, $b) {
                    return strcmp($b['month_key'], $a['month_key']);
                });
                $monthlyBreakdown = array_slice($monthlyBreakdown, 0, 4);

                $lastPayout = \App\Models\CoachPayout::where('user_id', $coach->id)->latest('paid_at')->first();

                $coach->individual_sessions = $unpaidSessions->where('type', 'Individu')->count();
                $coach->group_sessions = $unpaidSessions->where('type', 'Grup')->count();
                $coach->gym_sessions = $unpaidSessions->where('type', 'Jaga Gym')->count();
                $coach->total_sessions = $unpaidSessions->count();
                $coach->unpaid_sessions = $unpaidSessions->count();
                $coach->last_payout_amount = $lastPayout ? $lastPayout->amount : 0;
                $coach->unpaid_earnings = $unpaidEarnings;

                $coach->monthly_breakdown = $monthlyBreakdown;
                $coach->sessions = $unpaidSessions;
                $coach->all_sessions = $allSessions;

                return $coach;
            });

        // Unique sorted list of months (limit to last 4 months)
        $distinctMonths = $allRecordedMonths->unique()->sortDesc()->take(4)->values()->map(function ($mKey) use ($monthNames) {
            try {
                $cM = Carbon::createFromFormat('Y-m', $mKey);
                return [
                    'key' => $mKey,
                    'label' => $monthNames[(int)$cM->format('n')] . ' ' . $cM->format('Y'),
                ];
            } catch (\Exception $e) {
                return ['key' => $mKey, 'label' => $mKey];
            }
        })->values();

        // Calculate global monthly summary across all coaches
        $globalMonthlySummary = $distinctMonths->map(function ($monthItem) use ($coaches) {
            $mKey = $monthItem['key'];
            $totalFee = 0;
            $paidFee = 0;
            $unpaidFee = 0;
            $totalSessions = 0;

            foreach ($coaches as $coach) {
                foreach ($coach->monthly_breakdown as $mb) {
                    if ($mb['month_key'] === $mKey) {
                        $totalFee += $mb['total_fee'];
                        $paidFee += $mb['paid_fee'];
                        $unpaidFee += $mb['unpaid_fee'];
                        $totalSessions += $mb['total_sessions'];
                    }
                }
            }

            return [
                'month_key' => $mKey,
                'month_label' => $monthItem['label'],
                'total_fee' => $totalFee,
                'paid_fee' => $paidFee,
                'unpaid_fee' => $unpaidFee,
                'total_sessions' => $totalSessions,
            ];
        });

        // ─── CURRENT MONTH KPI METRICS ───
        $currentMonthKey = Carbon::now()->format('Y-m');
        $currentMonthLabel = ($monthNames[(int)Carbon::now()->format('n')] ?? 'Bulan Ini') . ' ' . Carbon::now()->format('Y');

        $currentMonthSummary = $globalMonthlySummary->firstWhere('month_key', $currentMonthKey) ?? [
            'month_key' => $currentMonthKey,
            'month_label' => $currentMonthLabel,
            'total_fee' => 0,
            'paid_fee' => 0,
            'unpaid_fee' => 0,
            'total_sessions' => 0,
        ];

        $thisMonthIndRegularCount = IndividualTraining::whereYear('date', Carbon::now()->year)
            ->whereMonth('date', Carbon::now()->month)
            ->where('is_extra', false)
            ->where(function ($q) {
                $q->where('status', 'completed')
                  ->orWhere('is_completed', true);
            })
            ->count();

        $thisMonthIndExtraCount = IndividualTraining::whereYear('date', Carbon::now()->year)
            ->whereMonth('date', Carbon::now()->month)
            ->where('is_extra', true)
            ->where(function ($q) {
                $q->where('status', 'completed')
                  ->orWhere('is_completed', true);
            })
            ->count();

        $thisMonthGroupRegularCount = GroupTraining::whereYear('date', Carbon::now()->year)
            ->whereMonth('date', Carbon::now()->month)
            ->where('is_extra', false)
            ->where(function ($q) {
                $q->where('status', 'completed')
                  ->orWhereHas('members_pivot', function ($mq) {
                      $mq->where('is_completed', true);
                  });
            })
            ->count();

        $thisMonthGroupExtraCount = GroupTraining::whereYear('date', Carbon::now()->year)
            ->whereMonth('date', Carbon::now()->month)
            ->where('is_extra', true)
            ->where(function ($q) {
                $q->where('status', 'completed')
                  ->orWhereHas('members_pivot', function ($mq) {
                      $mq->where('is_completed', true);
                  });
            })
            ->count();

        $activeCoachesMonth = 0;
        foreach ($coaches as $coach) {
            $hasSession = collect($coach->monthly_breakdown)->first(function ($mb) use ($currentMonthKey) {
                return $mb['month_key'] === $currentMonthKey && $mb['total_sessions'] > 0;
            });
            if ($hasSession) {
                $activeCoachesMonth++;
            }
        }
        if ($activeCoachesMonth === 0) {
            $activeCoachesMonth = $coaches->where('total_sessions', '>', 0)->count();
        }

        $currentMonthData = [
            'key' => $currentMonthKey,
            'label' => $currentMonthLabel,
            'total_individual_sessions' => $thisMonthIndRegularCount + $thisMonthIndExtraCount,
            'regular_individual_sessions' => $thisMonthIndRegularCount,
            'extra_individual_sessions' => $thisMonthIndExtraCount,
            'total_group_sessions' => $thisMonthGroupRegularCount + $thisMonthGroupExtraCount,
            'regular_group_sessions' => $thisMonthGroupRegularCount,
            'extra_group_sessions' => $thisMonthGroupExtraCount,
            'active_coaches_count' => $activeCoachesMonth,
            'unpaid_coach_earnings' => $currentMonthSummary['unpaid_fee'] ?? 0,
            'total_coach_earnings' => $currentMonthSummary['total_fee'] ?? 0,
        ];

        // ─── SHARED PACKAGES (Paket Bersama) ───
        $sharedPackages = SharedPackage::with(['package', 'members'])
            ->get()
            ->map(function ($sp) {
                $trainings = IndividualTraining::where('shared_package_id', $sp->id)
                    ->with('coach')
                    ->orderBy('date', 'desc')
                    ->get();

                $sp->package_name = $sp->package->name ?? null;
                $sp->package_type = $sp->package?->package_type ?? 'quota';
                $sp->package_session_count = $sp->package?->session_count;
                $sp->members_count = $sp->members->count();
                $sp->total_sessions = $trainings->count();
                $sp->regular_sessions = $trainings->where('is_extra', false)->count();
                $sp->extra_sessions = $trainings->where('is_extra', true)->count();
                $sp->unpaid_sessions = $trainings->where('is_athlete_paid', false)->count();
                $sp->unpaid_regular_sessions = $trainings->where('is_athlete_paid', false)->where('is_extra', false)->count();
                $sp->unpaid_extra_sessions = $trainings->where('is_athlete_paid', false)->where('is_extra', true)->count();

                // Member usage stats
                $sp->member_usage = $sp->members->map(function ($member) use ($sp) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'sessions_used' => IndividualTraining::where('shared_package_id', $sp->id)
                            ->where('user_id', $member->id)
                            ->where('is_athlete_paid', false)
                            ->where('is_extra', false)
                            ->count(),
                    ];
                });

                // Session list (unpaid only)
                $sp->sessions = $trainings->where('is_athlete_paid', false)->map(function ($t) {
                    $coachNames = [];
                    if ($t->coach) {
                        $coachNames[] = $t->coach->name;
                    }
                    return [
                        'id' => $t->id,
                        'date' => $t->date,
                        'status' => $t->status,
                        'session_number' => $t->shared_session_number,
                        'athlete_name' => $t->user?->name,
                        'name' => $t->name,
                        'coaches' => array_unique($coachNames),
                        'is_paid' => (bool) $t->is_athlete_paid,
                        'is_extra' => (bool) $t->is_extra,
                    ];
                })->values();

                $memberNames = $sp->members->pluck('name')->toArray();
                $sp->member_names = $memberNames;
                unset($sp->members, $sp->package);

                return $sp;
            });

        return Inertia::render('Admin/Reports/SessionRecap', [
            'athletes' => $athletes,
            'groups' => $groups,
            'sharedPackages' => $sharedPackages,
            'coaches' => $coaches,
            'available_months' => $distinctMonths,
            'monthly_summary' => $globalMonthlySummary,
            'current_month' => $currentMonthData,
        ]);
    }

    public function payAthlete(Request $request, User $user)
    {
        IndividualTraining::where('user_id', $user->id)
            ->where('is_athlete_paid', false)
            ->update(['is_athlete_paid' => true]);

        return redirect()->back()->with('success', 'Berhasil menandai sesi atlet sebagai lunas.');
    }

    public function payCoach(Request $request, User $user)
    {
        $unpaidEarnings = 0;

        // Mark individual sessions as paid for this coach (hanya sesi yang sudah terselesaikan)
        $individualTrainings = IndividualTraining::where(function ($q) use ($user) {
                $q->where('coach_id', $user->id)
                  ->orWhereJsonContains('coach_ids', (string)$user->id)
                  ->orWhereJsonContains('coach_ids', $user->id);
            })
            ->where(function ($q) {
                $q->where('status', 'completed')
                  ->orWhere('is_completed', true);
            })
            ->with('user.package')
            ->get();

        foreach ($individualTrainings as $session) {
            $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
            $paidIds = $paidIds ?? [];
            if (!in_array($user->id, $paidIds) && !in_array((string)$user->id, $paidIds)) {
                $unpaidEarnings += $session->user?->package?->coach_fee_per_session ?? 0;

                $paidIds[] = $user->id;
                $session->paid_coach_ids = $paidIds;
                $session->save();
            }
        }

        // Mark group sessions as paid for this coach (hanya sesi yang sudah terselesaikan)
        $groupTrainings = GroupTraining::where(function ($q) use ($user) {
                $q->where('coach_id', $user->id)
                  ->orWhereJsonContains('coach_ids', (string)$user->id)
                  ->orWhereJsonContains('coach_ids', $user->id);
            })
            ->where(function ($q) {
                $q->where('status', 'completed')
                  ->orWhereHas('members_pivot', function ($mq) {
                      $mq->where('is_completed', true);
                  });
            })
            ->where('is_coach_paid', false)
            ->with(['group.package', 'members_pivot'])
            ->get();

        foreach ($groupTrainings as $session) {
            $unpaidEarnings += $session->group?->package?->coach_fee_per_session ?? 0;
            $session->is_coach_paid = true;
            $session->save();
        }

        // Mark gym shifts as paid for this coach
        $gymShiftFee = (int) ($user->effective_gym_fee ?? 0);
        $unpaidGymShifts = GymAttendance::where('user_id', $user->id)
            ->where('is_paid', false)
            ->whereNotNull('check_in_time')
            ->whereNotNull('check_out_time')
            ->get();

        foreach ($unpaidGymShifts as $shift) {
            $unpaidEarnings += $gymShiftFee;
            $shift->is_paid = true;
            $shift->save();
        }

        if ($unpaidEarnings > 0) {
            \App\Models\CoachPayout::create([
                'user_id' => $user->id,
                'amount' => $unpaidEarnings,
                'paid_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Berhasil mencairkan honor pelatih sebesar Rp ' . number_format($unpaidEarnings, 0, ',', '.'));
    }

    public function payGroup(Request $request, TrainingGroup $group)
    {
        GroupTraining::where('training_group_id', $group->id)
            ->where('is_group_paid', false)
            ->update(['is_group_paid' => true]);

        return redirect()->back()->with('success', 'Berhasil menandai sesi grup sebagai lunas.');
    }

    public function paySharedPackage(Request $request, SharedPackage $sharedPackage)
    {
        IndividualTraining::where('shared_package_id', $sharedPackage->id)
            ->where('is_athlete_paid', false)
            ->update(['is_athlete_paid' => true]);

        $sharedPackage->update(['status' => 'completed']);

        return redirect()->back()->with('success', 'Berhasil menandai sesi paket bersama sebagai lunas.');
    }
    public function exportAthleteReportPdf(Request $request, User $user)
    {
        // Load all trainings for this athlete
        $trainings = IndividualTraining::where('user_id', $user->id)
            ->with(['coach', 'blocks.items.exercise', 'rpeRecords'])
            ->orderBy('session_number', 'asc')
            ->get();

        $logoSetting = \App\Models\Setting::where('key', 'app_logo')->value('value');
        $logoPath = $logoSetting ? storage_path('app/public/' . $logoSetting) : public_path('assets/images/app-logo.png');
        
        $clubLogo = null;
        if (file_exists($logoPath)) {
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            $data = file_get_contents($logoPath);
            $clubLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        // Prepare each training's data
        $trainings->each(function ($training) use ($user) {
            $training->blocks->each(function ($block) {
                $block->items->each(function ($item) {
                    if ($item->exercise) {
                        $base64Images = [];
                        if (!empty($item->exercise->images) && is_array($item->exercise->images)) {
                            foreach ($item->exercise->images as $img) {
                                $imgClean = str_replace('storage/', '', ltrim($img, '/'));
                                $imgPath1 = public_path('storage/' . $imgClean);
                                $imgPath2 = storage_path('app/public/' . $imgClean);
                                $finalImgPath = file_exists($imgPath1) ? $imgPath1 : (file_exists($imgPath2) ? $imgPath2 : null);
                                
                                if ($finalImgPath) {
                                    $type = pathinfo($finalImgPath, PATHINFO_EXTENSION);
                                    $data = file_get_contents($finalImgPath);
                                    $base64Images[] = 'data:image/' . $type . ';base64,' . base64_encode($data);
                                }
                            }
                        }
                        $item->exercise->setAttribute('base64_images', $base64Images);
                    }
                });
            });

            // Set title and focus
            $training->title = $training->name ?: 'Session #' . $training->session_number;
            $training->focus = ($training->location ? $training->location : '');
            
            $coachNames = [];
            if (is_array($training->coach_ids) && count($training->coach_ids) > 0) {
                $coachNames = \App\Models\User::whereIn('id', $training->coach_ids)
                    ->pluck('name')
                    ->toArray();
            }
            $training->coachList = count($coachNames) > 0 ? implode(', ', array_unique($coachNames)) : '-';

            // Process RPEs for the footer of each session if needed
            $rpes = [];
            foreach ($training->rpeRecords as $record) {
                $rpeData = $record->rpe_data;
                if (is_array($rpeData)) {
                    foreach ($rpeData as $data) {
                        if (is_array($data) && isset($data['label']) && isset($data['rpe'])) {
                            $rpes[] = ['label' => $data['label'], 'value' => $data['rpe']];
                        }
                    }
                }
            }
            
            $training->athleteData = [
                'name' => $user->name,
                'is_completed' => (bool) $training->is_completed,
                'note' => $training->athlete_note,
                'rpes' => $rpes,
            ];
        });

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.athlete_session_report_pdf', [
            'trainings' => $trainings,
            'athlete' => $user,
            'clubLogo' => $clubLogo
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Laporan_Sesi_' . str_replace(' ', '_', $user->name) . '.pdf');
    }


    public function exportGroupReportPdf(Request $request, \App\Models\TrainingGroup $group)
    {
        // Load all trainings for this group
        $trainings = GroupTraining::where('training_group_id', $group->id)
            ->with(['coach', 'blocks.items.exercise', 'rpe_records'])
            ->orderBy('session_number', 'asc')
            ->get();

        $logoSetting = \App\Models\Setting::where('key', 'app_logo')->value('value');
        $logoPath = $logoSetting ? storage_path('app/public/' . $logoSetting) : public_path('assets/images/app-logo.png');
        
        $clubLogo = null;
        if (file_exists($logoPath)) {
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            $data = file_get_contents($logoPath);
            $clubLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        // Prepare each training's data
        $trainings->each(function ($training) use ($group) {
            $training->blocks->each(function ($block) {
                $block->items->each(function ($item) {
                    if ($item->exercise) {
                        $base64Images = [];
                        if (!empty($item->exercise->images) && is_array($item->exercise->images)) {
                            foreach ($item->exercise->images as $img) {
                                $imgClean = str_replace('storage/', '', ltrim($img, '/'));
                                $imgPath1 = public_path('storage/' . $imgClean);
                                $imgPath2 = storage_path('app/public/' . $imgClean);
                                $finalImgPath = file_exists($imgPath1) ? $imgPath1 : (file_exists($imgPath2) ? $imgPath2 : null);
                                
                                if ($finalImgPath) {
                                    $type = pathinfo($finalImgPath, PATHINFO_EXTENSION);
                                    $data = file_get_contents($finalImgPath);
                                    $base64Images[] = 'data:image/' . $type . ';base64,' . base64_encode($data);
                                }
                            }
                        }
                        $item->exercise->setAttribute('base64_images', $base64Images);
                    }
                });
            });

            // Set title and focus
            $training->title = $training->name ?: 'Session #' . $training->session_number;
            $training->focus = ($training->location ? $training->location : '');
            
            $coachNames = [];
            if (is_array($training->coach_ids) && count($training->coach_ids) > 0) {
                $coachNames = \App\Models\User::whereIn('id', $training->coach_ids)
                    ->pluck('name')
                    ->toArray();
            }
            $training->coachList = count($coachNames) > 0 ? implode(', ', array_unique($coachNames)) : '-';

            $training->athleteData = [
                'name' => $group->name,
                'is_completed' => true,
                'note' => '',
                'rpes' => [],
            ];
        });

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.athlete_session_report_pdf', [
            'trainings' => $trainings,
            'athlete' => (object)['name' => $group->name, 'package' => null],
            'clubLogo' => $clubLogo
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Laporan_Sesi_Grup_' . str_replace(' ', '_', $group->name) . '.pdf');
    }

    public function exportProfilingPdf(Request $request, User $user)
    {
        $currentUser = auth()->user();
        if ($currentUser && $currentUser->role === 'athlete' && $currentUser->id !== $user->id) {
            abort(403, 'Unauthorized access.');
        }

        $athlete = User::with([
            'sport',
            'package',
            'groups.package',
            'coaches',
            'performanceTests.results.testItem.category'
        ])->findOrFail($user->id);
        
        $otsLogoPath = public_path('assets/images/otslogo2.png');
        $logoSetting = \App\Models\Setting::where('key', 'app_logo')->value('value');
        $logoPath = file_exists($otsLogoPath) ? $otsLogoPath : ($logoSetting ? storage_path('app/public/' . $logoSetting) : public_path('assets/images/app-logo.png'));
        
        $clubLogo = null;
        if (file_exists($logoPath)) {
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            $data = file_get_contents($logoPath);
            $clubLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        $athletePhoto = null;
        if ($athlete->profile_photo) {
            $photoPath1 = public_path('storage/' . $athlete->profile_photo);
            $photoPath2 = storage_path('app/public/' . $athlete->profile_photo);
            $finalPhotoPath = file_exists($photoPath1) ? $photoPath1 : (file_exists($photoPath2) ? $photoPath2 : null);
            if ($finalPhotoPath) {
                $type = pathinfo($finalPhotoPath, PATHINFO_EXTENSION);
                $photoData = file_get_contents($finalPhotoPath);
                $athletePhoto = 'data:image/' . $type . ';base64,' . base64_encode($photoData);
            }
        }

        // Biometrics & BMI
        $bmi = '-';
        $bmiStatus = ['label' => '-', 'color' => '#64748b'];
        $bmiClass = ['label' => '-', 'badge' => 'badge-slate'];
        if ($athlete->height && $athlete->weight) {
            $heightM = $athlete->height / 100;
            $bmi = round($athlete->weight / ($heightM * $heightM), 1);
            if ($bmi < 18.5) {
                $bmiStatus = ['label' => 'Underweight', 'color' => '#f59e0b'];
                $bmiClass = ['label' => 'Underweight', 'badge' => 'badge-amber'];
            } elseif ($bmi <= 24.9) {
                $bmiStatus = ['label' => 'Normal', 'color' => '#10b981'];
                $bmiClass = ['label' => 'Normal', 'badge' => 'badge-emerald'];
            } elseif ($bmi <= 29.9) {
                $bmiStatus = ['label' => 'Overweight', 'color' => '#f97316'];
                $bmiClass = ['label' => 'Overweight', 'badge' => 'badge-orange'];
            } else {
                $bmiStatus = ['label' => 'Obese', 'color' => '#ef4444'];
                $bmiClass = ['label' => 'Obese', 'badge' => 'badge-rose'];
            }
        }

        $age = $athlete->age ?? ($athlete->date_of_birth ? Carbon::parse($athlete->date_of_birth)->age : '-');

        // Performance tests and categories
        $tests = $athlete->performanceTests->sortBy('date')->values();
        $hasData = $tests->count() > 0;
        $allResults = $hasData ? $tests->flatMap->results : collect();

        $totalSessions = $tests->count();
        $averageScore = $hasData ? round($allResults->avg('score') ?? 0, 1) : 0;
        $highestScore = $hasData ? round($tests->map(fn($t) => $t->results->avg('score') ?? 0)->max() ?? 0, 1) : 0;
        $latestScore = $tests->last() ? round($tests->last()->results->avg('score') ?? 0, 1) : 0;
        $latestDate = $tests->last() ? Carbon::parse($tests->last()->date)->format('d M Y') : '-';

        // Package & Coaches text
        $packageName = $athlete->package->name ?? null;
        if (!$packageName && $athlete->groups && $athlete->groups->count() > 0) {
            $group = $athlete->groups->first();
            $packageName = $group->package->name ?? ($group->name . ' (Grup)');
        }
        $coachNames = $athlete->coaches ? $athlete->coaches->pluck('name')->toArray() : [];
        $coachesText = count($coachNames) > 0 ? implode(', ', $coachNames) : '-';

        $stats = [
            'total_sessions' => $totalSessions,
            'avg_score' => $averageScore,
            'highest_score' => $highestScore,
            'latest_score' => $latestScore,
            'latest_date' => $latestDate,
            'package_name' => $packageName,
            'coaches_text' => $coachesText,
            'sport' => $athlete->sport->name ?? 'General Athlete',
            'best_category' => '-'
        ];

        $categoryStats = collect();
        $strengths = collect();
        $weaknesses = collect();
        $radarData = [];
        $comparisonData = []; 
        $itemAnalysis = []; 

        if ($hasData) {
            $latestTest = $tests->last();
            $previousTests = $tests->count() > 1 ? $tests->slice(0, -1)->take(-4)->values() : collect();

            $categoryStats = ($latestTest ? $latestTest->results : collect())->groupBy(function($res) {
                return $res->testItem->category->name ?? 'Uncategorized';
            })->map(function ($items, $catName) {
                $avg = round($items->avg('score'), 1);
                return [
                    'name' => $catName,
                    'score' => $avg,
                    'target' => 100,
                    'gap' => $avg - 100
                ];
            })->values();

            $strengths = $categoryStats->filter(fn($item) => $item['score'] >= 70)->sortByDesc('score')->values();
            $weaknesses = $categoryStats->filter(fn($item) => $item['score'] < 70)->sortBy('score')->values();
            $stats['best_category'] = $strengths->first()['name'] ?? '-';

            $radarData = $categoryStats->map(function($cat) {
                return [
                    'subject' => $cat['name'],
                    'A' => $cat['score'], 
                    'B' => 100,           
                    'fullMark' => 100
                ];
            })->values();

            $latestCats = $latestTest ? $latestTest->results->groupBy(function($r) {
                return $r->testItem->category->name ?? 'Uncat';
            })->map(function($i) { return round($i->avg('score'), 1); }) : collect();

            $prevCats = collect();
            if ($previousTests->count() > 0) {
                $prevCats = $previousTests->flatMap->results->groupBy(function($r) {
                    return $r->testItem->category->name ?? 'Uncat';
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

            if ($latestTest) {
                $itemAnalysis = $latestTest->results->map(function($res) use ($previousTests) {
                    $item = $res->testItem;
                    $rawScore = floatval($res->score);
                    $prevScoreForGrowth = 0;
                    $prevResultVal = null;
                    $growth = 0;

                    if ($previousTests->count() > 0) {
                        $lastPrev = $previousTests->last();
                        $resPrev = $lastPrev->results->where('test_item_id', $item->id)->first();
                        $pScore = $resPrev ? floatval($resPrev->score) : 0;
                        $prevScoreForGrowth = $pScore;
                        $prevResultVal = $resPrev ? $resPrev->result : null;
                        if ($prevScoreForGrowth > 0) {
                            $growth = (($rawScore - $prevScoreForGrowth) / $prevScoreForGrowth) * 100;
                        }
                    }

                    return [
                        'id' => $res->id,
                        'name' => $item->name,
                        'category' => $item->category->name ?? '-',
                        'unit' => $item->unit,
                        'target_value' => $item->target_value,
                        'result_value' => $res->result,
                        'score' => round($rawScore, 1),
                        'previous_value' => $prevResultVal,
                        'previous_score' => round($prevScoreForGrowth, 1),
                        'growth' => round($growth, 1)
                    ];
                })->sortByDesc('score')->values();
            }
        }

        $history = $tests->sortByDesc('date')->take(5)->map(function ($test) {
            $score = $test->results->avg('score') ?? 0;
            return [
                'date' => Carbon::parse($test->date)->format('d M Y'),
                'name' => $test->name ?? 'Sesi Latihan',
                'items_count' => $test->results->count(),
                'score' => round($score, 1),
            ];
        })->values();

        // Multi-domain profiling assessments
        $latest_phv = \App\Models\PhvAssessment::where('user_id', $athlete->id)->orderBy('assessment_date', 'desc')->first();
        $latest_composition = \App\Models\CompositionTest::where('user_id', $athlete->id)->orderBy('date', 'desc')->first();
        $latest_wellness = \App\Models\WellnessRpe::where('user_id', $athlete->id)->orderBy('record_date', 'desc')->first();
        $latest_dpa = \App\Models\DpaAssessment::where('user_id', $athlete->id)->with('details.compensation')->orderBy('assessment_date', 'desc')->first();
        $latest_daily_metric = \App\Models\DailyMetric::where('user_id', $athlete->id)->orderBy('record_date', 'desc')->first();

        // Athlete Biometric & Progress Galleries
        $athlete->load(['galleries' => function ($query) {
            $query->latest();
        }]);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.profiling_pdf_landscape', [
            'athlete' => $athlete,
            'athletePhoto' => $athletePhoto,
            'clubLogo' => $clubLogo,
            'bmi' => $bmi,
            'bmiStatus' => $bmiStatus,
            'bmiClass' => $bmiClass,
            'age' => $age,
            'totalSessions' => $totalSessions,
            'averageScore' => $averageScore,
            'highestScore' => $highestScore,
            'latestScore' => $latestScore,
            'latestDate' => $latestDate,
            'stats' => $stats,
            'categoryStats' => $categoryStats,
            'strengths' => $strengths,
            'weaknesses' => $weaknesses,
            'latestTest' => $latestTest ?? null,
            'latestTestItems' => $itemAnalysis,
            'history' => $history,
            'latest_phv' => $latest_phv,
            'latest_composition' => $latest_composition,
            'latest_wellness' => $latest_wellness,
            'latest_dpa' => $latest_dpa,
            'latest_daily_metric' => $latest_daily_metric,
            'packageName' => $packageName,
            'coachesText' => $coachesText,
            'galleries' => $athlete->galleries,
        ]);

        $pdf->setPaper('A4', 'landscape');

        $cleanAthleteName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $athlete->name);
        $fileName = 'Profiling_Athlete_' . $cleanAthleteName . '.pdf';

        return $pdf->download($fileName);
    }

    public function exportCoachReportPdf(Request $request, User $user)
    {
        $coach = $user;
        if ($coach->role !== 'coach') {
            abort(404, 'Pelatih tidak ditemukan.');
        }

        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];

        $filterMonth = $request->query('month'); // e.g. '2026-08' or null

        // Individual sessions (hanya yang sudah terselesaikan)
        $individualTrainings = IndividualTraining::where(function($q) use ($coach) {
                $q->where('coach_id', $coach->id)
                  ->orWhereJsonContains('coach_ids', (string)$coach->id)
                  ->orWhereJsonContains('coach_ids', $coach->id);
            })
            ->where(function ($q) {
                $q->where('status', 'completed')
                  ->orWhere('is_completed', true);
            })
            ->with(['user.package', 'user.sport'])
            ->get();

        // Group sessions (hanya yang sudah terselesaikan)
        $groupTrainings = GroupTraining::where(function($q) use ($coach) {
                $q->where('coach_id', $coach->id)
                  ->orWhereJsonContains('coach_ids', (string)$coach->id)
                  ->orWhereJsonContains('coach_ids', $coach->id);
            })
            ->where(function ($q) {
                $q->where('status', 'completed')
                  ->orWhereHas('members_pivot', function ($mq) {
                      $mq->where('is_completed', true);
                  });
            })
            ->with(['group.package', 'members_pivot'])
            ->get();

        // Gym shift fee
        $gymShiftFee = (int) ($coach->effective_gym_fee ?? 0);
        $gymShifts = GymAttendance::where('user_id', $coach->id)
            ->whereNotNull('check_in_time')
            ->whereNotNull('check_out_time')
            ->get();

        // Map Individual
        $allIndividual = $individualTrainings->map(function ($session) use ($coach) {
            $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
            $paidIds = $paidIds ?? [];
            $isPaid = in_array($coach->id, $paidIds) || in_array((string)$coach->id, $paidIds);
            $fee = (int)($session->user?->package?->coach_fee_per_session ?? 0);
            $dateStr = $session->date ? $session->date->format('Y-m-d') : null;
            $monthKey = $session->date ? $session->date->format('Y-m') : null;
            $clientName = $session->user?->name ?? 'Atlet';

            return [
                'id' => 'ind_'.$session->id,
                'date' => $dateStr,
                'month_key' => $monthKey,
                'client_name' => $clientName,
                'client_sport' => $session->user?->sport?->name ?? null,
                'name' => $session->name ?: 'Program Latihan Individu',
                'session_number' => $session->session_number,
                'status' => $session->status,
                'type' => 'Individu',
                'fee' => $fee,
                'is_paid' => $isPaid,
                'is_extra' => (bool) $session->is_extra,
                'notes' => $session->coach_notes ?: $session->athlete_note,
            ];
        });

        // Map Group
        $allGroup = $groupTrainings->map(function ($session) {
            $fee = (int)($session->group?->package?->coach_fee_per_session ?? 0);
            $dateStr = $session->date ? $session->date->format('Y-m-d') : null;
            $monthKey = $session->date ? $session->date->format('Y-m') : null;
            $isPaid = (bool)$session->is_coach_paid;
            $groupName = $session->group?->name ?? 'Grup Latihan';

            return [
                'id' => 'grp_'.$session->id,
                'date' => $dateStr,
                'month_key' => $monthKey,
                'client_name' => $groupName,
                'client_sport' => 'Grup',
                'name' => $session->name ?: 'Program Latihan Grup',
                'session_number' => $session->session_number,
                'status' => ($session->status === 'completed' || ($session->members_pivot && $session->members_pivot->contains('is_completed', true))) ? 'completed' : $session->status,
                'type' => 'Grup',
                'fee' => $fee,
                'is_paid' => $isPaid,
                'is_extra' => (bool) $session->is_extra,
                'notes' => $session->notes,
            ];
        });

        // Map Gym
        $allGym = $gymShifts->map(function ($shift) use ($gymShiftFee) {
            $checkIn = $shift->check_in_time ? Carbon::parse($shift->check_in_time)->format('H:i') : '';
            $checkOut = $shift->check_out_time ? Carbon::parse($shift->check_out_time)->format('H:i') : '';
            $dateCarbon = $shift->date ? Carbon::parse($shift->date) : null;
            $dateStr = $dateCarbon ? $dateCarbon->format('Y-m-d') : ($shift->date ?? null);
            $monthKey = $dateCarbon ? $dateCarbon->format('Y-m') : null;
            $isPaid = (bool)$shift->is_paid;

            return [
                'id' => 'gym_'.$shift->id,
                'date' => $dateStr,
                'month_key' => $monthKey,
                'client_name' => "Jaga Gym",
                'client_sport' => "Gym Shift",
                'name' => "Shift ($checkIn - $checkOut)",
                'session_number' => null,
                'status' => 'completed',
                'type' => 'Jaga Gym',
                'fee' => $gymShiftFee,
                'is_paid' => $isPaid,
                'is_extra' => false,
                'notes' => $shift->notes
            ];
        });

        $allRawSessions = $allIndividual->concat($allGroup)->concat($allGym)->sortByDesc('date')->values();

        // If specific month is requested, filter
        $targetMonthLabel = "Semua Periode";
        if ($filterMonth && $filterMonth !== 'all') {
            $allSessions = $allRawSessions->where('month_key', $filterMonth)->values();
            if (str_contains($filterMonth, '-')) {
                [$y, $m] = explode('-', $filterMonth);
                $targetMonthLabel = ($monthNames[(int)$m] ?? $m) . ' ' . $y;
            }
        } else {
            $allSessions = $allRawSessions;
        }

        $unpaidSessions = $allSessions->where('is_paid', false)->values();
        $paidSessions = $allSessions->where('is_paid', true)->values();

        $totalFee = $allSessions->sum('fee');
        $unpaidFee = $unpaidSessions->sum('fee');
        $paidFee = $paidSessions->sum('fee');

        // Detailed count breakdown
        $indRegularSessions = $allSessions->where('type', 'Individu')->where('is_extra', false);
        $indExtraSessions = $allSessions->where('type', 'Individu')->where('is_extra', true);
        $grpRegularSessions = $allSessions->where('type', 'Grup')->where('is_extra', false);
        $grpExtraSessions = $allSessions->where('type', 'Grup')->where('is_extra', true);
        $gymSessions = $allSessions->where('type', 'Jaga Gym');

        // Monthly Breakdown
        $monthlyGroups = $allRawSessions->groupBy(function ($item) {
            return $item['month_key'] ?: 'other';
        });

        $monthlyBreakdown = [];
        foreach ($monthlyGroups as $mKey => $items) {
            if ($mKey === 'other' || empty($mKey)) continue;

            $carbonMonth = Carbon::createFromFormat('Y-m', $mKey);
            $mLabel = $monthNames[(int)$carbonMonth->format('n')] . ' ' . $carbonMonth->format('Y');

            $monthlyBreakdown[] = [
                'month_key' => $mKey,
                'month_label' => $mLabel,
                'total_sessions' => $items->count(),
                'individual_sessions' => $items->where('type', 'Individu')->count(),
                'individual_regular' => $items->where('type', 'Individu')->where('is_extra', false)->count(),
                'individual_extra' => $items->where('type', 'Individu')->where('is_extra', true)->count(),
                'group_sessions' => $items->where('type', 'Grup')->count(),
                'group_regular' => $items->where('type', 'Grup')->where('is_extra', false)->count(),
                'group_extra' => $items->where('type', 'Grup')->where('is_extra', true)->count(),
                'gym_sessions' => $items->where('type', 'Jaga Gym')->count(),
                'total_fee' => $items->sum('fee'),
                'paid_fee' => $items->where('is_paid', true)->sum('fee'),
                'unpaid_fee' => $items->where('is_paid', false)->sum('fee'),
                'sessions' => $items->values(),
            ];
        }

        usort($monthlyBreakdown, function ($a, $b) {
            return strcmp($b['month_key'], $a['month_key']);
        });

        // Determine Payout Status
        $payoutStatus = 'UNPAID'; // UNPAID, PARTIAL, PAID
        if ($totalFee > 0 && $unpaidFee === 0) {
            $payoutStatus = 'PAID';
        } elseif ($paidFee > 0 && $unpaidFee > 0) {
            $payoutStatus = 'PARTIAL';
        }

        $lastPayout = \App\Models\CoachPayout::where('user_id', $coach->id)->latest('paid_at')->first();

        // Club logo
        $otsLogoPath = public_path('assets/images/otslogo2.png');
        $logoSetting = \App\Models\Setting::where('key', 'app_logo')->value('value');
        $logoPath = file_exists($otsLogoPath) ? $otsLogoPath : ($logoSetting ? storage_path('app/public/' . $logoSetting) : public_path('assets/images/app-logo.png'));
        
        $clubLogo = null;
        if (file_exists($logoPath)) {
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            $data = file_get_contents($logoPath);
            $clubLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.coach_session_recap_pdf', [
            'coach' => $coach,
            'clubLogo' => $clubLogo,
            'filterMonth' => $filterMonth,
            'targetMonthLabel' => $targetMonthLabel,
            'payoutStatus' => $payoutStatus,
            'lastPayout' => $lastPayout,
            'allSessions' => $allSessions,
            'unpaidSessions' => $unpaidSessions,
            'paidSessions' => $paidSessions,
            'totalFee' => $totalFee,
            'unpaidFee' => $unpaidFee,
            'paidFee' => $paidFee,
            'indRegularSessions' => $indRegularSessions,
            'indExtraSessions' => $indExtraSessions,
            'grpRegularSessions' => $grpRegularSessions,
            'grpExtraSessions' => $grpExtraSessions,
            'gymSessions' => $gymSessions,
            'monthlyBreakdown' => $monthlyBreakdown,
        ])->setPaper('A4', 'portrait');

        $cleanCoachName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $coach->name);
        $filename = 'Slip_Honor_' . $cleanCoachName . ($filterMonth ? '_' . $filterMonth : '') . '_' . date('Ymd') . '.pdf';
        return $pdf->download($filename);
    }
}
