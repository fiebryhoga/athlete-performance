<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'athlete_id', // Pengganti email
        'password',
        'role',
        'sport_id',
        'age',
        'gender',
        'height',
        'weight',
        'sport_category',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function performanceTests()
    {
        return $this->hasMany(PerformanceTest::class);
    }

    public function testResults() {
        return $this->hasManyThrough(TestResult::class, PerformanceTest::class);
    }
}
