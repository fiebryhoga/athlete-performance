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
        
        $categories = Category::with(['testItems' => function($query) use ($sport) {
            $query->where('sport_id', $sport->id)->orderBy('id');
        }])->get();

        
        $parameterOptions = TestItem::PARAMS;

        return Inertia::render('Admin/Sports/Show', [
            'sport' => $sport,
            'categories' => $categories,
            'parameterOptions' => $parameterOptions 
        ]);
    }

    
    public function storeTestItem(Request $request, Sport $sport)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            
            'parameter_type' => ['required', Rule::in(array_keys(TestItem::PARAMS))], 
            'unit' => 'nullable|string', 
            'target_value' => 'required|numeric|min:0', 
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

    
    public function destroyTestItem(TestItem $testItem)
    {
        $testItem->delete();
        return back()->with('message', 'Item latihan dihapus.');
    }

    public function destroy(Sport $sport)
    {
        
        DB::transaction(function () use ($sport) {
            
            
            
            $testItemIds = $sport->testItems()->pluck('id');

            if ($testItemIds->isNotEmpty()) {
                
                
                $impactedSessionIds = TestResult::whereIn('test_item_id', $testItemIds)
                    ->pluck('performance_test_id')
                    ->unique();

                
                
                TestResult::whereIn('test_item_id', $testItemIds)->delete();

                
                
                
                if ($impactedSessionIds->isNotEmpty()) {
                    PerformanceTest::whereIn('id', $impactedSessionIds)
                        ->doesntHave('results') 
                        ->delete();
                }
            }

            
            
            $sport->testItems()->delete();

            
            
            
            $sport->athletes()->update(['sport_id' => null]);

            
            $sport->delete();
        });

        return back()->with('message', 'Cabor dihapus. Seluruh riwayat latihan terkait juga telah dibersihkan.');
    }
}