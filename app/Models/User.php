<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'profile_photo', 
        'username',
        'password',
        'role',
        'sport_id',
        'age',
        'gender',
        'height',
        'weight',
        'sport_category',
        'training_start_date',
        'training_exp_date',
        'subscription_package_id',
    ];

    public function package()
    {
        return $this->belongsTo(SubscriptionPackage::class, 'subscription_package_id');
    }

    public function groups()
    {
        return $this->belongsToMany(TrainingGroup::class, 'training_group_user');
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    
    protected $appends = [
        'profile_photo_url',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    
    public function getProfilePhotoUrlAttribute()
    {
        return $this->profile_photo 
            ? asset('storage/' . $this->profile_photo) 
            : null;
    }

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function performanceTests()
    {
        return $this->hasMany(PerformanceTest::class);
    }

    public function testResults() 
    {
        return $this->hasManyThrough(TestResult::class, PerformanceTest::class);
    }

    public function galleries()
    {
        return $this->hasMany(AthleteGallery::class);
    }

    public function individualTrainings()
    {
        return $this->hasMany(IndividualTraining::class);
    }

    public function coaches()
    {
        return $this->belongsToMany(User::class, 'coach_athlete', 'athlete_id', 'coach_id')->withTimestamps();
    }

    public function athletes()
    {
        return $this->belongsToMany(User::class, 'coach_athlete', 'coach_id', 'athlete_id')->withTimestamps();
    }
}