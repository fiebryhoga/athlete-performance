<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$user = \App\Models\User::where('role', 'superadmin')->first();
\Illuminate\Support\Facades\Auth::login($user);

$request = Illuminate\Http\Request::create('/admin/exercises/bulk', 'POST', [
    'exercises' => [
        ['name' => 'Test Exercise']
    ]
]);
$request->setLaravelSession(app('session')->driver());

$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
