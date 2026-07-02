<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndividualTrainingRpeRecord extends Model
{
    protected $fillable = [
        'individual_training_id',
        'training_block_item_id',
        'rpe_data',
    ];

    protected $casts = [
        'rpe_data' => 'array',
    ];

    public function training()
    {
        return $this->belongsTo(IndividualTraining::class, 'individual_training_id');
    }

    public function blockItem()
    {
        return $this->belongsTo(TrainingBlockItem::class, 'training_block_item_id');
    }
}
