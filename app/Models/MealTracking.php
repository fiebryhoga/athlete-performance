<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealTracking extends Model
{
    protected $table = 'meal_tracking';

    protected $fillable = [
        'meal_plan_id',
        'user_id',
        'date',
        'tracking_data',
        'compliance_score',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'tracking_data' => 'array',
        'compliance_score' => 'float',
    ];

    public function mealPlan()
    {
        return $this->belongsTo(MealPlan::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
