<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminManagementController extends Controller
{
    /**
     * Menampilkan daftar admin
     * INI YANG MENYEBABKAN ERROR JIKA TIDAK ADA
     */
    public function index(Request $request)
    {
        $admins = User::where('role', 'admin')
            ->when($request->search, function($q, $search) {
                $q->where(function($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('athlete_id', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Admins/Index', [
            'admins' => $admins,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Menyimpan admin baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'athlete_id' => 'required|string|max:50|unique:users,athlete_id',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'name' => $request->name,
            'athlete_id' => $request->athlete_id,
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);

        return redirect()->back()->with('message', 'Admin baru berhasil ditambahkan.');
    }

    /**
     * Mengupdate data admin
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'athlete_id' => ['required', 'string', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
        ]);

        $data = [
            'name' => $request->name,
            'athlete_id' => $request->athlete_id,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->back()->with('message', 'Data admin diperbarui.');
    }

    /**
     * Menghapus admin
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Anda tidak bisa menghapus akun sendiri.']);
        }
        
        $user->delete();
        return redirect()->back()->with('message', 'Admin berhasil dihapus.');
    }
}