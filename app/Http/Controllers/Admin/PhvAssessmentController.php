<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\PhvAssessment;

class PhvAssessmentController extends Controller
{
    public function index()
    {
        // Get all athletes with their latest PHV assessment
        $athletes = User::where('role', 'athlete')
            ->with(['phvAssessments' => function($q) {
                $q->latest('assessment_date');
            }])
            ->orderBy('name')
            ->get();
        
        return Inertia::render('Admin/Phv/Index', [
            'athletes' => $athletes
        ]);
    }

    public function show(User $user)
    {
        $assessments = PhvAssessment::where('user_id', $user->id)
            ->orderBy('assessment_date', 'desc')
            ->get();
            
        return Inertia::render('Admin/Phv/Show', [
            'athlete' => $user,
            'assessments' => $assessments
        ]);
    }
    
    public function create(User $user)
    {
        return Inertia::render('Admin/Phv/Form', [
            'athlete' => $user,
            'assessment' => null
        ]);
    }

    public function store(Request $request, User $user)
    {
        $validated = $request->validate([
            'assessment_date' => 'required|date',
            'age' => 'required|numeric',
            'weight' => 'required|numeric',
            'standing_height' => 'required|numeric',
            'sitting_height' => 'required|numeric',
            'leg_length' => 'required|numeric',
            'maturity_offset' => 'required|numeric',
            'phv_age' => 'required|numeric',
            'maturity_status' => 'required|string',
            'remaining_growth' => 'nullable|numeric',
            'predicted_adult_height' => 'nullable|numeric',
            'adult_height_percentage' => 'nullable|numeric',
        ]);
        
        $validated['user_id'] = $user->id;

        PhvAssessment::create($validated);

        return redirect()->route('admin.phv-calculator.show', $user->id)->with('success', 'PHV Assessment saved successfully.');
    }
    
    public function edit(PhvAssessment $phvAssessment)
    {
        $phvAssessment->load('user');
        
        return Inertia::render('Admin/Phv/Form', [
            'athlete' => $phvAssessment->user,
            'assessment' => $phvAssessment
        ]);
    }
    
    public function update(Request $request, PhvAssessment $phvAssessment)
    {
        $validated = $request->validate([
            'assessment_date' => 'required|date',
            'age' => 'required|numeric',
            'weight' => 'required|numeric',
            'standing_height' => 'required|numeric',
            'sitting_height' => 'required|numeric',
            'leg_length' => 'required|numeric',
            'maturity_offset' => 'required|numeric',
            'phv_age' => 'required|numeric',
            'maturity_status' => 'required|string',
            'remaining_growth' => 'nullable|numeric',
            'predicted_adult_height' => 'nullable|numeric',
            'adult_height_percentage' => 'nullable|numeric',
        ]);

        $phvAssessment->update($validated);

        return redirect()->route('admin.phv-calculator.show', $phvAssessment->user_id)->with('success', 'PHV Assessment updated successfully.');
    }
    
    public function destroy(PhvAssessment $phvAssessment)
    {
        $userId = $phvAssessment->user_id;
        $phvAssessment->delete();
        
        return redirect()->route('admin.phv-calculator.show', $userId)->with('success', 'PHV Assessment deleted successfully.');
    }
}
