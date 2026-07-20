<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Sport;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the users based on role tab.
     */
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'superadmin'); // default tab
        if (auth()->user()->role === 'coach') {
            $tab = 'athlete';
        }
        
        $sortField = $request->query('sort_field', 'name');
        $sortDirection = $request->query('sort_direction', 'asc');
        
        // Ensure valid sort direction
        $sortDirection = in_array(strtolower($sortDirection), ['asc', 'desc']) ? $sortDirection : 'asc';
        
        // Ensure valid sort field
        $validSortFields = ['name', 'username', 'created_at', 'role'];
        $sortField = in_array($sortField, $validSortFields) ? $sortField : 'name';

        $users = User::where('role', $tab)
            ->with(['coaches', 'sport', 'groups.package', 'package'])
            ->when(auth()->user()->role === 'coach', function($q) {
                $q->whereHas('coaches', function($subQ) {
                    $subQ->where('coach_id', auth()->id());
                });
            })
            ->when($request->search, function($q, $search) {
                $q->where(function($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->withQueryString();

        $sports = Sport::all();
        $coachesList = User::where('role', 'coach')->get();
        $packages = \App\Models\SubscriptionPackage::all();
        $groupsList = \App\Models\TrainingGroup::with(['members', 'coaches', 'package'])->get();
        $allAthletes = User::where('role', 'athlete')->with('sport')->orderBy('name')->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
                'tab' => $tab,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
            'activeTab' => $tab,
            'sports' => $sports,
            'coachesList' => $coachesList,
            'packagesList' => $packages,
            'groupsList' => $groupsList,
            'allAthletes' => $allAthletes,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403, 'Akses Ditolak.');
        $rules = [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users,username',
            'password' => 'required|string|min:6',
            'role' => 'required|in:superadmin,coach,athlete',
        ];

        if ($request->role === 'athlete') {
            $rules['sport_id'] = 'nullable|exists:sports,id';
            $rules['gender'] = 'nullable|in:L,P';
            $rules['age'] = 'nullable|integer';
            $rules['height'] = 'nullable|numeric';
            $rules['weight'] = 'nullable|numeric';
            $rules['training_exp_date'] = 'nullable|date';
            $rules['subscription_package_id'] = 'nullable|exists:subscription_packages,id';
            $rules['coach_ids'] = 'nullable|array|max:2';
            $rules['coach_ids.*'] = 'exists:users,id';
        }

        if ($request->role === 'coach') {
            $rules['is_gym_guard'] = 'nullable|boolean';
        }

        $request->validate($rules);

        $data = [
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ];

        if ($request->role === 'athlete') {
            $data['sport_id'] = $request->sport_id;
            $data['gender'] = $request->gender ?? 'L';
            $data['age'] = $request->age;
            $data['height'] = $request->height;
            $data['weight'] = $request->weight;
            $data['training_exp_date'] = $request->training_exp_date;
            $data['subscription_package_id'] = $request->subscription_package_id;
        }

        $user = User::create($data);

        if ($request->role === 'coach') {
            $user->update(['is_gym_guard' => (bool) $request->is_gym_guard]);
        }

        if ($request->role === 'athlete' && $request->has('coach_ids')) {
            $user->coaches()->sync($request->coach_ids);
        }

        return redirect()->back()->with('message', 'Pengguna baru berhasil ditambahkan.');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        if (auth()->user()->role === 'coach') {
            // Coach only allowed to update physical metrics
            $request->validate([
                'gender' => 'nullable|in:L,P',
                'age' => 'nullable|integer',
                'height' => 'nullable|numeric',
                'weight' => 'nullable|numeric',
                'training_exp_date' => 'nullable|date',
            ]);

            $user->update([
                'gender' => $request->gender ?? 'L',
                'age' => $request->age,
                'height' => $request->height,
                'weight' => $request->weight,
                'training_exp_date' => $request->training_exp_date,
            ]);

            return redirect()->back()->with('message', 'Data fisik klien berhasil diperbarui.');
        }

        $rules = [
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:superadmin,coach,athlete',
        ];

        if ($request->role === 'athlete') {
            $rules['sport_id'] = 'nullable|exists:sports,id';
            $rules['gender'] = 'nullable|in:L,P';
            $rules['age'] = 'nullable|integer';
            $rules['height'] = 'nullable|numeric';
            $rules['weight'] = 'nullable|numeric';
            $rules['training_exp_date'] = 'nullable|date';
            $rules['subscription_package_id'] = 'nullable|exists:subscription_packages,id';
            $rules['coach_ids'] = 'nullable|array|max:2';
            $rules['coach_ids.*'] = 'exists:users,id';
        }

        if ($request->role === 'coach') {
            $rules['is_gym_guard'] = 'nullable|boolean';
        }

        $request->validate($rules);

        $data = [
            'name' => $request->name,
            'username' => $request->username,
            'role' => $request->role,
        ];

        if ($request->role === 'athlete') {
            $data['sport_id'] = $request->sport_id;
            $data['gender'] = $request->gender ?? 'L';
            $data['age'] = $request->age;
            $data['height'] = $request->height;
            $data['weight'] = $request->weight;
            $data['training_exp_date'] = $request->training_exp_date;
            $data['subscription_package_id'] = $request->subscription_package_id;
        }

        // Jika password diisi, maka ubah (Reset Password)
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        if ($request->role === 'coach') {
            $user->update(['is_gym_guard' => (bool) $request->is_gym_guard]);
        }

        if ($request->role === 'athlete' && $request->has('coach_ids')) {
            $user->coaches()->sync($request->coach_ids);
        } else if ($request->role === 'athlete') {
            $user->coaches()->detach();
        }

        return redirect()->back()->with('message', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403, 'Akses Ditolak.');
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Anda tidak bisa menghapus akun Anda sendiri.']);
        }
        
        $user->delete();
        return redirect()->back()->with('message', 'Pengguna berhasil dihapus.');
    }
}
