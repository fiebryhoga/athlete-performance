<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GymAttendance extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'check_in_time',
        'check_in_ip',
        'check_in_device',
        'check_in_distance',
        'check_out_time',
        'check_out_ip',
        'check_out_device',
        'check_out_distance',
        'notes',
        'is_paid',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'check_in_time' => 'datetime',
        'check_out_time' => 'datetime',
        'is_paid' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
