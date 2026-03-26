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
        // 1. Cari 1 Atlet (Ambil atlet pertama di database)
        $athlete = User::where('role', 'athlete')->first();

        if (!$athlete) {
            $this->command->error('Tidak ada user dengan role athlete ditemukan. Silakan buat atlet dulu.');
            return;
        }

        // 2. Set Tanggal Mulai (30 hari yang lalu)
        $startDate = Carbon::today()->subDays(30);
        $endDate = Carbon::today();

        // Update tanggal start latihan si atlet
        $athlete->update(['training_start_date' => $startDate->format('Y-m-d')]);

        // Hapus data metrik lama milik atlet ini (agar bersih)
        DailyMetric::where('user_id', $athlete->id)->delete();

        // 3. Looping dari 30 hari lalu sampai hari ini
        $period = CarbonPeriod::create($startDate, $endDate);
        
        $age = $athlete->age ?? 20;
        $baseWeight = $athlete->weight ?? 70.0;

        $metricsData = [];

        foreach ($period as $date) {
            // -- SIMULASI DATA MENTAH REALISTIS --
            // Kadang-kadang atlet libur (probabilitas 10% hari libur/kosong)
            $isRestDay = rand(1, 100) <= 10; 

            $dateString = $date->format('Y-m-d');
            $diffInDays = $startDate->diffInDays($date);
            $week = floor($diffInDays / 7) + 1;
            $day = ($diffInDays % 7) + 1;
            $weekLabel = "Week $week, Day $day";

            if ($isRestDay) {
                // Input Data Kosong (Hari Libur)
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

            // Simulasi Fluktuasi Data
            $rhr = rand(58, 85); // RHR normal-tinggi (kecapekan)
            $spo2 = rand(96, 99); // SpO2 normal
            $weight = $baseWeight + (rand(-10, 10) / 10); // BB fluktuasi +/- 1 Kg
            $vj = rand(2400, 3400) / 100; // VJ fluktuasi antara 24.00 - 34.00 cm

            // -- KALKULASI RUMUS SAINS OLAHRAGA --
            
            // A. VO2Max
            $hr_max = 208 - (0.7 * $age);
            $hr_ratio = $hr_max / $rhr;
            $vo2_max = 15.3 * $hr_ratio;

            // B. Peak Power (Sayers Formula)
            $peak_power = (60.7 * $vj) + (45.3 * $weight) - 2055;

            // C. Quick Recovery (Regresi Linier)
            $raw_recovery = (-1.731 * $rhr) + (28.962 * $spo2) + (5.502 * $vj) - 2788.985;
            $quick_recovery_score = max(0, min(100, $raw_recovery));

            // D. Status Recovery
            $recovery_status = 'RECOVERY KURANG';
            if ($quick_recovery_score >= 75) {
                $recovery_status = 'RECOVERY BAIK';
            } elseif ($quick_recovery_score >= 35) {
                $recovery_status = 'RECOVERY CUKUP';
            }

            // Simpan ke array
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

        // 4. Insert ke Database secara massal
        DailyMetric::insert($metricsData);

        $this->command->info("✅ Berhasil men-generate " . count($metricsData) . " data metrik harian (1 bulan) untuk atlet: " . $athlete->name);
    }
}