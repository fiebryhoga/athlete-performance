<?php

namespace Database\Seeders;

use App\Models\WorkoutTemplate;
use Illuminate\Database\Seeder;

class WorkoutTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'title' => 'Upper Body (Dada, Punggung & Bahu)',
                'category' => 'Strength & Hypertrophy',
                'description' => 'Fokus kekuatan tubuh bagian atas dengan kombinasi gerakan push & pull serta aktivasi bahu.',
                'icon' => 'Dumbbell',
                'is_public' => true,
                'order' => 1,
                'blocks' => [
                    [
                        'name' => 'Pemanasan & Aktivasi Bahu',
                        'category' => 'warm_up',
                        'target_filled_by' => 'coach',
                        'set_scheme' => 'straight_set',
                        'rest_between_sets' => '45s',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Band Pull-Apart / Scapular Retraction',
                                'sets' => 2,
                                'reps' => '15',
                                'reps_array' => ['15', '15'],
                                'load' => '',
                                'load_unit' => 'kg',
                                'rest_per_set' => '30s',
                                'rest_per_set_array' => ['30s', '30s'],
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Arm Circles & Shoulder Mobility',
                                'sets' => 2,
                                'reps' => '10',
                                'reps_array' => ['10', '10'],
                                'load' => '',
                                'load_unit' => 'kg',
                                'rest_per_set' => '30s',
                                'rest_per_set_array' => ['30s', '30s'],
                            ]
                        ]
                    ],
                    [
                        'name' => 'Latihan Inti Tubuh Atas (Main Workout)',
                        'category' => 'strength_training',
                        'target_filled_by' => 'coach',
                        'set_scheme' => 'straight_set',
                        'rest_between_sets' => '90s',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Dumbbell Bench Press / Push Up',
                                'sets' => 3,
                                'reps' => '10',
                                'reps_array' => ['10', '10', '10'],
                                'load' => '12',
                                'load_array' => ['10', '12', '12'],
                                'load_unit' => 'kg',
                                'rest_per_set' => '60s',
                                'rest_per_set_array' => ['60s', '60s', '60s'],
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Lat Pulldown / Bent-over Row',
                                'sets' => 3,
                                'reps' => '12',
                                'reps_array' => ['12', '12', '12'],
                                'load' => '25',
                                'load_array' => ['20', '25', '25'],
                                'load_unit' => 'kg',
                                'rest_per_set' => '60s',
                                'rest_per_set_array' => ['60s', '60s', '60s'],
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Dumbbell Overhead Shoulder Press',
                                'sets' => 3,
                                'reps' => '10',
                                'reps_array' => ['10', '10', '10'],
                                'load' => '8',
                                'load_array' => ['8', '8', '8'],
                                'load_unit' => 'kg',
                                'rest_per_set' => '60s',
                                'rest_per_set_array' => ['60s', '60s', '60s'],
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Bicep Curl & Tricep Extension Superset',
                                'sets' => 3,
                                'reps' => '12',
                                'reps_array' => ['12', '12', '12'],
                                'load' => '6',
                                'load_array' => ['6', '6', '6'],
                                'load_unit' => 'kg',
                                'rest_per_set' => '45s',
                                'rest_per_set_array' => ['45s', '45s', '45s'],
                            ]
                        ]
                    ],
                    [
                        'name' => 'Pendinginan & Peregangan Statis',
                        'category' => 'stretching',
                        'target_filled_by' => 'coach',
                        'set_scheme' => 'straight_set',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Chest & Lat Static Stretch',
                                'sets' => 1,
                                'reps' => '30s',
                                'reps_array' => ['30s'],
                                'note' => 'Tahan regangan dada dan lat selama 30 detik per sisi.',
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Lower Body (Kaki, Paha & Glutes)',
                'category' => 'Strength & Power',
                'description' => 'Fokus kekuatan dan hipertrofi kaki (Quad, Hamstring, Glutes & Betis).',
                'icon' => 'Zap',
                'is_public' => true,
                'order' => 2,
                'blocks' => [
                    [
                        'name' => 'Pemanasan & Mobilitas Panggul',
                        'category' => 'warm_up',
                        'target_filled_by' => 'coach',
                        'set_scheme' => 'straight_set',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Hip 90/90 & Leg Swings',
                                'sets' => 2,
                                'reps' => '10',
                                'reps_array' => ['10', '10'],
                                'load_unit' => 'kg',
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Glute Bridge Activation',
                                'sets' => 2,
                                'reps' => '12',
                                'reps_array' => ['12', '12'],
                                'load_unit' => 'kg',
                            ]
                        ]
                    ],
                    [
                        'name' => 'Latihan Inti Kaki (Leg Day)',
                        'category' => 'strength_training',
                        'target_filled_by' => 'coach',
                        'set_scheme' => 'straight_set',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Goblet Squat / Barbell Back Squat',
                                'sets' => 3,
                                'reps' => '10',
                                'reps_array' => ['10', '10', '10'],
                                'load' => '16',
                                'load_array' => ['16', '20', '20'],
                                'load_unit' => 'kg',
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Romanian Deadlift (Dumbbell/Barbell)',
                                'sets' => 3,
                                'reps' => '10',
                                'reps_array' => ['10', '10', '10'],
                                'load' => '20',
                                'load_array' => ['20', '24', '24'],
                                'load_unit' => 'kg',
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Walking Lunges / Bulgarian Split Squat',
                                'sets' => 3,
                                'reps' => '10',
                                'reps_array' => ['10', '10', '10'],
                                'load' => '8',
                                'load_array' => ['8', '8', '8'],
                                'load_unit' => 'kg',
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Standing Calf Raise',
                                'sets' => 3,
                                'reps' => '15',
                                'reps_array' => ['15', '15', '15'],
                                'load' => '10',
                                'load_array' => ['10', '10', '10'],
                                'load_unit' => 'kg',
                            ]
                        ]
                    ],
                    [
                        'name' => 'Pendinginan & Peregangan Kaki',
                        'category' => 'stretching',
                        'target_filled_by' => 'coach',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Hamstring & Quad Stretch',
                                'sets' => 1,
                                'reps' => '30s',
                                'reps_array' => ['30s'],
                                'note' => 'Peregangan paha depan, hamstring, dan betis.',
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Speed, Agility & Footwork (SAQ)',
                'category' => 'Athletic Conditioning',
                'description' => 'Latihan kelincahan, reaksi kaki, dan akselerasi untuk meningkatkan performa atletik.',
                'icon' => 'Flame',
                'is_public' => true,
                'order' => 3,
                'blocks' => [
                    [
                        'name' => 'Dynamic Warm Up & Ladder Drills',
                        'category' => 'warm_up',
                        'target_filled_by' => 'coach',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'High Knees & Butt Kicks',
                                'sets' => 2,
                                'reps' => '20m',
                                'reps_array' => ['20m', '20m'],
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Agility Ladder - Icky Shuffle',
                                'sets' => 3,
                                'reps' => '1',
                                'reps_array' => ['1', '1', '1'],
                            ]
                        ]
                    ],
                    [
                        'name' => 'Main Drill (Kelincahan & Akselerasi)',
                        'category' => 'interval',
                        'target_filled_by' => 'coach',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Cone T-Drill / Pro Agility 5-10-5',
                                'sets' => 4,
                                'reps' => '1',
                                'reps_array' => ['1', '1', '1', '1'],
                                'rest_per_set' => '60s',
                                'rest_per_set_array' => ['60s', '60s', '60s', '60s'],
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Box Jump & Landing Mechanics',
                                'sets' => 3,
                                'reps' => '6',
                                'reps_array' => ['6', '6', '6'],
                                'rest_per_set' => '45s',
                                'rest_per_set_array' => ['45s', '45s', '45s'],
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => '10m - 20m Acceleration Sprints',
                                'sets' => 4,
                                'reps' => '1',
                                'reps_array' => ['1', '1', '1', '1'],
                                'rest_per_set' => '90s',
                                'rest_per_set_array' => ['90s', '90s', '90s', '90s'],
                            ]
                        ]
                    ],
                    [
                        'name' => 'Pendinginan & Breathing',
                        'category' => 'stretching',
                        'target_filled_by' => 'coach',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Light Jog & Full Lower Stretch',
                                'sets' => 1,
                                'reps' => '5 mins',
                                'reps_array' => ['5 mins'],
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Full Body Conditioning & Core',
                'category' => 'Fat Burn & Stamina',
                'description' => 'Sirkuit latihan seluruh tubuh untuk membangun daya tahan kardio dan kekuatan core.',
                'icon' => 'Activity',
                'is_public' => true,
                'order' => 4,
                'blocks' => [
                    [
                        'name' => 'Pemanasan & Core Activation',
                        'category' => 'warm_up',
                        'target_filled_by' => 'coach',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Jumping Jacks & Mountain Climbers',
                                'sets' => 2,
                                'reps' => '30s',
                                'reps_array' => ['30s', '30s'],
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Deadbug & Bird Dog',
                                'sets' => 2,
                                'reps' => '10',
                                'reps_array' => ['10', '10'],
                            ]
                        ]
                    ],
                    [
                        'name' => 'Sirkuit Full Body (Circuit Training)',
                        'category' => 'strength_training',
                        'target_filled_by' => 'coach',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Kettlebell Swings',
                                'sets' => 3,
                                'reps' => '15',
                                'reps_array' => ['15', '15', '15'],
                                'load' => '12',
                                'load_array' => ['12', '12', '12'],
                                'load_unit' => 'kg',
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Dumbbell Thrusters (Squat to Press)',
                                'sets' => 3,
                                'reps' => '10',
                                'reps_array' => ['10', '10', '10'],
                                'load' => '6',
                                'load_array' => ['6', '6', '6'],
                                'load_unit' => 'kg',
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Plank Hold with Shoulder Tap',
                                'sets' => 3,
                                'reps' => '45s',
                                'reps_array' => ['45s', '45s', '45s'],
                            ]
                        ]
                    ],
                    [
                        'name' => 'Pendinginan Total',
                        'category' => 'stretching',
                        'target_filled_by' => 'coach',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Full Body Static Stretch & Foam Roll',
                                'sets' => 1,
                                'reps' => '5 mins',
                                'reps_array' => ['5 mins'],
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Mobility & Active Recovery',
                'category' => 'Recovery & Flexibility',
                'description' => 'Sesi pemulihan aktif untuk meredakan kekakuan otot dan meningkatkan rentang gerak sendi.',
                'icon' => 'HeartPulse',
                'is_public' => true,
                'order' => 5,
                'blocks' => [
                    [
                        'name' => 'Mobilitas Sendi & Foam Rolling',
                        'category' => 'mobility',
                        'target_filled_by' => 'coach',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Thoracic Spine Rotation & Cat-Cow',
                                'sets' => 2,
                                'reps' => '10',
                                'reps_array' => ['10', '10'],
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Foam Rolling Major Muscles (Back, Quads, Glutes)',
                                'sets' => 1,
                                'reps' => '5 mins',
                                'reps_array' => ['5 mins'],
                            ]
                        ]
                    ],
                    [
                        'name' => 'Peregangan Dalam & Relaksasi',
                        'category' => 'stretching',
                        'target_filled_by' => 'coach',
                        'items' => [
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Pigeon Pose (Hip Opener)',
                                'sets' => 2,
                                'reps' => '45s',
                                'reps_array' => ['45s', '45s'],
                            ],
                            [
                                'exercise_id' => '',
                                'exercise_name' => 'Child’s Pose & Deep Diaphragmatic Breathing',
                                'sets' => 1,
                                'reps' => '3 mins',
                                'reps_array' => ['3 mins'],
                            ]
                        ]
                    ]
                ]
            ]
        ];

        foreach ($templates as $tmpl) {
            WorkoutTemplate::updateOrCreate(
                ['title' => $tmpl['title']],
                $tmpl
            );
        }
    }
}
