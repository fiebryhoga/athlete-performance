<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sport;
use App\Models\Category;
use App\Models\TestItem;

class SportSeeder extends Seeder
{
    public function run(): void
    {
        
        $categories = [
            'Strength',
            'Strength Endurance',
            'Endurance',
            'Speed',
            'Agility',
            'Power',
        ];

        $catIds = [];
        foreach ($categories as $cat) {
            $created = Category::firstOrCreate(['name' => $cat]);
            $catIds[$cat] = $created->id; 
        }

        
        $sport = Sport::firstOrCreate(['name' => 'Sepak Bola']);

        
        
        $tests = [
            
            [
                'cat'    => 'Strength',
                'name'   => 'Push Up 60 sec',
                'unit'   => 'Reps',
                'type'   => 'reps',
                'target' => 55
            ],
            [
                'cat'    => 'Strength',
                'name'   => 'Sit Up Twist 60 sec', 
                'unit'   => 'Reps',
                'type'   => 'reps',
                'target' => 60
            ],
            [
                'cat'    => 'Strength',
                'name'   => 'Squat', 
                'unit'   => 'Reps',
                'type'   => 'reps',
                'target' => 50
            ],
            [
                'cat'    => 'Strength',
                'name'   => 'Back Up',
                'unit'   => 'Reps',
                'type'   => 'reps',
                'target' => 60
            ],

            
            [
                'cat'    => 'Strength Endurance',
                'name'   => 'Plank',
                'unit'   => 'Menit',
                'type'   => 'minute', 
                'target' => 2.00 
            ],

            
            [
                'cat'    => 'Endurance',
                'name'   => 'VO2MAX',
                'unit'   => 'mL/kg/min',
                'type'   => 'vo2max',
                'target' => 52
            ],

            
            [
                'cat'    => 'Speed',
                'name'   => '20 Meter',
                'unit'   => 'Sec',
                'type'   => 'second',
                'target' => 2.9 
            ],
            [
                'cat'    => 'Speed',
                'name'   => '30 Meter',
                'unit'   => 'Sec',
                'type'   => 'second',
                'target' => 4.5 
            ],

            
            [
                'cat'    => 'Agility',
                'name'   => 'T Test',
                'unit'   => 'Sec',
                'type'   => 'second',
                'target' => 9.5 
            ],

            
            [
                'cat'    => 'Power',
                'name'   => 'Vertical Jump',
                'unit'   => 'Cm',
                'type'   => 'cm',
                'target' => 70 
            ],
            [
                'cat'    => 'Power',
                'name'   => 'Standing Board Jump',
                'unit'   => 'Cm',
                'type'   => 'cm',
                'target' => 245 
            ],
        ];

        
        foreach ($tests as $test) {
            TestItem::create([
                'sport_id'       => $sport->id,
                'category_id'    => $catIds[$test['cat']],
                'name'           => $test['name'],
                'unit'           => $test['unit'],
                'parameter_type' => $test['type'],
                'target_value'   => $test['target'],
            ]);
        }
    }
}