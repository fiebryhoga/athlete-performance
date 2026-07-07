<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhvAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'assessment_date',
        'age',
        'weight',
        'standing_height',
        'sitting_height',
        'leg_length',
        'maturity_offset',
        'phv_age',
        'maturity_status',
        'remaining_growth',
        'predicted_adult_height',
        'adult_height_percentage',
    ];

    protected $casts = [
        'assessment_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
