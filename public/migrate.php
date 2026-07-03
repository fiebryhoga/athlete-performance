<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$files = app('migrator')->getMigrationFiles(database_path('migrations'));
echo "<pre>";
print_r(array_keys($files));
echo "</pre>";
