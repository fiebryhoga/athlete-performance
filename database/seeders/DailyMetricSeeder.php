<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\DailyMetric;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class DailyMetricSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $athlete = User::where('role', 'athlete')->first();

        if (!$athlete) {
            $this->command->error('Tidak ada user dengan role athlete ditemukan. Silakan buat atlet dulu.');
            return;
        }

        
        $startDate = Carbon::today()->subDays(30);
        $endDate = Carbon::today();

        
        $athlete->update(['training_start_date' => $startDate->format('Y-m-d')]);

        
        DailyMetric::where('user_id', $athlete->id)->delete();

        
        $period = CarbonPeriod::create($startDate, $endDate);
        
        $age = $athlete->age ?? 20;
        $baseWeight = $athlete->weight ?? 70.0;

        $metricsData = [];

        foreach ($period as $date) {
            
            
            $isRestDay = rand(1, 100) <= 10; 

            $dateString = $date->format('Y-m-d');
            $diffInDays = $startDate->diffInDays($date);
            $week = floor($diffInDays / 7) + 1;
            $day = ($diffInDays % 7) + 1;
            $weekLabel = "Week $week, Day $day";

            if ($isRestDay) {
                
                $metricsData[] = [
                    'user_id' => $athlete->id,
                    'record_date' => $dateString,
                    'week' => $weekLabel,
                    'rhr' => 0, 'spo2' => 0, 'weight' => $baseWeight, 'vj' => 0,
                    'peak_power' => 0, 'quick_recovery_score' => 0,
                    'hr_max' => 0, 'hr_ratio' => 0, 'vo2_max' => 0,
                    'recovery_status' => 'KOSONG',
                    'created_at' => now(), 'updated_at' => now()
                ];
                continue;
            }

            
            $rhr = rand(58, 85); 
            $spo2 = rand(96, 99); 
            $weight = $baseWeight + (rand(-10, 10) / 10); 
            $vj = rand(2400, 3400) / 100; 

            
            
            
            $hr_max = 208 - (0.7 * $age);
            $hr_ratio = $hr_max / $rhr;
            $vo2_max = 15.3 * $hr_ratio;

            
            $peak_power = (60.7 * $vj) + (45.3 * $weight) - 2055;

            
            $raw_recovery = (-1.731 * $rhr) + (28.962 * $spo2) + (5.502 * $vj) - 2788.985;
            $quick_recovery_score = max(0, min(100, $raw_recovery));

            
            $recovery_status = 'RECOVERY KURANG';
            if ($quick_recovery_score >= 75) {
                $recovery_status = 'RECOVERY BAIK';
            } elseif ($quick_recovery_score >= 35) {
                $recovery_status = 'RECOVERY CUKUP';
            }

            
            $metricsData[] = [
                'user_id' => $athlete->id,
                'record_date' => $dateString,
                'week' => $weekLabel,
                'rhr' => $rhr,
                'spo2' => $spo2,
                'weight' => $weight,
                'vj' => $vj,
                'peak_power' => round($peak_power, 3),
                'quick_recovery_score' => round($quick_recovery_score, 2),
                'hr_max' => round($hr_max, 2),
                'hr_ratio' => round($hr_ratio, 2),
                'vo2_max' => round($vo2_max, 2),
                'recovery_status' => $recovery_status,
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        
        DailyMetric::insert($metricsData);

        $this->command->info("✅ Berhasil men-generate " . count($metricsData) . " data metrik harian (1 bulan) untuk atlet: " . $athlete->name);
    }
}