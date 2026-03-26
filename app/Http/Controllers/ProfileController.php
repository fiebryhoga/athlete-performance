<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage; // Tambahkan ini untuk akses Storage

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
            // Validasi foto profil baru
            'profile_photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:10240'],
        ]);

        // 1. Update Nama
        $user->name = $request->name;

        // 2. Update Password (Hanya jika diisi)
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // 3. Update Foto Profil (Jika ada file yang diunggah)
        if ($request->hasFile('profile_photo')) {
            // Hapus foto lama jika sebelumnya sudah punya foto
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            // Simpan foto baru ke folder public/storage/profile-photos
            $user->profile_photo = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        $user->save();

        return Redirect::back()->with('message', 'Profil berhasil diperbarui.');
    }
}