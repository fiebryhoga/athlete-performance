<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndividualTraining extends Model
{
    protected $fillable = [
        'user_id',
        'coach_id',
        'coach_ids',
        'date',
        'day_number',
        'session_number',
        'name',
        'training_type',
        'location',
        'status',
        'athlete_rpe',
        'duration_minutes',
        'coach_notes',
        'is_completed',
        'completed_at',
        'athlete_note',
        'proof_photo',
        'is_extra',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
        'coach_ids' => 'array',
        'date' => 'date:Y-m-d',
        'is_extra' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }

    // NEW: Hierarchical block structure (ISMS-style)
    public function blocks()
    {
        return $this->hasMany(TrainingBlock::class)->orderBy('sort_order');
    }

    public function rpeRecords()
    {
        return $this->hasMany(IndividualTrainingRpeRecord::class);
    }

    // LEGACY: Keep for data migration, remove later
    public function programs()
    {
        return $this->hasMany(IndividualTrainingProgram::class);
    }
}
