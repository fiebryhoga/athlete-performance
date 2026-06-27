<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IndividualTraining;
use App\Models\IndividualTrainingProgram;
use App\Models\User;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class IndividualTrainingController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'athlete')->with('sport');
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $athletes = $query->get()->map(function($user) {
            $user->total_records = IndividualTraining::where('user_id', $user->id)->count();
            return $user;
        });

        return Inertia::render('Admin/IndividualTrainings/Index', [
            'athletes' => $athletes,
            'filters' => $request->only(['search'])
        ]);
    }

    public function showAthleteTrainings(User $user)
    {
        if ($user->role !== 'athlete') {
            abort(404);
        }

        $trainings = IndividualTraining::where('user_id', $user->id)
            ->with(['coach', 'programs.exercise'])
            ->orderBy('date', 'asc')
            ->orderBy('session_number', 'asc')
            ->get();

        $exercisesList = Exercise::with('category')->orderBy('name', 'asc')->get();
        $packagesList = \App\Models\ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/IndividualTrainings/ShowAthlete', [
            'athlete' => $user,
            'trainings' => $trainings,
            'exercises' => $exercisesList,
            'packages' => $packagesList
        ]);
    }

    public function storeSession(Request $request, User $user)
    {
        $request->validate([
            'date' => 'required|date',
            'session_option' => 'required|in:restart,next,custom',
            'custom_session_number' => 'nullable|integer|min:1',
            'training_type' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'programs' => 'array',
        ]);

        $session_number = 1;
        if ($request->session_option === 'restart') {
            $session_number = 1;
        } elseif ($request->session_option === 'next') {
            $lastTraining = IndividualTraining::where('user_id', $user->id)
                ->where('date', $request->date)
                ->orderBy('session_number', 'desc')
                ->first();
            $session_number = $lastTraining ? $lastTraining->session_number + 1 : 1;
        } elseif ($request->session_option === 'custom') {
            $session_number = $request->custom_session_number ?? 1;
        }

        $firstTrainingDate = IndividualTraining::where('user_id', $user->id)->min('date');
        if (!$firstTrainingDate) {
            $firstTrainingDate = $user->created_at->format('Y-m-d');
        }
        
        $day_number = Carbon::parse($firstTrainingDate)->diffInDays(Carbon::parse($request->date)) + 1;
        if ($day_number < 1) $day_number = 1;

        $training = IndividualTraining::create([
            'user_id' => $user->id,
            'coach_id' => Auth::id(),
            'date' => $request->date,
            'day_number' => $day_number,
            'session_number' => $session_number,
            'training_type' => $request->training_type,
            'location' => $request->location,
        ]);

        if (!empty($request->programs)) {
            foreach ($request->programs as $index => $prog) {
                IndividualTrainingProgram::create([
                    'individual_training_id' => $training->id,
                    'phase' => $prog['phase'] ?? null,
                    'logic' => $prog['logic'] ?? null,
                    'exercise_id' => $prog['exercise_id'] ?? null,
                    'sets' => $prog['sets'] ?? null,
                    'reps' => $prog['reps'] ?? null,
                    'duration' => $prog['duration'] ?? null,
                    'rest' => $prog['rest'] ?? null,
                    'intensity' => $prog['intensity'] ?? null,
                    'notes' => $prog['notes'] ?? null,
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.individual-trainings.show', $user->id)
            ->with('message', 'Sesi latihan berhasil ditambahkan!');
    }

    public function destroySession(IndividualTraining $training)
    {
        $userId = $training->user_id;
        $training->delete();
        return redirect()->route('admin.individual-trainings.show', $userId)
            ->with('message', 'Sesi latihan dihapus.');
    }
}
