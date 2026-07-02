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
            'name' => 'Superadmin',
            'username' => 'superadmin', 
            'role' => 'superadmin',
            'password' => Hash::make('password'),
        ]);

        for ($i = 1; $i <= 4; $i++) {
            User::create([
                'name' => 'Coach ' . $i,
                'username' => 'coach' . $i,
                'role' => 'coach',
                'password' => Hash::make('password'),
            ]);
        }
    }
}