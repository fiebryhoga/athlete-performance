<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DpaCompensation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DpaCompensationController extends Controller
{
    public function index()
    {
        $compensations = DpaCompensation::orderBy('category')->orderBy('name')->get();

        return Inertia::render('Admin/DpaCompensations/Index', [
            'compensations' => $compensations
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/DpaCompensations/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|in:Posterior View,Lateral View,Anterior View,Single Leg',
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'overactive_muscles' => 'nullable|string',
            'underactive_muscles' => 'nullable|string',
            'possible_injuries' => 'nullable|string',
            'exercises_smr' => 'nullable|string',
            'exercises_stretching' => 'nullable|string',
            'exercises_isometrics' => 'nullable|string',
            'exercises_integrated' => 'nullable|string',
            'image_smr' => 'nullable|image|max:2048',
            'image_stretching' => 'nullable|image|max:2048',
            'image_isometrics' => 'nullable|image|max:2048',
            'image_integrated' => 'nullable|image|max:2048',
        ]);

        $imageFields = ['image', 'image_smr', 'image_stretching', 'image_isometrics', 'image_integrated'];
        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $pathKey = $field === 'image' ? 'image_path' : $field;
                $validated[$pathKey] = $request->file($field)->store('dpa_images', 'public');
            }
        }

        DpaCompensation::create($validated);

        return redirect()->route('admin.dpa-compensations.index')->with('success', 'DPA Compensation created successfully.');
    }

    public function edit(DpaCompensation $dpaCompensation)
    {
        return Inertia::render('Admin/DpaCompensations/Form', [
            'dpaCompensation' => $dpaCompensation
        ]);
    }

    public function update(Request $request, DpaCompensation $dpaCompensation)
    {
        $validated = $request->validate([
            'category' => 'required|string|in:Posterior View,Lateral View,Anterior View,Single Leg',
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'overactive_muscles' => 'nullable|string',
            'underactive_muscles' => 'nullable|string',
            'possible_injuries' => 'nullable|string',
            'exercises_smr' => 'nullable|string',
            'exercises_stretching' => 'nullable|string',
            'exercises_isometrics' => 'nullable|string',
            'exercises_integrated' => 'nullable|string',
            'image_smr' => 'nullable|image|max:2048',
            'image_stretching' => 'nullable|image|max:2048',
            'image_isometrics' => 'nullable|image|max:2048',
            'image_integrated' => 'nullable|image|max:2048',
        ]);

        $imageFields = ['image', 'image_smr', 'image_stretching', 'image_isometrics', 'image_integrated'];
        foreach ($imageFields as $field) {
            $pathKey = $field === 'image' ? 'image_path' : $field;
            
            // Check if removal was requested
            if ($request->boolean("remove_{$field}")) {
                if ($dpaCompensation->{$pathKey}) {
                    Storage::disk('public')->delete($dpaCompensation->{$pathKey});
                }
                $validated[$pathKey] = null;
            } elseif ($request->hasFile($field)) {
                if ($dpaCompensation->{$pathKey}) {
                    Storage::disk('public')->delete($dpaCompensation->{$pathKey});
                }
                $validated[$pathKey] = $request->file($field)->store('dpa_images', 'public');
            } else {
                // If no new file and no removal requested, do not overwrite the existing DB path with null
                unset($validated[$pathKey]);
            }
        }

        $dpaCompensation->update($validated);

        return redirect()->route('admin.dpa-compensations.index')->with('success', 'DPA Compensation updated successfully.');
    }

    public function destroy(DpaCompensation $dpaCompensation)
    {
        $imageFields = ['image_path', 'image_smr', 'image_stretching', 'image_isometrics', 'image_integrated'];
        foreach ($imageFields as $field) {
            if ($dpaCompensation->{$field}) {
                Storage::disk('public')->delete($dpaCompensation->{$field});
            }
        }
        $dpaCompensation->delete();

        return redirect()->back()->with('success', 'DPA Compensation deleted successfully.');
    }
}
