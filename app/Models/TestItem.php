<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestItem extends Model
{
    protected $guarded = ['id'];

    public const PARAMS = [
        'reps'   => 'Repetisi (Reps)',
        'second' => 'Detik (Seconds)',
        'minute' => 'Menit (Minutes)',
        'meter'  => 'Meter',
        'cm'     => 'Centimeter',
        'kg'     => 'Kilogram',
        'vo2max' => 'VO2 Max',
        'points' => 'Poin (Points)',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Hitung Skor Persentase
     */
    public function calculateScore($actualResult)
    {
        $target = floatval($this->target_value);
        $actual = floatval($actualResult);

        
        if ($target == 0) return 0;

        $score = 0;

        switch ($this->parameter_type) {
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            

            case 'second': 
                if ($actual <= 0) $score = 0;
                else $score = ($target / $actual) * 100;
                break;

            case 'minute': 
                $score = ($actual / $target) * 100;
                break;

            case 'reps':
            case 'cm':
            case 'meter':
            case 'vo2max':
            case 'points':
            default: 
                $score = ($actual / $target) * 100;
                break;
        }

        
        if ($score > 100) {
            $score = 100;
        }

        return $score; 
    }
}