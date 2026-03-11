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
    }
}