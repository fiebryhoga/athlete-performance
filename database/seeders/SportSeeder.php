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
        // 1. Definisikan Kategori sesuai "COMPONENT"
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

        // 2. Buat Sport (Contoh: Sepak Bola)
        $sport = Sport::firstOrCreate(['name' => 'Sepak Bola']);

        // 3. Masukkan Data Item Test Sesuai Tabel Anda
        // Format: [Kategori, Nama Tes, Unit, Tipe Parameter, Benchmark/Target]
        $tests = [
            // --- Strength ---
            [
                'cat'    => 'Strength',
                'name'   => 'Push Up 60 sec',
                'unit'   => 'Reps',
                'type'   => 'reps',
                'target' => 55
            ],
            [
                'cat'    => 'Strength',
                'name'   => 'Sit Up Twist 60 sec', // Typo "Shit up" diperbaiki jadi Sit Up
                'unit'   => 'Reps',
                'type'   => 'reps',
                'target' => 60
            ],
            [
                'cat'    => 'Strength',
                'name'   => 'Squat', // Typo "Squad" diperbaiki jadi Squat
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

            // --- Strength Endurance ---
            [
                'cat'    => 'Strength Endurance',
                'name'   => 'Plank',
                'unit'   => 'Menit',
                'type'   => 'minute', 
                'target' => 2.00 // 2 Menit
            ],

            // --- Endurance ---
            [
                'cat'    => 'Endurance',
                'name'   => 'VO2MAX',
                'unit'   => 'mL/kg/min',
                'type'   => 'vo2max',
                'target' => 52
            ],

            // --- Speed ---
            [
                'cat'    => 'Speed',
                'name'   => '20 Meter',
                'unit'   => 'Sec',
                'type'   => 'second',
                'target' => 2.9 // 2.9 Detik
            ],
            [
                'cat'    => 'Speed',
                'name'   => '30 Meter',
                'unit'   => 'Sec',
                'type'   => 'second',
                'target' => 4.5 // 4.5 Detik
            ],

            // --- Agility ---
            [
                'cat'    => 'Agility',
                'name'   => 'T Test',
                'unit'   => 'Sec',
                'type'   => 'second',
                'target' => 9.5 // 9.5 Detik
            ],

            // --- Power ---
            [
                'cat'    => 'Power',
                'name'   => 'Vertical Jump',
                'unit'   => 'Cm',
                'type'   => 'cm',
                'target' => 70 // 70 cm
            ],
            [
                'cat'    => 'Power',
                'name'   => 'Standing Board Jump',
                'unit'   => 'Cm',
                'type'   => 'cm',
                'target' => 245 // 245 cm
            ],
        ];

        // 4. Loop Insert ke Database
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