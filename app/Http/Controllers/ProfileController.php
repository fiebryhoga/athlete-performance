<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            // Validasi: current_password wajib ada JIKA password baru diisi
            'current_password' => ['nullable', 'required_with:password', 'current_password'], 
            'password' => ['nullable', 'confirmed', 'min:6'],
        ]);

        // Update Nama
        $user->name = $request->name;

        // Update Password (Hanya jika diisi)
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return Redirect::back()->with('message', 'Profil berhasil diperbarui.');
    }
}