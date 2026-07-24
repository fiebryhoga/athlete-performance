<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealPlan extends Model
{
    protected $fillable = [
        'user_id',
        'coach_id',
        'start_date',
        'end_date',
        'recommendation',
        'target_calories',
        'protein_target',
        'carbs_target',
        'fats_target',
        'weekly_plan',
        'hydration_plan',
        'supplements_plan',
        'notes',
        'warnings',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'weekly_plan' => 'array',
        'hydration_plan' => 'array',
        'supplements_plan' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }
}
