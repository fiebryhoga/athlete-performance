<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        User::create([
            'name' => 'Coach ZK15',
            'athlete_id' => 'admin', 
            'role' => 'admin',
            'password' => Hash::make('password'),
            'age' => 35,
            'gender' => 'L',
            'height' => 170,
            'weight' => 70,
            'sport_category' => 'Head Coach',
        ]);
        
        
        User::create([
            'name' => 'Asisten Coach',
            'athlete_id' => 'admin2',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);
    }
}