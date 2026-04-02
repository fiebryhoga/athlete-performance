<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingLoad;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth; // 1. Tambahkan Facade Auth

class TrainingLoadController extends Controller
{
    /**
     * Menampilkan daftar semua atlet
     */
    public function index(Request $request)
    {
        $currentUser = Auth::user();

        // ==========================================================
        // LOMPATAN KHUSUS ATLET: Langsung ke halamannya sendiri
        // ==========================================================
        if ($currentUser->role === 'athlete') {
            return redirect()->route('admin.training-loads.show', $currentUser->id);
        }

        $query = User::where('role', 'athlete')->with('sport');

        // Tambahan: Fitur Search agar selaras dengan UI terbaru
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $athletes = $query->get()->map(function($user) {
            // Hitung total hari di mana atlet mengisi Wellness atau RPE
            $user->total_records = TrainingLoad::where('user_id', $user->id)->count();
            return $user;
        });

        return Inertia::render('Admin/TrainingLoads/Index', [
            'athletes' => $athletes,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Menampilkan detail halaman Wellness & RPE per atlet
     */
    public function show(User $user)
    {
        $currentUser = Auth::user();

        // --- PROTEKSI AKSES: Cegah atlet mengintip data atlet lain ---
        if ($currentUser->role === 'athlete' && $user->id !== $currentUser->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat melihat data Wellness Anda sendiri.');
        }

        $user->load('sport');
        
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
        $currentUser = Auth::user();

        // 1. Validasi Input Dasar
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'record_date' => 'required|date',
            
            // Wellness
            'sleep_quality' => 'nullable|integer|min:0|max:5',
            'fatigue' => 'nullable|integer|min:0|max:5',
            'muscle_soreness' => 'nullable|integer|min:0|max:5',
            'stress' => 'nullable|integer|min:0|max:5',
            'motivation' => 'nullable|integer|min:0|max:5',
            'health' => 'nullable|integer|min:0|max:5',
            'mood' => 'nullable|integer|min:0|max:5',
            'study_attitude' => 'nullable|integer|min:0|max:5',
            
            // Sesi AM
            'am_session_type' => 'nullable|string|max:100',
            'am_rpe' => 'nullable|integer|min:0|max:10',
            'am_duration' => 'nullable|integer|min:0',
            
            // Sesi PM
            'pm_session_type' => 'nullable|string|max:100',
            'pm_rpe' => 'nullable|integer|min:0|max:10',
            'pm_duration' => 'nullable|integer|min:0',
        ]);

        // --- PROTEKSI AKSES: Cegah atlet menginput data atas nama orang lain ---
        if ($currentUser->role === 'athlete' && $validated['user_id'] != $currentUser->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat mengisi form Wellness untuk diri sendiri.');
        }

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

        // 4. Simpan ke Database
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
                'wellness_score' => $wellness_score,
                
                'am_session_type' => $validated['am_session_type'],
                'am_rpe' => $validated['am_rpe'],
                'am_duration' => $validated['am_duration'],
                'am_load' => $am_load,
                
                'pm_session_type' => $validated['pm_session_type'],
                'pm_rpe' => $validated['pm_rpe'],
                'pm_duration' => $validated['pm_duration'],
                'pm_load' => $pm_load,
                
                'daily_load' => $daily_load
            ]
        );

        return redirect()->back()->with('message', 'Data Wellness & RPE berhasil disimpan!');
    }
}