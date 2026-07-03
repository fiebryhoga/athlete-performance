<?php
if (function_exists('opcache_reset')) {
    opcache_reset();
}
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$tables = Illuminate\Support\Facades\DB::select('SHOW TABLES');
echo "<pre>";
print_r($tables);
echo "</pre>";

$migrations = Illuminate\Support\Facades\DB::table('migrations')->get();
echo "<pre>";
print_r($migrations);
echo "</pre>";
