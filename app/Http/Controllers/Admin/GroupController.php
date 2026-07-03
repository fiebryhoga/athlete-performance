<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TrainingGroup;

class GroupController extends Controller
{
    public function store(Request $request)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subscription_package_id' => 'nullable|exists:subscription_packages,id',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
            'coach_ids' => 'nullable|array',
            'coach_ids.*' => 'exists:users,id'
        ]);

        $group = TrainingGroup::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'subscription_package_id' => $validated['subscription_package_id'] ?? null,
        ]);

        if (!empty($validated['member_ids'])) {
            $group->members()->sync($validated['member_ids']);
        }
        
        if (!empty($validated['coach_ids'])) {
            $group->coaches()->sync($validated['coach_ids']);
        }

        return redirect()->back()->with('message', 'Grup berhasil dibuat.');
    }

    public function update(Request $request, TrainingGroup $group)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subscription_package_id' => 'nullable|exists:subscription_packages,id',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:users,id',
            'coach_ids' => 'nullable|array',
            'coach_ids.*' => 'exists:users,id'
        ]);

        $group->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'subscription_package_id' => $validated['subscription_package_id'] ?? null,
        ]);

        if (isset($validated['member_ids'])) {
            $group->members()->sync($validated['member_ids']);
        } else {
            $group->members()->detach();
        }

        if (isset($validated['coach_ids'])) {
            $group->coaches()->sync($validated['coach_ids']);
        } else {
            $group->coaches()->detach();
        }

        return redirect()->back()->with('message', 'Grup berhasil diperbarui.');
    }

    public function destroy(TrainingGroup $group)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403);
        
        $group->delete();
        
        return redirect()->back()->with('message', 'Grup berhasil dihapus.');
    }
}
