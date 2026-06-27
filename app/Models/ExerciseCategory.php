<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExerciseCategory extends Model
{
    protected $fillable = ['name'];

    public function exercises()
    {
        return $this->hasMany(Exercise::class);
    }
}
