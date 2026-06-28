<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\CompositionTest;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CompositionTestController extends Controller
{
    private function getDefaultBenchmarks()
    {
        return [
            "bmi" => [
                "underweight" => ["min" => 0, "max" => 18.4, "label" => "Underweight", "color" => "blue"],
                "normal"      => ["min" => 18.5, "max" => 22.9, "label" => "Normal", "color" => "green"],
                "overweight"  => ["min" => 23.0, "max" => 24.9, "label" => "Overweight", "color" => "yellow"],
                "obesity"     => ["min" => 25.0, "max" => 100, "label" => "Obese", "color" => "red"],
            ],
            "body_fat" => [
                "male" => [
                    "essential"  => ["min" => 2, "max" => 5, "label" => "Essential", "color" => "blue"],
                    "athlete"    => ["min" => 6, "max" => 13, "label" => "Athlete", "color" => "green"],
                    "fitness"    => ["min" => 14, "max" => 17, "label" => "Fitness", "color" => "lime"],
                    "acceptable" => ["min" => 18, "max" => 24, "label" => "Acceptable", "color" => "yellow"],
                    "obese"      => ["min" => 25, "max" => 100, "label" => "Obese", "color" => "red"],
                ],
                "female" => [
                    "essential"  => ["min" => 10, "max" => 13, "label" => "Essential", "color" => "blue"],
                    "athlete"    => ["min" => 14, "max" => 20, "label" => "Athlete", "color" => "green"],
                    "fitness"    => ["min" => 21, "max" => 24, "label" => "Fitness", "color" => "lime"],
                    "acceptable" => ["min" => 25, "max" => 31, "label" => "Acceptable", "color" => "yellow"],
                    "obese"      => ["min" => 32, "max" => 100, "label" => "Obese", "color" => "red"],
                ]
            ],
            "visceral_fat" => [
                "healthy"   => ["min" => 1, "max" => 9, "label" => "Healthy", "color" => "green"],
                "high"      => ["min" => 10, "max" => 14, "label" => "High", "color" => "yellow"],
                "very_high" => ["min" => 15, "max" => 59, "label" => "Very High", "color" => "red"],
            ],
            "phase_angle" => [
                "low"       => ["min" => 0, "max" => 5.4, "label" => "Low (Fatigue/Risk)", "color" => "red"],
                "normal"    => ["min" => 5.5, "max" => 6.9, "label" => "Normal", "color" => "green"],
                "excellent" => ["min" => 7.0, "max" => 15, "label" => "Excellent (Athlete)", "color" => "blue"],
            ]
        ];
    }

    public function index(Request $request)
    {
        $currentUser = Auth::user();
        if ($currentUser && $currentUser->role === 'athlete') {
            return redirect()->route('admin.composition-tests.show', $currentUser->id);
        }

        $query = User::where('role', 'athlete')->orderBy('name', 'asc');
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        $athletes = $query->get();
        
        $athleteIds = $athletes->pluck('id');
        $allTests = CompositionTest::whereIn('user_id', $athleteIds)
                        ->orderBy('date', 'desc')
                        ->get();

        $athletes->map(function($athlete) use ($allTests) {
            $athleteTests = $allTests->where('user_id', $athlete->id);
            $athlete->total_tests = $athleteTests->count();
            $athlete->latest_test = $athleteTests->first();
            $athlete->photo_url = $athlete->profile_photo ? asset('storage/' . $athlete->profile_photo) : null;
            return $athlete;
        });

        $setting = Setting::where('key', 'composition_benchmarks')->first();
        $benchmarks = $setting ? json_decode($setting->value, true) : $this->getDefaultBenchmarks();

        return Inertia::render('Admin/CompositionTests/Index', [
            'athletes' => $athletes,
            'benchmarks' => $benchmarks,
            'filters' => $request->only(['search'])
        ]);
    }

    public function show(User $user)
    {
        if ($user->role !== 'athlete') abort(404);
        
        $currentUser = auth()->user();
        if ($currentUser->role === 'athlete' && $user->id !== $currentUser->id) abort(403);

        $user->photo_url = $user->profile_photo ? asset('storage/' . $user->profile_photo) : null;
        
        $history = CompositionTest::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get();

        $setting = Setting::where('key', 'composition_benchmarks')->first();
        $benchmarks = $setting ? json_decode($setting->value, true) : $this->getDefaultBenchmarks();

        return Inertia::render('Admin/CompositionTests/Show', [
            'player' => $user, 
            'history' => $history,
            'benchmarks' => $benchmarks
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'             => 'required|exists:users,id',
            'date'                => 'required|date',
            'age'                 => 'required|integer',
            'metabolic_age'       => 'nullable|integer',
            'weight'              => 'required|numeric',
            'height'              => 'required|numeric',
            'bmi'                 => 'nullable|numeric',
            'body_fat_percentage' => 'nullable|numeric',
            'fat_free_mass'       => 'nullable|numeric',
            'muscle_mass'         => 'nullable|numeric',
            'skeletal_muscle_mass'=> 'nullable|numeric',
            'bone_mass'           => 'nullable|numeric',
            'essential_fat_mass'  => 'nullable|numeric',
            'storage_fat_mass'    => 'nullable|numeric',
            'visceral_fat'        => 'nullable|numeric',
            'total_body_water'    => 'nullable|numeric',
            'intracellular_water' => 'nullable|numeric',
            'extracellular_water' => 'nullable|numeric',
            'phase_angle'         => 'nullable|numeric',
            'bmr'                 => 'nullable|integer',
            'other_mass'          => 'nullable|numeric',
        ]);

        $height = $validated['height'];
        $weight = $validated['weight'];
        $bmi = ($height > 0) ? round($weight / ($height * $height), 2) : 0;

        CompositionTest::create(array_merge($validated, ['bmi' => $bmi]));

        return redirect()->back()->with('message', 'Data komposisi tubuh berhasil disimpan!');
    }

    public function update(Request $request, $id)
    {
        $test = CompositionTest::findOrFail($id);
        
        $validated = $request->validate([
            'date'                => 'required|date',
            'age'                 => 'required|integer',
            'metabolic_age'       => 'nullable|integer',
            'weight'              => 'required|numeric',
            'height'              => 'required|numeric',
            'bmi'                 => 'nullable|numeric',
            'body_fat_percentage' => 'nullable|numeric',
            'fat_free_mass'       => 'nullable|numeric',
            'muscle_mass'         => 'nullable|numeric',
            'skeletal_muscle_mass'=> 'nullable|numeric',
            'bone_mass'           => 'nullable|numeric',
            'essential_fat_mass'  => 'nullable|numeric',
            'storage_fat_mass'    => 'nullable|numeric',
            'visceral_fat'        => 'nullable|numeric',
            'total_body_water'    => 'nullable|numeric',
            'intracellular_water' => 'nullable|numeric',
            'extracellular_water' => 'nullable|numeric',
            'phase_angle'         => 'nullable|numeric',
            'bmr'                 => 'nullable|integer',
            'other_mass'          => 'nullable|numeric',
        ]);

        $bmi = ($validated['height'] > 0) ? round($validated['weight'] / ($validated['height'] * $validated['height']), 2) : 0;

        $test->update(array_merge($validated, ['bmi' => $bmi]));

        return redirect()->back()->with('message', 'Data berhasil diperbarui!');
    }

    
    public function destroy(CompositionTest $compositionTest)
    {
        $compositionTest->delete();
        return redirect()->back()->with('message', 'Data tes berhasil dihapus.');
    }

    public function saveBenchmarks(Request $request)
    {
        $validated = $request->validate([
            'benchmarks' => 'required|array'
        ]);

        Setting::updateOrCreate(
            ['key' => 'composition_benchmarks'],
            ['value' => json_encode($validated['benchmarks'])]
        );

        return redirect()->back()->with('message', 'Benchmarks saved successfully.');
    }
}