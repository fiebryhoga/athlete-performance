<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingLoad;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth; 

class TrainingLoadController extends Controller
{
    /**
     * Menampilkan daftar semua atlet
     */
    public function index(Request $request)
    {
        $currentUser = Auth::user();

        
        
        
        if ($currentUser->role === 'athlete') {
            return redirect()->route('admin.training-loads.show', $currentUser->id);
        }

        $query = User::where('role', 'athlete')->with('sport');

        
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $athletes = $query->get()->map(function($user) {
            
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

        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'record_date' => 'required|date',
            
            
            'sleep_quality' => 'nullable|integer|min:0|max:5',
            'fatigue' => 'nullable|integer|min:0|max:5',
            'muscle_soreness' => 'nullable|integer|min:0|max:5',
            'stress' => 'nullable|integer|min:0|max:5',
            'motivation' => 'nullable|integer|min:0|max:5',
            'health' => 'nullable|integer|min:0|max:5',
            'mood' => 'nullable|integer|min:0|max:5',
            'study_attitude' => 'nullable|integer|min:0|max:5',
            
            
            'am_session_type' => 'nullable|string|max:100',
            'am_rpe' => 'nullable|integer|min:0|max:10',
            'am_duration' => 'nullable|integer|min:0',
            
            
            'pm_session_type' => 'nullable|string|max:100',
            'pm_rpe' => 'nullable|integer|min:0|max:10',
            'pm_duration' => 'nullable|integer|min:0',

            
            'notes' => 'nullable|string|max:1000',
        ]);

        
        if ($currentUser->role === 'athlete' && $validated['user_id'] != $currentUser->id) {
            abort(403, 'Akses Ditolak. Anda hanya dapat mengisi form Wellness untuk diri sendiri.');
        }

        
        $wellness_score = 0;
        $wellnessItems = ['sleep_quality', 'fatigue', 'muscle_soreness', 'stress', 'motivation', 'health', 'mood', 'study_attitude'];
        foreach ($wellnessItems as $item) {
            if (isset($validated[$item])) {
                $wellness_score += $validated[$item];
            }
        }

        
        $am_load = 0;
        if (isset($validated['am_rpe']) && isset($validated['am_duration'])) {
            $am_load = $validated['am_rpe'] * $validated['am_duration'];
        }

        $pm_load = 0;
        if (isset($validated['pm_rpe']) && isset($validated['pm_duration'])) {
            $pm_load = $validated['pm_rpe'] * $validated['pm_duration'];
        }

        $daily_load = $am_load + $pm_load;

        
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
                
                'daily_load' => $daily_load,
                'notes' => $validated['notes'] ?? null, 
            ]
        );

        return redirect()->back()->with('message', 'Data Wellness & RPE berhasil disimpan!');
    }
}