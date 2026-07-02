<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ClearWellnessData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-wellness';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clears all Wellness & RPE data and related settings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::table('wellness_rpes')->truncate();
        $this->info('Wellness & RPE data cleared successfully.');

        DB::table('settings')->where('key', 'season_start_date')->delete();
        $this->info('Season start date setting removed.');

        $this->info('All done!');
    }
}
