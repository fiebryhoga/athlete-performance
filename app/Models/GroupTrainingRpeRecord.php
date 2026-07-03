<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupTrainingRpeRecord extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'rpe_data' => 'array',
    ];

    public function groupTraining()
    {
        return $this->belongsTo(GroupTraining::class);
    }

    public function athlete()
    {
        return $this->belongsTo(User::class, 'athlete_id');
    }

    public function trainingBlockItem()
    {
        return $this->belongsTo(TrainingBlockItem::class);
    }
}
