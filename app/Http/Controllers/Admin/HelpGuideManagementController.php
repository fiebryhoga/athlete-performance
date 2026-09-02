<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HelpCategory;
use App\Models\HelpGuide;
use App\Models\HelpGuideStep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class HelpGuideManagementController extends Controller
{
    /**
     * Display a listing of help guides for Superadmin.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $targetRole = $request->input('target_role');
        $categoryId = $request->input('category_id');
        $status = $request->input('status'); // published, draft

        $query = HelpGuide::with(['category'])
            ->withCount('steps')
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        if ($targetRole && in_array($targetRole, ['athlete', 'coach', 'all'])) {
            $query->where('target_role', $targetRole);
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($status === 'published') {
            $query->where('is_published', true);
        } elseif ($status === 'draft') {
            $query->where('is_published', false);
        }

        $guides = $query->paginate(15)->withQueryString();
        $categories = HelpCategory::orderBy('order', 'asc')->get();

        return Inertia::render('Admin/HelpGuides/Index', [
            'guides' => $guides,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'target_role' => $targetRole,
                'category_id' => $categoryId,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new help guide.
     */
    public function create()
    {
        $categories = HelpCategory::orderBy('order', 'asc')->get();

        return Inertia::render('Admin/HelpGuides/Form', [
            'guide' => null,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created help guide in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:help_guides,slug',
            'category_id' => 'nullable|exists:help_categories,id',
            'target_role' => 'required|in:all,coach,athlete',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'is_published' => 'boolean',
            'order' => 'nullable|integer|min:0',
            'steps' => 'nullable|array',
            'steps.*.step_number' => 'required|integer',
            'steps.*.title' => 'required|string|max:255',
            'steps.*.description' => 'nullable|string',
            'steps.*.tip' => 'nullable|string',
            'steps.*.image' => 'nullable|image|max:5120', // 5MB max
        ]);

        DB::transaction(function () use ($request, $validated) {
            $slug = !empty($validated['slug']) 
                ? Str::slug($validated['slug']) 
                : Str::slug($validated['title']);

            // Ensure unique slug
            $originalSlug = $slug;
            $count = 1;
            while (HelpGuide::where('slug', $slug)->exists()) {
                $slug = "{$originalSlug}-{$count}";
                $count++;
            }

            $guide = HelpGuide::create([
                'category_id' => $validated['category_id'] ?? null,
                'title' => $validated['title'],
                'slug' => $slug,
                'target_role' => $validated['target_role'],
                'summary' => $validated['summary'] ?? null,
                'content' => $validated['content'] ?? null,
                'is_published' => $request->boolean('is_published', true),
                'order' => $validated['order'] ?? 0,
            ]);

            if (!empty($request->steps) && is_array($request->steps)) {
                foreach ($request->steps as $index => $stepData) {
                    $imagePath = null;
                    if ($request->hasFile("steps.{$index}.image")) {
                        $imagePath = $request->file("steps.{$index}.image")->store('help_guides', 'public');
                    }

                    HelpGuideStep::create([
                        'help_guide_id' => $guide->id,
                        'step_number' => $stepData['step_number'] ?? ($index + 1),
                        'title' => $stepData['title'],
                        'description' => $stepData['description'] ?? null,
                        'tip' => $stepData['tip'] ?? null,
                        'image_path' => $imagePath,
                    ]);
                }
            }
        });

        return redirect()->route('admin.help-guides.index')->with('success', 'Panduan berhasil dibuat!');
    }

    /**
     * Show the form for editing the specified help guide.
     */
    public function edit(HelpGuide $helpGuide)
    {
        $helpGuide->load(['category', 'steps' => function ($q) {
            $q->orderBy('step_number', 'asc');
        }]);
        $categories = HelpCategory::orderBy('order', 'asc')->get();

        return Inertia::render('Admin/HelpGuides/Form', [
            'guide' => $helpGuide,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified help guide in storage.
     */
    public function update(Request $request, HelpGuide $helpGuide)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:help_guides,slug,' . $helpGuide->id,
            'category_id' => 'nullable|exists:help_categories,id',
            'target_role' => 'required|in:all,coach,athlete',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'is_published' => 'boolean',
            'order' => 'nullable|integer|min:0',
            'steps' => 'nullable|array',
            'steps.*.id' => 'nullable|integer',
            'steps.*.step_number' => 'required|integer',
            'steps.*.title' => 'required|string|max:255',
            'steps.*.description' => 'nullable|string',
            'steps.*.tip' => 'nullable|string',
            'steps.*.existing_image' => 'nullable|string',
            'steps.*.image' => 'nullable|image|max:5120',
        ]);

        DB::transaction(function () use ($request, $validated, $helpGuide) {
            $slug = !empty($validated['slug']) 
                ? Str::slug($validated['slug']) 
                : Str::slug($validated['title']);

            // Ensure unique slug if changed
            if ($slug !== $helpGuide->slug) {
                $originalSlug = $slug;
                $count = 1;
                while (HelpGuide::where('slug', $slug)->where('id', '!=', $helpGuide->id)->exists()) {
                    $slug = "{$originalSlug}-{$count}";
                    $count++;
                }
            }

            $helpGuide->update([
                'category_id' => $validated['category_id'] ?? null,
                'title' => $validated['title'],
                'slug' => $slug,
                'target_role' => $validated['target_role'],
                'summary' => $validated['summary'] ?? null,
                'content' => $validated['content'] ?? null,
                'is_published' => $request->boolean('is_published', true),
                'order' => $validated['order'] ?? 0,
            ]);

            // Track kept step IDs
            $keptStepIds = [];

            if (!empty($request->steps) && is_array($request->steps)) {
                foreach ($request->steps as $index => $stepData) {
                    $stepId = $stepData['id'] ?? null;
                    $stepModel = $stepId ? HelpGuideStep::find($stepId) : null;

                    $imagePath = $stepData['existing_image'] ?? null;

                    // If new image uploaded
                    if ($request->hasFile("steps.{$index}.image")) {
                        // Delete old image if existed
                        if ($stepModel && $stepModel->image_path) {
                            Storage::disk('public')->delete($stepModel->image_path);
                        }
                        $imagePath = $request->file("steps.{$index}.image")->store('help_guides', 'public');
                    } elseif (isset($stepData['remove_image']) && $stepData['remove_image']) {
                        if ($stepModel && $stepModel->image_path) {
                            Storage::disk('public')->delete($stepModel->image_path);
                        }
                        $imagePath = null;
                    }

                    if ($stepModel && $stepModel->help_guide_id == $helpGuide->id) {
                        $stepModel->update([
                            'step_number' => $stepData['step_number'] ?? ($index + 1),
                            'title' => $stepData['title'],
                            'description' => $stepData['description'] ?? null,
                            'tip' => $stepData['tip'] ?? null,
                            'image_path' => $imagePath,
                        ]);
                        $keptStepIds[] = $stepModel->id;
                    } else {
                        $newStep = HelpGuideStep::create([
                            'help_guide_id' => $helpGuide->id,
                            'step_number' => $stepData['step_number'] ?? ($index + 1),
                            'title' => $stepData['title'],
                            'description' => $stepData['description'] ?? null,
                            'tip' => $stepData['tip'] ?? null,
                            'image_path' => $imagePath,
                        ]);
                        $keptStepIds[] = $newStep->id;
                    }
                }
            }

            // Remove steps that were deleted in the form
            $deletedSteps = HelpGuideStep::where('help_guide_id', $helpGuide->id)
                ->whereNotIn('id', $keptStepIds)
                ->get();

            foreach ($deletedSteps as $dStep) {
                if ($dStep->image_path) {
                    Storage::disk('public')->delete($dStep->image_path);
                }
                $dStep->delete();
            }
        });

        return redirect()->route('admin.help-guides.index')->with('success', 'Panduan berhasil diperbarui!');
    }

    /**
     * Remove the specified help guide from storage.
     */
    public function destroy(HelpGuide $helpGuide)
    {
        foreach ($helpGuide->steps as $step) {
            if ($step->image_path) {
                Storage::disk('public')->delete($step->image_path);
            }
        }

        $helpGuide->delete();

        return redirect()->route('admin.help-guides.index')->with('success', 'Panduan berhasil dihapus!');
    }

    /**
     * Toggle the published status of a guide.
     */
    public function togglePublish(HelpGuide $helpGuide)
    {
        $helpGuide->update([
            'is_published' => !$helpGuide->is_published,
        ]);

        return redirect()->back()->with('success', 'Status publikasi panduan berhasil diperbarui!');
    }
}
