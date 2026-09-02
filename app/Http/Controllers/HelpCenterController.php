<?php

namespace App\Http\Controllers;

use App\Models\HelpCategory;
use App\Models\HelpGuide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HelpCenterController extends Controller
{
    /**
     * Display the Help & Support Center.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $userRole = $user ? $user->role : 'athlete';

        $search = $request->input('search');
        $categorySlug = $request->input('category');
        $roleFilter = $request->input('role'); // Only for superadmin previewing

        $query = HelpGuide::with(['category', 'steps'])
            ->withCount('steps')
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');

        // Non-superadmin users only see published guides for their role or 'all'
        if ($userRole !== 'superadmin') {
            $query->published()->forRole($userRole);
        } elseif ($roleFilter && in_array($roleFilter, ['athlete', 'coach', 'all'])) {
            $query->where('target_role', $roleFilter);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%")
                  ->orWhereHas('steps', function ($stepQuery) use ($search) {
                      $stepQuery->where('title', 'like', "%{$search}%")
                                ->orWhere('description', 'like', "%{$search}%");
                  });
            });
        }

        if ($categorySlug && $categorySlug !== 'all') {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        $guides = $query->get();

        // Get categories that have guides available for the current user
        $categories = HelpCategory::withCount(['guides' => function ($q) use ($userRole) {
            if ($userRole !== 'superadmin') {
                $q->published()->forRole($userRole);
            }
        }])
        ->orderBy('order', 'asc')
        ->get();

        // Popular / recommended guides (e.g. top 3)
        $popularGuides = HelpGuide::with('category')
            ->withCount('steps')
            ->when($userRole !== 'superadmin', fn($q) => $q->published()->forRole($userRole))
            ->orderBy('views_count', 'desc')
            ->orderBy('order', 'asc')
            ->take(3)
            ->get();

        return Inertia::render('Help/Index', [
            'guides' => $guides,
            'categories' => $categories,
            'popularGuides' => $popularGuides,
            'filters' => [
                'search' => $search,
                'category' => $categorySlug,
                'role' => $roleFilter,
            ],
            'userRole' => $userRole,
        ]);
    }

    /**
     * Display a specific help guide.
     */
    public function show(Request $request, $slug)
    {
        $user = $request->user();
        $userRole = $user ? $user->role : 'athlete';

        $guide = HelpGuide::with(['category', 'steps' => function ($q) {
            $q->orderBy('step_number', 'asc');
        }])->where('slug', $slug)->firstOrFail();

        // Check permission for non-superadmin
        if ($userRole !== 'superadmin') {
            if (!$guide->is_published) {
                abort(404);
            }
            if ($guide->target_role !== 'all' && $guide->target_role !== $userRole) {
                abort(403, 'Panduan ini tidak tersedia untuk peran akun Anda.');
            }
        }

        // Increment view count
        $guide->increment('views_count');

        // Fetch related guides
        $relatedGuides = HelpGuide::with('category')
            ->withCount('steps')
            ->where('id', '!=', $guide->id)
            ->when($userRole !== 'superadmin', fn($q) => $q->published()->forRole($userRole))
            ->when($guide->category_id, fn($q) => $q->where('category_id', $guide->category_id))
            ->orderBy('order', 'asc')
            ->take(4)
            ->get();

        return Inertia::render('Help/Show', [
            'guide' => $guide,
            'relatedGuides' => $relatedGuides,
            'userRole' => $userRole,
        ]);
    }
}
