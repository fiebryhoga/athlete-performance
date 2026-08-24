<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingGroup;
use App\Models\GroupTraining;
use App\Models\Exercise;
use App\Models\User;
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
            ->with(['coach', 'blocks.items.exercise', 'rpe_records'])
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
        $group->load('members');
        
        $dateStr = $request->query('date', Carbon::today()->format('Y-m-d'));
        
        $lastUnpaidSession = GroupTraining::where('training_group_id', $group->id)
            ->where('is_group_paid', false)
            ->orderBy('session_number', 'desc')
            ->first();
            
        $nextSessionNumber = $lastUnpaidSession ? $lastUnpaidSession->session_number + 1 : 1;

        $exercisesList = Exercise::with('category')->orderBy('name', 'asc')->get();
        $packagesList = \App\Models\ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();
        
        $coaches = $group->coaches()->orderBy('name', 'asc')->get();
        $allAthletes = \App\Models\User::where('role', 'athlete')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/GroupTrainings/CreateSession', [
            'group' => $group,
            'exercises' => $exercisesList,
            'packages' => $packagesList,
            'coaches' => $coaches,
            'date' => $dateStr,
            'nextSessionNumber' => $nextSessionNumber,
            'availableAthletes' => $allAthletes,
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
            'attendee_ids' => 'required|array',
            'blocks' => 'array',
            'is_extra' => 'boolean',
        ]);

        $isExtra = $request->input('is_extra', false);

        if ($isExtra) {
            $session_number = null;
        } else {
            $lastUnpaidSession = GroupTraining::where('training_group_id', $group->id)
                ->where('is_group_paid', false)
                ->where('is_extra', false)
                ->orderBy('session_number', 'desc')
                ->first();

            $session_number = $lastUnpaidSession ? $lastUnpaidSession->session_number + 1 : 1;
        }

        $training = GroupTraining::create([
            'training_group_id' => $group->id,
            'coach_id' => !empty($request->coach_ids) ? $request->coach_ids[0] : Auth::id(), // Fallback to current user if no coach selected
            'coach_ids' => $request->coach_ids ?? [],
            'date' => $request->date,
            'session_number' => $session_number,
            'is_extra' => $isExtra,
            'name' => $request->name,
            'training_type' => $request->training_type,
            'location' => $request->location,
            'status' => 'scheduled',
            'attendee_ids' => $request->attendee_ids,
        ]);

        // Save blocks in ISMS-style hierarchical structure
        if (!empty($request->programs)) {
            $globalBlockIndex = 0;
            foreach ($request->programs as $program) {
                foreach ($program['blocks'] as $blockData) {
                    $block = \App\Models\TrainingBlock::create([
                        'group_training_id' => $training->id,
                        'step' => $blockData['step'] ?? 2,
                        'category' => $blockData['category'] ?? 'warm_up',
                        'title' => $blockData['title'] ?? null,
                        'description' => $blockData['description'] ?? null,
                        'program_name' => $program['name'] ?? 'Program Utama',
                        'athlete_ids' => $program['athlete_ids'] ?? null,
                        'sort_order' => $globalBlockIndex++,
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
        }

        return redirect()->route('admin.group-trainings.show', $group->id)
            ->with('message', 'Sesi latihan grup berhasil dibuat!');
    }

    public function showSession(GroupTraining $training)
    {
        $training->load(['group.members', 'members_pivot', 'rpe_records', 'coach', 'blocks.items.exercise.category']);
        
        $availableAthletes = User::where('role', 'athlete')
            ->select('id', 'name')
            ->get();
            
        $coaches = [];
        if (!empty($training->coach_ids)) {
            $coaches = User::whereIn('id', $training->coach_ids)->get();
        } elseif ($training->coach_id) {
            $c = User::find($training->coach_id);
            if ($c) {
                $coaches = [$c];
            }
        }
            
        return Inertia::render('Admin/GroupTrainings/ShowSession', [
            'training' => $training,
            'group' => $training->group,
            'availableAthletes' => $availableAthletes,
            'coaches' => $coaches,
        ]);
    }

    public function storeRpe(Request $request, GroupTraining $training)
    {
        $request->validate([
            'rpes' => 'array',
            'athlete_id' => 'nullable|exists:users,id',
            'apply_to_all' => 'nullable|boolean',
        ]);

        $applyToAll = $request->boolean('apply_to_all') || $request->input('apply_to_all') == '1' || $request->input('apply_to_all') === 'true';

        if ($applyToAll) {
            $training->load(['members_pivot', 'group.members']);
            $athleteIds = collect();
            if (is_array($training->attendee_ids) && count($training->attendee_ids) > 0) {
                $athleteIds = $athleteIds->merge($training->attendee_ids);
            }
            if ($training->members_pivot && $training->members_pivot->count() > 0) {
                $athleteIds = $athleteIds->merge($training->members_pivot->pluck('athlete_id'));
            }
            if ($training->group && $training->group->members) {
                $athleteIds = $athleteIds->merge($training->group->members->pluck('id'));
            }
            $athleteIds = $athleteIds->unique()->filter()->values();

            if ($request->has('rpes')) {
                foreach ($athleteIds as $athId) {
                    foreach ($request->rpes as $itemId => $rpeData) {
                        \App\Models\GroupTrainingRpeRecord::updateOrCreate(
                            [
                                'group_training_id' => $training->id,
                                'athlete_id' => $athId,
                                'training_block_item_id' => $itemId,
                            ],
                            ['rpe_data' => $rpeData]
                        );
                    }
                }
            }

            return redirect()->back()->with('message', 'Update RPE berhasil diterapkan ke semua atlet.');
        }

        $athleteId = $request->athlete_id;

        if ($athleteId && $request->has('rpes')) {
            foreach ($request->rpes as $itemId => $rpeData) {
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

        return redirect()->back()->with('message', 'RPE berhasil disimpan untuk atlet.');
    }

    public function completeTraining(Request $request, GroupTraining $training)
    {
        $request->validate([
            'athlete_id' => 'nullable|exists:users,id',
            'apply_to_all' => 'nullable',
            'proof_photo' => 'nullable|image|max:5120',
            'rpes' => 'nullable|array',
            'group_note' => 'nullable|string',
        ]);

        $applyToAll = $request->boolean('apply_to_all') || $request->input('apply_to_all') == '1' || $request->input('apply_to_all') === 'true';

        if ($applyToAll) {
            $training->load(['members_pivot', 'group.members']);
            $athleteIds = collect();
            if (is_array($training->attendee_ids) && count($training->attendee_ids) > 0) {
                $athleteIds = $athleteIds->merge($training->attendee_ids);
            }
            if ($training->members_pivot && $training->members_pivot->count() > 0) {
                $athleteIds = $athleteIds->merge($training->members_pivot->pluck('athlete_id'));
            }
            if ($training->group && $training->group->members) {
                $athleteIds = $athleteIds->merge($training->group->members->pluck('id'));
            }
            $athleteIds = $athleteIds->unique()->filter()->values();

            foreach ($athleteIds as $athId) {
                if ($request->has('rpes')) {
                    foreach ($request->rpes as $itemId => $rpeData) {
                        \App\Models\GroupTrainingRpeRecord::updateOrCreate(
                            [
                                'group_training_id' => $training->id,
                                'athlete_id' => $athId,
                                'training_block_item_id' => $itemId,
                            ],
                            ['rpe_data' => $rpeData]
                        );
                    }
                }

                $memberRecord = \App\Models\GroupTrainingMember::firstOrCreate([
                    'group_training_id' => $training->id,
                    'athlete_id' => $athId,
                ]);

                $memberRecord->is_completed = true;
                $memberRecord->completed_at = now();
                $memberRecord->save();
            }

            $training->status = 'completed';
            $training->save();

            return redirect()->back()->with('message', 'Sesi latihan grup berhasil diselesaikan untuk semua atlet!');
        }

        $athleteId = $request->athlete_id;

        // Save RPE data if present
        if ($request->has('rpes') && $athleteId) {
            foreach ($request->rpes as $itemId => $rpeData) {
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

        $memberRecord = \App\Models\GroupTrainingMember::firstOrCreate([
            'group_training_id' => $training->id,
            'athlete_id' => $athleteId,
        ]);

        if ($request->has('group_note')) {
            $memberRecord->athlete_note = $request->group_note;
        }

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

        return redirect()->back()->with('message', 'Latihan grup berhasil diselesaikan untuk atlet ini!');
    }

    public function editSession(GroupTraining $training)
    {
        $training->load('group.members', 'coach');
        $blocks = \App\Models\TrainingBlock::where('group_training_id', $training->id)
            ->with(['items.exercise'])
            ->orderBy('sort_order')
            ->get();
            
        $programsMap = [];
        foreach ($blocks as $block) {
            $pName = $block->program_name ?: 'Program Utama';
            if (!isset($programsMap[$pName])) {
                $programsMap[$pName] = [
                    'name' => $pName,
                    'athlete_ids' => is_array($block->athlete_ids) ? $block->athlete_ids : null,
                    'blocks' => []
                ];
            }
            $programsMap[$pName]['blocks'][] = $block;
        }
        
        // If empty, provide a default
        if (empty($programsMap)) {
            $programsMap['Program Utama'] = [
                'name' => 'Program Utama',
                'athlete_ids' => null,
                'blocks' => []
            ];
        }
        
        $training->programs = array_values($programsMap);
        $exercises = Exercise::all();
        $exercisePackages = \App\Models\ExercisePackage::with('exercises')->get();
        $coaches = $training->group->coaches()->orderBy('name', 'asc')->get();
        $allAthletes = \App\Models\User::where('role', 'athlete')->orderBy('name', 'asc')->get();
        
        return Inertia::render('Admin/GroupTrainings/EditSession', [
            'training' => $training,
            'exercisesList' => $exercises,
            'packagesList' => $exercisePackages,
            'coachesList' => $coaches,
            'group' => $training->group,
            'availableAthletes' => $allAthletes,
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
            'attendee_ids' => 'required|array',
            'programs' => 'array',
            'is_extra' => 'boolean',
        ]);

        $isExtra = $request->input('is_extra', false);

        if ($training->is_extra !== $isExtra) {
            if ($isExtra) {
                $oldSessionNumber = $training->session_number;
                if ($oldSessionNumber) {
                    \App\Models\GroupTraining::where('training_group_id', $training->training_group_id)
                        ->where('is_group_paid', $training->is_group_paid)
                        ->where('session_number', '>', $oldSessionNumber)
                        ->decrement('session_number');
                }
                $training->session_number = null;
            } else {
                $lastUnpaidSession = GroupTraining::where('training_group_id', $training->training_group_id)
                    ->where('is_group_paid', false)
                    ->where('is_extra', false)
                    ->orderBy('session_number', 'desc')
                    ->first();
                $training->session_number = $lastUnpaidSession ? $lastUnpaidSession->session_number + 1 : 1;
            }
        }

        $training->update([
            'date' => $request->date,
            'name' => $request->name,
            'training_type' => $request->training_type,
            'location' => $request->location,
        ]);

        $training->coach_ids = $request->coach_ids ?? [];
        $training->attendee_ids = $request->attendee_ids;
        $training->is_extra = $isExtra;
        $training->save();

        // Process blocks
        $existingBlockIds = [];
        $existingItemIds = [];

        if (!empty($request->programs)) {
            $globalBlockIndex = 0;
            foreach ($request->programs as $program) {
                if (empty($program['blocks'])) continue;
                foreach ($program['blocks'] as $blockData) {
                    if (!empty($blockData['id'])) {
                        $block = \App\Models\TrainingBlock::find($blockData['id']);
                        $block->update([
                            'step' => $blockData['step'] ?? 2,
                            'category' => $blockData['category'] ?? 'warm_up',
                            'title' => $blockData['title'] ?? null,
                            'description' => $blockData['description'] ?? null,
                            'program_name' => $program['name'] ?? 'Program Utama',
                            'athlete_ids' => $program['athlete_ids'] ?? null,
                            'sort_order' => $globalBlockIndex++,
                            'target_filled_by' => $blockData['target_filled_by'] ?? 'admin',
                        ]);
                    } else {
                        $block = \App\Models\TrainingBlock::create([
                            'group_training_id' => $training->id,
                            'step' => $blockData['step'] ?? 2,
                            'category' => $blockData['category'] ?? 'warm_up',
                            'title' => $blockData['title'] ?? null,
                            'description' => $blockData['description'] ?? null,
                            'program_name' => $program['name'] ?? 'Program Utama',
                            'athlete_ids' => $program['athlete_ids'] ?? null,
                            'sort_order' => $globalBlockIndex++,
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

        return redirect()->route('admin.group-trainings.show', $training->training_group_id)
            ->with('message', 'Sesi latihan berhasil diperbarui!');
    }

    public function destroySession(GroupTraining $training)
    {
        $groupId = $training->training_group_id;
        $deletedSessionNumber = $training->session_number;
        $isPaid = $training->is_group_paid;
        
        $training->delete();
        
        if ($deletedSessionNumber) {
            \App\Models\GroupTraining::where('training_group_id', $groupId)
                ->where('is_group_paid', $isPaid)
                ->where('session_number', '>', $deletedSessionNumber)
                ->decrement('session_number');
        }
        
        return redirect()->route('admin.group-trainings.show', $groupId)
            ->with('message', 'Sesi latihan grup berhasil dihapus dan nomor sesi telah disesuaikan.');
    }

    /**
     * Duplicate a training session
     */
    public function duplicateSession(Request $request, GroupTraining $training)
    {
        $request->validate([
            'target_date' => 'required|date'
        ]);

        $group = $training->group;

        // Calculate new session_number
        if ($training->is_extra) {
            $session_number = null;
        } else {
            $lastUnpaidSession = GroupTraining::where('training_group_id', $group->id)
                ->where('is_group_paid', false)
                ->where('is_extra', false)
                ->orderBy('session_number', 'desc')
                ->first();
            $session_number = $lastUnpaidSession ? $lastUnpaidSession->session_number + 1 : 1;
        }

        // Duplicate the training record
        $newTraining = $training->replicate(['attendee_ids']);
        $newTraining->date = $request->target_date;
        $newTraining->is_extra = $training->is_extra;
        $newTraining->session_number = $session_number;
        $newTraining->status = 'scheduled';
        $newTraining->attendee_ids = [];
        $newTraining->save();

        // Duplicate blocks and items
        $training->load('blocks.items');
        foreach ($training->blocks as $block) {
            $newBlock = $block->replicate(['group_training_id']);
            $newBlock->group_training_id = $newTraining->id;
            $newBlock->save();

            foreach ($block->items as $item) {
                $newItem = $item->replicate(['training_block_id']);
                $newItem->training_block_id = $newBlock->id;
                $newItem->save();
            }
        }

        return back()->with('message', 'Sesi latihan grup berhasil diduplikasi ke tanggal ' . $request->target_date . '!');
    }

    /**
     * Export PDF for Group Training Session
     */
    public function exportPdf(GroupTraining $training)
    {
        $training->load(['coach', 'group', 'blocks.items.exercise', 'members_pivot', 'rpe_records']);
        $group = $training->group;
        
        $logoSetting = \App\Models\Setting::where('key', 'app_logo')->value('value');
        $logoPath = $logoSetting ? storage_path('app/public/' . $logoSetting) : public_path('assets/images/app-logo.png');
        
        $clubLogo = null;
        if (file_exists($logoPath)) {
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            $data = file_get_contents($logoPath);
            $clubLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        $athletesData = [];
        foreach ($training->members_pivot as $pivot) {
            $athlete = \App\Models\User::find($pivot->athlete_id);
            if ($athlete) {
                $rpes = [];
                $rpeRecords = $training->rpeRecords->where('athlete_id', $athlete->id);
                foreach ($rpeRecords as $record) {
                    $rpeData = $record->rpe_data;
                    if (is_array($rpeData)) {
                        foreach ($rpeData as $data) {
                            if (is_array($data) && isset($data['label']) && isset($data['rpe'])) {
                                $rpes[] = ['label' => $data['label'], 'value' => $data['rpe']];
                            }
                        }
                    }
                }
                $athletesData[] = [
                    'name' => $athlete->name,
                    'is_completed' => $pivot->is_completed,
                    'note' => $pivot->athlete_note,
                    'rpes' => $rpes,
                ];
            }
        }

        $training->blocks->each(function ($block) {
            $block->items->each(function ($item) {
                if ($item->exercise) {
                    $base64Images = [];
                    if (!empty($item->exercise->images) && is_array($item->exercise->images)) {
                        foreach ($item->exercise->images as $img) {
                            $imgClean = str_replace('storage/', '', ltrim($img, '/'));
                            $imgPath1 = public_path('storage/' . $imgClean);
                            $imgPath2 = storage_path('app/public/' . $imgClean);
                            $finalImgPath = file_exists($imgPath1) ? $imgPath1 : (file_exists($imgPath2) ? $imgPath2 : null);
                            
                            if ($finalImgPath) {
                                $type = pathinfo($finalImgPath, PATHINFO_EXTENSION);
                                $data = file_get_contents($finalImgPath);
                                $base64Images[] = 'data:image/' . $type . ';base64,' . base64_encode($data);
                            }
                        }
                    }
                    $item->exercise->setAttribute('base64_images', $base64Images);
                }
            });
        });

        $coachNames = [];
        if (is_array($training->coach_ids) && count($training->coach_ids) > 0) {
            $coachNames = \App\Models\User::whereIn('id', $training->coach_ids)
                ->pluck('name')
                ->toArray();
        }
        $coachList = count($coachNames) > 0 ? implode(', ', array_unique($coachNames)) : '-';

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.training_session_pdf', [
            'training' => (object)[
                'title' => ($training->name ?: 'Group Training Session #' . $training->session_number),
                'date' => $training->date,
                'focus' => $group->name . ($training->location ? ' | ' . $training->location : ''),
                'blocks' => $training->blocks,
                'coachList' => $coachList,
            ],
            'group' => $group,
            'athletesData' => $athletesData,
            'clubLogo' => $clubLogo
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Group_Training_Session_' . $training->id . '.pdf');
    }
}
