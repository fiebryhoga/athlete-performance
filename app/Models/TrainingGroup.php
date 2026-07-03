<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'subscription_package_id',
    ];

    public function package()
    {
        return $this->belongsTo(SubscriptionPackage::class, 'subscription_package_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'training_group_user');
    }

    public function coaches()
    {
        return $this->belongsToMany(User::class, 'coach_training_group', 'training_group_id', 'coach_id');
    }

    public function trainings()
    {
        return $this->hasMany(GroupTraining::class);
    }
}
