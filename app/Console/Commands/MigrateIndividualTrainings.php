<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MigrateIndividualTrainings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-individual-trainings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting individual training data migration...');

        if (!\Schema::hasTable('individual_training_programs')) {
            $this->info('Table individual_training_programs does not exist. Nothing to migrate.');
            return;
        }

        $programs = \DB::table('individual_training_programs')->get();
        if ($programs->isEmpty()) {
            $this->info('No old individual training programs found to migrate.');
            return;
        }

        $this->info('Found ' . $programs->count() . ' old programs to migrate.');

        \DB::beginTransaction();
        try {
            // Group programs by individual_training_id and phase (which maps to block category/title)
            $groupedByTraining = $programs->groupBy('individual_training_id');

            foreach ($groupedByTraining as $trainingId => $trainingPrograms) {
                $groupedByPhase = $trainingPrograms->groupBy(function($item) {
                    return strtolower($item->phase ?? 'main_workout');
                });

                $blockOrder = 0;
                foreach ($groupedByPhase as $phase => $items) {
                    $categoryMap = [
                        'warm_up' => 'warm_up',
                        'main_workout' => 'main_workout',
                        'cool_down' => 'cool_down',
                        'stretching' => 'stretching'
                    ];

                    // Find closest category mapping, default to main_workout
                    $category = 'main_workout';
                    foreach ($categoryMap as $key => $val) {
                        if (str_contains($phase, $key)) {
                            $category = $val;
                            break;
                        }
                    }

                    $blockId = \DB::table('training_blocks')->insertGetId([
                        'trainingable_type' => 'App\Models\IndividualTraining',
                        'trainingable_id' => $trainingId,
                        'category' => $category,
                        'title' => ucfirst($phase),
                        'order' => $blockOrder++,
                        'target_filled_by' => 'coach',
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);

                    foreach ($items as $itemOrder => $item) {
                        \DB::table('training_block_items')->insert([
                            'training_block_id' => $blockId,
                            'exercise_id' => $item->exercise_id ?? null,
                            'name' => null,
                            'sets' => $item->sets,
                            'reps' => $item->reps,
                            'duration' => $item->duration,
                            'rest_per_set' => $item->rest,
                            'intensity' => $item->intensity,
                            'note' => $item->notes,
                            'order' => $item->order ?? $itemOrder,
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                    }
                }
            }

            \DB::commit();
            $this->info('Data migration completed successfully.');
            $this->info('You can now safely drop the individual_training_programs table using a migration.');
        } catch (\Exception $e) {
            \DB::rollBack();
            $this->error('Migration failed: ' . $e->getMessage());
        }
    }
}
