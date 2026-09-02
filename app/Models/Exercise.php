<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    protected $fillable = ['name', 'description', 'body_parts', 'images', 'videos', 'exercise_category_id'];

    protected $casts = [
        'body_parts' => 'array',
        'images' => 'array',
        'videos' => 'array',
    ];



    public function category()
    {
        return $this->belongsTo(ExerciseCategory::class, 'exercise_category_id');
    }

    public function packages()
    {
        return $this->belongsToMany(ExercisePackage::class);
    }
}