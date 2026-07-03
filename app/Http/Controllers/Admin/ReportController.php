<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\IndividualTraining;
use App\Models\GroupTraining;
use App\Models\TrainingGroup;
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
                $athlete->package_session_count = $packageSessionCount;
                $athlete->total_sessions = $trainings->count();
                $athlete->completed_sessions = $trainings->where('status', 'completed')->count();
                $athlete->scheduled_sessions = $trainings->whereNotIn('status', ['completed'])->count();
                $athlete->unpaid_sessions = $trainings->where('is_athlete_paid', false)->count();

                // Session list for drill-down
                $athlete->sessions = $trainings->map(function ($t) {
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
                $group->package_session_count = $packageSessionCount;
                $group->members_count = $group->members->count();
                $group->total_sessions = $trainings->count();
                $group->completed_sessions = $trainings->where('status', 'completed')->count();
                $group->unpaid_sessions = $trainings->where('is_group_paid', false)->count();

                // Session list for drill-down
                $group->sessions = $trainings->map(function ($t) {
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
                    ];
                })->values();

                // Clean up relationships
                $memberNames = $group->members->pluck('name')->toArray();
                $group->member_names = $memberNames;
                unset($group->members, $group->package);

                return $group;
            });

        // ─── COACHES ───
        $coaches = User::where('role', 'coach')
            ->get()
            ->map(function ($coach) {
                // Individual sessions
                $individualTrainings = IndividualTraining::where('coach_id', $coach->id)
                    ->orWhereJsonContains('coach_ids', (string)$coach->id)
                    ->orWhereJsonContains('coach_ids', $coach->id)
                    ->with('user.package')
                    ->get();

                $individualCount = $individualTrainings->count();

                // Group sessions
                $groupTrainings = GroupTraining::where('coach_id', $coach->id)
                    ->orWhereJsonContains('coach_ids', (string)$coach->id)
                    ->orWhereJsonContains('coach_ids', $coach->id)
                    ->with('group.package')
                    ->get();

                $groupCount = $groupTrainings->count();

                // Unpaid individual sessions
                $unpaidIndividual = $individualTrainings->filter(function ($session) use ($coach) {
                    $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
                    $paidIds = $paidIds ?? [];
                    return !in_array($coach->id, $paidIds) && !in_array((string)$coach->id, $paidIds);
                });

                // Unpaid group sessions
                $unpaidGroup = $groupTrainings->where('is_coach_paid', false);

                // Calculate earnings from package fee
                $totalEarnings = 0;
                $unpaidEarnings = 0;

                foreach ($individualTrainings as $session) {
                    $fee = $session->user?->package?->coach_fee_per_session ?? 0;
                    $totalEarnings += $fee;

                    $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
                    $paidIds = $paidIds ?? [];
                    if (!in_array($coach->id, $paidIds) && !in_array((string)$coach->id, $paidIds)) {
                        $unpaidEarnings += $fee;
                    }
                }

                foreach ($groupTrainings as $session) {
                    $fee = $session->group?->package?->coach_fee_per_session ?? 0;
                    $totalEarnings += $fee;

                    if (!$session->is_coach_paid) {
                        $unpaidEarnings += $fee;
                    }
                }

                $coach->individual_sessions = $individualCount;
                $coach->group_sessions = $groupCount;
                $coach->total_sessions = $individualCount + $groupCount;
                $coach->unpaid_sessions = $unpaidIndividual->count() + $unpaidGroup->count();
                $coach->total_earnings = $totalEarnings;
                $coach->unpaid_earnings = $unpaidEarnings;

                return $coach;
            });

        return Inertia::render('Admin/Reports/SessionRecap', [
            'athletes' => $athletes,
            'groups' => $groups,
            'coaches' => $coaches,
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
        // Mark individual sessions as paid for this coach
        $individualTrainings = IndividualTraining::where('coach_id', $user->id)
            ->orWhereJsonContains('coach_ids', (string)$user->id)
            ->orWhereJsonContains('coach_ids', $user->id)
            ->get();

        foreach ($individualTrainings as $session) {
            $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
            $paidIds = $paidIds ?? [];
            if (!in_array($user->id, $paidIds) && !in_array((string)$user->id, $paidIds)) {
                $paidIds[] = $user->id;
                $session->paid_coach_ids = $paidIds;
                $session->save();
            }
        }

        // Mark group sessions as paid for this coach
        GroupTraining::where('coach_id', $user->id)
            ->orWhereJsonContains('coach_ids', (string)$user->id)
            ->orWhereJsonContains('coach_ids', $user->id)
            ->where('is_coach_paid', false)
            ->update(['is_coach_paid' => true]);

        return redirect()->back()->with('success', 'Berhasil menandai sesi pelatih sebagai lunas.');
    }

    public function payGroup(Request $request, TrainingGroup $group)
    {
        GroupTraining::where('training_group_id', $group->id)
            ->where('is_group_paid', false)
            ->update(['is_group_paid' => true]);

        return redirect()->back()->with('success', 'Berhasil menandai sesi grup sebagai lunas.');
    }
}
