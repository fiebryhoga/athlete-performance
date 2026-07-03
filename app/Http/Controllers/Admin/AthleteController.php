<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Sport;
use App\Models\AthleteGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon; 

class AthleteController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->where('role', 'athlete')->with(['sport', 'coaches']);

        if (auth()->user()->role === 'coach') {
            $query->whereHas('coaches', function($q) {
                $q->where('coach_id', auth()->id());
            });
        }

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('username', 'like', '%'.$request->search.'%');
            });
        }

        $coaches = User::where('role', 'coach')->get(['id', 'name']);

        return Inertia::render('Admin/Athletes/Index', [
            'athletes' => $query->latest()->paginate(10)->through(function ($athlete) {
                $athlete->profile_photo_url = $athlete->profile_photo_url; 
                return $athlete;
            })->withQueryString(),
            
            'sports' => Sport::all(),
            'coachesList' => $coaches,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
            'sport_id' => 'nullable|exists:sports,id',
            'gender' => 'required|in:L,P',
            'age' => 'nullable|integer',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'training_exp_date' => 'nullable|date',
            'subscription_package_id' => 'nullable|exists:subscription_packages,id',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'coach_ids' => 'nullable|array|max:2',
            'coach_ids.*' => 'exists:users,id'
        ]);

        $photoPath = null;
        if ($request->hasFile('profile_photo')) {
            $photoPath = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role' => 'athlete', 
            'sport_id' => $validated['sport_id'],
            'gender' => $validated['gender'],
            'age' => $validated['age'],
            'height' => $validated['height'],
            'weight' => $validated['weight'],
            'training_exp_date' => $validated['training_exp_date'] ?? null,
            'subscription_package_id' => $validated['subscription_package_id'] ?? null,
            'profile_photo' => $photoPath,
        ]);

        if (isset($validated['coach_ids'])) {
            $user->coaches()->sync($validated['coach_ids']);
        }

        return redirect()->back()->with('message', 'Atlet berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $athlete = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'username' => [
                'sometimes',
                'required', 
                'string',
                Rule::unique('users', 'username')->ignore($athlete->id)
            ],
            'password' => 'nullable|string|min:6',
            'sport_id' => 'nullable|exists:sports,id',
            'gender' => 'sometimes|required|in:L,P',
            'age' => 'nullable|integer',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'training_exp_date' => 'nullable|date',
            'subscription_package_id' => 'nullable|exists:subscription_packages,id',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'coach_ids' => 'nullable|array|max:2',
            'coach_ids.*' => 'exists:users,id'
        ]);

        $dataToUpdate = [];
        if ($request->has('name')) $dataToUpdate['name'] = $request->name;
        if ($request->has('username')) $dataToUpdate['username'] = $request->username;
        if ($request->has('sport_id')) $dataToUpdate['sport_id'] = $request->sport_id;
        if ($request->has('gender')) $dataToUpdate['gender'] = $request->gender;
        if ($request->has('age')) $dataToUpdate['age'] = $request->age;
        if ($request->has('height')) $dataToUpdate['height'] = $request->height;
        if ($request->has('weight')) $dataToUpdate['weight'] = $request->weight;
        if ($request->has('training_exp_date')) $dataToUpdate['training_exp_date'] = $request->training_exp_date;
        if ($request->has('subscription_package_id')) $dataToUpdate['subscription_package_id'] = $request->subscription_package_id;

        if ($request->filled('password')) {
            $dataToUpdate['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('profile_photo')) {
            if ($athlete->profile_photo) {
                Storage::disk('public')->delete($athlete->profile_photo);
            }
            $dataToUpdate['profile_photo'] = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        $athlete->update($dataToUpdate);

        if ($request->has('coach_ids')) {
            $athlete->coaches()->sync($request->coach_ids ?? []);
        }

        return redirect()->back()->with('message', 'Data atlet diperbarui.');
    }

    public function destroy($id)
    {
        $athlete = User::findOrFail($id);
        
        if ($athlete->profile_photo) {
            Storage::disk('public')->delete($athlete->profile_photo);
        }
        
        $athlete->delete();

        return redirect()->back()->with('message', 'Data atlet berhasil dihapus.');
    }

    
    public function show($id)
    {
        $athlete = User::with(['sport', 'performanceTests.results.testItem.category'])->findOrFail($id);

        $tests = $athlete->performanceTests->sortBy('date')->values();
        $hasData = $tests->count() > 0;

        $stats = [
            'total_sessions' => $tests->count(),
            'highest_score' => 0,
            'average_score' => 0,
            'latest_score' => 0,
            'previous_score' => 0,
            'latest_date' => '-'
        ];

        $radarData = [];
        $comparisonData = []; 
        $itemAnalysis = []; 
        $strengths = [];
        $weaknesses = [];
        $historicalLabels = collect();

        if ($hasData) {
            $allResults = $tests->flatMap->results;
            
            $stats['highest_score'] = $tests->map(function ($t) {
                return $t->results->avg('score') ?? 0;
            })->max() ?? 0;
            
            $stats['average_score'] = round($allResults->avg('score') ?? 0, 1);
            
            $latestTest = $tests->last();
            
            
            $previousTests = $tests->count() > 1 ? $tests->slice(0, -1)->take(-4)->values() : collect();

            if ($latestTest) {
                $stats['latest_score'] = round($latestTest->results->avg('score') ?? 0, 1);
                $stats['latest_date'] = date('d M Y', strtotime($latestTest->date));
                
                $stats['previous_score'] = $previousTests->count() > 0 
                    ? round($previousTests->last()->results->avg('score') ?? 0, 1) 
                    : 0;

                
                if ($previousTests->count() > 0) {
                    $historicalLabels = $previousTests->map(function($pt, $index) {
                        return [
                            'key' => 'prev_' . $index,
                            'name' => Carbon::parse($pt->date)->format('d M y'),
                        ];
                    });
                }

                
                $categoryStats = $allResults->groupBy(function($res) {
                        return $res->testItem->category->name ?? 'Uncategorized';
                    })
                    ->map(function ($items, $catName) {
                        $avg = round($items->avg('score'), 1);
                        return [
                            'name' => $catName,
                            'score' => $avg,
                            'target' => 100, 
                            'gap' => $avg - 100
                        ];
                    });

                $radarData = $categoryStats->map(function($cat) {
                    return [
                        'subject' => $cat['name'],
                        'A' => $cat['score'], 
                        'B' => 100,           
                        'fullMark' => 100
                    ];
                })->values();

                $strengths = $categoryStats->filter(function($item) {
                    return $item['score'] > 70;
                })->sortByDesc('score')->values();

                $weaknesses = $categoryStats->filter(function($item) {
                    return $item['score'] <= 70;
                })->sortBy('score')->take(3)->values();

                
                $latestCats = $latestTest->results->groupBy(function($r) {
                    return $r->testItem->category->name ?? 'Uncat';
                })->map(function($i) { return round($i->avg('score'), 1); });

                $prevCats = collect();
                if ($previousTests->count() > 0) {
                    $prevCats = $previousTests->flatMap->results->groupBy(function($r) {
                        return $r->testItem->category->name ?? 'Uncat';
                    })->map(function($i) { return round($i->avg('score'), 1); });
                }
                
                $allCatNames = $latestCats->keys()->merge($prevCats->keys())->unique();
                
                $comparisonData = $allCatNames->map(function($catName) use ($latestCats, $prevCats) {
                    return [
                        'name' => $catName,
                        'latest' => $latestCats->get($catName) ?? 0,
                        'previous' => $prevCats->get($catName) ?? 0,
                    ];
                })->values();

                
                $itemAnalysis = $latestTest->results->map(function($res) use ($previousTests) {
                    $item = $res->testItem;
                    $rawScore = floatval($res->score);
                    $prevScoreForGrowth = 0;
                    $growth = 0;

                    $data = [
                        'id' => $res->id,
                        'name' => $item->name,
                        'category' => $item->category->name ?? '-',
                        'unit' => $item->unit,
                        'target_value' => $item->target_value,
                        'result_value' => $res->result,
                        'score' => round($rawScore, 1)
                    ];

                    if ($previousTests->count() > 0) {
                        foreach ($previousTests as $index => $pt) {
                            $resPrev = $pt->results->where('test_item_id', $item->id)->first();
                            $pScore = $resPrev ? floatval($resPrev->score) : 0;
                            
                            $data['prev_' . $index] = round($pScore, 1);
                            
                            
                            if ($index === $previousTests->count() - 1) {
                                $prevScoreForGrowth = $pScore;
                            }
                        }

                        if ($prevScoreForGrowth > 0) {
                            $growth = (($rawScore - $prevScoreForGrowth) / $prevScoreForGrowth) * 100;
                        }
                    }

                    $data['previous_score'] = round($prevScoreForGrowth, 1);
                    $data['growth'] = round($growth, 1);

                    return $data;
                })->values();
            }
        }

        $historyData = $tests->map(function($test) {
            return [
                'date' => date('d/m/y', strtotime($test->date)),
                'full_date' => $test->date, 
                'score' => round($test->results->avg('score') ?? 0, 1),
                'id' => $test->id 
            ];
        })->values();

        $athlete->load(['galleries' => function($query) {
            $query->latest(); // Urutkan foto terbaru di atas
        }]);

        return Inertia::render('Admin/Athletes/Show', [
            'athlete' => $athlete,
            'stats' => $stats,
            'radar_data' => $radarData,
            'comparison_data' => $comparisonData,
            'item_analysis' => $itemAnalysis,
            'history_data' => $historyData,
            'strengths' => $strengths,
            'weaknesses' => $weaknesses,
            'has_data' => $hasData,
            'historical_labels' => $historicalLabels 
        ]);
    }

    public function storeGallery(Request $request, User $user)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*.file' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // Max 5MB
            'photos.*.notes' => 'nullable|string'
        ]);

        foreach ($request->photos as $photoData) {
            if (isset($photoData['file'])) {
                $path = $photoData['file']->store('athlete_galleries', 'public');
                
                AthleteGallery::create([
                    'user_id' => $user->id,
                    'image_path' => '/storage/' . $path,
                    'notes' => $photoData['notes'] ?? null
                ]);
            }
        }

        return redirect()->back()->with('message', 'Foto biometrik berhasil ditambahkan!');
    }

    public function destroyGallery(AthleteGallery $gallery)
    {
        // Hapus file fisik dari storage
        $path = str_replace('/storage/', '', $gallery->image_path);
        Storage::disk('public')->delete($path);
        
        // Hapus dari database
        $gallery->delete();

        return redirect()->back()->with('message', 'Foto berhasil dihapus.');
    }

    public function updateGallery(Request $request, \App\Models\AthleteGallery $gallery)
{
    $request->validate([
        'notes' => 'nullable|string'
    ]);

    $gallery->update([
        'notes' => $request->notes
    ]);

    return redirect()->back()->with('message', 'Catatan foto berhasil diperbarui.');
}
}