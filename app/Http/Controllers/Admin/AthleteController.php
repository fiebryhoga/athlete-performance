<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Sport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

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
            // Tambahkan profile_photo_url ke respons JSON
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
            // Validasi Foto (opsional, maks 2MB, format gambar)
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
            'profile_photo' => $photoPath, // Simpan path foto
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

        // Cek jika ada foto baru yang diupload
        if ($request->hasFile('profile_photo')) {
            // Hapus foto lama jika ada
            if ($athlete->profile_photo) {
                Storage::disk('public')->delete($athlete->profile_photo);
            }
            // Simpan foto baru
            $dataToUpdate['profile_photo'] = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        $athlete->update($dataToUpdate);

        return redirect()->back()->with('message', 'Data atlet diperbarui.');
    }

    public function destroy($id)
    {
        $athlete = User::findOrFail($id);
        
        // Hapus foto dari server sebelum menghapus data user
        if ($athlete->profile_photo) {
            Storage::disk('public')->delete($athlete->profile_photo);
        }
        
        $athlete->delete();

        return redirect()->back()->with('message', 'Data atlet berhasil dihapus.');
    }

    /**
     * Menampilkan detail & statistik atlet (Read Detail)
     */
    /**
     * Menampilkan detail & statistik atlet (Read Detail)
     */
    public function show($id)
    {
        // 1. Load Data Lengkap dengan Relasi
        $athlete = User::with(['sport', 'performanceTests.results.testItem.category'])->findOrFail($id);

        // 2. Urutkan Tes (Terlama -> Terbaru) untuk perhitungan tren
        $tests = $athlete->performanceTests->sortBy('date')->values();
        $hasData = $tests->count() > 0;

        // 3. Inisialisasi Variable Statistik
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

        // 4. Logika Perhitungan Statistik (Jika ada data tes)
        if ($hasData) {
            $allResults = $tests->flatMap->results;
            
            $stats['highest_score'] = $tests->map(function ($t) {
                return $t->results->avg('score') ?? 0;
            })->max() ?? 0;
            
            $stats['average_score'] = round($allResults->avg('score') ?? 0, 1);
            
            // Ambil Tes Terakhir
            $latestTest = $tests->last();
            
            // --- PERUBAHAN: Ambil hingga 4 tes sebelum tes terbaru ---
            // Slice dari index 0 hingga tepat sebelum tes terbaru (index terakhir), lalu ambil maksimal 4 dari belakang
            $previousTests = $tests->count() > 1 ? $tests->slice(0, -1)->take(-4)->values() : collect();

            if ($latestTest) {
                $stats['latest_score'] = round($latestTest->results->avg('score') ?? 0, 1);
                $stats['latest_date'] = date('d M Y', strtotime($latestTest->date));
                
                // Hitung rata-rata skor dari 4 tes sebelumnya
                $stats['previous_score'] = $previousTests->count() > 0 
                    ? round($previousTests->flatMap->results->avg('score') ?? 0, 1) 
                    : 0;

                // B. Analisis Per Kategori (Untuk Radar Chart & SWOT) - Berdasarkan semua data
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

                // Format Data Radar Chart
                $radarData = $categoryStats->map(function($cat) {
                    return [
                        'subject' => $cat['name'],
                        'A' => $cat['score'], 
                        'B' => 100,           
                        'fullMark' => 100
                    ];
                })->values();

                // C. SWOT Analysis
                $strengths = $categoryStats->filter(function($item) {
                    return $item['score'] > 70;
                })->sortByDesc('score')->values();

                $weaknesses = $categoryStats->filter(function($item) {
                    return $item['score'] <= 70;
                })->sortBy('score')->take(3)->values();

                // D. Perbandingan Kategori (Bar Chart: Latest vs Avg of Previous 4)
                $latestCats = $latestTest->results->groupBy(function($r) {
                    return $r->testItem->category->name ?? 'Uncat';
                })->map(function($i) { return round($i->avg('score'), 1); });

                // Hitung rata-rata skor per kategori dari 4 tes sebelumnya
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

                // E. DETAIL PER ITEM (Tabel Rincian: Latest vs Avg of Previous 4)
                $itemAnalysis = $latestTest->results->map(function($res) use ($previousTests) {
                    $item = $res->testItem;
                    $prevScore = 0;
                    $growth = 0;

                    if ($previousTests->count() > 0) {
                        // Kumpulkan semua hasil dari 4 tes sebelumnya untuk item tes ini
                        $prevItemResults = collect();
                        foreach ($previousTests as $pt) {
                            $resPrev = $pt->results->where('test_item_id', $item->id)->first();
                            if ($resPrev) {
                                $prevItemResults->push($resPrev);
                            }
                        }

                        if ($prevItemResults->count() > 0) {
                            // Rata-rata dari skor tes sebelumnya
                            $prevScore = $prevItemResults->avg('score');
                            
                            if ($prevScore > 0) {
                                $growth = (($res->score - $prevScore) / $prevScore) * 100;
                            }
                        }
                    }

                    return [
                        'id' => $res->id,
                        'name' => $item->name,
                        'category' => $item->category->name ?? '-',
                        'unit' => $item->unit,
                        'target_value' => $item->target_value,
                        'result_value' => $res->result,
                        'score' => round($res->score, 1),
                        'previous_score' => round($prevScore, 1),
                        'growth' => round($growth, 1)
                    ];
                })->values();
            }
        }

        // 5. Data History (Untuk Grafik Area Chart / Log)
        $historyData = $tests->map(function($test) {
            return [
                'date' => date('d/m/y', strtotime($test->date)),
                'full_date' => $test->date, 
                'score' => round($test->results->avg('score') ?? 0, 1),
                'id' => $test->id 
            ];
        })->values();

        // 6. Return ke View Inertia
        return Inertia::render('Admin/Athletes/Show', [
            'athlete' => $athlete,
            'stats' => $stats,
            'radar_data' => $radarData,
            'comparison_data' => $comparisonData,
            'item_analysis' => $itemAnalysis,
            'history_data' => $historyData,
            'strengths' => $strengths,
            'weaknesses' => $weaknesses,
            'has_data' => $hasData
        ]);
    }
}