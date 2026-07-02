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
        for ($i = 1; $i <= 4; $i++) {
            User::create([
                'name' => 'Athlete ' . $i,
                'username' => 'athlete' . $i,
                'role' => 'athlete',
                'password' => Hash::make('password'),
                'age' => 20 + $i,
                'gender' => $i % 2 == 0 ? 'P' : 'L',
                'height' => 170.0,
                'weight' => 60.0,
            ]);
        }
    }
}