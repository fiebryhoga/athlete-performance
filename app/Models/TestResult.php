<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    use HasFactory;

    // OPSI 1: Izinkan semua kolom (Paling Aman untuk Development)
    protected $guarded = ['id'];

    // ATAU OPSI 2: Daftarkan satu per satu
    // protected $fillable = [
    //     'performance_test_id',
    //     'test_item_id',
    //     'result', // <--- JANGAN LUPA INI
    //     'score'
    // ];

    public function performanceTest()
    {
        return $this->belongsTo(PerformanceTest::class);
    }

    public function testItem()
    {
        return $this->belongsTo(TestItem::class);
    }
}