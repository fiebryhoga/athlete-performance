<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$g = App\Models\GroupTraining::latest('id')->first();
echo "GroupTraining DB raw date: " . $g->getRawOriginal('date') . "\n";
echo "GroupTraining date property: " . $g->date . "\n";
echo "GroupTraining JSON: " . json_encode($g->toArray()) . "\n\n";

$i = App\Models\IndividualTraining::latest('id')->first();
echo "IndividualTraining DB raw date: " . $i->getRawOriginal('date') . "\n";
echo "IndividualTraining date property: " . $i->date . "\n";
echo "IndividualTraining JSON: " . json_encode($i->toArray()) . "\n";
