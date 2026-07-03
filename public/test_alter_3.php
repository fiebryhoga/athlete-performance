<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $cols = \Illuminate\Support\Facades\Schema::getColumnListing('training_block_items');
    echo json_encode($cols);
} catch (\Exception $e) {
    echo $e->getMessage();
}
