<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    use HasFactory;

    
    protected $guarded = ['id'];

    
    
    
    
    
    
    

    public function performanceTest()
    {
        return $this->belongsTo(PerformanceTest::class);
    }

    public function testItem()
    {
        return $this->belongsTo(TestItem::class);
    }
}