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
    
    private $defaultBenchmarks = [
        "bmi" => ["underweight" => 18.5, "normal" => 23.0, "overweight" => 25.0, "obesity1" => 30.0],
        "bodyfat_male" => ["essential" => 5, "athlete" => 13, "fitness" => 17, "acceptable" => 24],
        "bodyfat_female" => ["essential" => 5, "athlete" => 20, "fitness" => 24, "acceptable" => 31],
        "muscle_male_18_40" => ["low" => 33.4, "normal" => 39.4, "high" => 44.1],
        "muscle_male_41_60" => ["low" => 33.2, "normal" => 39.2, "high" => 43.9],
        "muscle_male_61_80" => ["low" => 33.0, "normal" => 38.7, "high" => 43.4],
        "muscle_female_18_40" => ["low" => 24.4, "normal" => 30.2, "high" => 35.2],
        "muscle_female_41_60" => ["low" => 24.2, "normal" => 30.3, "high" => 35.3],
        "muscle_female_61_80" => ["low" => 24.0, "normal" => 29.8, "high" => 34.8],
        "bone_male" => ["lt_60" => 2.5, "60_75" => 2.9, "gt_75" => 3.2],
        "bone_female" => ["lt_45" => 1.8, "45_60" => 2.2, "gt_60" => 2.5],
        "visceral_fat" => ["standard" => 9, "high" => 14],
        "tbw_male" => ["min" => 50, "max" => 65],
        "tbw_female" => ["min" => 45, "max" => 60]
    ];

    public function index(Request $request)
    {
        $currentUser = Auth::user();
        
        
        if ($currentUser->role === 'athlete') {
            return redirect()->route('admin.composition-tests.show', $currentUser->id);
        }

        $query = User::where('role', 'athlete')->with('sport');
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $athletes = $query->get()->map(function($user) {
            $user->total_tests = CompositionTest::where('user_id', $user->id)->count();
            
            $user->latest_test = CompositionTest::where('user_id', $user->id)->orderBy('date', 'desc')->first();
            return $user;
        });

        
        $setting = Setting::where('key', 'composition_benchmarks')->first();
        $benchmarks = $setting ? json_decode($setting->value, true) : $this->defaultBenchmarks;

        return Inertia::render('Admin/CompositionTests/Index', [
            'athletes' => $athletes,
            'filters' => $request->only(['search']),
            'benchmarks' => $benchmarks,
            'is_athlete' => false
        ]);
    }

    /**
     * Menyimpan Pengaturan Benchmark Dinamis (Diubah oleh Pelatih/Admin)
     */
    public function saveBenchmarks(Request $request)
    {
        $request->validate([
            'benchmarks' => 'required|array'
        ]);

        
        Setting::updateOrCreate(
            ['key' => 'composition_benchmarks'],
            ['value' => json_encode($request->benchmarks), 'type' => 'json']
        );

        return redirect()->back()->with('message', 'Standar Benchmark berhasil diperbarui!');
    }

    /**
     * Tampilkan Riwayat & Form Input Tes (Satu Atlet)
     */
    public function show(User $user)
    {
        $currentUser = auth()->user();
        if ($currentUser->role === 'athlete' && $user->id !== $currentUser->id) abort(403);

        $user->load('sport');
        
        
        $history = CompositionTest::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get();

        
        $setting = Setting::where('key', 'composition_benchmarks')->first();
        $benchmarks = $setting ? json_decode($setting->value, true) : $this->defaultBenchmarks;

        return Inertia::render('Admin/CompositionTests/Show', [
            'athlete' => $user,
            'history' => $history,
            'benchmarks' => $benchmarks
        ]);
    }

    /**
     * Simpan Rekaman Tes Komposisi Baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'age' => 'required|integer',
            'metabolic_age' => 'nullable|integer',
            'weight' => 'required|numeric',
            'height' => 'required|numeric', 
            'body_fat_percentage' => 'nullable|numeric',
            'muscle_mass' => 'nullable|numeric',
            'bone_mass' => 'nullable|numeric',
            'visceral_fat' => 'nullable|numeric',
            'bmr' => 'nullable|integer',
            'total_body_water' => 'nullable|numeric',
        ]);

        
        $height = $validated['height'];
        $weight = $validated['weight'];
        $bmi = ($height > 0) ? round($weight / ($height * $height), 2) : 0;

        CompositionTest::create(array_merge($validated, ['bmi' => $bmi]));

        return redirect()->back()->with('message', 'Data komposisi tubuh berhasil disimpan!');
    }

    public function update(Request $request, CompositionTest $compositionTest)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'age' => 'required|integer',
            'metabolic_age' => 'nullable|integer',
            'weight' => 'required|numeric',
            'height' => 'required|numeric',
            'body_fat_percentage' => 'nullable|numeric',
            'muscle_mass' => 'nullable|numeric',
            'bone_mass' => 'nullable|numeric',
            'visceral_fat' => 'nullable|numeric',
            'bmr' => 'nullable|integer',
            'total_body_water' => 'nullable|numeric',
        ]);

        $bmi = ($validated['height'] > 0) ? round($validated['weight'] / ($validated['height'] * $validated['height']), 2) : 0;

        $compositionTest->update(array_merge($validated, ['bmi' => $bmi]));

        return redirect()->back()->with('message', 'Data berhasil diperbarui!');
    }

    
    public function destroy(CompositionTest $compositionTest)
    {
        $compositionTest->delete();
        return redirect()->back()->with('message', 'Data tes berhasil dihapus.');
    }
}