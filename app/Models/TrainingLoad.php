<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingLoad extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'record_date',
        'sleep_quality',
        'fatigue',
        'muscle_soreness',
        'stress',
        'motivation',
        'health',
        'mood',
        'study_attitude',
        'wellness_score',
        'am_session_type',
        'am_rpe',
        'am_duration',
        'am_load',
        'pm_session_type',
        'pm_rpe',
        'pm_duration',
        'pm_load',
        'daily_load',
        'notes',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}