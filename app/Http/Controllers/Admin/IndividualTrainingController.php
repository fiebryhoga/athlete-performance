<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IndividualTraining;
use App\Models\IndividualTrainingRpeRecord;
use App\Models\TrainingBlock;
use App\Models\TrainingBlockItem;
use App\Models\User;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class IndividualTrainingController extends Controller
{
    /**
     * Index: List all athletes
     */
    public function index(Request $request)
    {
        if (Auth::user()->role === 'athlete') {
            return redirect()->route('admin.individual-trainings.show', Auth::id());
        }

        $query = User::where('role', 'athlete')->with('sport');
        
        if (Auth::user()->role === 'coach') {
            $query->whereHas('coaches', function($q) {
                $q->where('coach_id', Auth::id());
            });
        }
        
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $athletes = $query->get()->map(function($user) {
            $latestTraining = IndividualTraining::where('user_id', $user->id)
                ->orderBy('date', 'desc')
                ->orderBy('id', 'desc')
                ->first();
            $user->total_records = $latestTraining ? $latestTraining->session_number : 0;
            return $user;
        });

        $groupsQuery = \App\Models\TrainingGroup::with(['package', 'members']);
        
        if (Auth::user()->role === 'coach') {
            $groupsQuery->whereHas('coaches', function($q) {
                $q->where('coach_id', Auth::id());
            });
        }

        if ($request->search) {
            $groupsQuery->where('name', 'like', '%' . $request->search . '%');
        }

        $groups = $groupsQuery->get()->map(function($group) {
            $latestTraining = \App\Models\GroupTraining::where('training_group_id', $group->id)
                ->orderBy('date', 'desc')
                ->orderBy('id', 'desc')
                ->first();
            $group->total_records = $latestTraining ? $latestTraining->session_number : 0;
            return $group;
        });

        return Inertia::render('Admin/IndividualTrainings/Index', [
            'athletes' => $athletes,
            'groups' => $groups,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * ShowAthlete: Timeline view for a specific athlete
     */
    public function showAthleteTrainings(User $user)
    {
        if ($user->role !== 'athlete') {
            abort(404);
        }

        $user->load(['sport', 'package']);

        $trainings = IndividualTraining::where('user_id', $user->id)
            ->with(['coach', 'blocks.items.exercise', 'rpeRecords'])
            ->orderBy('date', 'asc')
            ->orderBy('session_number', 'asc')
            ->get();

        // Get group trainings where this athlete is a member of the group
        $groupIds = $user->groups()->pluck('training_groups.id');
        $groupTrainings = \App\Models\GroupTraining::whereIn('training_group_id', $groupIds)
            ->with(['coach', 'group'])
            ->orderBy('date', 'asc')
            ->orderBy('session_number', 'asc')
            ->get();

        $exercisesList = Exercise::with('category')->orderBy('name', 'asc')->get();
        $packagesList = \App\Models\ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/IndividualTrainings/ShowAthlete', [
            'athlete' => $user,
            'trainings' => $trainings,
            'groupTrainings' => $groupTrainings,
            'exercises' => $exercisesList,
            'packages' => $packagesList
        ]);
    }

    /**
     * CreateSession: Form to create a new training session
     */
    public function createSession(Request $request, User $user)
    {
        if ($user->role !== 'athlete') {
            abort(404);
        }

        $dateStr = $request->query('date', Carbon::today()->format('Y-m-d'));
        
        $lastUnpaidSession = IndividualTraining::where('user_id', $user->id)
            ->where('is_athlete_paid', false)
            ->orderBy('session_number', 'desc')
            ->first();
            
        $nextSessionNumber = $lastUnpaidSession ? $lastUnpaidSession->session_number + 1 : 1;

        $exercisesList = Exercise::with('category')->orderBy('name', 'asc')->get();
        $packagesList = \App\Models\ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();
        
        $coaches = $user->coaches()->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/IndividualTrainings/CreateSession', [
            'athlete' => $user,
            'exercises' => $exercisesList,
            'packages' => $packagesList,
            'coaches' => $coaches,
            'date' => $dateStr,
            'nextSessionNumber' => $nextSessionNumber,
        ]);
    }

    /**
     * StoreSession: Save a new training session with blocks structure
     */
    public function storeSession(Request $request, User $user)
    {
        $request->validate([
            'date' => 'required|date',
            'name' => 'nullable|string|max:255',
            'training_type' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'coach_ids' => 'nullable|array',
            'blocks' => 'array',
        ]);

        $lastUnpaidSession = IndividualTraining::where('user_id', $user->id)
            ->where('is_athlete_paid', false)
            ->orderBy('session_number', 'desc')
            ->first();

        $session_number = $lastUnpaidSession ? $lastUnpaidSession->session_number + 1 : 1;

        // Calculate day number
        $firstTrainingDate = IndividualTraining::where('user_id', $user->id)->min('date');
        if (!$firstTrainingDate) {
            $firstTrainingDate = $user->created_at->format('Y-m-d');
        }
        $day_number = Carbon::parse($firstTrainingDate)->diffInDays(Carbon::parse($request->date)) + 1;
        if ($day_number < 1) $day_number = 1;

        // Create the training record
        $training = IndividualTraining::create([
            'user_id' => $user->id,
            'coach_id' => Auth::id(),
            'coach_ids' => $request->coach_ids ?? [],
            'date' => $request->date,
            'day_number' => $day_number,
            'session_number' => $session_number,
            'name' => $request->name,
            'training_type' => $request->training_type,
            'location' => $request->location,
            'status' => 'scheduled',
        ]);

        // Save blocks in ISMS-style hierarchical structure
        if (!empty($request->blocks)) {
            foreach ($request->blocks as $blockIndex => $blockData) {
                $block = TrainingBlock::create([
                    'individual_training_id' => $training->id,
                    'step' => $blockData['step'] ?? 2,
                    'category' => $blockData['category'] ?? 'warm_up',
                    'title' => $blockData['title'] ?? null,
                    'description' => $blockData['description'] ?? null,
                    'sort_order' => $blockIndex,
                    'target_filled_by' => $blockData['target_filled_by'] ?? 'admin',
                ]);

                if (!empty($blockData['items'])) {
                    foreach ($blockData['items'] as $itemIndex => $itemData) {
                        TrainingBlockItem::create([
                            'training_block_id' => $block->id,
                            'exercise_id' => $itemData['exercise_id'] ?? null,
                            'note' => $itemData['note'] ?? null,
                            'load' => $itemData['load'] ?? null,
                            'load_unit' => $itemData['load_unit'] ?? 'kg',
                            'sets' => $itemData['sets'] ?? null,
                            'reps' => $itemData['reps'] ?? null,
                            'reps_unit' => $itemData['reps_unit'] ?? 'reps',
                            'duration' => $itemData['duration'] ?? null,
                            'tempo' => $itemData['tempo'] ?? null,
                            'rir' => $itemData['rir'] ?? null,
                            'rest_per_set' => $itemData['rest_per_set'] ?? ($itemData['rest'] ?? null),
                            'intensity' => $itemData['intensity'] ?? null,
                            'reps_array' => $itemData['reps_array'] ?? null,
                            'load_array' => $itemData['load_array'] ?? null,
                            'distance_array' => $itemData['distance_array'] ?? null,
                            'minutes_array' => $itemData['minutes_array'] ?? null,
                            'tempo_array' => $itemData['tempo_array'] ?? null,
                            'rir_array' => $itemData['rir_array'] ?? null,
                            'rest_per_set_array' => $itemData['rest_per_set_array'] ?? null,
                            'sort_order' => $itemIndex,
                        ]);
                    }
                }
            }
        }

        return redirect()->route('admin.individual-trainings.show', $user->id)
            ->with('message', 'Sesi latihan berhasil ditambahkan!');
    }
    public function editSession(IndividualTraining $training)
    {
        $training->load('user', 'coach', 'blocks.items.exercise');
        
        $exercises = Exercise::all();
        $exercisePackages = \App\Models\ExercisePackage::with('exercises')->get();
        $coaches = $training->user->coaches()->orderBy('name', 'asc')->get();
        
        return inertia('Admin/IndividualTrainings/EditSession', [
            'training' => $training,
            'exercisesList' => $exercises,
            'packagesList' => $exercisePackages,
            'coachesList' => $coaches,
            'user' => $training->user,
        ]);
    }

    public function updateSession(Request $request, IndividualTraining $training)
    {
        $request->validate([
            'date' => 'required|date',
            'name' => 'nullable|string',
            'training_type' => 'required|string',
            'location' => 'nullable|string',
            'coach_ids' => 'nullable|array',
        ]);

        $training->update([
            'date' => $request->date,
            'name' => $request->name,
            'training_type' => $request->training_type,
            'location' => $request->location,
            'coach_ids' => $request->coach_ids,
        ]);

        // Recreate blocks and items
        // First delete existing blocks
        $training->blocks()->delete();

        if (!empty($request->blocks)) {
            foreach ($request->blocks as $blockIndex => $blockData) {
                $block = TrainingBlock::create([
                    'individual_training_id' => $training->id,
                    'step' => $blockData['step'] ?? 2,
                    'category' => $blockData['category'] ?? 'warm_up',
                    'title' => $blockData['title'] ?? null,
                    'description' => $blockData['description'] ?? null,
                    'sort_order' => $blockIndex,
                    'target_filled_by' => $blockData['target_filled_by'] ?? 'admin',
                ]);

                if (!empty($blockData['items'])) {
                    foreach ($blockData['items'] as $itemIndex => $itemData) {
                        TrainingBlockItem::create([
                            'training_block_id' => $block->id,
                            'exercise_id' => $itemData['exercise_id'] ?? null,
                            'note' => $itemData['note'] ?? null,
                            'load' => $itemData['load'] ?? null,
                            'load_unit' => $itemData['load_unit'] ?? 'kg',
                            'sets' => $itemData['sets'] ?? null,
                            'reps' => $itemData['reps'] ?? null,
                            'reps_unit' => $itemData['reps_unit'] ?? 'reps',
                            'duration' => $itemData['duration'] ?? null,
                            'tempo' => $itemData['tempo'] ?? null,
                            'rir' => $itemData['rir'] ?? null,
                            'rest_per_set' => $itemData['rest_per_set'] ?? ($itemData['rest'] ?? null),
                            'intensity' => $itemData['intensity'] ?? null,
                            'reps_array' => $itemData['reps_array'] ?? null,
                            'load_array' => $itemData['load_array'] ?? null,
                            'distance_array' => $itemData['distance_array'] ?? null,
                            'minutes_array' => $itemData['minutes_array'] ?? null,
                            'tempo_array' => $itemData['tempo_array'] ?? null,
                            'rir_array' => $itemData['rir_array'] ?? null,
                            'rest_per_set_array' => $itemData['rest_per_set_array'] ?? null,
                            'sort_order' => $itemIndex,
                        ]);
                    }
                }
            }
        }

        return redirect()->route('admin.individual-trainings.session.show', $training->id)
            ->with('message', 'Sesi latihan berhasil diperbarui!');
    }

    /**
     * ShowSession: View detailed session with blocks, items, RPE data
     */
    public function showSession(IndividualTraining $training)
    {
        $training->load(['user', 'coach', 'blocks.items.exercise', 'rpeRecords']);
        
        // Fetch all selected coaches manually since it's a json array
        $coaches = [];
        if (!empty($training->coach_ids)) {
            $coaches = User::whereIn('id', $training->coach_ids)->get();
        } elseif ($training->coach_id) {
            $coaches = [$training->coach];
        }
        
        return inertia('Admin/IndividualTrainings/ShowSession', [
            'training' => $training,
            'rpeRecords' => $training->rpeRecords,
            'coaches' => $coaches,
        ]);
    }

    /**
     * StoreRpe: Save RPE actuals from athlete (per exercise per set)
     */
    public function storeRpe(Request $request, IndividualTraining $training)
    {
        $request->validate([
            'rpes' => 'array',
            'athlete_note' => 'nullable|string',
            'proof_photo' => 'nullable|image|max:5120',
            'remove_proof_photo' => 'nullable|boolean',
        ]);

        // Save RPE data per block item
        if ($request->rpes) {
            foreach ($request->rpes as $itemId => $rpeData) {
                IndividualTrainingRpeRecord::updateOrCreate(
                    [
                        'individual_training_id' => $training->id,
                        'training_block_item_id' => $itemId,
                    ],
                    [
                        'rpe_data' => $rpeData,
                    ]
                );
            }
        }

        // Save athlete note
        if ($request->has('athlete_note')) {
            $training->athlete_note = $request->athlete_note;
        }

        // Handle proof photo
        if ($request->hasFile('proof_photo')) {
            if ($training->proof_photo) {
                \Storage::disk('public')->delete($training->proof_photo);
            }
            $training->proof_photo = $request->file('proof_photo')->store('proof-photos', 'public');
        }

        if ($request->remove_proof_photo) {
            if ($training->proof_photo) {
                \Storage::disk('public')->delete($training->proof_photo);
            }
            $training->proof_photo = null;
        }

        // Update status to in_progress if not yet completed
        if (!$training->is_completed && $training->status === 'scheduled') {
            $training->status = 'in_progress';
        }

        $training->save();

        return redirect()->back()->with('message', 'Data latihan berhasil disimpan.');
    }

    /**
     * CompleteTraining: Mark session as completed by athlete
     */
    public function completeTraining(Request $request, IndividualTraining $training)
    {
        $request->validate([
            'rpes' => 'array',
            'athlete_note' => 'nullable|string',
            'proof_photo' => 'nullable|image|max:5120',
        ]);

        // Save final RPE data
        if ($request->rpes) {
            foreach ($request->rpes as $itemId => $rpeData) {
                IndividualTrainingRpeRecord::updateOrCreate(
                    [
                        'individual_training_id' => $training->id,
                        'training_block_item_id' => $itemId,
                    ],
                    [
                        'rpe_data' => $rpeData,
                    ]
                );
            }
        }

        // Save athlete note
        $training->athlete_note = $request->athlete_note;

        // Handle proof photo
        if ($request->hasFile('proof_photo')) {
            if ($training->proof_photo) {
                \Storage::disk('public')->delete($training->proof_photo);
            }
            $training->proof_photo = $request->file('proof_photo')->store('proof-photos', 'public');
        }

        // Mark as completed
        $training->is_completed = true;
        $training->status = 'completed';
        $training->completed_at = now();
        $training->save();

        return redirect()->back()->with('message', 'Latihan berhasil diselesaikan!');
    }

    /**
     * DestroySession: Delete a training session
     */
    public function destroySession(IndividualTraining $training)
    {
        $userId = $training->user_id;
        $training->delete();
        return redirect()->route('admin.individual-trainings.show', $userId)
            ->with('message', 'Sesi latihan dihapus.');
    }

    /**
     * UpdateFeedback: Coach updates feedback/evaluation on a session
     */
    public function updateFeedback(Request $request, IndividualTraining $training)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:scheduled,in_progress,completed,canceled',
            'athlete_rpe' => 'nullable|integer|min:1|max:10',
            'duration_minutes' => 'nullable|integer|min:1',
            'coach_notes' => 'nullable|string',
        ]);

        $training->update($validated);

        return redirect()->back()->with('message', 'Feedback sesi berhasil disimpan.');
    }

    /**
     * UpdateTitle: Inline title editing
     */
    public function updateTitle(Request $request, IndividualTraining $training)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);
        
        $training->update(['name' => $request->name]);
        
        return back()->with('message', 'Judul sesi berhasil diperbarui!');
    }
}
