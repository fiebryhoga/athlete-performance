<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SharedPackage;
use App\Models\IndividualTraining;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SharedPackageController extends Controller
{
    /**
     * Show detail page for a shared package.
     */
    public function show(SharedPackage $sharedPackage)
    {
        $sharedPackage->load(['package', 'members.sport', 'coaches']);

        // Get all trainings under this shared package
        $trainings = IndividualTraining::where('shared_package_id', $sharedPackage->id)
            ->with(['user.sport', 'coach', 'blocks.items.exercise'])
            ->orderBy('date', 'desc')
            ->orderBy('shared_session_number', 'desc')
            ->get();

        // Build usage stats per member
        $memberStats = $sharedPackage->members->map(function ($member) use ($sharedPackage) {
            $memberTrainings = IndividualTraining::where('shared_package_id', $sharedPackage->id)
                ->where('user_id', $member->id)
                ->where('is_athlete_paid', false)
                ->where('is_extra', false)
                ->count();

            $historyTrainings = IndividualTraining::where('shared_package_id', $sharedPackage->id)
                ->where('user_id', $member->id)
                ->where('is_athlete_paid', true)
                ->count();

            $completedTrainings = IndividualTraining::where('shared_package_id', $sharedPackage->id)
                ->where('user_id', $member->id)
                ->where(function($q) {
                    $q->where('status', 'completed')->orWhere('is_completed', true);
                })
                ->count();

            return [
                'id' => $member->id,
                'name' => $member->name,
                'profile_photo_url' => $member->profile_photo_url,
                'sport' => $member->sport?->name,
                'sessions_used' => $memberTrainings,
                'history_sessions' => $historyTrainings,
                'total_sessions' => $memberTrainings + $historyTrainings,
                'completed_sessions' => $completedTrainings,
            ];
        });

        $totalSessions = $sharedPackage->package?->session_count;
        $usedSessions = $sharedPackage->usedSessions();

        $packagesList = \App\Models\SubscriptionPackage::all();
        $allAthletes = User::where('role', 'athlete')->with('sport')->orderBy('name')->get();
        $coachesList = User::where('role', 'coach')->get(['id', 'name']);

        return Inertia::render('Admin/SharedPackages/Show', [
            'sharedPackage' => $sharedPackage,
            'trainings' => $trainings,
            'memberStats' => $memberStats,
            'totalSessions' => $totalSessions,
            'usedSessions' => $usedSessions,
            'remainingSessions' => $totalSessions !== null ? max(0, $totalSessions - $usedSessions) : null,
            'packagesList' => $packagesList,
            'allAthletes' => $allAthletes,
            'coachesList' => $coachesList,
        ]);
    }

    /**
     * Store a new shared package.
     */
    public function store(Request $request)
    {
        abort_if(!in_array(auth()->user()->role, ['superadmin', 'coach']), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subscription_package_id' => 'required|exists:subscription_packages,id',
            'start_date' => 'nullable|date',
            'expiration_date' => 'nullable|date',
            'member_ids' => 'required|array|min:1',
            'member_ids.*' => 'exists:users,id',
            'coach_ids' => 'nullable|array',
            'coach_ids.*' => 'exists:users,id',
        ]);

        $sharedPackage = SharedPackage::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'subscription_package_id' => $validated['subscription_package_id'],
            'start_date' => $validated['start_date'] ?? null,
            'expiration_date' => $validated['expiration_date'] ?? null,
            'status' => 'active',
        ]);

        $sharedPackage->members()->sync($validated['member_ids']);

        // Anggota paket bersama otomatis tidak memiliki paket privat solo sendiri
        User::whereIn('id', $validated['member_ids'])->update(['subscription_package_id' => null]);

        if (!empty($validated['coach_ids'])) {
            $sharedPackage->coaches()->sync($validated['coach_ids']);
        }

        return redirect()->back()->with('message', 'Paket bersama berhasil dibuat.');
    }

    /**
     * Update an existing shared package.
     */
    public function update(Request $request, SharedPackage $sharedPackage)
    {
        abort_if(!in_array(auth()->user()->role, ['superadmin', 'coach']), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subscription_package_id' => 'required|exists:subscription_packages,id',
            'start_date' => 'nullable|date',
            'expiration_date' => 'nullable|date',
            'member_ids' => 'required|array|min:1',
            'member_ids.*' => 'exists:users,id',
            'coach_ids' => 'nullable|array',
            'coach_ids.*' => 'exists:users,id',
        ]);

        $sharedPackage->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'subscription_package_id' => $validated['subscription_package_id'],
            'start_date' => $validated['start_date'] ?? null,
            'expiration_date' => $validated['expiration_date'] ?? null,
        ]);

        $sharedPackage->members()->sync($validated['member_ids']);

        // Anggota paket bersama otomatis tidak memiliki paket privat solo sendiri
        User::whereIn('id', $validated['member_ids'])->update(['subscription_package_id' => null]);

        if (isset($validated['coach_ids'])) {
            $sharedPackage->coaches()->sync($validated['coach_ids']);
        } else {
            $sharedPackage->coaches()->detach();
        }

        return redirect()->back()->with('message', 'Paket bersama berhasil diperbarui.');
    }

    /**
     * Delete a shared package.
     */
    public function destroy(SharedPackage $sharedPackage)
    {
        abort_if(!in_array(auth()->user()->role, ['superadmin', 'coach']), 403);

        // Unlink trainings from this shared package (don't delete the trainings)
        IndividualTraining::where('shared_package_id', $sharedPackage->id)
            ->update([
                'shared_package_id' => null,
                'shared_session_number' => null,
            ]);

        $sharedPackage->delete();

        return redirect()->back()->with('message', 'Paket bersama berhasil dihapus.');
    }

    /**
     * Pay/mark all sessions in a shared package as paid.
     */
    public function pay(Request $request, SharedPackage $sharedPackage)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403);

        IndividualTraining::where('shared_package_id', $sharedPackage->id)
            ->where('is_athlete_paid', false)
            ->update(['is_athlete_paid' => true]);

        \App\Http\Controllers\Admin\IndividualTrainingController::resequenceSharedPackageSessions($sharedPackage->id);
        foreach ($sharedPackage->members as $member) {
            \App\Http\Controllers\Admin\IndividualTrainingController::resequenceAthleteSessions($member->id);
        }

        return redirect()->back()->with('success', 'Berhasil menandai sesi paket bersama sebagai lunas.');
    }
}
