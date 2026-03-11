<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerformanceTest extends Model
{
    protected $fillable = ['user_id', 'date', 'name', 'notes'];

    public function athlete() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function testResults()
    {
        return $this->hasMany(TestResult::class);
    }

    public function results() {
        return $this->hasMany(TestResult::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
