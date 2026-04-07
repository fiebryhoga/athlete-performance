<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\DailyMetric;
use Carbon\Carbon;

class DailyMetricVol006Seeder extends Seeder
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

        
        $dataMetrics = [
            ['rhr' => 66, 'spo2' => 98, 'weight' => 70, 'vj' => 35.43],
            ['rhr' => 69, 'spo2' => 98, 'weight' => 70, 'vj' => 44.26],
            ['rhr' => 83, 'spo2' => 98, 'weight' => 70, 'vj' => 39.73],
            ['rhr' => 75, 'spo2' => 99, 'weight' => 70, 'vj' => 39.73],
            ['rhr' => 62, 'spo2' => 98, 'weight' => 70, 'vj' => 39.73],
            ['rhr' => 68, 'spo2' => 98, 'weight' => 70, 'vj' => 44.26],
            ['rhr' => 72, 'spo2' => 99, 'weight' => 70, 'vj' => 44.26],
            ['rhr' => 79, 'spo2' => 99, 'weight' => 70, 'vj' => 49.05],
            ['rhr' => 82, 'spo2' => 99, 'weight' => 70, 'vj' => 43.58],
            ['rhr' => 89, 'spo2' => 98, 'weight' => 70, 'vj' => 49.05],
            
            ['rhr' => 66, 'spo2' => 98, 'weight' => 70, 'vj' => 35.43],
            ['rhr' => 69, 'spo2' => 98, 'weight' => 70, 'vj' => 44.26],
            ['rhr' => 83, 'spo2' => 98, 'weight' => 70, 'vj' => 39.73],
            ['rhr' => 75, 'spo2' => 99, 'weight' => 70, 'vj' => 39.73],
            ['rhr' => 62, 'spo2' => 98, 'weight' => 70, 'vj' => 39.73],
            ['rhr' => 68, 'spo2' => 98, 'weight' => 70, 'vj' => 44.26],
            ['rhr' => 72, 'spo2' => 99, 'weight' => 70, 'vj' => 44.26],
            ['rhr' => 79, 'spo2' => 99, 'weight' => 70, 'vj' => 49.05],
            ['rhr' => 82, 'spo2' => 99, 'weight' => 70, 'vj' => 43.58],
            ['rhr' => 89, 'spo2' => 98, 'weight' => 70, 'vj' => 49.05],
            ['rhr' => 90, 'spo2' => 98.00, 'weight' => 70, 'vj' => 35.40],
            ['rhr' => 79, 'spo2' => 97, 'weight' => 70, 'vj' => 44.26],
            ['rhr' => 80, 'spo2' => 98, 'weight' => 70, 'vj' => 39.70],
            ['rhr' => 86, 'spo2' => 99, 'weight' => 70, 'vj' => 44.26],
            ['rhr' => 86, 'spo2' => 98, 'weight' => 70, 'vj' => 53.21],
            ['rhr' => 80, 'spo2' => 98, 'weight' => 70, 'vj' => 49.05],
            ['rhr' => 93, 'spo2' => 97.00, 'weight' => 70, 'vj' => 54.07],
            ['rhr' => 73, 'spo2' => 96, 'weight' => 70, 'vj' => 49.05],
            ['rhr' => 85, 'spo2' => 98, 'weight' => 70, 'vj' => 54.07],
            ['rhr' => 77, 'spo2' => 99, 'weight' => 70, 'vj' => 59.30],
            ['rhr' => 74, 'spo2' => 98.00, 'weight' => 70, 'vj' => 59.35],
            ['rhr' => 63, 'spo2' => 98, 'weight' => 70, 'vj' => 69.18],
            ['rhr' => 76, 'spo2' => 98, 'weight' => 70, 'vj' => 70.63],
            ['rhr' => 73, 'spo2' => 99, 'weight' => 70, 'vj' => 54.07],
            ['rhr' => 70, 'spo2' => 99, 'weight' => 70, 'vj' => 59.35],
            ['rhr' => 78, 'spo2' => 98, 'weight' => 70, 'vj' => 59.35],
            ['rhr' => 78, 'spo2' => 98, 'weight' => 70, 'vj' => 30.00],
            ['rhr' => 71, 'spo2' => 98, 'weight' => 70, 'vj' => 54.07],
            ['rhr' => 72, 'spo2' => 99.00, 'weight' => 70, 'vj' => 59.35],
            ['rhr' => 80, 'spo2' => 99, 'weight' => 70, 'vj' => 64.86],
        ];

        
        $startDate = Carbon::today()->subDays(count($dataMetrics) - 1);
        $athlete->update(['training_start_date' => $startDate->format('Y-m-d')]);

        
        DailyMetric::where('user_id', $athlete->id)->delete();

        $this->command->info("Menanam (seeding) 40 data metrik harian untuk {$athlete->name} (VOL-006)...");

        
        foreach ($dataMetrics as $index => $data) {
            $currentDate = clone $startDate;
            $currentDate->addDays($index);

            
            $week = floor($index / 7) + 1;
            $day = ($index % 7) + 1;
            $weekLabel = "Week $week, Day $day";

            
            $age = $athlete->age ?? 20; 
            $hr_max = 208 - (0.7 * $age);
            $hr_ratio = $data['rhr'] > 0 ? ($hr_max / $data['rhr']) : 0;
            $vo2_max = 15.3 * $hr_ratio;

            $peak_power = (60.7 * $data['vj']) + (45.3 * $data['weight']) - 2055;

            $raw_recovery = (-1.731 * $data['rhr']) + (28.962 * $data['spo2']) + (5.502 * $data['vj']) - 2788.985;
            $quick_recovery_score = max(0, min(100, $raw_recovery));

            $recovery_status = 'RECOVERY KURANG';
            if ($quick_recovery_score >= 75) {
                $recovery_status = 'RECOVERY BAIK';
            } elseif ($quick_recovery_score >= 35) {
                $recovery_status = 'RECOVERY CUKUP';
            }

            
            DailyMetric::create([
                'user_id' => $athlete->id,
                'record_date' => $currentDate->format('Y-m-d'),
                'week' => $weekLabel,
                'rhr' => $data['rhr'],
                'spo2' => $data['spo2'],
                'weight' => $data['weight'],
                'vj' => $data['vj'],
                'peak_power' => round($peak_power, 3), 
                'quick_recovery_score' => round($quick_recovery_score, 2),
                'hr_max' => round($hr_max, 2),
                'hr_ratio' => round($hr_ratio, 2),
                'vo2_max' => round($vo2_max, 2),
                'recovery_status' => $data['rhr'] > 0 ? $recovery_status : 'KOSONG' 
            ]);
        }

        $this->command->info('Sukses! 40 hari data metrik berhasil ditambahkan.');
    }
}