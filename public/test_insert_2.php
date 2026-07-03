<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    \Illuminate\Support\Facades\DB::insert("INSERT INTO training_blocks (group_training_id, step, category, title, description, sort_order, target_filled_by, updated_at, created_at) VALUES (1, 2, 'warm_up', 'test', 'test', 0, 'admin', NOW(), NOW())");
    echo 'Insert2 OK';
} catch (\Exception $e) {
    echo $e->getMessage();
}
