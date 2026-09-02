<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by',
        'title',
        'category',
        'description',
        'icon',
        'blocks',
        'is_public',
        'order',
    ];

    protected $casts = [
        'blocks' => 'array',
        'is_public' => 'boolean',
        'order' => 'integer',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
