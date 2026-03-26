<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingLoad;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TrainingLoadController extends Controller
{
    /**
     * Menampilkan daftar semua atlet
     */
    public function index()
    {
        $athletes = User::where('role', 'athlete')
            ->with('sport')
            ->get()
            ->map(function($user) {
                // Hitung total hari di mana atlet mengisi Wellness atau RPE
                $user->total_records = TrainingLoad::where('user_id', $user->id)->count();
                return $user;
            });

        return Inertia::render('Admin/TrainingLoads/Index', [
            'athletes' => $athletes
        ]);
    }

    /**
     * Menampilkan detail halaman Wellness & RPE per atlet
     */
    public function show(User $user)
    {
        $user->load('sport');
        
        // Ambil data historis dari tabel training_loads, diurutkan dari terbaru
        $trainingHistory = TrainingLoad::where('user_id', $user->id)
            ->orderBy('record_date', 'desc')
            ->get();

        return Inertia::render('Admin/TrainingLoads/Show', [
            'athlete' => $user,
            'trainingHistory' => $trainingHistory
        ]);
    }

    /**
     * Menyimpan dan Mengkalkulasi data Wellness dan RPE (Upsert)
     */
    public function store(Request $request)
    {
        // 1. Validasi Input Dasar
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'record_date' => 'required|date',
            
            // Wellness (Maksimum 5 poin per item, biarkan nullable)
            'sleep_quality' => 'nullable|integer|min:0|max:5',
            'fatigue' => 'nullable|integer|min:0|max:5',
            'muscle_soreness' => 'nullable|integer|min:0|max:5',
            'stress' => 'nullable|integer|min:0|max:5',
            'motivation' => 'nullable|integer|min:0|max:5',
            'health' => 'nullable|integer|min:0|max:5',
            'mood' => 'nullable|integer|min:0|max:5',
            'study_attitude' => 'nullable|integer|min:0|max:5',
            
            // Sesi AM (Pagi)
            'am_session_type' => 'nullable|string|max:100',
            'am_rpe' => 'nullable|integer|min:0|max:10',
            'am_duration' => 'nullable|integer|min:0',
            
            // Sesi PM (Sore/Malam)
            'pm_session_type' => 'nullable|string|max:100',
            'pm_rpe' => 'nullable|integer|min:0|max:10',
            'pm_duration' => 'nullable|integer|min:0',
        ]);

        // 2. Kalkulasi Wellness Score
        $wellness_score = 0;
        $wellnessItems = ['sleep_quality', 'fatigue', 'muscle_soreness', 'stress', 'motivation', 'health', 'mood', 'study_attitude'];
        foreach ($wellnessItems as $item) {
            if (isset($validated[$item])) {
                $wellness_score += $validated[$item];
            }
        }

        // 3. Kalkulasi Beban Latihan (Load = RPE x Durasi)
        $am_load = 0;
        if (isset($validated['am_rpe']) && isset($validated['am_duration'])) {
            $am_load = $validated['am_rpe'] * $validated['am_duration'];
        }

        $pm_load = 0;
        if (isset($validated['pm_rpe']) && isset($validated['pm_duration'])) {
            $pm_load = $validated['pm_rpe'] * $validated['pm_duration'];
        }

        $daily_load = $am_load + $pm_load;

        // 4. Simpan ke Database (UpdateOrCreate)
        TrainingLoad::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'record_date' => $validated['record_date']
            ],
            [
                'sleep_quality' => $validated['sleep_quality'],
                'fatigue' => $validated['fatigue'],
                'muscle_soreness' => $validated['muscle_soreness'],
                'stress' => $validated['stress'],
                'motivation' => $validated['motivation'],
                'health' => $validated['health'],
                'mood' => $validated['mood'],
                'study_attitude' => $validated['study_attitude'],
                'wellness_score' => $wellness_score, // Hasil kalkulasi
                
                'am_session_type' => $validated['am_session_type'],
                'am_rpe' => $validated['am_rpe'],
                'am_duration' => $validated['am_duration'],
                'am_load' => $am_load, // Hasil kalkulasi
                
                'pm_session_type' => $validated['pm_session_type'],
                'pm_rpe' => $validated['pm_rpe'],
                'pm_duration' => $validated['pm_duration'],
                'pm_load' => $pm_load, // Hasil kalkulasi
                
                'daily_load' => $daily_load // Hasil kalkulasi
            ]
        );

        return redirect()->back()->with('message', 'Data Wellness & RPE berhasil disimpan!');
    }
}