<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Sport;
use App\Models\SubscriptionPackage;
use App\Models\TrainingGroup;

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
            ->withCount('athletes')
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
            ->paginate($request->query('per_page', 25))
            ->withQueryString();

        $sports = Sport::all();
        $coachesList = User::where('role', 'coach')->get();
        $packages = \App\Models\SubscriptionPackage::all();
        $groupsList = \App\Models\TrainingGroup::with(['members', 'coaches', 'package'])->get();
        $allAthletes = User::where('role', 'athlete')->with('sport')->orderBy('name')->get();

        $tabCounts = [
            'superadmin' => User::where('role', 'superadmin')->count(),
            'coach' => User::where('role', 'coach')->count(),
            'athlete' => auth()->user()->role === 'coach'
                ? User::where('role', 'athlete')->whereHas('coaches', fn($subQ) => $subQ->where('coach_id', auth()->id()))->count()
                : User::where('role', 'athlete')->count(),
            'group' => \App\Models\TrainingGroup::count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
                'tab' => $tab,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
            'activeTab' => $tab,
            'tabCounts' => $tabCounts,
            'sports' => $sports,
            'coachesList' => $coachesList,
            'packagesList' => $packages,
            'groupsList' => $groupsList,
            'allAthletes' => $allAthletes,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(Request $request)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403, 'Akses Ditolak.');

        $sports = Sport::orderBy('name')->get();
        $coachesList = User::where('role', 'coach')->select('id', 'name', 'profile_photo')->get();
        $packages = SubscriptionPackage::orderBy('name')->get();

        $defaultRole = $request->query('role', 'athlete');
        if (!in_array($defaultRole, ['superadmin', 'coach', 'athlete'])) {
            $defaultRole = 'athlete';
        }

        return Inertia::render('Admin/Users/Form', [
            'mode' => 'create',
            'defaultRole' => $defaultRole,
            'sports' => $sports,
            'coachesList' => $coachesList,
            'packagesList' => $packages,
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
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
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
            $rules['gym_fee'] = 'nullable|numeric|min:0';
        }

        $request->validate($rules);

        $photoPath = null;
        if ($request->hasFile('profile_photo')) {
            $photoPath = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        $data = [
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'profile_photo' => $photoPath,
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
            $user->update([
                'is_gym_guard' => (bool) $request->is_gym_guard,
                'gym_fee' => $request->filled('gym_fee') && $request->gym_fee > 0 ? (int)$request->gym_fee : null,
            ]);
        }

        if ($request->role === 'athlete' && $request->has('coach_ids')) {
            $user->coaches()->sync($request->coach_ids);
        }

        return redirect()->route('admin.users.index', ['tab' => $user->role])->with('message', 'Pengguna baru berhasil ditambahkan.');
    }

    /**
     * Show the form for bulk creating users.
     */
    public function bulkCreate()
    {
        abort_if(auth()->user()->role !== 'superadmin', 403, 'Akses Ditolak.');
        return Inertia::render('Admin/Users/BulkCreate');
    }

    /**
     * Store multiple newly created users (clients) from bulk upload.
     */
    public function bulkStore(Request $request)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403, 'Akses Ditolak.');
        
        $request->validate([
            'users' => 'required|array',
            'users.*.name' => 'required|string|max:255',
            'users.*.username' => 'nullable|string|max:50',
            'users.*.password' => 'nullable|string|min:6',
            'users.*.age' => 'nullable|integer',
            'users.*.weight' => 'nullable|numeric',
            'users.*.height' => 'nullable|numeric',
            'users.*.gender' => 'nullable|in:L,P',
        ]);

        $createdCount = 0;

        foreach ($request->users as $userData) {
            $name = $userData['name'];
            $username = $userData['username'] ?? null;
            
            if (empty($username)) {
                // Generate username from name: remove spaces, lowercase.
                $base = \Illuminate\Support\Str::slug($name, '');
                $username = $base;
                $counter = 1;
                while (User::where('username', $username)->exists()) {
                    $username = $base . $counter;
                    $counter++;
                }
            } else {
                // Check if username exists, if it does, append counter
                if (User::where('username', $username)->exists()) {
                    $counter = 1;
                    $original = $username;
                    while (User::where('username', $username)->exists()) {
                        $username = $original . $counter;
                        $counter++;
                    }
                }
            }

            User::create([
                'name' => $name,
                'username' => $username,
                'password' => Hash::make(empty($userData['password']) ? '12345678' : $userData['password']),
                'role' => 'athlete',
                'age' => $userData['age'] ?? null,
                'weight' => $userData['weight'] ?? null,
                'height' => $userData['height'] ?? null,
                'gender' => $userData['gender'] ?? 'L',
            ]);
            
            $createdCount++;
        }

        return redirect()->route('admin.users.index', ['tab' => 'athlete'])->with('message', $createdCount . ' pengguna baru (klien) berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        if (auth()->user()->role !== 'superadmin' && auth()->user()->role !== 'coach') {
            abort(403, 'Akses Ditolak.');
        }

        $user->load(['sport', 'coaches:id,name', 'package', 'groups']);

        $sports = Sport::orderBy('name')->get();
        $coachesList = User::where('role', 'coach')->select('id', 'name', 'profile_photo')->get();
        $packages = SubscriptionPackage::orderBy('name')->get();

        return Inertia::render('Admin/Users/Form', [
            'mode' => 'edit',
            'targetUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
                'sport_id' => $user->sport_id ? (string)$user->sport_id : '',
                'gender' => $user->gender ?? 'L',
                'age' => $user->age ?? '',
                'height' => $user->height ?? '',
                'weight' => $user->weight ?? '',
                'training_exp_date' => $user->training_exp_date ? \Carbon\Carbon::parse($user->training_exp_date)->format('Y-m-d') : '',
                'subscription_package_id' => $user->subscription_package_id ? (string)$user->subscription_package_id : '',
                'is_gym_guard' => (bool)$user->is_gym_guard,
                'gym_fee' => $user->gym_fee ?? '',
                'profile_photo_url' => $user->profile_photo_url,
                'coach_ids' => $user->coaches->pluck('id')->toArray(),
            ],
            'sports' => $sports,
            'coachesList' => $coachesList,
            'packagesList' => $packages,
        ]);
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

            return redirect()->route('admin.users.index', ['tab' => 'athlete'])->with('message', 'Data fisik klien berhasil diperbarui.');
        }

        $rules = [
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:superadmin,coach,athlete',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
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
            $rules['gym_fee'] = 'nullable|numeric|min:0';
        }

        $request->validate($rules);

        $data = [
            'name' => $request->name,
            'username' => $request->username,
            'role' => $request->role,
        ];

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->profile_photo);
            }
            $data['profile_photo'] = $request->file('profile_photo')->store('profile-photos', 'public');
        }

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
            $user->update([
                'is_gym_guard' => (bool) $request->is_gym_guard,
                'gym_fee' => $request->filled('gym_fee') && $request->gym_fee > 0 ? (int)$request->gym_fee : null,
            ]);
        }

        if ($request->role === 'athlete' && $request->has('coach_ids')) {
            $user->coaches()->sync($request->coach_ids);
        } else if ($request->role === 'athlete') {
            $user->coaches()->detach();
        }

        return redirect()->route('admin.users.index', ['tab' => $user->role])->with('message', 'Data pengguna berhasil diperbarui.');
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
