<?php
if (function_exists('opcache_reset')) {
    opcache_reset();
}

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    Illuminate\Support\Facades\DB::statement("ALTER TABLE `training_blocks` ADD `group_training_id` bigint unsigned DEFAULT NULL AFTER `individual_training_id`");
    Illuminate\Support\Facades\DB::statement("ALTER TABLE `training_blocks` MODIFY `individual_training_id` bigint unsigned DEFAULT NULL");
    
    // Add foreign key constraint if possible, but safe_migrate might not need it for now.
    
    echo "<h1>Added group_training_id to training_blocks successfully</h1>";
} catch (\Throwable $e) {
    echo "<h1>Error: " . $e->getMessage() . "</h1>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
