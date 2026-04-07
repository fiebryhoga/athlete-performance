<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Sport;
use App\Models\Category;
use App\Models\TestItem;
use App\Models\PerformanceTest; 
use App\Models\TestResult;      
use Illuminate\Support\Facades\Hash;

class VolleyballSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        
        
        
        $sport = Sport::firstOrCreate(['name' => 'Bola Voli']);

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

        
        
        
        
        $athletes = [
            ['name' => 'Afgan', 'gender' => 'L', 'weight' => 82.95, 'height' => 175],
            ['name' => 'Fatir', 'gender' => 'L', 'weight' => 43.6,  'height' => 165],
            ['name' => 'Idzam', 'gender' => 'L', 'weight' => 78.55, 'height' => 172],
            ['name' => 'Rafi',  'gender' => 'L', 'weight' => 49.4,  'height' => 168],
            ['name' => 'Irzam', 'gender' => 'L', 'weight' => 44.6,  'height' => 165],
            ['name' => 'Fajar', 'gender' => 'L', 'weight' => 56.4,  'height' => 170],
        ];

        foreach ($athletes as $index => $data) {
            $athleteId = 'VOL-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);
            User::firstOrCreate(
                ['name' => $data['name']],
                [
                    'athlete_id' => $athleteId,
                    'role' => 'athlete',
                    'sport_id' => $sport->id,
                    'password' => Hash::make('password'),
                    'age' => 16,
                    'gender' => $data['gender'],
                    'height' => $data['height'],
                    'weight' => $data['weight'],
                    'sport_category' => 'Bola Voli',
                ]
            );
        }

        
        
        

        $tests = [
            ['cat' => 'Strength', 'name' => 'Push Up 60 sec', 'unit' => 'Reps', 'type' => 'reps', 'target' => 55],
            ['cat' => 'Strength', 'name' => 'Sit Up Twist 60 sec', 'unit' => 'Reps', 'type' => 'reps', 'target' => 60],
            ['cat' => 'Strength', 'name' => 'Squat', 'unit' => 'Reps', 'type' => 'reps', 'target' => 50],
            ['cat' => 'Strength', 'name' => 'Back Up', 'unit' => 'Reps', 'type' => 'reps', 'target' => 60],
            ['cat' => 'Strength Endurance', 'name' => 'Plank', 'unit' => 'Menit', 'type' => 'minute', 'target' => 2.00],
            ['cat' => 'Endurance', 'name' => 'VO2MAX', 'unit' => 'mL/kg/min', 'type' => 'vo2max', 'target' => 52],
            ['cat' => 'Speed', 'name' => '20 Meter', 'unit' => 'Sec', 'type' => 'second', 'target' => 2.9],
            ['cat' => 'Speed', 'name' => '30 Meter', 'unit' => 'Sec', 'type' => 'second', 'target' => 4.5],
            ['cat' => 'Agility', 'name' => 'T Test', 'unit' => 'Sec', 'type' => 'second', 'target' => 9.5],
            ['cat' => 'Power', 'name' => 'Vertical Jump', 'unit' => 'Cm', 'type' => 'cm', 'target' => 70],
            ['cat' => 'Power', 'name' => 'Standing Board Jump', 'unit' => 'Cm', 'type' => 'cm', 'target' => 245],
        ];

        foreach ($tests as $test) {
            TestItem::firstOrCreate(
                ['sport_id' => $sport->id, 'name' => $test['name']],
                [
                    'category_id'    => $catIds[$test['cat']],
                    'unit'           => $test['unit'],
                    'parameter_type' => $test['type'],
                    'target_value'   => $test['target'],
                ]
            );
        }

        
        
        
        
        
        
        $resultsData = [
            'Afgan' => [
                'Push Up 60 sec' => 16,
                'Sit Up Twist 60 sec' => 32,
                'Squat' => 36,
                'Back Up' => 54,
                'Plank' => 1.44,
                'VO2MAX' => 0,
                '20 Meter' => 3.23,
                '30 Meter' => 5.09,
                'T Test' => 10,
                'Vertical Jump' => 47,
                'Standing Board Jump' => 0
            ],
            'Fatir' => [
                'Push Up 60 sec' => 11,
                'Sit Up Twist 60 sec' => 28,
                'Squat' => 13,
                'Back Up' => 50,
                'Plank' => 1,
                'VO2MAX' => 0,
                '20 Meter' => 3.61,
                '30 Meter' => 5.37,
                'T Test' => 10,
                'Vertical Jump' => 47,
                'Standing Board Jump' => 0
            ],
            'Idzam' => [
                'Push Up 60 sec' => 13,
                'Sit Up Twist 60 sec' => 26,
                'Squat' => 27,
                'Back Up' => 50,
                'Plank' => 1.05,
                'VO2MAX' => 0,
                '20 Meter' => 3.2,
                '30 Meter' => 5.02,
                'T Test' => 10,
                'Vertical Jump' => 44,
                'Standing Board Jump' => 0
            ],
            'Rafi' => [
                'Push Up 60 sec' => 28,
                'Sit Up Twist 60 sec' => 30,
                'Squat' => 35,
                'Back Up' => 60,
                'Plank' => 1.32,
                'VO2MAX' => 0,
                '20 Meter' => 3.18,
                '30 Meter' => 4.67,
                'T Test' => 10,
                'Vertical Jump' => 57,
                'Standing Board Jump' => 0
            ],
            'Irzam' => [
                'Push Up 60 sec' => 11,
                'Sit Up Twist 60 sec' => 25,
                'Squat' => 23,
                'Back Up' => 21,
                'Plank' => 1.15,
                'VO2MAX' => 0,
                '20 Meter' => 3.15,
                '30 Meter' => 4.82,
                'T Test' => 10,
                'Vertical Jump' => 43,
                'Standing Board Jump' => 0
            ],
            
            'Fajar' => [
                'Push Up 60 sec' => 34,
                'Sit Up Twist 60 sec' => 33,
                'Squat' => 40,
                'Back Up' => 43,
                'Plank' => 1.25,
                'VO2MAX' => 0,
                
                '20 Meter' => 3.19,
                '30 Meter' => 4.88,
                'T Test' => 10,
                'Vertical Jump' => 69,
                'Standing Board Jump' => 0
            ],
        ];

        
        foreach ($resultsData as $athleteName => $scores) {
            
            $user = User::where('name', $athleteName)->first();
            
            if (!$user) continue;

            
            $testSession = PerformanceTest::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'date' => '2026-01-10', 
                ],
                [
                    'name' => 'Tes Fisik Tahap 1',
                    'notes' => 'Data impor awal dari Raport Skavola',
                ]
            );

            
            foreach ($scores as $itemName => $rawResult) {
                $item = TestItem::where('sport_id', $sport->id)
                                ->where('name', $itemName)
                                ->first();

                if ($item) {
                    
                    $scorePercent = $item->calculateScore($rawResult);

                    TestResult::updateOrCreate(
                        [
                            'performance_test_id' => $testSession->id,
                            'test_item_id' => $item->id,
                        ],
                        [
                            'result' => $rawResult,     
                            'score' => $scorePercent,   
                        ]
                    );
                }
            }
        }
    }
}