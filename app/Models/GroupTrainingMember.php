<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupTrainingMember extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function groupTraining()
    {
        return $this->belongsTo(GroupTraining::class);
    }

    public function athlete()
    {
        return $this->belongsTo(User::class, 'athlete_id');
    }
}
