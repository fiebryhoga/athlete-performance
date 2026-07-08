<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DpaAssessment;
use App\Models\DpaCompensation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class DpaAssessmentController extends Controller
{
    public function index()
    {
        $athletes = User::where('role', 'athlete')->with('sport')->get();

        return Inertia::render('Admin/Athletes/Dpa/Index', [
            'players' => $athletes
        ]);
    }

    public function show(User $user)
    {
        $currentUser = Auth::user();
        if ($currentUser->role === 'athlete' && $currentUser->id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $assessments = $user->dpaAssessments()
            ->with(['details.compensation'])
            ->orderBy('assessment_date', 'desc')
            ->get();

        $compensations = DpaCompensation::orderBy('category')->orderBy('name')->get();

        return Inertia::render('Admin/Athletes/Dpa/Show', [
            'player' => $user,
            'assessments' => $assessments,
            'compensations' => $compensations
        ]);
    }

    public function store(Request $request, User $user)
    {
        $validated = $request->validate([
            'assessment_date' => 'required|date',
            'notes' => 'nullable|string',
            'compensations' => 'array',
            'compensations.*' => 'exists:dpa_compensations,id'
        ]);

        $assessment = $user->dpaAssessments()->create([
            'assessment_date' => $validated['assessment_date'],
            'notes' => $validated['notes'] ?? null,
        ]);

        if (!empty($validated['compensations'])) {
            foreach ($validated['compensations'] as $compId) {
                $assessment->details()->create([
                    'dpa_compensation_id' => $compId
                ]);
            }
        }

        return redirect()->back()->with('success', 'Data DPA berhasil ditambahkan!');
    }

    public function update(Request $request, DpaAssessment $dpaAssessment)
    {
        $validated = $request->validate([
            'assessment_date' => 'required|date',
            'notes' => 'nullable|string',
            'compensations' => 'array',
            'compensations.*' => 'exists:dpa_compensations,id'
        ]);

        $dpaAssessment->update([
            'assessment_date' => $validated['assessment_date'],
            'notes' => $validated['notes'] ?? null,
        ]);

        $dpaAssessment->compensations()->sync($validated['compensations'] ?? []);

        return redirect()->back()->with('success', 'Data DPA berhasil diperbarui!');
    }

    public function destroy(DpaAssessment $dpaAssessment)
    {
        $dpaAssessment->delete();
        return redirect()->back()->with('success', 'Data asesmen berhasil dihapus.');
    }

    public function exportPdf(Request $request, User $user)
    {
        $currentUser = Auth::user();
        if ($currentUser->role === 'athlete' && $currentUser->id !== $user->id) {
            abort(403, 'Unauthorized access.');
        }

        ini_set('memory_limit', '512M');
        ini_set('max_execution_time', '300');

        $exportData = json_decode($request->input('table_data', '[]'), true);
        
        $customTitle = trim($request->input('title'));
        $note = $request->input('note');
        $includeInsights = filter_var($request->input('include_insights', false), FILTER_VALIDATE_BOOLEAN);
        
        $defaultTitle = "DPA ASSESSMENT REPORT";
        $title = !empty($customTitle) ? $customTitle : $defaultTitle;

        $latest = $exportData['latest'] ?? null;
        
        $analysis = [
            'overactive' => [],
            'underactive' => [],
            'injuries' => [],
            'smr' => [],
            'stretching' => [],
            'isometrics' => [],
            'integrated' => []
        ];

        if ($latest && isset($latest['details'])) {
            $addItems = function($sourceStr, &$targetArray) {
                if (!$sourceStr) return;
                $items = array_filter(array_map('trim', preg_split('/[\n,]/', $sourceStr)));
                foreach ($items as $item) {
                    if (!in_array($item, $targetArray)) $targetArray[] = $item;
                }
            };

            $addItemsWithImage = function($sourceStr, $imagePath, &$targetArray) {
                if (!$sourceStr) return;
                $items = array_filter(array_map('trim', preg_split('/[\n,]/', $sourceStr)));
                foreach ($items as $item) {
                    $exists = false;
                    foreach ($targetArray as &$existing) {
                        if ($existing['text'] === $item) {
                            $exists = true;
                            if ($imagePath && empty($existing['image'])) {
                                $existing['image'] = $imagePath;
                            }
                            break;
                        }
                    }
                    if (!$exists) {
                        $targetArray[] = ['text' => $item, 'image' => $imagePath];
                    }
                }
            };

            foreach ($latest['details'] as $detail) {
                if (isset($detail['compensation'])) {
                    $c = $detail['compensation'];
                    $addItems($c['overactive_muscles'] ?? '', $analysis['overactive']);
                    $addItems($c['underactive_muscles'] ?? '', $analysis['underactive']);
                    $addItems($c['possible_injuries'] ?? '', $analysis['injuries']);
                    
                    $addItemsWithImage($c['exercises_smr'] ?? '', $c['image_smr'] ?? null, $analysis['smr']);
                    $addItemsWithImage($c['exercises_stretching'] ?? '', $c['image_stretching'] ?? null, $analysis['stretching']);
                    $addItemsWithImage($c['exercises_isometrics'] ?? '', $c['image_isometrics'] ?? null, $analysis['isometrics']);
                    $addItemsWithImage($c['exercises_integrated'] ?? '', $c['image_integrated'] ?? null, $analysis['integrated']);
                }
            }
        }

        $pdf = Pdf::loadView('exports.dpa_pdf', [
            'player' => $user,
            'latest' => $latest,
            'analysis' => $analysis,
            'title' => $title,
            'note' => $note,
            'includeInsights' => $includeInsights
        ])->setPaper('a4', 'portrait');

        $playerName = $user ? str_replace(' ', '_', $user->name) : 'Athlete';
        $reqFilename = trim($request->input('filename'));

        $fileNamePrefix = !empty($reqFilename) 
            ? preg_replace('/[^A-Za-z0-9_\-]/', '_', $reqFilename) 
            : (!empty($customTitle) 
                ? preg_replace('/[^A-Za-z0-9_\-]/', '_', $customTitle) 
                : 'DPA_Report_' . $playerName);

        return $pdf->download($fileNamePrefix . '.pdf');
    }
}
