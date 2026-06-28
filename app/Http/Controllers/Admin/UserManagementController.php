<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the users based on role tab.
     */
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'superadmin'); // default tab
        
        $users = User::where('role', $tab)
            ->when($request->search, function($q, $search) {
                $q->where(function($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('athlete_id', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'tab']),
            'activeTab' => $tab,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'athlete_id' => 'required|string|max:50|unique:users,athlete_id',
            'password' => 'required|string|min:6',
            'role' => 'required|in:superadmin,coach,athlete',
        ]);

        User::create([
            'name' => $request->name,
            'athlete_id' => $request->athlete_id,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->back()->with('message', 'Pengguna baru berhasil ditambahkan.');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'athlete_id' => ['required', 'string', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:superadmin,coach,athlete',
        ]);

        $data = [
            'name' => $request->name,
            'athlete_id' => $request->athlete_id,
            'role' => $request->role,
        ];

        // Jika password diisi, maka ubah (Reset Password)
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->back()->with('message', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Anda tidak bisa menghapus akun Anda sendiri.']);
        }
        
        $user->delete();
        return redirect()->back()->with('message', 'Pengguna berhasil dihapus.');
    }
}
