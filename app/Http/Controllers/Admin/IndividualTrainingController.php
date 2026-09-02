<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IndividualTraining;
use App\Models\IndividualTrainingRpeRecord;
use App\Models\SharedPackage;
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

        // Shared Packages (Paket Bersama)
        $sharedPackagesQuery = SharedPackage::with(['package', 'members', 'coaches']);

        if (Auth::user()->role === 'coach') {
            $sharedPackagesQuery->whereHas('coaches', function($q) {
                $q->where('coach_id', Auth::id());
            });
        }

        if ($request->search) {
            $sharedPackagesQuery->where('name', 'like', '%' . $request->search . '%');
        }

        $sharedPackages = $sharedPackagesQuery->get()->map(function($sp) {
            $sp->used_sessions = $sp->usedSessions();
            $sp->total_sessions = $sp->package?->session_count;
            $sp->remaining_sessions = $sp->remainingSessions();
            return $sp;
        });

        return Inertia::render('Admin/IndividualTrainings/Index', [
            'athletes' => $athletes,
            'groups' => $groups,
            'sharedPackages' => $sharedPackages,
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

        $user->load(['sport', 'package', 'sharedPackages' => function($q) {
            $q->with('package');
        }]);

        $trainings = IndividualTraining::where('user_id', $user->id)
            ->with(['coach', 'blocks.items.exercise', 'rpeRecords', 'sharedPackage.package'])
            ->orderBy('date', 'asc')
            ->orderBy('session_number', 'asc')
            ->get();

        // Get group trainings where this athlete is a member of the group
        $groupIds = $user->groups()->pluck('training_groups.id');
        $groupTrainings = \App\Models\GroupTraining::where(function($query) use ($user, $groupIds) {
                // If explicitly an attendee (Guest)
                $query->whereJsonContains('attendee_ids', $user->id)
                      // OR they are a member of the group
                      ->orWhereIn('training_group_id', $groupIds);
            })
            ->with(['coach', 'group.package', 'blocks.items.exercise', 'rpe_records', 'members_pivot' => function ($query) use ($user) {
                $query->where('athlete_id', $user->id);
            }])
            ->orderBy('date', 'asc')
            ->orderBy('session_number', 'asc')
            ->get();

        $missedSessionsQueue = [];
        foreach ($groupTrainings as $training) {
            $isGroupMember = $groupIds->contains($training->training_group_id);
            $attendees = $training->attendee_ids ?: [];
            
            // Legacy fallback: if attendee_ids is empty/null, we assume all members attended.
            $isLegacy = is_null($training->attendee_ids) || empty($training->attendee_ids);
            $isAttending = in_array($user->id, $attendees) || ($isLegacy && $isGroupMember);
            
            if ($isGroupMember && !$isAttending) {
                // Missed session
                $training->is_absent = true;
                $missedSessionsQueue[] = $training->session_number;
            } elseif (!$isGroupMember && $isAttending) {
                // Guest session (makeup)
                $training->is_makeup = true;
                if (count($missedSessionsQueue) > 0) {
                    $makeupFor = array_shift($missedSessionsQueue);
                    $training->display_session_number = $makeupFor;
                } else {
                    $training->display_session_number = $training->session_number; // fallback
                }
            } else {
                $training->is_absent = false;
                $training->is_makeup = false;
            }
        }

        $exercisesList = Exercise::with('category')->orderBy('name', 'asc')->get();
        $packagesList = \App\Models\ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();

        $athletesQuery = User::where('role', 'athlete')->with('sport:id,name');
        if (Auth::user()->role === 'coach') {
            $athletesQuery->whereHas('coaches', function($q) {
                $q->where('coach_id', Auth::id());
            });
        }
        $allAthletes = $athletesQuery->orderBy('name', 'asc')->select('id', 'name', 'sport_id', 'profile_photo')->get();

        // Load shared packages info for display
        $activeSharedPackages = $user->sharedPackages()
            ->with(['package', 'members'])
            ->get()
            ->map(function($sp) {
                $sp->used_sessions = $sp->usedSessions();
                $sp->total_sessions = $sp->package?->session_count;
                $sp->remaining_sessions = $sp->remainingSessions();
                return $sp;
            });

        return Inertia::render('Admin/IndividualTrainings/ShowAthlete', [
            'athlete' => $user,
            'trainings' => $trainings,
            'groupTrainings' => $groupTrainings,
            'exercises' => $exercisesList,
            'packages' => $packagesList,
            'allAthletes' => $allAthletes,
            'sharedPackages' => $activeSharedPackages,
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

        // Load active shared packages for this athlete
        $activeSharedPackages = $user->sharedPackages()
            ->with(['package', 'members'])
            ->get()
            ->map(function($sp) {
                $sp->used_sessions = $sp->usedSessions();
                $sp->total_sessions = $sp->package?->session_count;
                $sp->remaining_sessions = $sp->remainingSessions();
                return $sp;
            });

        $workoutTemplates = \App\Models\WorkoutTemplate::orderBy('order', 'asc')->get();

        return Inertia::render('Admin/IndividualTrainings/CreateSession', [
            'athlete' => $user,
            'exercises' => $exercisesList,
            'packages' => $packagesList,
            'coaches' => $coaches,
            'date' => $dateStr,
            'nextSessionNumber' => $nextSessionNumber,
            'sharedPackages' => $activeSharedPackages,
            'workoutTemplates' => $workoutTemplates,
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
            'is_extra' => 'boolean',
            'shared_package_id' => 'nullable|exists:shared_packages,id',
        ]);

        $isExtra = $request->input('is_extra', false);
        $sharedPackageId = $request->input('shared_package_id');

        // Athlete yang terdaftar di paket bersama selalu otomatis terhubung ke paket bersamanya
        if (!$sharedPackageId) {
            $activeShared = $user->sharedPackages()->where('status', 'active')->first() ?? $user->sharedPackages()->first();
            if ($activeShared) {
                $sharedPackageId = $activeShared->id;
            }
        }

        $sharedSessionNumber = null;

        if ($isExtra) {
            $session_number = null;
        } else {
            $lastUnpaidSession = IndividualTraining::where('user_id', $user->id)
                ->where('is_athlete_paid', false)
                ->where('is_extra', false)
                ->orderBy('session_number', 'desc')
                ->first();

            $session_number = $lastUnpaidSession ? $lastUnpaidSession->session_number + 1 : 1;
        }

        // If linked to a shared package, calculate the shared session number
        if ($sharedPackageId && !$isExtra) {
            $sharedPackage = SharedPackage::with('package')->find($sharedPackageId);
            if ($sharedPackage) {
                $sharedSessionNumber = $sharedPackage->nextSharedSessionNumber();
            }
        }

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
            'shared_package_id' => $sharedPackageId,
            'coach_id' => !empty($request->coach_ids) ? $request->coach_ids[0] : null,
            'coach_ids' => $request->coach_ids ?? [],
            'date' => $request->date,
            'day_number' => $day_number,
            'session_number' => null,
            'shared_session_number' => null,
            'is_extra' => $isExtra,
            'name' => $request->name,
            'training_type' => $request->training_type,
            'location' => $request->location,
            'status' => 'scheduled',
        ]);

        // Resequence sessions accurately in chronological order
        self::resequenceAthleteSessions($user->id, false);
        if ($sharedPackageId) {
            self::resequenceSharedPackageSessions($sharedPackageId);
        }

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

        if ($request->input('from') === 'shared-package' && ($request->input('package_id') || $request->input('shared_package_id'))) {
            $pkgId = $request->input('package_id') ?: $request->input('shared_package_id');
            return redirect()->route('admin.shared-packages.show', $pkgId)
                ->with('message', 'Sesi latihan berhasil ditambahkan!');
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
        
        $workoutTemplates = \App\Models\WorkoutTemplate::orderBy('order', 'asc')->get();

        return inertia('Admin/IndividualTrainings/EditSession', [
            'training' => $training,
            'exercisesList' => $exercises,
            'packagesList' => $exercisePackages,
            'coachesList' => $coaches,
            'user' => $training->user,
            'workoutTemplates' => $workoutTemplates,
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
            'is_extra' => 'boolean',
        ]);

        $isExtra = $request->input('is_extra', false);
        $oldSharedPackageId = $training->shared_package_id;

        $training->update([
            'date' => $request->date,
            'name' => $request->name,
            'training_type' => $request->training_type,
            'location' => $request->location,
            'coach_id' => !empty($request->coach_ids) ? $request->coach_ids[0] : null,
            'coach_ids' => $request->coach_ids ?? [],
            'is_extra' => $isExtra,
        ]);

        // Resequence all sessions for the athlete and shared package in chronological order
        self::resequenceAthleteSessions($training->user_id, (bool)$training->is_athlete_paid);
        if ($training->shared_package_id) {
            self::resequenceSharedPackageSessions($training->shared_package_id);
        }
        if ($oldSharedPackageId && $oldSharedPackageId !== $training->shared_package_id) {
            self::resequenceSharedPackageSessions($oldSharedPackageId);
        }

        // Process blocks
        $existingBlockIds = [];
        $existingItemIds = [];

        if (!empty($request->blocks)) {
            foreach ($request->blocks as $blockIndex => $blockData) {
                if (!empty($blockData['id'])) {
                    $block = TrainingBlock::find($blockData['id']);
                    if ($block) {
                        $block->update([
                            'step' => $blockData['step'] ?? 2,
                            'category' => $blockData['category'] ?? 'warm_up',
                            'title' => $blockData['title'] ?? null,
                            'description' => $blockData['description'] ?? null,
                            'sort_order' => $blockIndex,
                            'target_filled_by' => $blockData['target_filled_by'] ?? 'admin',
                        ]);
                    }
                } else {
                    $block = TrainingBlock::create([
                        'individual_training_id' => $training->id,
                        'step' => $blockData['step'] ?? 2,
                        'category' => $blockData['category'] ?? 'warm_up',
                        'title' => $blockData['title'] ?? null,
                        'description' => $blockData['description'] ?? null,
                        'sort_order' => $blockIndex,
                        'target_filled_by' => $blockData['target_filled_by'] ?? 'admin',
                    ]);
                }
                
                if ($block) {
                    $existingBlockIds[] = $block->id;
                }

                if (!empty($blockData['items']) && $block) {
                    foreach ($blockData['items'] as $itemIndex => $itemData) {
                        if (!empty($itemData['id'])) {
                            $item = TrainingBlockItem::find($itemData['id']);
                            if ($item) {
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
                            }
                        } else {
                            $item = TrainingBlockItem::create([
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
                        
                        if ($item) {
                            $existingItemIds[] = $item->id;
                        }
                    }
                }
            }
        }

        // Delete removed items
        $blocks = TrainingBlock::where('individual_training_id', $training->id)->get();
        foreach ($blocks as $block) {
            TrainingBlockItem::where('training_block_id', $block->id)
                ->whereNotIn('id', $existingItemIds)
                ->delete();
        }
        
        // Delete removed blocks
        TrainingBlock::where('individual_training_id', $training->id)
            ->whereNotIn('id', $existingBlockIds)
            ->delete();

        if ($request->input('from') === 'shared-package' && ($request->input('package_id') || $training->shared_package_id)) {
            $pkgId = $request->input('package_id') ?: $training->shared_package_id;
            return redirect()->route('admin.shared-packages.show', $pkgId)
                ->with('message', 'Sesi latihan berhasil diperbarui!');
        }

        return redirect()->route('admin.individual-trainings.show', $training->user_id)
            ->with('message', 'Sesi latihan berhasil diperbarui!');
    }

    /**
     * ShowSession: View detailed session with blocks, items, RPE data
     */
    public function showSession(IndividualTraining $training)
    {
        $training->load(['user', 'coach', 'blocks.items.exercise', 'rpeRecords', 'sharedPackage']);
        
        // Fetch all selected coaches manually since it's a json array
        $coaches = [];
        if (is_array($training->coach_ids)) {
            $coaches = !empty($training->coach_ids) ? User::whereIn('id', $training->coach_ids)->get() : [];
        } elseif ($training->coach_id) {
            $coaches = $training->coach ? [$training->coach] : [];
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
            'signature_data' => 'nullable|string',
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

        // Handle client digital signature (Base64 data URL or uploaded file)
        if ($request->filled('signature_data')) {
            $dataUrl = $request->input('signature_data');
            if (preg_match('/^data:image\/(\w+);base64,/', $dataUrl, $type)) {
                $data = substr($dataUrl, strpos($dataUrl, ',') + 1);
                $type = strtolower($type[1]);
                $data = base64_decode($data);

                if ($data !== false) {
                    if ($training->signature_photo) {
                        \Storage::disk('public')->delete($training->signature_photo);
                    }
                    $filename = 'signatures/' . uniqid('sig_ind_') . '.' . $type;
                    \Storage::disk('public')->put($filename, $data);
                    $training->signature_photo = $filename;
                    $training->signed_at = now();
                }
            }
        } elseif ($request->hasFile('signature_photo')) {
            if ($training->signature_photo) {
                \Storage::disk('public')->delete($training->signature_photo);
            }
            $training->signature_photo = $request->file('signature_photo')->store('signatures', 'public');
            $training->signed_at = now();
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
        $isPaid = (bool)$training->is_athlete_paid;
        $sharedPackageId = $training->shared_package_id;

        $training->delete();

        self::resequenceAthleteSessions($userId, $isPaid);
        if ($sharedPackageId) {
            self::resequenceSharedPackageSessions($sharedPackageId);
        }

        return redirect()->route('admin.individual-trainings.show', $userId)
            ->with('message', 'Sesi latihan dihapus dan nomor sesi telah disesuaikan.');
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

    /**
     * Duplicate a training session
     */
    public function duplicateSession(Request $request, IndividualTraining $training)
    {
        $request->validate([
            'target_date' => 'required|date',
            'target_user_ids' => 'nullable|array',
            'target_user_ids.*' => 'exists:users,id',
        ]);

        $targetUserIds = $request->target_user_ids;
        if (empty($targetUserIds)) {
            $targetUserIds = [$training->user_id];
        }

        $targetUsers = User::whereIn('id', $targetUserIds)->get();
        $targetDate = $request->target_date;
        $createdCount = 0;

        $training->load('blocks.items');

        foreach ($targetUsers as $targetUser) {
            // Calculate day_number for this target client
            $firstTrainingDate = IndividualTraining::where('user_id', $targetUser->id)->min('date');
            if (!$firstTrainingDate) {
                $firstTrainingDate = $targetUser->created_at ? $targetUser->created_at->format('Y-m-d') : $targetDate;
            }
            $day_number = Carbon::parse($firstTrainingDate)->diffInDays(Carbon::parse($targetDate)) + 1;
            if ($day_number < 1) $day_number = 1;

            // Duplicate the training record (kosongkan pelatih & pelatih pendamping pada sesi duplikasi)
            $newTraining = $training->replicate(['is_completed', 'completed_at', 'athlete_note', 'proof_photo', 'athlete_rpe']);
            $newTraining->user_id = $targetUser->id;

            // Pastikan jika target user memiliki paket bersama, sesi langsung terhubung ke paket bersamanya
            $targetShared = $targetUser->sharedPackages()->where('status', 'active')->first() ?? $targetUser->sharedPackages()->first();
            $newTraining->shared_package_id = $targetShared ? $targetShared->id : null;

            $newTraining->coach_id = null; // Kosongkan pelatih utama agar bisa disesuaikan
            $newTraining->coach_ids = []; // Kosongkan pelatih pendamping
            $newTraining->paid_coach_ids = null;
            $newTraining->is_athlete_paid = false;
            $newTraining->date = $targetDate;
            $newTraining->is_extra = $training->is_extra;
            $newTraining->day_number = $day_number;
            $newTraining->session_number = null; // Will be sequenced accurately
            $newTraining->shared_session_number = null;
            $newTraining->status = 'scheduled';
            $newTraining->is_completed = false;
            $newTraining->completed_at = null;
            $newTraining->athlete_note = null;
            $newTraining->proof_photo = null;
            $newTraining->athlete_rpe = null;
            $newTraining->save();

            // Duplicate blocks and items
            foreach ($training->blocks as $block) {
                $newBlock = $block->replicate(['individual_training_id']);
                $newBlock->individual_training_id = $newTraining->id;
                $newBlock->save();

                foreach ($block->items as $item) {
                    $newItem = $item->replicate(['training_block_id']);
                    $newItem->training_block_id = $newBlock->id;
                    $newItem->save();
                }
            }

            self::resequenceAthleteSessions($targetUser->id, false);
            if ($newTraining->shared_package_id) {
                self::resequenceSharedPackageSessions($newTraining->shared_package_id);
            }

            $createdCount++;
        }

        $message = count($targetUsers) === 1 && $targetUsers[0]->id === $training->user_id
            ? 'Sesi latihan berhasil diduplikasi ke tanggal ' . Carbon::parse($targetDate)->translatedFormat('d M Y') . '!'
            : 'Sesi latihan berhasil diduplikasi ke ' . $createdCount . ' klien pada tanggal ' . Carbon::parse($targetDate)->translatedFormat('d M Y') . '!';

        return back()->with('message', $message);
    }

    /**
     * Resequence all sessions for an athlete in chronological order (date, created_at, id).
     * Extra sessions (is_extra = true) get null session_number.
     * Regular sessions get continuous numbers: 1, 2, 3, ...
     */
    public static function resequenceAthleteSessions(int $userId, ?bool $isPaid = null): void
    {
        if ($isPaid === null) {
            self::resequenceAthleteSessions($userId, false);
            self::resequenceAthleteSessions($userId, true);
            return;
        }

        // 1. Reset extra sessions
        IndividualTraining::where('user_id', $userId)
            ->where('is_athlete_paid', $isPaid)
            ->where('is_extra', true)
            ->update(['session_number' => null]);

        // 2. Fetch regular sessions chronologically
        $sessions = IndividualTraining::where('user_id', $userId)
            ->where('is_athlete_paid', $isPaid)
            ->where('is_extra', false)
            ->orderBy('date', 'asc')
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        foreach ($sessions as $index => $session) {
            $expectedNumber = $index + 1;
            if ($session->session_number !== $expectedNumber) {
                $session->session_number = $expectedNumber;
                $session->saveQuietly();
            }
        }
    }

    /**
     * Resequence all sessions for a shared package in chronological order (date, created_at, id).
     * Extra sessions (is_extra = true) get null shared_session_number.
     * Regular sessions get continuous numbers: 1, 2, 3, ...
     * Unpaid and Paid cycles are numbered independently starting from 1.
     */
    public static function resequenceSharedPackageSessions(int $sharedPackageId, ?bool $isPaid = null): void
    {
        if ($isPaid === null) {
            self::resequenceSharedPackageSessions($sharedPackageId, false);
            self::resequenceSharedPackageSessions($sharedPackageId, true);
            return;
        }

        // 1. Reset extra sessions
        IndividualTraining::where('shared_package_id', $sharedPackageId)
            ->where('is_athlete_paid', $isPaid)
            ->where('is_extra', true)
            ->update(['shared_session_number' => null]);

        // 2. Fetch regular sessions chronologically for this payment cycle
        $sessions = IndividualTraining::where('shared_package_id', $sharedPackageId)
            ->where('is_athlete_paid', $isPaid)
            ->where('is_extra', false)
            ->orderBy('date', 'asc')
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        foreach ($sessions as $index => $session) {
            $expectedNumber = $index + 1;
            if ($session->shared_session_number !== $expectedNumber) {
                $session->shared_session_number = $expectedNumber;
                $session->saveQuietly();
            }
        }
    }

    /**
     * Export PDF for Individual Training Session
     */
    public function exportPdf(IndividualTraining $training)
    {
        $training->load(['coach', 'user', 'blocks.items.exercise', 'rpeRecords']);
        $athlete = $training->user;
        
        $logoSetting = \App\Models\Setting::where('key', 'app_logo')->value('value');
        $logoPath = $logoSetting ? storage_path('app/public/' . $logoSetting) : public_path('assets/images/app-logo.png');
        
        $clubLogo = null;
        if (file_exists($logoPath)) {
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            $data = file_get_contents($logoPath);
            $clubLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        $athletesData = [];
        if ($athlete) {
            $rpes = [];
            foreach ($training->rpeRecords as $record) {
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
                'is_completed' => (bool) $training->is_completed,
                'note' => $training->athlete_note,
                'rpes' => $rpes,
            ];
        }

        \App\Services\PdfImageHelper::processTrainingImages($training);

        // Pastikan nama dan tanggal tersedia untuk title
        $training->title = $training->name ?: ($training->is_extra ? 'Extra Activity / Tournament' : 'Individual Training Session #' . $training->session_number);
        $training->focus = ($athlete ? $athlete->name : 'Athlete') . ($training->location ? ' | ' . $training->location : '');
        
        $coachNames = [];
        if (is_array($training->coach_ids)) {
            if (count($training->coach_ids) > 0) {
                $coachNames = \App\Models\User::whereIn('id', $training->coach_ids)
                    ->pluck('name')
                    ->toArray();
            }
        } elseif ($training->coach_id && $training->coach) {
            $coachNames = [$training->coach->name];
        }
        $training->coachList = count($coachNames) > 0 ? implode(', ', array_unique($coachNames)) : '-';

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.training_session_pdf', [
            'training' => $training,
            'playerName' => $athlete ? $athlete->name : 'Athlete',
            'athlete' => $athlete,
            'athletesData' => $athletesData,
            'clubLogo' => $clubLogo
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Individual_Training_Session_' . $training->id . '.pdf');
    }
}
