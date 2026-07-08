<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DpaAssessment extends Model
{
    use HasFactory;

    protected $table = 'dpa_assessments';

    protected $fillable = [
        'user_id',
        'assessment_date',
        'notes',
    ];

    protected $casts = [
        'assessment_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function details()
    {
        return $this->hasMany(DpaAssessmentDetail::class);
    }

    public function compensations()
    {
        return $this->belongsToMany(DpaCompensation::class, 'dpa_assessment_details', 'dpa_assessment_id', 'dpa_compensation_id');
    }
}
