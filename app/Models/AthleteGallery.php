<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AthleteGallery extends Model
{
    protected $fillable = ['user_id', 'image_path', 'notes'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}