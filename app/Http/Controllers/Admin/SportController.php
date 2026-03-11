<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TestResult;
use App\Models\PerformanceTest;
use Illuminate\Support\Facades\DB;
use App\Models\Category;
use App\Models\Sport;
use App\Models\TestItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class SportController extends Controller
{
    public function index()
    {
        // Menampilkan list cabor
        $sports = Sport::withCount(['athletes', 'testItems'])->get();
        return Inertia::render('Admin/Sports/Index', ['sports' => $sports]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:sports,name']);
        Sport::create($request->only('name', 'description'));
        return back();
    }

    public function show(Sport $sport)
    {
        // Load kategori dan test item, urutkan biar rapi
        $categories = Category::with(['testItems' => function($query) use ($sport) {
            $query->where('sport_id', $sport->id)->orderBy('id');
        }])->get();

        // Kirim Opsi Parameter ke Frontend untuk Dropdown
        $parameterOptions = TestItem::PARAMS;

        return Inertia::render('Admin/Sports/Show', [
            'sport' => $sport,
            'categories' => $categories,
            'parameterOptions' => $parameterOptions // <-- Kirim ini
        ]);
    }

    // 4. Tambah Latihan (Updated)
    public function storeTestItem(Request $request, Sport $sport)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            // Validasi parameter harus salah satu dari key PARAMS
            'parameter_type' => ['required', Rule::in(array_keys(TestItem::PARAMS))], 
            'unit' => 'nullable|string', // Opsional, misal "Detik" atau "Kali"
            'target_value' => 'required|numeric|min:0', // Nilai Benchmark
        ]);

        $sport->testItems()->create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'parameter_type' => $request->parameter_type,
            'unit' => $request->unit,
            'target_value' => $request->target_value
        ]);

        return back()->with('message', 'Item latihan berhasil ditambahkan.');
    }

    // 5. Update Latihan (BARU - Fitur Edit)
    public function updateTestItem(Request $request, TestItem $testItem)
    {
        $request->validate([
            'name' => 'required|string',
            'parameter_type' => ['required', Rule::in(array_keys(TestItem::PARAMS))],
            'target_value' => 'required|numeric|min:0',
            'unit' => 'nullable|string',
        ]);

        $testItem->update([
            'name' => $request->name,
            'parameter_type' => $request->parameter_type,
            'target_value' => $request->target_value,
            'unit' => $request->unit
        ]);

        return back()->with('message', 'Item latihan diperbarui.');
    }

    // 6. Hapus Latihan
    public function destroyTestItem(TestItem $testItem)
    {
        $testItem->delete();
        return back()->with('message', 'Item latihan dihapus.');
    }

    public function destroy(Sport $sport)
    {
        // Gunakan Transaction agar jika satu gagal, semua batal (Lebih Aman)
        DB::transaction(function () use ($sport) {
            
            // 1. IDENTIFIKASI ITEM TES
            // Ambil semua ID Item Tes milik Cabor ini (misal: Push Up, Lari 100m milik Sepak Bola)
            $testItemIds = $sport->testItems()->pluck('id');

            if ($testItemIds->isNotEmpty()) {
                // 2. CARI SESI YANG TERDAMPAK
                // Kita catat dulu ID sesi latihan yang mengandung item-item ini
                $impactedSessionIds = TestResult::whereIn('test_item_id', $testItemIds)
                    ->pluck('performance_test_id')
                    ->unique();

                // 3. HAPUS NILAI/SKOR (History Detail)
                // Menghapus baris nilai (misal: Adi dapat skor 80 di Push Up)
                TestResult::whereIn('test_item_id', $testItemIds)->delete();

                // 4. HAPUS SESI LATIHAN KOSONG (PerformanceTest)
                // Jika setelah nilai dihapus, sesi latihan itu jadi kosong (tidak ada item lain),
                // maka sesi itu (Judul & Tanggalnya) juga harus dihapus agar tidak jadi sampah.
                if ($impactedSessionIds->isNotEmpty()) {
                    PerformanceTest::whereIn('id', $impactedSessionIds)
                        ->doesntHave('results') // Cek sesi yang jumlah result-nya 0
                        ->delete();
                }
            }

            // 5. HAPUS MASTER ITEM TES
            // Hapus definisi latihannya dari database
            $sport->testItems()->delete();

            // 6. LEPASKAN ATLET (UNASSIGN)
            // Atlet TIDAK DIHAPUS, tapi status cabornya jadi kosong (NULL)
            // Agar akun mereka tetap aman.
            $sport->athletes()->update(['sport_id' => null]);

            // 7. HAPUS CABORNYA
            $sport->delete();
        });

        return back()->with('message', 'Cabor dihapus. Seluruh riwayat latihan terkait juga telah dibersihkan.');
    }
}