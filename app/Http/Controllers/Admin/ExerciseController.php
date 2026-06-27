<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\ExerciseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        $exercises = Exercise::with('category')->orderBy('name', 'asc')->get();
        $categories = ExerciseCategory::orderBy('name', 'asc')->get();
        $packages = \App\Models\ExercisePackage::with('exercises')->orderBy('name', 'asc')->get();
        
        return Inertia::render('Admin/Exercises/Index', [
            'exercises' => $exercises,
            'categories' => $categories,
            'packages' => $packages,
            'currentCategoryId' => $request->category_id,
        ]);
    }

    public function create()
    {
        $categories = ExerciseCategory::orderBy('name', 'asc')->get();
        return Inertia::render('Admin/Exercises/Create', [
            'categories' => $categories
        ]);
    }

    public function bulkCreate()
    {
        $categories = ExerciseCategory::orderBy('name', 'asc')->get();
        return Inertia::render('Admin/Exercises/BulkCreate', [
            'categories' => $categories
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'names' => 'required|string',
            'exercise_category_id' => 'nullable|exists:exercise_categories,id',
        ]);

        $names = explode("\n", str_replace("\r", "", $request->names));
        $names = array_filter(array_map('trim', $names));

        $insertData = [];
        $now = now();
        foreach ($names as $name) {
            if (!empty($name)) {
                $insertData[] = [
                    'name' => $name,
                    'exercise_category_id' => $request->exercise_category_id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if (count($insertData) > 0) {
            Exercise::insert($insertData);
            return redirect()->route('admin.exercises.index')->with('success', count($insertData) . ' Latihan berhasil dibuat secara massal.');
        }

        return redirect()->back()->with('error', 'Tidak ada nama latihan yang valid.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:exercises,name',
            'description' => 'nullable|string',
            'exercise_category_id' => 'nullable|exists:exercise_categories,id',
            'images.*' => 'nullable|image|max:5120',
        ]);
        
        $data = $request->only('name', 'description', 'exercise_category_id');

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('exercises', 'public');
                $imagePaths[] = '/storage/' . $path;
            }
        }
        $data['images'] = $imagePaths;

        $videos = [];
        if ($request->videos) {
            $videosData = is_string($request->videos) ? json_decode($request->videos, true) : $request->videos;
            if (is_array($videosData)) {
                $videos = array_values(array_filter($videosData));
            }
        }
        $data['videos'] = $videos;

        Exercise::create($data);

        return redirect()->route('admin.exercises.index')->with('success', 'Latihan berhasil dibuat.');
    }

    public function edit(Exercise $exercise)
    {
        $categories = ExerciseCategory::orderBy('name', 'asc')->get();
        return Inertia::render('Admin/Exercises/Edit', [
            'exercise' => $exercise,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Exercise $exercise)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:exercises,name,' . $exercise->id,
            'description' => 'nullable|string',
            'exercise_category_id' => 'nullable|exists:exercise_categories,id',
            'images.*' => 'nullable|image|max:5120',
        ]);

        $data = $request->only('name', 'description', 'exercise_category_id');

        // Handle Images (Append new ones, keep existing ones handled by frontend passing 'existing_images')
        $existingImages = $request->existing_images ? (is_string($request->existing_images) ? json_decode($request->existing_images, true) : $request->existing_images) : [];
        if (!is_array($existingImages)) $existingImages = [];

        $imagePaths = $existingImages;
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('exercises', 'public');
                $imagePaths[] = '/storage/' . $path;
            }
        }
        $data['images'] = $imagePaths;

        $videos = [];
        if ($request->videos) {
            $videosData = is_string($request->videos) ? json_decode($request->videos, true) : $request->videos;
            if (is_array($videosData)) {
                $videos = array_values(array_filter($videosData));
            }
        }
        $data['videos'] = $videos;

        $exercise->update($data);

        return redirect()->route('admin.exercises.index')->with('success', 'Data diperbarui.');
    }

    public function destroy(Exercise $exercise)
    {
        $exercise->delete();
        return redirect()->route('exercises.index')->with('success', 'Latihan dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:exercises,id',
        ]);

        Exercise::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Latihan terpilih berhasil dihapus.');
    }

    public function bulkAssignCategory(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:exercises,id',
            'category_id' => 'nullable|integer|exists:exercise_categories,id',
            'new_category_name' => 'nullable|string|max:255',
        ]);

        $categoryId = $request->category_id;

        if (!empty($request->new_category_name)) {
            $category = ExerciseCategory::firstOrCreate(['name' => trim($request->new_category_name)]);
            $categoryId = $category->id;
        }

        Exercise::whereIn('id', $request->ids)->update(['exercise_category_id' => $categoryId]);

        return redirect()->back()->with('success', "Latihan berhasil dipindahkan ke kategori.");
    }

    // --- Category CRUD ---
    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:exercise_categories,name',
        ]);

        ExerciseCategory::create($request->only('name'));
        
        return redirect()->back()->with('success', 'Kategori latihan berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, ExerciseCategory $exerciseCategory)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:exercise_categories,name,' . $exerciseCategory->id,
        ]);

        $exerciseCategory->update($request->only('name'));

        return redirect()->back()->with('success', 'Kategori latihan berhasil diperbarui.');
    }

    public function destroyCategory(ExerciseCategory $exerciseCategory)
    {
        $exerciseCategory->delete();
        return redirect()->back()->with('success', 'Kategori dihapus. Latihan di dalamnya kini tidak berkategori.');
    }
}
