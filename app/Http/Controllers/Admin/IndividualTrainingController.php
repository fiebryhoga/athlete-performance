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

    public function createSession(Request $request, User $user)
    {
        if ($user->role !== 'athlete') {
            abort(404);
        }

        $dateStr = $request->query('date', Carbon::today()->format('Y-m-d'));
        
        $trainings = IndividualTraining::where('user_id', $user->id)
            ->where('date', $dateStr)
            ->get();
            
        $lastSessionNumber = $trainings->count() > 0 
            ? $trainings->max('session_number') 
            : 0;
            
        $nextSessionNumber = $lastSessionNumber + 1;

        $exercisesList = Exercise::with('category')->orderBy('name', 'asc')->get();
        $packagesList = \App\Models\ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/IndividualTrainings/CreateSession', [
            'athlete' => $user,
            'exercises' => $exercisesList,
            'packages' => $packagesList,
            'date' => $dateStr,
            'nextSessionNumber' => $nextSessionNumber,
        ]);
    }

    public function storeSession(Request $request, User $user)
    {
        $request->validate([
            'date' => 'required|date',
            'session_option' => 'required|in:restart,next,custom',
            'custom_session_number' => 'nullable|integer|min:1',
            'training_type' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'blocks' => 'array',
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

        if (!empty($request->blocks)) {
            $order = 0;
            foreach ($request->blocks as $block) {
                if (isset($block['step']) && $block['step'] === 1) {
                    // Text block
                    $note = $block['items'][0]['note'] ?? null;
                    if ($note) {
                        IndividualTrainingProgram::create([
                            'individual_training_id' => $training->id,
                            'phase' => 'TEXT_BLOCK',
                            'logic' => $block['category'] ?? null,
                            'exercise_id' => null,
                            'notes' => $note,
                            'order' => $order++,
                        ]);
                    }
                } else {
                    // Phase block
                    if (!empty($block['items'])) {
                        foreach ($block['items'] as $item) {
                            IndividualTrainingProgram::create([
                                'individual_training_id' => $training->id,
                                'phase' => $block['title'] ?? null,
                                'logic' => $block['category'] ?? null,
                                'exercise_id' => $item['exercise_id'] ?? null,
                                'sets' => $item['sets'] ?? null,
                                'reps' => $item['reps'] ?? null,
                                'duration' => $item['duration'] ?? null,
                                'rest' => $item['rest'] ?? null,
                                'intensity' => $item['intensity'] ?? null,
                                'notes' => $item['notes'] ?? null,
                                'order' => $order++,
                            ]);
                        }
                    }
                }
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
