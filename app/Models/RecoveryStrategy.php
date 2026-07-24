<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecoveryStrategy extends Model
{
    protected $fillable = [
        'user_id',
        'coach_id',
        'type',
        'scheduled_date',
        'notes',
        'is_completed',
        'athlete_note',
    ];

    protected $casts = [
        'scheduled_date' => 'date:Y-m-d',
        'is_completed' => 'boolean',
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
