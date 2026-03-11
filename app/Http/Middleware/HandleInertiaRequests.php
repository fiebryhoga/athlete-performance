<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting; // Pastikan Model Setting di-import

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // 1. Ambil setting global dari database
        // Menggunakan pluck agar hasilnya array ['key' => 'value']
        // Jika tabel belum ada (saat fresh migrate), beri fallback array kosong
        try {
            $settings = Setting::pluck('value', 'key');
        } catch (\Exception $e) {
            $settings = [];
        }
        
        $logoPath = $settings['app_logo'] ?? null;

        // 2. Gabungkan data default Inertia dengan data custom kita
        return array_merge(parent::share($request), [
            
            // Auth User
            'auth' => [
                'user' => $request->user(),
            ],

            // App Settings (Global)
            'app_settings' => [
                'name' => $settings['app_name'] ?? 'Zakiyudin Analytics', // Default name
                'logo' => $logoPath ? asset('storage/' . $logoPath) : null,
            ],

            // Flash Messages (Untuk notifikasi sukses/gagal)
            'flash' => [
                'message' => function () use ($request) {
                    return $request->session()->get('message');
                },
                'error' => function () use ($request) {
                    return $request->session()->get('error');
                },
            ],
        ]);
    }
}