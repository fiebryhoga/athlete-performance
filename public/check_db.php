<?php
if (function_exists('opcache_reset')) {
    opcache_reset();
}
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    $columns = Illuminate\Support\Facades\Schema::getColumnListing('group_trainings');
    echo "<h1>Columns in group_trainings</h1>";
    echo "<pre>" . print_r($columns, true) . "</pre>";
} catch (\Throwable $e) {
    echo "<h1>Error:</h1> " . $e->getMessage();
}
