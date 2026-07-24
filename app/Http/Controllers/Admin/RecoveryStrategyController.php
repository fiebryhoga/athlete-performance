<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RecoveryStrategy;
use App\Models\User;
use App\Models\TrainingGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RecoveryStrategyController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::user()->role === 'athlete') {
            return redirect()->route('admin.recovery-strategies.show', Auth::id());
        }

        $query = User::where('role', 'athlete')->with('sport');
        
        if (Auth::user()->role === 'coach') {
            $query->whereHas('coaches', function($q) {
                $q->where('coach_id', Auth::id());
            });
        }
        
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $athletes = $query->get();

        $groupsQuery = TrainingGroup::with(['package', 'members']);
        
        if (Auth::user()->role === 'coach') {
            $groupsQuery->whereHas('coaches', function($q) {
                $q->where('coach_id', Auth::id());
            });
        }

        if ($request->search) {
            $groupsQuery->where('name', 'like', '%' . $request->search . '%');
        }

        $groups = $groupsQuery->get();

        return Inertia::render('Admin/RecoveryStrategies/Index', [
            'athletes' => $athletes,
            'groups' => $groups,
            'filters' => $request->only(['search'])
        ]);
    }

    public function showAthlete(User $user)
    {
        if ($user->role !== 'athlete') {
            abort(404);
        }

        $strategies = RecoveryStrategy::where('user_id', $user->id)
            ->with('coach')
            ->orderBy('scheduled_date', 'asc')
            ->get();

        return Inertia::render('Admin/RecoveryStrategies/ShowAthlete', [
            'athlete' => $user,
            'strategies' => $strategies,
        ]);
    }

    public function showGroup(TrainingGroup $group)
    {
        $group->load('members');

        $memberIds = $group->members->pluck('id');
        $strategies = RecoveryStrategy::whereIn('user_id', $memberIds)
            ->select('type', 'scheduled_date', 'notes')
            ->distinct()
            ->get()
            ->map(function ($s, $index) {
                $s->id = 'group-' . $index; // mock id for React key
                return $s;
            });

        return Inertia::render('Admin/RecoveryStrategies/ShowGroup', [
            'group' => $group,
            'strategies' => $strategies, 
        ]);
    }

    public function store(Request $request, User $user)
    {
        $request->validate([
            'type' => 'required|string|max:255',
            'scheduled_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        RecoveryStrategy::create([
            'user_id' => $user->id,
            'coach_id' => Auth::id(),
            'type' => $request->type,
            'scheduled_date' => $request->scheduled_date,
            'notes' => $request->notes,
        ]);

        return back()->with('message', 'Recovery Strategy berhasil ditambahkan!');
    }

    public function storeGroup(Request $request, TrainingGroup $group)
    {
        $request->validate([
            'type' => 'required|string|max:255',
            'scheduled_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $group->load('members');

        foreach ($group->members as $member) {
            RecoveryStrategy::create([
                'user_id' => $member->id,
                'coach_id' => Auth::id(),
                'type' => $request->type,
                'scheduled_date' => $request->scheduled_date,
                'notes' => $request->notes,
            ]);
        }

        return back()->with('message', 'Recovery Strategy berhasil ditambahkan ke semua anggota grup!');
    }

    public function update(Request $request, RecoveryStrategy $strategy)
    {
        $request->validate([
            'type' => 'required|string|max:255',
            'scheduled_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $strategy->update([
            'type' => $request->type,
            'scheduled_date' => $request->scheduled_date,
            'notes' => $request->notes,
        ]);

        return back()->with('message', 'Recovery Strategy berhasil diperbarui!');
    }

    public function destroy(RecoveryStrategy $strategy)
    {
        $strategy->delete();
        return back()->with('message', 'Recovery Strategy berhasil dihapus!');
    }

    public function complete(Request $request, RecoveryStrategy $strategy)
    {
        if (Auth::user()->role !== 'athlete' && Auth::id() !== $strategy->user_id) {
            // Coach/admin can also complete, but let's assume this is mostly for the athlete themselves
            // if we want only the athlete themselves: if (Auth::id() !== $strategy->user_id) abort(403);
        }

        $request->validate([
            'is_completed' => 'required|boolean',
            'athlete_note' => 'nullable|string',
        ]);

        $strategy->update([
            'is_completed' => $request->is_completed,
            'athlete_note' => $request->athlete_note,
        ]);

        return back()->with('message', 'Status Recovery Strategy berhasil diperbarui!');
    }
}
