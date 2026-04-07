<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\TrainingLoad;
use Carbon\Carbon;

class TrainingLoadVol006Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $athlete = User::where('athlete_id', 'VOL-006')->first();

        if (!$athlete) {
            $this->command->error("Atlet dengan ID VOL-006 tidak ditemukan! Pastikan atlet sudah ada di database.");
            return;
        }

        
        
        $startDate = Carbon::today()->subDays(39); 

        
        TrainingLoad::where('user_id', $athlete->id)->delete();

        $this->command->info("Menanam (seeding) 40 data Wellness & Training Load untuk {$athlete->name} (VOL-006)...");

        
        $amTypes = ['Power', 'Strength UB', 'Strength LB', 'Conditioning', 'Injury Prevention'];
        $pmTypes = ['Tactical', 'Technical', 'Skills', 'Match', 'Speed/Agility'];

        
        for ($i = 0; $i < 40; $i++) {
            $currentDate = clone $startDate;
            $currentDate->addDays($i);
            
            $dayOfWeek = $currentDate->dayOfWeek; 

            
            
            
            
            $sleep = rand(3, 5);
            $fatigue = rand(2, 5);
            $soreness = rand(2, 4); 
            $stress = rand(3, 5);
            $motivation = rand(3, 5);
            $health = rand(4, 5);
            $mood = rand(3, 5);
            $study = rand(3, 5);

            $wellness_score = $sleep + $fatigue + $soreness + $stress + $motivation + $health + $mood + $study;

            
            
            
            $am_type = null; $am_rpe = null; $am_duration = null;
            $pm_type = null; $pm_rpe = null; $pm_duration = null;

            
            if ($dayOfWeek == 0) { 
                if (rand(1, 100) > 50) { 
                    $pm_type = 'Recovery';
                    $pm_rpe = rand(1, 3);
                    $pm_duration = rand(30, 45); 
                }
            } else {
                
                if (rand(1, 100) <= 60) {
                    $am_type = $amTypes[array_rand($amTypes)];
                    $am_rpe = rand(5, 8); 
                    $am_duration = rand(45, 90); 
                }

                
                if (rand(1, 100) <= 90) {
                    $pm_type = $pmTypes[array_rand($pmTypes)];
                    
                    if ($dayOfWeek == 6 && rand(1,100) > 30) {
                        $pm_type = 'Match';
                        $pm_rpe = rand(8, 10); 
                        $pm_duration = rand(90, 120);
                    } else {
                        $pm_rpe = rand(5, 9);
                        $pm_duration = rand(60, 120);
                    }
                }
            }

            
            $am_load = ($am_rpe && $am_duration) ? ($am_rpe * $am_duration) : 0;
            $pm_load = ($pm_rpe && $pm_duration) ? ($pm_rpe * $pm_duration) : 0;
            $daily_load = $am_load + $pm_load;

            
            TrainingLoad::create([
                'user_id' => $athlete->id,
                'record_date' => $currentDate->format('Y-m-d'),
                
                'sleep_quality' => $sleep,
                'fatigue' => $fatigue,
                'muscle_soreness' => $soreness,
                'stress' => $stress,
                'motivation' => $motivation,
                'health' => $health,
                'mood' => $mood,
                'study_attitude' => $study,
                'wellness_score' => $wellness_score,
                
                'am_session_type' => $am_type,
                'am_rpe' => $am_rpe,
                'am_duration' => $am_duration,
                'am_load' => $am_load,
                
                'pm_session_type' => $pm_type,
                'pm_rpe' => $pm_rpe,
                'pm_duration' => $pm_duration,
                'pm_load' => $pm_load,
                
                'daily_load' => $daily_load
            ]);
        }

        $this->command->info('Sukses! 40 hari data Wellness & Training Load berhasil ditambahkan.');
    }
}