<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SharedPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'subscription_package_id',
        'start_date',
        'expiration_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'expiration_date' => 'date:Y-m-d',
    ];

    public function package()
    {
        return $this->belongsTo(SubscriptionPackage::class, 'subscription_package_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'shared_package_members');
    }

    public function coaches()
    {
        return $this->belongsToMany(User::class, 'coach_shared_package', 'shared_package_id', 'coach_id');
    }

    public function trainings()
    {
        return $this->hasMany(IndividualTraining::class, 'shared_package_id');
    }

    /**
     * Count of sessions used in this shared package (only non-extra, unpaid cycle).
     */
    public function usedSessions(): int
    {
        return $this->trainings()
            ->where('is_extra', false)
            ->where('is_athlete_paid', false)
            ->count();
    }

    /**
     * Remaining sessions available in this shared package.
     */
    public function remainingSessions(): ?int
    {
        $total = $this->package?->session_count;
        if ($total === null) {
            return null;
        }
        return max(0, $total - $this->usedSessions());
    }

    /**
     * Get the next shared session number.
     */
    public function nextSharedSessionNumber(): int
    {
        $lastSession = $this->trainings()
            ->where('is_extra', false)
            ->where('is_athlete_paid', false)
            ->max('shared_session_number');

        return ($lastSession ?? 0) + 1;
    }
}
