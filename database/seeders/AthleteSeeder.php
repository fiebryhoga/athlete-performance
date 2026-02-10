<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AthleteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Dimas Fiebry Prayhoga Putra',
            'athlete_id' => 'ATL-2026-001',
            'role' => 'athlete',
            'password' => Hash::make('password'),
            'age' => 22,
            'gender' => 'L',
            'height' => 175.0,
            'weight' => 68.0,
            'sport_category' => 'Teknologi & Esports',
        ]);

        User::create([
            'name' => 'Farra Athikasari',
            'athlete_id' => 'ATL-2026-002',
            'role' => 'athlete',
            'password' => Hash::make('password'),
            'age' => 21,
            'gender' => 'P',
            'height' => 160.0,
            'weight' => 50.0,
            'sport_category' => 'Renang',
        ]);

        for ($i = 3; $i <= 12; $i++) {
            User::create([
                'name' => 'Atlet Demo ' . $i,
                'athlete_id' => 'ATL-2026-' . str_pad($i, 3, '0', STR_PAD_LEFT), // Format: ATL-2026-003
                'role' => 'athlete',
                'password' => Hash::make('password'),
                'age' => rand(17, 25),
                'gender' => rand(0, 1) ? 'L' : 'P',
                'height' => rand(155, 185),
                'weight' => rand(45, 85),
                'sport_category' => 'General',
            ]);
        }
    }
}