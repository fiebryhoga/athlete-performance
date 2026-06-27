<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExercisePackage;
use Illuminate\Http\Request;

class ExercisePackageController extends Controller
{
    public function create()
    {
        $exercises = \App\Models\Exercise::orderBy('name', 'asc')->get();
        return \Inertia\Inertia::render('Admin/ExercisePackages/Create', [
            'exercises' => $exercises
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'exercise_ids' => 'nullable|array',
            'exercise_ids.*' => 'exists:exercises,id'
        ]);

        $package = ExercisePackage::create($request->only('name'));
        if ($request->has('exercise_ids')) {
            $package->exercises()->sync($request->exercise_ids);
        }

        return redirect()->route('admin.exercises.index')->with('success', 'Paket latihan berhasil dibuat.');
    }

    public function edit(ExercisePackage $exercisePackage)
    {
        $exercisePackage->load('exercises');
        $exercises = \App\Models\Exercise::orderBy('name', 'asc')->get();
        return \Inertia\Inertia::render('Admin/ExercisePackages/Edit', [
            'packageData' => $exercisePackage,
            'exercises' => $exercises
        ]);
    }

    public function update(Request $request, ExercisePackage $exercisePackage)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'exercise_ids' => 'nullable|array',
            'exercise_ids.*' => 'exists:exercises,id'
        ]);

        $exercisePackage->update($request->only('name'));
        if ($request->has('exercise_ids')) {
            $exercisePackage->exercises()->sync($request->exercise_ids);
        } else {
            $exercisePackage->exercises()->detach();
        }

        return redirect()->route('admin.exercises.index')->with('success', 'Paket latihan diperbarui.');
    }

    public function destroy(ExercisePackage $exercisePackage)
    {
        $exercisePackage->delete();
        return redirect()->back()->with('success', 'Paket latihan dihapus.');
    }
}
