<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Sport;
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
        $query = User::query()->where('role', 'athlete')->with('sport');

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('athlete_id', 'like', '%'.$request->search.'%');
            });
        }

        return Inertia::render('Admin/Athletes/Index', [
            'athletes' => $query->latest()->paginate(10)->through(function ($athlete) {
                $athlete->profile_photo_url = $athlete->profile_photo_url; 
                return $athlete;
            })->withQueryString(),
            
            'sports' => Sport::all(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'athlete_id' => 'required|string|max:255|unique:users,athlete_id',
            'password' => 'required|string|min:6',
            'sport_id' => 'nullable|exists:sports,id',
            'gender' => 'required|in:L,P',
            'age' => 'nullable|integer',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', 
        ]);

        $photoPath = null;
        if ($request->hasFile('profile_photo')) {
            $photoPath = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        User::create([
            'name' => $validated['name'],
            'athlete_id' => $validated['athlete_id'],
            'password' => Hash::make($validated['password']),
            'role' => 'athlete', 
            'sport_id' => $validated['sport_id'],
            'gender' => $validated['gender'],
            'age' => $validated['age'],
            'height' => $validated['height'],
            'weight' => $validated['weight'],
            'profile_photo' => $photoPath,
        ]);

        return redirect()->back()->with('message', 'Atlet berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $athlete = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'athlete_id' => [
                'required', 
                'string',
                Rule::unique('users', 'athlete_id')->ignore($athlete->id)
            ],
            'password' => 'nullable|string|min:6',
            'sport_id' => 'nullable|exists:sports,id',
            'gender' => 'required|in:L,P',
            'age' => 'nullable|integer',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $dataToUpdate = [
            'name' => $request->name,
            'athlete_id' => $request->athlete_id,
            'sport_id' => $request->sport_id,
            'gender' => $request->gender,
            'age' => $request->age,
            'height' => $request->height,
            'weight' => $request->weight,
        ];

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
}