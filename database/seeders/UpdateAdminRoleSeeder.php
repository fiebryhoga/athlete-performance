<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UpdateAdminRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Get all users who have admin or superadmin role
        $users = User::whereIn('role', ['admin', 'superadmin'])->orderBy('id')->get();

        if ($users->isNotEmpty()) {
            // First user becomes superadmin
            $firstUser = $users->first();
            $firstUser->update(['role' => 'superadmin']);

            // Rest become coach
            $users->slice(1)->each(function ($user) {
                $user->update(['role' => 'coach']);
            });
        }
        echo "Roles updated successfully.\n";
    }
}
