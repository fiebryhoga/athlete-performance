<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupTraining extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_group_id',
        'name',
        'training_type',
        'location',
        'status',
        'date',
        'session_number',
        'coach_id',
        'coach_ids',
        'is_group_paid',
        'is_coach_paid',
        'attendee_ids',
    ];

    protected $casts = [
        'attendee_ids' => 'array',
        'coach_ids' => 'array',
        'is_group_paid' => 'boolean',
        'is_coach_paid' => 'boolean',
        'date' => 'date',
    ];

    public function group()
    {
        return $this->belongsTo(TrainingGroup::class, 'training_group_id');
    }

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }

    public function blocks()
    {
        return $this->hasMany(TrainingBlock::class, 'group_training_id')->orderBy('sort_order', 'asc');
    }

    public function members_pivot()
    {
        return $this->hasMany(GroupTrainingMember::class, 'group_training_id');
    }

    public function rpe_records()
    {
        return $this->hasMany(GroupTrainingRpeRecord::class, 'group_training_id');
    }
}
