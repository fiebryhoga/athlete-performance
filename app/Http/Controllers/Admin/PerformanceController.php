<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PerformanceTest;
use App\Models\TestResult;
use App\Models\User;
use App\Models\Category;
use App\Models\Sport;
use App\Models\TestItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PerformanceController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $sports = Sport::all();

        $query = PerformanceTest::with(['athlete.sport', 'results.testItem.category'])
            ->latest();

        if ($user->role === 'athlete') {
            $query->where('user_id', $user->id);
        }

        if ($request->search) {
            $query->whereHas('athlete', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->sport_id) {
            $query->whereHas('athlete', function($q) use ($request) {
                $q->where('sport_id', $request->sport_id);
            });
        }

        $tests = $query->get()->map(function ($test) {
            $totalScore = $test->results->avg('score') ?? 0;
            $test->average_score = round($totalScore, 1);

            $test->category_scores = $test->results->groupBy(function($res) {
                return $res->testItem->category->name ?? 'Uncategorized';
            })->map(function ($items) {
                return round($items->avg('score') ?? 0, 0);
            });

            $test->target_score = 100;
            $test->status_label = $this->determineStatus($test->average_score);

            return $test;
        });

        return Inertia::render('Admin/Performance/Index', [
            'tests' => $tests,
            'sports' => $sports,
            'filters' => $request->only(['search', 'sport_id']),
            'auth_role' => $user->role 
        ]);
    }

    private function determineStatus($score)
    {
        if ($score >= 85) return ['label' => 'Excellent', 'color' => 'bg-emerald-100 text-emerald-700 border-emerald-200'];
        if ($score >= 70) return ['label' => 'Good', 'color' => 'bg-blue-100 text-blue-700 border-blue-200'];
        if ($score >= 50) return ['label' => 'Fair', 'color' => 'bg-amber-100 text-amber-700 border-amber-200'];
        return ['label' => 'Poor', 'color' => 'bg-red-100 text-red-700 border-red-200'];
    }

    public function create()
    {
        $athletes = User::where('role', 'athlete')
            ->whereNotNull('sport_id')
            ->with('sport')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'sport_name' => $user->sport->name,
                    'label' => $user->name . ' - ' . $user->sport->name
                ];
            });

        return Inertia::render('Admin/Performance/Create', [
            'athletes' => $athletes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'name' => 'nullable|string',
        ]);

        $testName = $request->name ?? 'Latihan - ' . Carbon::parse($request->date)->format('d M Y');

        $test = PerformanceTest::create([
            'user_id' => $request->user_id,
            'date' => $request->date,
            'name' => $testName,
        ]);

        return redirect()->route('admin.performance.edit', $test->id);
    }

    public function show(PerformanceTest $performanceTest)
    {
        $user = auth()->user();

        if ($user->role === 'athlete' && $performanceTest->user_id != $user->id) {
            abort(403, 'Akses Ditolak.');
        }

        $performanceTest->load(['athlete.sport', 'results.testItem.category']);
        
        // PERBAIKAN: Ambil hingga 4 tes sebelumnya
        $previousTests = PerformanceTest::where('user_id', $performanceTest->user_id)
            ->where(function ($query) use ($performanceTest) {
                $query->where('date', '<', $performanceTest->date)
                      ->orWhere(function ($q) use ($performanceTest) {
                          $q->where('date', $performanceTest->date)
                            ->where('id', '<', $performanceTest->id);
                      });
            })
            ->with('results.testItem')
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->take(4) // Ambil maksimal 4
            ->get()
            ->reverse() // Balikkan array agar urutannya dari yang terlama ke yang terbaru
            ->values();

        $currentScore = round($performanceTest->results->avg('score') ?? 0, 2);

        // Buat Label untuk Grafik Bar dari 4 tes sebelumnya
        $historicalLabels = $previousTests->map(function($pt, $index) {
            return [
                'key' => 'prev_' . $index,
                'name' => Carbon::parse($pt->date)->format('d M y'), // Label format tanggal
            ];
        });

        // Analisis Detail Item
        $itemAnalysis = $performanceTest->results->map(function($res) use ($previousTests) {
            $item = $res->testItem; 
            $rawScore = floatval($res->score);
            
            $data = [
                'id' => $res->id,
                'name' => $item ? $item->name : 'Unknown',
                'unit' => $item ? $item->unit : '',
                'category' => ($item && $item->category) ? $item->category->name : 'Uncategorized',
                'result_value' => $res->result,
                'target_value' => $item->target_value,
                'score' => $rawScore, 
                'status' => $rawScore >= 80 ? 'Excellent' : ($rawScore >= 60 ? 'Good' : 'Poor')
            ];

            // Masukkan data skor dari maksimal 4 tes sebelumnya ke dalam baris ini
            $prevScoreForGrowth = 0; 

            foreach($previousTests as $index => $pt) {
                $prevRes = $pt->results->where('test_item_id', $res->test_item_id)->first();
                $pScore = $prevRes ? floatval($prevRes->score) : 0;
                
                $data['prev_' . $index] = round($pScore, 2);
                
                // Gunakan tes yang Paling Terakhir (index terakhir) untuk perhitungan persentase tabel
                if ($index === $previousTests->count() - 1) {
                    $prevScoreForGrowth = $pScore;
                }
            }

            $growth = ($prevScoreForGrowth > 0) ? (($rawScore - $prevScoreForGrowth) / $prevScoreForGrowth) * 100 : 0;
            
            $data['previous_score'] = round($prevScoreForGrowth, 2);
            $data['growth'] = round($growth, 1);

            return $data;
        });

        $totalScoreAvg = $itemAnalysis->avg('score');
        $currentScore = round($totalScoreAvg, 2); 

        $categoryAnalysis = $itemAnalysis->groupBy('category')->map(function ($items, $catName) {
            return [
                'name' => $catName,
                'score' => round($items->avg('score'), 2),
                'target' => 100,
                'fullMark' => 100,
                'growth' => round($items->avg('growth'), 1),
                'diff' => round($items->avg('score') - 100, 2)
            ];
        })->values();

        $radarData = $categoryAnalysis->map(function($cat) {
            return [
                'subject' => $cat['name'],
                'A' => $cat['score'],
                'B' => 100, 
                'fullMark' => 100
            ];
        });

        $history = PerformanceTest::where('user_id', $performanceTest->user_id)
            ->where('date', '<=', $performanceTest->date)
            ->with('results')
            ->orderBy('date', 'asc')
            ->take(10)
            ->get()
            ->map(function($test) use ($performanceTest) {
                return [
                    'date' => Carbon::parse($test->date)->format('d M'),
                    'score' => round($test->results->avg('score') ?? 0, 1),
                    'is_active' => $test->id === $performanceTest->id
                ];
            });

        return Inertia::render('Admin/Performance/Show', [
            'test' => $performanceTest,
            'current_score' => $currentScore,
            'radar_data' => $radarData,
            'item_analysis' => $itemAnalysis,
            'category_analysis' => $categoryAnalysis, 
            'history' => $history ?? [],
            'has_previous' => $previousTests->count() > 0,
            'historical_labels' => $historicalLabels // Kirim label historical ke React
        ]);
    }

    public function edit(PerformanceTest $performanceTest)
    {
        $performanceTest->load(['athlete.sport', 'results']);
        $sportId = $performanceTest->athlete->sport_id;

        $categories = Category::whereHas('testItems', function($q) use ($sportId) {
            $q->where('sport_id', $sportId);
        })
        ->with(['testItems' => function($q) use ($sportId) {
            $q->where('sport_id', $sportId);
        }])
        ->get()
        ->map(function($cat) use ($performanceTest) {
            $cat->testItems->transform(function($item) use ($performanceTest) {
                $existingResult = $performanceTest->results->firstWhere('test_item_id', $item->id);
                $item->saved_result = $existingResult ? $existingResult->result : '';
                $item->target_value = $item->target_value;
                $item->parameter_type = $item->parameter_type;
                return $item;
            });
            return $cat;
        });

        return Inertia::render('Admin/Performance/Edit', [
            'test' => $performanceTest,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, PerformanceTest $performanceTest)
    {
        $data = $request->validate([
            'scores' => 'required|array',
            'scores.*.test_item_id' => 'required|exists:test_items,id',
            'scores.*.result_value' => 'nullable|numeric', 
            'notes' => 'nullable|string'
        ]);

        $performanceTest->update(['notes' => $request->notes]);

        foreach ($data['scores'] as $item) {
            if (!array_key_exists('result_value', $item) || $item['result_value'] === null || $item['result_value'] === '') {
                continue;
            }

            $testItem = TestItem::find($item['test_item_id']);
            $scoreRaw = $testItem->calculateScore($item['result_value']);

            TestResult::updateOrCreate(
                [
                    'performance_test_id' => $performanceTest->id,
                    'test_item_id' => $item['test_item_id']
                ],
                [
                    'result' => $item['result_value'], 
                    'score' => $scoreRaw 
                ]
            );
        }

        return redirect()->route('admin.performance.index')->with('message', 'Data berhasil disimpan!');
    }

    public function destroy(PerformanceTest $performanceTest)
    {
        $performanceTest->delete();
        return redirect()->back()->with('message', 'Data latihan berhasil dihapus.');
    }
}