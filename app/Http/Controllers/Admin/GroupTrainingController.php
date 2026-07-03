<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingGroup;
use App\Models\GroupTraining;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class GroupTrainingController extends Controller
{
    public function showGroup(TrainingGroup $group)
    {
        $group->load(['package', 'members', 'coaches']);

        $trainings = GroupTraining::where('training_group_id', $group->id)
            ->with(['coach', 'blocks.items.exercise'])
            ->orderBy('date', 'asc')
            ->orderBy('session_number', 'asc')
            ->get();

        $exercisesList = Exercise::with('category')->orderBy('name', 'asc')->get();
        $packagesList = \App\Models\ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/GroupTrainings/ShowGroup', [
            'group' => $group,
            'trainings' => $trainings,
            'exercises' => $exercisesList,
            'packages' => $packagesList
        ]);
    }

    public function createSession(Request $request, TrainingGroup $group)
    {
        $dateStr = $request->query('date', Carbon::today()->format('Y-m-d'));
        
        $lastUnpaidSession = GroupTraining::where('training_group_id', $group->id)
            ->where('is_group_paid', false)
            ->orderBy('session_number', 'desc')
            ->first();
            
        $nextSessionNumber = $lastUnpaidSession ? $lastUnpaidSession->session_number + 1 : 1;

        $exercisesList = Exercise::with('category')->orderBy('name', 'asc')->get();
        $packagesList = \App\Models\ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();
        
        $coaches = $group->coaches()->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/GroupTrainings/CreateSession', [
            'group' => $group,
            'exercises' => $exercisesList,
            'packages' => $packagesList,
            'coaches' => $coaches,
            'date' => $dateStr,
            'nextSessionNumber' => $nextSessionNumber,
        ]);
    }

    public function storeSession(Request $request, TrainingGroup $group)
    {
        $request->validate([
            'date' => 'required|date',
            'name' => 'nullable|string|max:255',
            'training_type' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'coach_ids' => 'nullable|array',
            'blocks' => 'array',
        ]);

        $lastUnpaidSession = GroupTraining::where('training_group_id', $group->id)
            ->where('is_group_paid', false)
            ->orderBy('session_number', 'desc')
            ->first();

        $session_number = $lastUnpaidSession ? $lastUnpaidSession->session_number + 1 : 1;

        $training = GroupTraining::create([
            'training_group_id' => $group->id,
            'coach_id' => Auth::id(), // Primary creator
            'coach_ids' => $request->coach_ids ?? [],
            'date' => $request->date,
            'session_number' => $session_number,
            'name' => $request->name,
            'training_type' => $request->training_type,
            'location' => $request->location,
            'status' => 'scheduled',
            'attendee_ids' => [], // Start with empty attendees, marked during completion
        ]);

        // Save blocks in ISMS-style hierarchical structure
        if (!empty($request->blocks)) {
            foreach ($request->blocks as $blockIndex => $blockData) {
                $block = \App\Models\TrainingBlock::create([
                    'group_training_id' => $training->id,
                    'step' => $blockData['step'] ?? 2,
                    'category' => $blockData['category'] ?? 'warm_up',
                    'title' => $blockData['title'] ?? null,
                    'description' => $blockData['description'] ?? null,
                    'sort_order' => $blockIndex,
                    'target_filled_by' => $blockData['target_filled_by'] ?? 'admin',
                ]);

                if (!empty($blockData['items'])) {
                    foreach ($blockData['items'] as $itemIndex => $itemData) {
                        \App\Models\TrainingBlockItem::create([
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

        return redirect()->route('admin.group-trainings.show', $group->id)
            ->with('message', 'Sesi latihan grup berhasil ditambahkan!');
    }

    public function showSession(GroupTraining $training)
    {
        $training->load(['group.members', 'members_pivot', 'rpe_records', 'coach', 'blocks.items.exercise.category']);
            
        return Inertia::render('Admin/GroupTrainings/ShowSession', [
            'training' => $training,
            'group' => $training->group,
        ]);
    }

    public function storeRpe(Request $request, GroupTraining $training)
    {
        $request->validate([
            'rpes' => 'array',
            'athlete_id' => 'required|exists:users,id',
        ]);

        $athleteId = $request->athlete_id;

        if ($request->has('rpes')) {
            foreach ($request->rpes as $itemId => $rpeData) {
                // Ensure rpes are saved per athlete
                \App\Models\GroupTrainingRpeRecord::updateOrCreate(
                    [
                        'group_training_id' => $training->id,
                        'athlete_id' => $athleteId,
                        'training_block_item_id' => $itemId,
                    ],
                    ['rpe_data' => $rpeData]
                );
            }
        }

        // We also want to save group_note or targets if applicable, but targets are usually group-wide
        // Group Note should be per athlete if they have a specific note. We'll use athlete_note on the pivot.

        return redirect()->back()->with('message', 'RPE saved for athlete.');
    }

    public function completeTraining(Request $request, GroupTraining $training)
    {
        $request->validate([
            'athlete_id' => 'required|exists:users,id',
            'proof_photo' => 'nullable|image|max:5120',
        ]);

        $athleteId = $request->athlete_id;

        $memberRecord = \App\Models\GroupTrainingMember::firstOrCreate([
            'group_training_id' => $training->id,
            'athlete_id' => $athleteId,
        ]);

        $memberRecord->is_completed = true;
        $memberRecord->completed_at = now();

        if ($request->hasFile('proof_photo')) {
            if ($memberRecord->proof_photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($memberRecord->proof_photo);
            }
            $memberRecord->proof_photo = $request->file('proof_photo')->store('proofs', 'public');
        } elseif ($request->boolean('remove_proof_photo')) {
            if ($memberRecord->proof_photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($memberRecord->proof_photo);
                $memberRecord->proof_photo = null;
            }
        }

        $memberRecord->save();

        // If all group members have completed, we could potentially set $training->status = 'completed'.
        // But for now, we leave the group training open or handle it differently.
        
        return redirect()->back()->with('message', 'Latihan grup berhasil diselesaikan!');
    }

    public function editSession(GroupTraining $training)
    {
        $training->load('group', 'coach');
        $training->blocks = \App\Models\TrainingBlock::where('group_training_id', $training->id)
            ->with(['items.exercise'])
            ->orderBy('sort_order')
            ->get();
            
        $exercises = Exercise::all();
        $exercisePackages = \App\Models\ExercisePackage::with('exercises')->get();
        $coaches = $training->group->coaches()->orderBy('name', 'asc')->get();
        
        return Inertia::render('Admin/GroupTrainings/EditSession', [
            'training' => $training,
            'exercisesList' => $exercises,
            'packagesList' => $exercisePackages,
            'coachesList' => $coaches,
            'group' => $training->group,
        ]);
    }

    public function updateSession(Request $request, GroupTraining $training)
    {
        $request->validate([
            'date' => 'required|date',
            'name' => 'nullable|string|max:255',
            'training_type' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'coach_ids' => 'nullable|array',
            'blocks' => 'array',
        ]);

        $training->update([
            'date' => $request->date,
            'name' => $request->name,
            'training_type' => $request->training_type,
            'location' => $request->location,
            'coach_ids' => $request->coach_ids ?? [],
        ]);

        // Process blocks
        $existingBlockIds = [];
        $existingItemIds = [];

        if (!empty($request->blocks)) {
            foreach ($request->blocks as $blockIndex => $blockData) {
                if (!empty($blockData['id'])) {
                    $block = \App\Models\TrainingBlock::find($blockData['id']);
                    $block->update([
                        'step' => $blockData['step'] ?? 2,
                        'category' => $blockData['category'] ?? 'warm_up',
                        'title' => $blockData['title'] ?? null,
                        'description' => $blockData['description'] ?? null,
                        'sort_order' => $blockIndex,
                        'target_filled_by' => $blockData['target_filled_by'] ?? 'admin',
                    ]);
                } else {
                    $block = \App\Models\TrainingBlock::create([
                        'group_training_id' => $training->id,
                        'step' => $blockData['step'] ?? 2,
                        'category' => $blockData['category'] ?? 'warm_up',
                        'title' => $blockData['title'] ?? null,
                        'description' => $blockData['description'] ?? null,
                        'sort_order' => $blockIndex,
                        'target_filled_by' => $blockData['target_filled_by'] ?? 'admin',
                    ]);
                }
                $existingBlockIds[] = $block->id;

                if (!empty($blockData['items'])) {
                    foreach ($blockData['items'] as $itemIndex => $itemData) {
                        if (!empty($itemData['id'])) {
                            $item = \App\Models\TrainingBlockItem::find($itemData['id']);
                            $item->update([
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
                        } else {
                            $item = \App\Models\TrainingBlockItem::create([
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
                        $existingItemIds[] = $item->id;
                    }
                }
            }
        }

        // Delete removed items
        $blocks = \App\Models\TrainingBlock::where('group_training_id', $training->id)->get();
        foreach ($blocks as $block) {
            \App\Models\TrainingBlockItem::where('training_block_id', $block->id)
                ->whereNotIn('id', $existingItemIds)
                ->delete();
        }
        
        // Delete removed blocks
        \App\Models\TrainingBlock::where('group_training_id', $training->id)
            ->whereNotIn('id', $existingBlockIds)
            ->delete();

        return redirect()->route('admin.group-trainings.session.show', $training->id)
            ->with('message', 'Sesi latihan berhasil diperbarui!');
    }

    public function destroySession(GroupTraining $training)
    {
        $groupId = $training->training_group_id;
        $training->delete();
        
        return redirect()->route('admin.group-trainings.show', $groupId)
            ->with('message', 'Sesi latihan grup berhasil dihapus.');
    }
}
