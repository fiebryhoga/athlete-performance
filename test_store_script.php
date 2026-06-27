<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$payload = [
    'record_date' => '2026-06-27',
    'data' => [
        [
            'user_id' => 52,
            'metrics' => [
                'quality_of_sleep' => 4,
                'fatigue' => 3,
                'muscle_soreness' => 2,
                'stress' => 1
            ]
        ]
    ]
];

$request = Illuminate\Http\Request::create('/admin/wellness-rpe/store', 'POST', $payload);
$response = $kernel->handle($request);

echo "Status: " . $response->getStatusCode() . "\n";
echo "Error: " . ($response->exception ? $response->exception->getMessage() : 'None') . "\n";
