<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\IndividualTraining;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display a recap of sessions handled by athletes and coaches.
     * Accessible only by Superadmin.
     */
    public function sessionRecap()
    {
        // Get all athletes with their total scheduled and completed sessions
        $athletes = User::where('role', 'athlete')
            ->with('sport')
            ->get()
            ->map(function ($athlete) {
                // Determine the total sessions done or scheduled by this athlete
                $trainings = IndividualTraining::where('user_id', $athlete->id)->get();
                $athlete->total_sessions = $trainings->count();
                $athlete->completed_sessions = $trainings->where('status', 'completed')->count();
                $athlete->scheduled_sessions = $trainings->where('status', 'scheduled')->count();
                
                // Unpaid sessions
                $athlete->unpaid_sessions = $trainings->where('is_athlete_paid', false)->count();
                
                return $athlete;
            });

        // Get all coaches and calculate how many sessions they handled
        $coaches = User::where('role', 'coach')
            ->get()
            ->map(function ($coach) {
                // A coach handles a session if they are the primary coach_id OR if they are in coach_ids JSON array
                $trainings = IndividualTraining::where('coach_id', $coach->id)
                    ->orWhereJsonContains('coach_ids', (string)$coach->id)
                    ->orWhereJsonContains('coach_ids', $coach->id)
                    ->get();
                
                $coach->total_handled_sessions = $trainings->count();
                
                // Unpaid handled sessions
                $unpaid = $trainings->filter(function($session) use ($coach) {
                    $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
                    $paidIds = $paidIds ?? [];
                    return !in_array($coach->id, $paidIds) && !in_array((string)$coach->id, $paidIds);
                });
                
                $coach->unpaid_handled_sessions = $unpaid->count();
                
                return $coach;
            });

        return Inertia::render('Admin/Reports/SessionRecap', [
            'athletes' => $athletes,
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
        $trainings = IndividualTraining::where('coach_id', $user->id)
            ->orWhereJsonContains('coach_ids', (string)$user->id)
            ->orWhereJsonContains('coach_ids', $user->id)
            ->get();

        foreach ($trainings as $session) {
            $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
            $paidIds = $paidIds ?? [];
            if (!in_array($user->id, $paidIds) && !in_array((string)$user->id, $paidIds)) {
                $paidIds[] = $user->id;
                $session->paid_coach_ids = $paidIds;
                $session->save();
            }
        }

        return redirect()->back()->with('success', 'Berhasil menandai sesi pelatih sebagai lunas.');
    }
}
