<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingSession;
use App\Models\TrainingSessionExercise;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Exercise;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Auth;

class TrainingLogController extends Controller
{
    /**
     * Tampilkan Tabel Jadwal Semua Klien (Global Schedule)
     */
    /**
     * Tampilkan Tabel Jadwal Semua Klien (Global Schedule - Mode Kalender Bulanan)
     */
    public function athleteList(Request $request)
    {
        $query = User::where('role', 'athlete')->with('sport');
        if ($request->search) $query->where('name', 'like', '%' . $request->search . '%');

        $athletes = $query->get()->map(function($user) {
            $user->total_records = TrainingSession::where('user_id', $user->id)->count();
            return $user;
        });

        return Inertia::render('Admin/TrainingLogs/AthleteList', [
            'athletes' => $athletes, 'filters' => $request->only(['search'])
        ]);
    }

    public function index(Request $request)
    {
        $currentUser = Auth::user();
        
        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfDay();
        $endDate = $startDate->copy()->endOfMonth()->endOfDay();

        $query = TrainingSession::with(['user', 'coach'])
            ->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->orderBy('date', 'asc') 
            ->orderBy('id', 'asc');
        
        if ($currentUser->role === 'athlete') {
            $query->where('user_id', $currentUser->id);
        }
        
        $sessionsFromDb = $query->get()->groupBy('date');
        
        $period = CarbonPeriod::create($startDate, $endDate);
        $calendar = [];

        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');
            if ($sessionsFromDb->has($dateString)) {
                foreach ($sessionsFromDb[$dateString] as $session) {
                    $calendar[] = ['date' => $dateString, 'is_empty' => false, 'session' => $session];
                }
            } else {
                $calendar[] = ['date' => $dateString, 'is_empty' => true, 'session' => null];
            }
        }
        
        $athletes = User::where('role', 'athlete')->get(['id', 'name']);
        $coaches = User::whereIn('role', ['admin', 'coach'])->get(['id', 'name']);

        return Inertia::render('Admin/TrainingLogs/Index', [
            'calendar' => $calendar,
            'athletes' => $athletes,
            'coaches' => $coaches,
            'is_athlete' => $currentUser->role === 'athlete',
            'currentMonth' => (int)$month,
            'currentYear' => (int)$year,
            'monthName' => $startDate->translatedFormat('F Y'),
        ]);
    }

    public function storeSession(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'session_number' => 'required|integer|min:1|max:100',
            'training_type' => 'required|string|max:255',
            'coach_id' => 'nullable|exists:users,id',
            'location' => 'nullable|string|max:255',
        ]);

        $session = TrainingSession::create($request->all());

        TrainingSessionExercise::create([
            'training_session_id' => $session->id, 
            'order' => 0
        ]);

        
        return redirect()->back()->with('message', 'Jadwal sesi berhasil ditambahkan!');
    }

    

    /**
     * Update Data Jadwal Sesi (Bukan isi Log Excel)
     */
    public function updateSession(Request $request, TrainingSession $trainingSession)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'session_number' => 'required|integer|min:1|max:100',
            'training_type' => 'required|string|max:255',
            'coach_id' => 'nullable|exists:users,id',
            'location' => 'nullable|string|max:255',
        ]);

        $trainingSession->update($request->all());

        return redirect()->back()->with('message', 'Jadwal berhasil diperbarui!');
    }

    /**
     * PERBAIKAN: Kirim 'exercisesList' ke halaman Show (Excel Log)
     */
    public function show(TrainingSession $trainingSession)
    {
        $trainingSession->load(['user', 'coach', 'exercises']);
        
        $exercisesList = Exercise::orderBy('name', 'asc')->pluck('name');

        $nextSession = TrainingSession::where('user_id', $trainingSession->user_id)
            ->where('date', '>', $trainingSession->date)
            ->orderBy('date', 'asc')
            ->first();

        
        $historySessions = TrainingSession::where('user_id', $trainingSession->user_id)
            ->where('date', '<', $trainingSession->date)
            ->with('exercises') 
            ->orderBy('date', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/TrainingLogs/Show', [
            'session' => $trainingSession, 
            'exercisesList' => $exercisesList, 
            'nextSession' => $nextSession,
            'historySessions' => $historySessions,
            'is_athlete' => Auth::user()->role === 'athlete'
        ]);
    }

    public function update(Request $request, TrainingSession $trainingSession)
    {
        $exercises = $request->exercises ?? [];
        
        
        $sentIds = collect($exercises)->pluck('id')->filter()->toArray();

        
        if (empty($sentIds)) {
            $trainingSession->exercises()->delete(); 
        } else {
            $trainingSession->exercises()->whereNotIn('id', $sentIds)->delete();
        }

        
        foreach ($exercises as $index => $exData) {
            $trainingSession->exercises()->updateOrCreate(
                
                ['id' => $exData['id'] ?? null, 'training_session_id' => $trainingSession->id],
                
                [
                    'order' => $index, 
                    'exercise_name' => $exData['exercise_name'] ?? null,
                    'set_1_load' => $exData['set_1_load'] ?? null, 'set_1_reps' => $exData['set_1_reps'] ?? null,
                    'set_2_load' => $exData['set_2_load'] ?? null, 'set_2_reps' => $exData['set_2_reps'] ?? null,
                    'set_3_load' => $exData['set_3_load'] ?? null, 'set_3_reps' => $exData['set_3_reps'] ?? null,
                    'set_4_load' => $exData['set_4_load'] ?? null, 'set_4_reps' => $exData['set_4_reps'] ?? null,
                    'notes' => $exData['notes'] ?? null,
                ]
            );
        }

        return redirect()->back()->with('message', 'Log Latihan Berhasil Disimpan!');
    }

    public function addRow(TrainingSession $trainingSession)
    {
        TrainingSessionExercise::create([
            'training_session_id' => $trainingSession->id,
            'order' => $trainingSession->exercises()->count()
        ]);
        return redirect()->back();
    }

    public function destroy(TrainingSession $trainingSession)
    {
        $trainingSession->delete();
        return redirect()->back()->with('message', 'Sesi Latihan Dihapus.');
    }

    /**
     * FUNGSI BARU: Untuk menyimpan nama gerakan kustom ke Database via API
     */
    public function storeExercise(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        Exercise::firstOrCreate(['name' => $request->name]);

        
        return redirect()->back();
    }

    public function destroyExercise(Request $request)
    {
        $request->validate(['name' => 'required|string']);
        
        
        \App\Models\Exercise::where('name', $request->name)->delete();

        return response()->json(['message' => 'Gerakan dihapus dari library']);
    }
}