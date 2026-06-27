<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndividualTrainingProgram extends Model
{
    protected $fillable = [
        'individual_training_id',
        'phase',
        'logic',
        'exercise_id',
        'sets',
        'reps',
        'duration',
        'rest',
        'intensity',
        'notes',
        'order',
    ];

    public function individualTraining()
    {
        return $this->belongsTo(IndividualTraining::class);
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class, 'exercise_id');
    }
}
