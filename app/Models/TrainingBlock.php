<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingBlock extends Model
{
    protected $fillable = [
        'individual_training_id',
        'step',
        'category',
        'target_filled_by',
        'title',
        'description',
        'sort_order',
    ];

    public function training()
    {
        return $this->belongsTo(IndividualTraining::class, 'individual_training_id');
    }

    public function items()
    {
        return $this->hasMany(TrainingBlockItem::class)->orderBy('sort_order');
    }
}
