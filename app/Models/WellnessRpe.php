<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WellnessRpe extends Model
{
    use HasFactory;

    protected $table = 'wellness_rpes';

    protected $fillable = [
        'user_id',
        'record_date',
        'quality_of_sleep',
        'fatigue',
        'muscle_soreness',
        'stress',
        'motivation',
        'health',
        'mood_state',
        'attitude_to_study',
        'daily_wellness_score',
        'am_rpe',
        'am_duration',
        'pm_rpe',
        'pm_duration',
        'daily_load',
        'notes',
        'muscle_pain_areas',
        'sort_order'
    ];

    protected $casts = [
        'record_date' => 'date',
        'muscle_pain_areas' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
