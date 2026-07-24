<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MealPlan;
use App\Models\User;
use App\Models\CompositionTest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MealPlanController extends Controller
{
    public function index(Request $request)
    {
        $currentUser = Auth::user();
        if ($currentUser && $currentUser->role === 'athlete') {
            return redirect()->route('admin.meal-plans.show', $currentUser->id);
        }

        $query = User::where('role', 'athlete')->orderBy('name', 'asc');
        
        if ($currentUser && $currentUser->role === 'coach') {
            $query->whereHas('coaches', function($q) use ($currentUser) {
                $q->where('coach_id', $currentUser->id);
            });
        }
        
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        $athletes = $query->get();
        
        $athleteIds = $athletes->pluck('id');
        $allPlans = MealPlan::whereIn('user_id', $athleteIds)
                        ->orderBy('created_at', 'desc')
                        ->get();

        $athletes->map(function($athlete) use ($allPlans) {
            $athletePlans = $allPlans->where('user_id', $athlete->id);
            $athlete->total_plans = $athletePlans->count();
            $athlete->latest_plan = $athletePlans->first();
            $athlete->photo_url = $athlete->profile_photo ? asset('storage/' . $athlete->profile_photo) : null;
            return $athlete;
        });

        return Inertia::render('Admin/MealPlans/Index', [
            'athletes' => $athletes,
            'filters' => $request->only('search')
        ]);
    }

    public function show($id)
    {
        $player = User::findOrFail($id);
        $currentUser = Auth::user();

        // Security check
        if ($currentUser->role === 'athlete' && $currentUser->id !== $player->id) {
            abort(403);
        }

        $player->photo_url = $player->profile_photo ? asset('storage/' . $player->profile_photo) : null;

        $history = MealPlan::where('user_id', $player->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $latestTest = CompositionTest::where('user_id', $player->id)
            ->orderBy('date', 'desc')
            ->first();

        return Inertia::render('Admin/MealPlans/Show', [
            'player' => $player,
            'history' => $history,
            'latestTest' => $latestTest
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'recommendation' => 'nullable|string',
            'target_calories' => 'nullable|integer',
            'protein_target' => 'nullable|integer',
            'carbs_target' => 'nullable|integer',
            'fats_target' => 'nullable|integer',
            'weekly_plan' => 'nullable|array',
            'hydration_plan' => 'nullable|array',
            'supplements_plan' => 'nullable|array',
            'notes' => 'nullable|string',
            'warnings' => 'nullable|string',
        ]);

        $data = $request->all();
        $data['coach_id'] = Auth::id();

        MealPlan::create($data);

        return redirect()->back()->with('success', 'Rencana Makan berhasil disimpan.');
    }

    public function destroy($id)
    {
        $plan = MealPlan::findOrFail($id);
        $plan->delete();

        return redirect()->back()->with('success', 'Rencana Makan berhasil dihapus.');
    }
}
