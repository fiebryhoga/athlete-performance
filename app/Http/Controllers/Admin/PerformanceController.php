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
    /**
     * Menampilkan daftar History Tes
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        // 1. Ambil list Sport untuk Dropdown Filter
        $sports = Sport::all();

        // 2. Query Dasar
        $query = PerformanceTest::with(['athlete.sport', 'results.testItem.category'])
            ->latest();

        // --- PROTEKSI: Jika Atlet, hanya tampilkan data miliknya sendiri ---
        if ($user->role === 'athlete') {
            $query->where('user_id', $user->id);
        }

        // 3. Filter by Search (Nama Atlet)
        if ($request->search) {
            $query->whereHas('athlete', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        // 4. Filter by Cabor (Sport ID)
        if ($request->sport_id) {
            $query->whereHas('athlete', function($q) use ($request) {
                $q->where('sport_id', $request->sport_id);
            });
        }

        // 5. Eksekusi & Mapping Data
        $tests = $query->get()->map(function ($test) {
            
            // Hitung Rata-rata Skor (0-100)
            $totalScore = $test->results->avg('score') ?? 0;
            $test->average_score = round($totalScore, 1);

            // Grouping Skor per Kategori
            $test->category_scores = $test->results->groupBy(function($res) {
                return $res->testItem->category->name ?? 'Uncategorized';
            })->map(function ($items) {
                return round($items->avg('score') ?? 0, 0);
            });

            // Target Global sekarang adalah 100
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

    /**
     * Helper: Logika penentuan status berdasarkan Skor 0-100
     */
    private function determineStatus($score)
    {
        if ($score >= 85) return ['label' => 'Excellent', 'color' => 'bg-emerald-100 text-emerald-700 border-emerald-200'];
        if ($score >= 70) return ['label' => 'Good', 'color' => 'bg-blue-100 text-blue-700 border-blue-200'];
        if ($score >= 50) return ['label' => 'Fair', 'color' => 'bg-amber-100 text-amber-700 border-amber-200'];
        return ['label' => 'Poor', 'color' => 'bg-red-100 text-red-700 border-red-200'];
    }

    /**
     * Form Pilih Atlet & Tanggal (Tahap 1)
     */
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

    /**
     * Proses Simpan Sesi (Tahap 1 -> Tahap 2)
     */
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

    /**
     * Detail Analisis (Show)
     */
    public function show(PerformanceTest $performanceTest)
    {
        $user = auth()->user();

        // Proteksi Akses
        if ($user->role === 'athlete' && $performanceTest->user_id != $user->id) {
            abort(403, 'Akses Ditolak.');
        }

        // 1. Load Data Utama
        $performanceTest->load(['athlete.sport', 'results.testItem.category']);
        
        
        // 2. Cari Tes Sebelumnya (FIX: Load relasi nested 'results.testItem')
        $previousTest = PerformanceTest::where('user_id', $performanceTest->user_id)
            ->where(function ($query) use ($performanceTest) {
                $query->where('date', '<', $performanceTest->date)
                      ->orWhere(function ($q) use ($performanceTest) {
                          $q->where('date', $performanceTest->date)
                            ->where('id', '<', $performanceTest->id);
                      });
            })
            ->with('results.testItem') // <--- PERBAIKAN DISINI (Tambahkan .testItem)
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->first();

        $currentScore = round($performanceTest->results->avg('score') ?? 0, 2); // 2 Desimal

        

        // 1. ANALISIS DETAIL ITEM (Hitung ini DULUAN untuk data mentah)
        $itemAnalysis = $performanceTest->results->map(function($res) use ($previousTest) {
            $item = $res->testItem; 
            
            // Pastikan score diambil apa adanya (float)
            $rawScore = floatval($res->score);
            
            // Logic Growth
            $prevScore = 0;
            if ($previousTest) {
                $prevRes = $previousTest->results->where('test_item_id', $res->test_item_id)->first();
                $prevScore = $prevRes ? floatval($prevRes->score) : 0;
            }
            
            $growth = ($prevScore > 0) ? (($rawScore - $prevScore) / $prevScore) * 100 : 0;

            return [
                'id' => $res->id,
                'name' => $item ? $item->name : 'Unknown',
                'unit' => $item ? $item->unit : '',
                'category' => ($item && $item->category) ? $item->category->name : 'Uncategorized',
                
                'result_value' => $res->result,
                'target_value' => $item->target_value,
                
                // DISINI KUNCINYA: Jangan dibulatkan jadi int. Biarkan float.
                // Kita kirim raw score agar presisi.
                'score' => $rawScore, 
                
                'previous_score' => round($prevScore, 2),
                'growth' => round($growth, 1),
                'status' => $rawScore >= 80 ? 'Excellent' : ($rawScore >= 60 ? 'Good' : 'Poor')
            ];
        });

        $totalScoreAvg = $itemAnalysis->avg('score');
        $currentScore = round($totalScoreAvg, 2); // Baru dibulatkan 2 desimal di akhir untuk tampilan total

        // 3. DATA RADAR (Ambil rata-rata per kategori dari Item Analysis)
        $categoryAnalysis = $itemAnalysis->groupBy('category')->map(function ($items, $catName) {
            return [
                'name' => $catName,
                'score' => round($items->avg('score'), 2), // Rata-rata kategori, 2 desimal
                'target' => 100,
                'fullMark' => 100,
                // Properti lain untuk tabel kategori bisa ditambahkan jika perlu
                'growth' => round($items->avg('growth'), 1),
                'diff' => round($items->avg('score') - 100, 2)
            ];
        })->values();

        // Format Radar Data untuk Chart
        $radarData = $categoryAnalysis->map(function($cat) {
            return [
                'subject' => $cat['name'],
                'A' => $cat['score'],
                'B' => 100, 
                'fullMark' => 100
            ];
        });

        // History Chart Data
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
                'category_analysis' => $categoryAnalysis, // Kirim ini juga
                'history' => $history ?? [],
                'has_previous' => (bool)$previousTest 
            ]);
        }

    /**
     * Tahap 2: Form Input Nilai
     */
    /**
     * Tahap 2: Form Input Nilai
     */
    public function edit(PerformanceTest $performanceTest)
    {
        // 1. Load Data Sesi & Hasil
        $performanceTest->load(['athlete.sport', 'results']);
        $sportId = $performanceTest->athlete->sport_id;

        // 2. Ambil Kategori & Item Tes (OPTIMIZED QUERY)
        // Kita gunakan 'whereHas' agar hanya mengambil Kategori yang PUNYA item tes di cabor ini.
        // Jadi tidak perlu filter manual di bawah (yang bikin error).
        $categories = Category::whereHas('testItems', function($q) use ($sportId) {
            $q->where('sport_id', $sportId);
        })
        ->with(['testItems' => function($q) use ($sportId) {
            $q->where('sport_id', $sportId);
        }])
        ->get()
        ->map(function($cat) use ($performanceTest) {
            
            // Loop item tes untuk menyuntikkan nilai yang sudah tersimpan (saved_result)
            $cat->testItems->transform(function($item) use ($performanceTest) {
                // Cari apakah sudah ada nilai di database?
                $existingResult = $performanceTest->results->firstWhere('test_item_id', $item->id);
                
                // Inject 'saved_result' (Nilai Asli) agar muncul di form input
                $item->saved_result = $existingResult ? $existingResult->result : '';
                
                // Pastikan properti ini terkirim ke frontend
                $item->target_value = $item->target_value;
                $item->parameter_type = $item->parameter_type;
                
                return $item;
            });
            
            return $cat;
        });

        return Inertia::render('Admin/Performance/Edit', [
            'test' => $performanceTest,
            'categories' => $categories // Tidak perlu ->values() lagi karena ini sudah Collection murni
        ]);
    }
    /**
     * Proses Simpan Nilai Akhir (Update & Kalkulasi Skor Otomatis)
     */
    public function update(Request $request, PerformanceTest $performanceTest)
    {
        $data = $request->validate([
            'scores' => 'required|array',
            'scores.*.test_item_id' => 'required|exists:test_items,id',
            // Gunakan 'present' & 'nullable' agar angka 0 diterima, tapi null ditolak jika perlu logic lain
            // Disini kita pakai nullable|numeric
            'scores.*.result_value' => 'nullable|numeric', 
            'notes' => 'nullable|string'
        ]);

        $performanceTest->update(['notes' => $request->notes]);

        foreach ($data['scores'] as $item) {
            // Cek strict: Jika null atau string kosong, skip. TAPI angka 0 harus lanjut.
            if (!array_key_exists('result_value', $item) || $item['result_value'] === null || $item['result_value'] === '') {
                continue;
            }

            $testItem = TestItem::find($item['test_item_id']);
            
            // Hitung Skor (Hasilnya Float, misal 92.0634)
            $scoreRaw = $testItem->calculateScore($item['result_value']);

            // Simpan Result (Asli) & Score (Persen)
            TestResult::updateOrCreate(
                [
                    'performance_test_id' => $performanceTest->id,
                    'test_item_id' => $item['test_item_id']
                ],
                [
                    'result' => $item['result_value'], 
                    'score' => $scoreRaw // Simpan desimalnya ke DB
                ]
            );
        }

        return redirect()->route('admin.performance.index')->with('message', 'Data berhasil disimpan!');
    }

    /**
     * Hapus Data Latihan
     */
    public function destroy(PerformanceTest $performanceTest)
    {
        $performanceTest->delete();
        return redirect()->back()->with('message', 'Data latihan berhasil dihapus.');
    }
}