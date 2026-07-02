<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingBlockItem extends Model
{
    protected $fillable = [
        'training_block_id',
        'exercise_id',
        'note',
        'load',
        'load_unit',
        'sets',
        'reps',
        'reps_unit',
        'duration',
        'tempo',
        'rir',
        'rest_per_set',
        'intensity',
        'sort_order',
        'reps_array',
        'load_array',
        'distance_array',
        'minutes_array',
        'tempo_array',
        'rir_array',
        'rest_per_set_array',
    ];

    protected $casts = [
        'reps_array' => 'array',
        'load_array' => 'array',
        'distance_array' => 'array',
        'minutes_array' => 'array',
        'tempo_array' => 'array',
        'rir_array' => 'array',
        'rest_per_set_array' => 'array',
    ];

    public function block()
    {
        return $this->belongsTo(TrainingBlock::class, 'training_block_id');
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
