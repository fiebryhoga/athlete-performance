<?php
if (function_exists('opcache_reset')) {
    opcache_reset();
}
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

Illuminate\Support\Facades\Schema::dropIfExists('coach_training_group');
Illuminate\Support\Facades\Schema::dropIfExists('group_trainings');
Illuminate\Support\Facades\Schema::dropIfExists('training_group_user');
Illuminate\Support\Facades\Schema::dropIfExists('training_groups');

Illuminate\Support\Facades\DB::table('migrations')->whereIn('migration', [
    '2026_07_02_224028_create_training_groups_table',
    '2026_07_02_224029_create_training_group_user_table',
    '2026_07_02_224030_create_group_trainings_table',
    '2026_07_02_232051_create_coach_training_group_table'
])->delete();

try {
    Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    echo "<h1>Migration Output</h1>";
    echo nl2br(Illuminate\Support\Facades\Artisan::output());
} catch (\Throwable $e) {
    echo "<h1>Error:</h1> " . $e->getMessage();
}
