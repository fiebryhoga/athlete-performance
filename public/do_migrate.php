<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    echo "<h1>Migration Success!</h1>";
    echo nl2br(Illuminate\Support\Facades\Artisan::output());
} catch (\Throwable $e) {
    echo "<h1>Error:</h1> " . $e->getMessage();
    echo "<br><pre>" . $e->getTraceAsString() . "</pre>";
    echo "<br>Class: " . get_class($e);
}
