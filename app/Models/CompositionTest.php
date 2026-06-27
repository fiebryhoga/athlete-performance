<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompositionTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'date', 'age', 'metabolic_age', 'weight', 'height', 'bmi',
        'body_fat_percentage', 'fat_free_mass', 'muscle_mass', 'skeletal_muscle_mass', 
        'bone_mass', 'essential_fat_mass', 'storage_fat_mass', 'visceral_fat', 
        'total_body_water', 'intracellular_water', 'extracellular_water', 
        'phase_angle', 'bmr', 'other_mass',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'weight' => 'float',
        'height' => 'float',
        'bmi' => 'float',
        'body_fat_percentage' => 'float',
        'fat_free_mass' => 'float',
        'muscle_mass' => 'float',
        'skeletal_muscle_mass' => 'float',
        'bone_mass' => 'float',
        'essential_fat_mass' => 'float',
        'storage_fat_mass' => 'float',
        'visceral_fat' => 'float',
        'total_body_water' => 'float',
        'intracellular_water' => 'float',
        'extracellular_water' => 'float',
        'phase_angle' => 'float',
        'other_mass' => 'float',
    ];

    protected $appends = ['anatomy_breakdown_percentage'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getAnatomyBreakdownPercentageAttribute()
    {
        if (!$this->weight) return null;

        $totalFatMass = ($this->essential_fat_mass ?? 0) + ($this->storage_fat_mass ?? 0);
        
        if ($totalFatMass == 0 && $this->body_fat_percentage) {
            $totalFatMass = $this->weight * ($this->body_fat_percentage / 100);
        }

        $muscleMass = $this->muscle_mass ?? 0;
        $boneMass = $this->bone_mass ?? 0;
        
        $calculatedOtherMass = $this->weight - ($totalFatMass + $muscleMass + $boneMass);
        $calculatedOtherMass = $calculatedOtherMass < 0 ? 0 : $calculatedOtherMass;

        return [
            'fat_percentage' => round(($totalFatMass / $this->weight) * 100, 2),
            'muscle_percentage' => round(($muscleMass / $this->weight) * 100, 2),
            'bone_percentage' => round(($boneMass / $this->weight) * 100, 2),
            'other_percentage' => round(($calculatedOtherMass / $this->weight) * 100, 2),
        ];
    }
}