<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'package_type',
        'description',
        'session_count',
        'coach_fee_per_session',
        'price',
    ];

    public function isPerSession(): bool
    {
        return $this->package_type === 'per_session';
    }

    public function isQuota(): bool
    {
        return $this->package_type !== 'per_session';
    }
}
