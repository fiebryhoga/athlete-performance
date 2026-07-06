<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoachPayout extends Model
{
    protected $fillable = ['user_id', 'amount', 'paid_at', 'notes'];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
