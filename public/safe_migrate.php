<?php
if (function_exists('opcache_reset')) {
    opcache_reset();
}

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $rows = Illuminate\Support\Facades\DB::select("SELECT * FROM group_trainings LIMIT 1");
    echo "<h1>Rows in group_trainings</h1>";
    echo "<pre>" . print_r($rows, true) . "</pre>";
} catch (\Throwable $e) {
    echo "<h1>Error:</h1> " . $e->getMessage();
    echo "<br>In " . $e->getFile() . " on line " . $e->getLine();
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
