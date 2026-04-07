<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting; 

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
        
        
        
        try {
            $settings = Setting::pluck('value', 'key');
        } catch (\Exception $e) {
            $settings = [];
        }
        
        $logoPath = $settings['app_logo'] ?? null;

        
        return array_merge(parent::share($request), [
            
            
            'auth' => [
                'user' => $request->user(),
            ],

            
            'app_settings' => [
                'name' => $settings['app_name'] ?? 'Zakiyudin Analytics', 
                'logo' => $logoPath ? asset('storage/' . $logoPath) : null,
            ],

            
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