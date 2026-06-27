<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DropTempTable extends Command
{
    protected $signature = 'db:drop-temp';
    protected $description = 'Drop stuck table';

    public function handle()
    {
        Schema::dropIfExists('exercise_exercise_package');
        $this->info('Table dropped');
    }
}
