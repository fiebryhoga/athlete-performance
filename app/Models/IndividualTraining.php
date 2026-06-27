<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndividualTraining extends Model
{
    protected $fillable = [
        'user_id',
        'coach_id',
        'date',
        'day_number',
        'session_number',
        'training_type',
        'location',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }

    public function programs()
    {
        return $this->hasMany(IndividualTrainingProgram::class);
    }
}
