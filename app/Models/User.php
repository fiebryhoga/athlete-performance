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
        'is_gym_guard',
        'gym_fee',
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

    public function subscriptionPackage()
    {
        return $this->belongsTo(SubscriptionPackage::class, 'subscription_package_id');
    }

    public function groups()
    {
        return $this->belongsToMany(TrainingGroup::class, 'training_group_user');
    }

    public function sharedPackages()
    {
        return $this->belongsToMany(SharedPackage::class, 'shared_package_members');
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
            'is_gym_guard' => 'boolean',
            'gym_fee' => 'integer',
        ];
    }

    public function getEffectiveGymFeeAttribute(): int
    {
        if ($this->gym_fee !== null && (int)$this->gym_fee > 0) {
            return (int) $this->gym_fee;
        }
        return (int) (\App\Models\Setting::where('key', 'gym_shift_fee')->value('value') ?: 0);
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

    public function phvAssessments()
    {
        return $this->hasMany(PhvAssessment::class);
    }

    public function dpaAssessments()
    {
        return $this->hasMany(DpaAssessment::class);
    }

    public function gymSchedules()
    {
        return $this->hasMany(GymSchedule::class);
    }

    public function gymAttendances()
    {
        return $this->hasMany(GymAttendance::class);
    }

    public function scopeGymGuards($query)
    {
        return $query->where('role', 'coach')->where('is_gym_guard', true);
    }
}