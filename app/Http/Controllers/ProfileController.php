<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage; 

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            
            'current_password' => ['nullable', 'required_with:password', 'current_password'], 
            'password' => ['nullable', 'confirmed', 'min:6'],
            
            'profile_photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:10240'],
        ]);

        
        $user->name = $request->name;

        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        
        if ($request->hasFile('profile_photo')) {
            
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            
            $user->profile_photo = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        $user->save();

        return Redirect::back()->with('message', 'Profil berhasil diperbarui.');
    }
}