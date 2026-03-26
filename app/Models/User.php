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
        'profile_photo', // <-- TAMBAHAN BARU
        'athlete_id',
        'password',
        'role',
        'sport_id',
        'age',
        'gender',
        'height',
        'weight',
        'sport_category',
        'training_start_date',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Mendaftarkan "jalan pintas" URL foto agar selalu terkirim ke React (Inertia)
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

    /**
     * Accessor untuk mendapatkan URL lengkap foto profil.
     * Jika user belum punya foto, kembalikan nilai null (nanti React akan menampilkan inisial nama).
     */
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
}