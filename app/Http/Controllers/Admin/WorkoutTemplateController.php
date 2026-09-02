<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\ExercisePackage;
use App\Models\WorkoutTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkoutTemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkoutTemplate::with('creator:id,name')
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $templates = $query->paginate(12)->withQueryString();
        
        $categories = WorkoutTemplate::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category');

        return Inertia::render('Admin/WorkoutTemplates/Index', [
            'templates' => $templates,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create()
    {
        $exercises = Exercise::orderBy('name', 'asc')->get();
        $packages = ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/WorkoutTemplates/Form', [
            'template' => null,
            'exercises' => $exercises,
            'packages' => $packages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'blocks' => 'required|array|min:1',
            'is_public' => 'boolean',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['order'] = WorkoutTemplate::max('order') + 1;

        WorkoutTemplate::create($validated);

        return redirect()->route('admin.workout-templates.index')
            ->with('success', 'Template sesi latihan berhasil ditambahkan!');
    }

    public function edit(WorkoutTemplate $workoutTemplate)
    {
        $exercises = Exercise::orderBy('name', 'asc')->get();
        $packages = ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/WorkoutTemplates/Form', [
            'template' => $workoutTemplate,
            'exercises' => $exercises,
            'packages' => $packages,
        ]);
    }

    public function update(Request $request, WorkoutTemplate $workoutTemplate)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'blocks' => 'required|array|min:1',
            'is_public' => 'boolean',
        ]);

        $workoutTemplate->update($validated);

        return redirect()->route('admin.workout-templates.index')
            ->with('success', 'Template sesi latihan berhasil diperbarui!');
    }

    public function destroy(WorkoutTemplate $workoutTemplate)
    {
        $workoutTemplate->delete();

        return redirect()->route('admin.workout-templates.index')
            ->with('success', 'Template sesi latihan berhasil dihapus.');
    }

    public function duplicate(WorkoutTemplate $workoutTemplate)
    {
        $clone = $workoutTemplate->replicate();
        $clone->title = $workoutTemplate->title . ' (Copy)';
        $clone->created_by = auth()->id();
        $clone->order = WorkoutTemplate::max('order') + 1;
        $clone->save();

        return redirect()->route('admin.workout-templates.index')
            ->with('success', 'Template berhasil diduplikasi!');
    }
}
