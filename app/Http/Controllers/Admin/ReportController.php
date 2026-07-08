<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\IndividualTraining;
use App\Models\GroupTraining;
use App\Models\TrainingGroup;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display a comprehensive recap of sessions for athletes, groups, and coaches.
     */
    public function sessionRecap()
    {
        // ─── ATHLETES (Individual) ───
        $athletes = User::where('role', 'athlete')
            ->with(['sport', 'package'])
            ->get()
            ->map(function ($athlete) {
                $trainings = IndividualTraining::where('user_id', $athlete->id)
                    ->with('coach')
                    ->orderBy('date', 'desc')
                    ->get();

                $packageSessionCount = $athlete->package->session_count ?? null;

                $athlete->package_name = $athlete->package->name ?? null;
                $athlete->package_session_count = $packageSessionCount;
                $athlete->total_sessions = $trainings->count();
                $athlete->completed_sessions = $trainings->where('status', 'completed')->count();
                $athlete->scheduled_sessions = $trainings->whereNotIn('status', ['completed'])->count();
                $athlete->unpaid_sessions = $trainings->where('is_athlete_paid', false)->count();

                // Session list for drill-down (hanya yang belum dibayar)
                $athlete->sessions = $trainings->where('is_athlete_paid', false)->map(function ($t) {
                    $coachNames = [];
                    if ($t->coach) {
                        $coachNames[] = $t->coach->name;
                    }
                    if ($t->coach_ids && is_array($t->coach_ids)) {
                        $extraCoaches = User::whereIn('id', $t->coach_ids)
                            ->where('id', '!=', $t->coach_id)
                            ->pluck('name')
                            ->toArray();
                        $coachNames = array_merge($coachNames, $extraCoaches);
                    }

                    return [
                        'id' => $t->id,
                        'date' => $t->date,
                        'status' => $t->status,
                        'session_number' => $t->session_number,
                        'name' => $t->name,
                        'training_type' => $t->training_type,
                        'coaches' => array_unique($coachNames),
                        'is_paid' => (bool) $t->is_athlete_paid,
                    ];
                })->values();

                // Unset relationship to keep payload clean
                unset($athlete->package);

                return $athlete;
            });

        // ─── GROUPS ───
        $groups = TrainingGroup::with(['package', 'members'])
            ->get()
            ->map(function ($group) {
                $trainings = GroupTraining::where('training_group_id', $group->id)
                    ->with('coach')
                    ->orderBy('date', 'desc')
                    ->get();

                $packageSessionCount = $group->package->session_count ?? null;

                $group->package_name = $group->package->name ?? null;
                $group->package_session_count = $packageSessionCount;
                $group->members_count = $group->members->count();
                $group->total_sessions = $trainings->count();
                $group->completed_sessions = $trainings->where('status', 'completed')->count();
                $group->unpaid_sessions = $trainings->where('is_group_paid', false)->count();

                // Session list for drill-down (hanya yang belum dibayar)
                $group->sessions = $trainings->where('is_group_paid', false)->map(function ($t) {
                    $coachNames = [];
                    if ($t->coach) {
                        $coachNames[] = $t->coach->name;
                    }
                    if ($t->coach_ids && is_array($t->coach_ids)) {
                        $extraCoaches = User::whereIn('id', $t->coach_ids)
                            ->where('id', '!=', $t->coach_id)
                            ->pluck('name')
                            ->toArray();
                        $coachNames = array_merge($coachNames, $extraCoaches);
                    }

                    return [
                        'id' => $t->id,
                        'date' => $t->date ? $t->date->format('Y-m-d') : null,
                        'status' => $t->status,
                        'session_number' => $t->session_number,
                        'name' => $t->name,
                        'coaches' => array_unique($coachNames),
                        'is_paid' => (bool) $t->is_group_paid,
                    ];
                })->values();

                // Clean up relationships
                $memberNames = $group->members->pluck('name')->toArray();
                $group->member_names = $memberNames;
                unset($group->members, $group->package);

                return $group;
            });

        // ─── COACHES ───
        $coaches = User::where('role', 'coach')
            ->get()
            ->map(function ($coach) {
                // Individual sessions
                $individualTrainings = IndividualTraining::where('coach_id', $coach->id)
                    ->orWhereJsonContains('coach_ids', (string)$coach->id)
                    ->orWhereJsonContains('coach_ids', $coach->id)
                    ->with('user.package')
                    ->get();

                $individualCount = $individualTrainings->count();

                // Group sessions
                $groupTrainings = GroupTraining::where('coach_id', $coach->id)
                    ->orWhereJsonContains('coach_ids', (string)$coach->id)
                    ->orWhereJsonContains('coach_ids', $coach->id)
                    ->with('group.package')
                    ->get();

                $groupCount = $groupTrainings->count();

                // Unpaid individual sessions
                $unpaidIndividual = $individualTrainings->filter(function ($session) use ($coach) {
                    $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
                    $paidIds = $paidIds ?? [];
                    return !in_array($coach->id, $paidIds) && !in_array((string)$coach->id, $paidIds);
                });

                // Unpaid group sessions
                $unpaidGroup = $groupTrainings->where('is_coach_paid', false);
                $unpaidEarnings = 0;

                foreach ($individualTrainings as $session) {
                    $fee = $session->user?->package?->coach_fee_per_session ?? 0;

                    $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
                    $paidIds = $paidIds ?? [];
                    if (!in_array($coach->id, $paidIds) && !in_array((string)$coach->id, $paidIds)) {
                        $unpaidEarnings += $fee;
                    }
                }

                foreach ($groupTrainings as $session) {
                    $fee = $session->group?->package?->coach_fee_per_session ?? 0;

                    if (!$session->is_coach_paid) {
                        $unpaidEarnings += $fee;
                    }
                }

                $lastPayout = \App\Models\CoachPayout::where('user_id', $coach->id)->latest('paid_at')->first();

                $coach->individual_sessions = $unpaidIndividual->count();
                $coach->group_sessions = $unpaidGroup->count();
                $coach->total_sessions = $unpaidIndividual->count() + $unpaidGroup->count();
                $coach->unpaid_sessions = $coach->total_sessions;
                $coach->last_payout_amount = $lastPayout ? $lastPayout->amount : 0;
                $coach->unpaid_earnings = $unpaidEarnings;

                // Build coach sessions for drill-down
                $coachSessions = collect();

                foreach ($unpaidIndividual as $session) {
                    $coachSessions->push([
                        'id' => 'ind_'.$session->id,
                        'date' => $session->date ? $session->date->format('Y-m-d') : null,
                        'name' => $session->name ?: 'Program Individu - ' . ($session->user->name ?? 'Atlet'),
                        'session_number' => $session->session_number,
                        'status' => $session->status,
                        'type' => 'Individu',
                        'fee' => $session->user?->package?->coach_fee_per_session ?? 0
                    ]);
                }

                foreach ($unpaidGroup as $session) {
                    $coachSessions->push([
                        'id' => 'grp_'.$session->id,
                        'date' => $session->date ? $session->date->format('Y-m-d') : null,
                        'name' => $session->name ?: 'Program Grup - ' . ($session->group->name ?? 'Grup'),
                        'session_number' => $session->session_number,
                        'status' => $session->status,
                        'type' => 'Grup',
                        'fee' => $session->group?->package?->coach_fee_per_session ?? 0
                    ]);
                }

                $coach->sessions = $coachSessions->sortByDesc('date')->values();

                return $coach;
            });

        return Inertia::render('Admin/Reports/SessionRecap', [
            'athletes' => $athletes,
            'groups' => $groups,
            'coaches' => $coaches,
        ]);
    }

    public function payAthlete(Request $request, User $user)
    {
        IndividualTraining::where('user_id', $user->id)
            ->where('is_athlete_paid', false)
            ->update(['is_athlete_paid' => true]);

        return redirect()->back()->with('success', 'Berhasil menandai sesi atlet sebagai lunas.');
    }

    public function payCoach(Request $request, User $user)
    {
        $unpaidEarnings = 0;

        // Mark individual sessions as paid for this coach
        $individualTrainings = IndividualTraining::where('coach_id', $user->id)
            ->orWhereJsonContains('coach_ids', (string)$user->id)
            ->orWhereJsonContains('coach_ids', $user->id)
            ->with('user.package')
            ->get();

        foreach ($individualTrainings as $session) {
            $paidIds = is_string($session->paid_coach_ids) ? json_decode($session->paid_coach_ids, true) : $session->paid_coach_ids;
            $paidIds = $paidIds ?? [];
            if (!in_array($user->id, $paidIds) && !in_array((string)$user->id, $paidIds)) {
                $unpaidEarnings += $session->user?->package?->coach_fee_per_session ?? 0;

                $paidIds[] = $user->id;
                $session->paid_coach_ids = $paidIds;
                $session->save();
            }
        }

        // Mark group sessions as paid for this coach
        $groupTrainings = GroupTraining::where('coach_id', $user->id)
            ->orWhereJsonContains('coach_ids', (string)$user->id)
            ->orWhereJsonContains('coach_ids', $user->id)
            ->where('is_coach_paid', false)
            ->with('group.package')
            ->get();

        foreach ($groupTrainings as $session) {
            $unpaidEarnings += $session->group?->package?->coach_fee_per_session ?? 0;
            $session->is_coach_paid = true;
            $session->save();
        }

        if ($unpaidEarnings > 0) {
            \App\Models\CoachPayout::create([
                'user_id' => $user->id,
                'amount' => $unpaidEarnings,
                'paid_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Berhasil mencairkan honor pelatih sebesar Rp ' . number_format($unpaidEarnings, 0, ',', '.'));
    }

    public function payGroup(Request $request, TrainingGroup $group)
    {
        GroupTraining::where('training_group_id', $group->id)
            ->where('is_group_paid', false)
            ->update(['is_group_paid' => true]);

        return redirect()->back()->with('success', 'Berhasil menandai sesi grup sebagai lunas.');
    }
    public function exportAthleteReportPdf(Request $request, User $user)
    {
        // Load all trainings for this athlete
        $trainings = IndividualTraining::where('user_id', $user->id)
            ->with(['coach', 'blocks.items.exercise', 'rpeRecords'])
            ->orderBy('session_number', 'asc')
            ->get();

        $logoSetting = \App\Models\Setting::where('key', 'app_logo')->value('value');
        $logoPath = $logoSetting ? storage_path('app/public/' . $logoSetting) : public_path('assets/images/app-logo.png');
        
        $clubLogo = null;
        if (file_exists($logoPath)) {
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            $data = file_get_contents($logoPath);
            $clubLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        // Prepare each training's data
        $trainings->each(function ($training) use ($user) {
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

            // Set title and focus
            $training->title = $training->name ?: 'Session #' . $training->session_number;
            $training->focus = ($training->location ? $training->location : '');
            
            $coachNames = [];
            if (is_array($training->coach_ids) && count($training->coach_ids) > 0) {
                $coachNames = \App\Models\User::whereIn('id', $training->coach_ids)
                    ->pluck('name')
                    ->toArray();
            }
            $training->coachList = count($coachNames) > 0 ? implode(', ', array_unique($coachNames)) : '-';

            // Process RPEs for the footer of each session if needed
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
            
            $training->athleteData = [
                'name' => $user->name,
                'is_completed' => (bool) $training->is_completed,
                'note' => $training->athlete_note,
                'rpes' => $rpes,
            ];
        });

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.athlete_session_report_pdf', [
            'trainings' => $trainings,
            'athlete' => $user,
            'clubLogo' => $clubLogo
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Laporan_Sesi_' . str_replace(' ', '_', $user->name) . '.pdf');
    }


    public function exportGroupReportPdf(Request $request, \App\Models\TrainingGroup $group)
    {
        // Load all trainings for this group
        $trainings = GroupTraining::where('training_group_id', $group->id)
            ->with(['coach', 'blocks.items.exercise', 'rpe_records'])
            ->orderBy('session_number', 'asc')
            ->get();

        $logoSetting = \App\Models\Setting::where('key', 'app_logo')->value('value');
        $logoPath = $logoSetting ? storage_path('app/public/' . $logoSetting) : public_path('assets/images/app-logo.png');
        
        $clubLogo = null;
        if (file_exists($logoPath)) {
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            $data = file_get_contents($logoPath);
            $clubLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        // Prepare each training's data
        $trainings->each(function ($training) use ($group) {
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

            // Set title and focus
            $training->title = $training->name ?: 'Session #' . $training->session_number;
            $training->focus = ($training->location ? $training->location : '');
            
            $coachNames = [];
            if (is_array($training->coach_ids) && count($training->coach_ids) > 0) {
                $coachNames = \App\Models\User::whereIn('id', $training->coach_ids)
                    ->pluck('name')
                    ->toArray();
            }
            $training->coachList = count($coachNames) > 0 ? implode(', ', array_unique($coachNames)) : '-';

            $training->athleteData = [
                'name' => $group->name,
                'is_completed' => true,
                'note' => '',
                'rpes' => [],
            ];
        });

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.athlete_session_report_pdf', [
            'trainings' => $trainings,
            'athlete' => (object)['name' => $group->name, 'package' => null],
            'clubLogo' => $clubLogo
        ])->setPaper('a4', 'landscape');

        return $pdf->download('Laporan_Sesi_Grup_' . str_replace(' ', '_', $group->name) . '.pdf');
    }

    public function exportProfilingPdf(Request $request, User $user)
    {
        $athlete = User::with(['sport', 'performanceTests.results.testItem.category'])->findOrFail($user->id);
        
        $logoSetting = \App\Models\Setting::where('key', 'app_logo')->value('value');
        $logoPath = $logoSetting ? storage_path('app/public/' . $logoSetting) : public_path('assets/images/app-logo.png');
        
        $clubLogo = null;
        if (file_exists($logoPath)) {
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            $data = file_get_contents($logoPath);
            $clubLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.profiling_pdf', [
            'athlete' => $athlete,
            'clubLogo' => $clubLogo
        ])->setPaper('a4', 'portrait');

        return $pdf->download("Profiling_Athlete_{$athlete->name}.pdf");
    }
}
