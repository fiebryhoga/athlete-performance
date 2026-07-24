<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        
        $settings = Setting::pluck('value', 'key');

        return Inertia::render('Admin/Settings/Index', [
            'app_name' => $settings['app_name'] ?? 'My App',
            'app_logo' => $settings['app_logo'] ? asset('storage/' . $settings['app_logo']) : null,
            'login_background' => ($settings['login_background'] ?? null) ? asset('storage/' . $settings['login_background']) : null,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string|max:50',
            'app_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048', 
            'login_background' => 'nullable|image|mimes:jpeg,png,jpg|max:10240', 
        ]);

        
        Setting::updateOrCreate(
            ['key' => 'app_name'],
            ['value' => $request->app_name]
        );

        
        if ($request->hasFile('app_logo')) {
            
            $oldLogo = Setting::where('key', 'app_logo')->value('value');
            if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
                Storage::disk('public')->delete($oldLogo);
            }

            
            $path = $request->file('app_logo')->store('settings', 'public');
            
            Setting::updateOrCreate(
                ['key' => 'app_logo'],
                ['value' => $path]
            );
        }

        if ($request->hasFile('login_background')) {
            $oldBg = Setting::where('key', 'login_background')->value('value');
            if ($oldBg && Storage::disk('public')->exists($oldBg)) {
                Storage::disk('public')->delete($oldBg);
            }

            $pathBg = $request->file('login_background')->store('settings', 'public');
            
            Setting::updateOrCreate(
                ['key' => 'login_background'],
                ['value' => $pathBg]
            );
        }

        return redirect()->back()->with('message', 'Konfigurasi aplikasi berhasil diperbarui.');
    }
}