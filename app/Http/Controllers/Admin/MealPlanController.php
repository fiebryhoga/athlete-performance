<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MealPlan;
use App\Models\MealTracking;
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
            ->get()
            ->map(function ($plan) {
                $plan->append('status');
                return $plan;
            });

        // Load tracking data for all plans
        $planIds = $history->pluck('id');
        $trackings = MealTracking::whereIn('meal_plan_id', $planIds)
            ->where('user_id', $player->id)
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($t) {
                $t->date_str = \Carbon\Carbon::parse($t->date)->format('Y-m-d');
                return $t;
            })
            ->groupBy('meal_plan_id');

        $latestTest = CompositionTest::where('user_id', $player->id)
            ->orderBy('date', 'desc')
            ->first();

        return Inertia::render('Admin/MealPlans/Show', [
            'player' => $player,
            'history' => $history,
            'trackings' => $trackings,
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

    public function update(Request $request, MealPlan $mealPlan)
    {
        $request->validate([
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

        $mealPlan->update($request->all());

        return redirect()->back()->with('success', 'Rencana Makan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $plan = MealPlan::findOrFail($id);
        $plan->delete();

        return redirect()->back()->with('success', 'Rencana Makan berhasil dihapus.');
    }

    public function saveTracking(Request $request)
    {
        $request->validate([
            'meal_plan_id' => 'required|exists:meal_plans,id',
            'date' => 'required|date',
            'tracking_data' => 'required|array',
        ]);

        $mealPlan = MealPlan::findOrFail($request->meal_plan_id);
        $athleteId = $mealPlan->user_id;

        // Calculate compliance score
        $trackingData = $request->tracking_data;
        $totalItems = 0;
        $eatenItems = 0;

        foreach ($trackingData['meals'] ?? [] as $meal) {
            foreach ($meal['items'] ?? [] as $item) {
                if (!empty($item['status'])) {
                    $totalItems++;
                    if ($item['status'] === 'eaten') {
                        $eatenItems++;
                    }
                }
            }
        }

        $complianceScore = $totalItems > 0 ? round(($eatenItems / $totalItems) * 100, 1) : 0;

        MealTracking::updateOrCreate(
            [
                'meal_plan_id' => $mealPlan->id,
                'user_id' => $athleteId,
                'date' => $request->date,
            ],
            [
                'tracking_data' => $trackingData,
                'compliance_score' => $complianceScore,
            ]
        );

        return redirect()->back()->with('success', 'Laporan makan berhasil disimpan.');
    }
}
