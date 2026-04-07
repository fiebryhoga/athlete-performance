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
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string|max:50',
            'app_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048', 
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

        return redirect()->back()->with('message', 'Konfigurasi aplikasi berhasil diperbarui.');
    }
}