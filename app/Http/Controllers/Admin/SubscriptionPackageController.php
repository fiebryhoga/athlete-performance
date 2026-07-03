<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SubscriptionPackage;

class SubscriptionPackageController extends Controller
{
    public function index()
    {
        abort_if(auth()->user()->role !== 'superadmin', 403, 'Akses Ditolak.');

        $packages = SubscriptionPackage::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Packages/Index', [
            'packages' => $packages,
        ]);
    }

    public function store(Request $request)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403, 'Akses Ditolak.');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'session_count' => 'required|integer|min:1',
            'coach_fee_per_session' => 'required|integer|min:0',
            'price' => 'nullable|integer|min:0',
        ]);

        SubscriptionPackage::create($validated);

        return redirect()->back()->with('message', 'Paket latihan berhasil ditambahkan.');
    }

    public function update(Request $request, SubscriptionPackage $package)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403, 'Akses Ditolak.');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'session_count' => 'required|integer|min:1',
            'coach_fee_per_session' => 'required|integer|min:0',
            'price' => 'nullable|integer|min:0',
        ]);

        $package->update($validated);

        return redirect()->back()->with('message', 'Paket latihan berhasil diperbarui.');
    }

    public function destroy(SubscriptionPackage $package)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403, 'Akses Ditolak.');

        $package->delete();

        return redirect()->back()->with('message', 'Paket latihan berhasil dihapus.');
    }
}
