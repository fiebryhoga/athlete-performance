<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HelpGuide extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'target_role',
        'summary',
        'content',
        'is_published',
        'views_count',
        'order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'views_count' => 'integer',
        'order' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(HelpCategory::class, 'category_id');
    }

    public function steps()
    {
        return $this->hasMany(HelpGuideStep::class, 'help_guide_id')->orderBy('step_number', 'asc');
    }

    public function scopeForRole($query, $role)
    {
        if ($role === 'superadmin') {
            return $query;
        }

        return $query->where(function ($q) use ($role) {
            $q->where('target_role', 'all')
              ->orWhere('target_role', $role);
        });
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
