<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sport;
use App\Models\Category;
use App\Models\Benchmark;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BenchmarkController extends Controller
{
    public function index()
    {
        // Ambil Sport beserta nilai benchmark-nya
        $sports = Sport::with(['benchmarks.category'])->get()->map(function ($sport) {
            $avg = $sport->benchmarks->avg('value');
            $sport->overall_benchmark = round($avg ?? 0, 1);
            return $sport;
        });

        // Ambil semua Kategori untuk referensi form di Modal
        $categories = Category::all();

        return Inertia::render('Admin/Benchmarks/Index', [
            'sports' => $sports,
            'categories' => $categories
        ]);
    }

    // Method Edit halaman terpisah bisa DIHAPUS karena kita pakai modal
    
    public function update(Request $request, Sport $sport)
    {
        $data = $request->validate([
            'benchmarks' => 'required|array',
            'benchmarks.*.category_id' => 'required|exists:categories,id',
            'benchmarks.*.value' => 'required|integer|min:0|max:100',
        ]);

        foreach ($data['benchmarks'] as $item) {
            Benchmark::updateOrCreate(
                [
                    'sport_id' => $sport->id,
                    'category_id' => $item['category_id']
                ],
                [
                    'value' => $item['value']
                ]
            );
        }

        return redirect()->back()->with('message', 'Standar benchmark diperbarui.');
    }
}