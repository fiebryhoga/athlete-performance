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
        // 1. Cari Atlet dengan ID VOL-006
        $athlete = User::where('athlete_id', 'VOL-006')->first();

        if (!$athlete) {
            $this->command->error("Atlet dengan ID VOL-006 tidak ditemukan! Pastikan atlet sudah ada di database.");
            return;
        }

        // Tentukan Tanggal Mulai (40 Hari yang Lalu dari hari ini)
        // Kita gunakan 39 untuk mencakup tepat 40 hari termasuk hari ini
        $startDate = Carbon::today()->subDays(39); 

        // Bersihkan data lama untuk VOL-006 agar tidak tumpang tindih
        TrainingLoad::where('user_id', $athlete->id)->delete();

        $this->command->info("Menanam (seeding) 40 data Wellness & Training Load untuk {$athlete->name} (VOL-006)...");

        // Daftar opsi latihan yang masuk akal
        $amTypes = ['Power', 'Strength UB', 'Strength LB', 'Conditioning', 'Injury Prevention'];
        $pmTypes = ['Tactical', 'Technical', 'Skills', 'Match', 'Speed/Agility'];

        // Loop untuk membuat 40 baris data
        for ($i = 0; $i < 40; $i++) {
            $currentDate = clone $startDate;
            $currentDate->addDays($i);
            
            $dayOfWeek = $currentDate->dayOfWeek; // 0 = Minggu, 1 = Senin, dst.

            // ==========================================
            // 1. GENERATE DATA WELLNESS (Skala 1 - 5)
            // ==========================================
            // Kita atur agar nilainya fluktuatif namun realistis
            $sleep = rand(3, 5);
            $fatigue = rand(2, 5);
            $soreness = rand(2, 4); // Otot sering pegal
            $stress = rand(3, 5);
            $motivation = rand(3, 5);
            $health = rand(4, 5);
            $mood = rand(3, 5);
            $study = rand(3, 5);

            $wellness_score = $sleep + $fatigue + $soreness + $stress + $motivation + $health + $mood + $study;

            // ==========================================
            // 2. GENERATE BEBAN LATIHAN (LOAD)
            // ==========================================
            $am_type = null; $am_rpe = null; $am_duration = null;
            $pm_type = null; $pm_rpe = null; $pm_duration = null;

            // Logika: Hari Minggu biasanya libur atau hanya Recovery ringan
            if ($dayOfWeek == 0) { 
                if (rand(1, 100) > 50) { // 50% kemungkinan ada sesi recovery
                    $pm_type = 'Recovery';
                    $pm_rpe = rand(1, 3);
                    $pm_duration = rand(30, 45); // 30-45 menit
                }
            } else {
                // Hari biasa: Sesi Pagi (AM) - 60% kemungkinan atlet melakukan sesi pagi
                if (rand(1, 100) <= 60) {
                    $am_type = $amTypes[array_rand($amTypes)];
                    $am_rpe = rand(5, 8); // Cukup berat
                    $am_duration = rand(45, 90); // 45-90 menit
                }

                // Hari biasa: Sesi Sore (PM) - 90% kemungkinan atlet latihan taktik/skill di sore hari
                if (rand(1, 100) <= 90) {
                    $pm_type = $pmTypes[array_rand($pmTypes)];
                    // Jika hari sabtu (6), mungkin Match
                    if ($dayOfWeek == 6 && rand(1,100) > 30) {
                        $pm_type = 'Match';
                        $pm_rpe = rand(8, 10); // Sangat berat
                        $pm_duration = rand(90, 120);
                    } else {
                        $pm_rpe = rand(5, 9);
                        $pm_duration = rand(60, 120);
                    }
                }
            }

            // Kalkulasi matematika Load
            $am_load = ($am_rpe && $am_duration) ? ($am_rpe * $am_duration) : 0;
            $pm_load = ($pm_rpe && $pm_duration) ? ($pm_rpe * $pm_duration) : 0;
            $daily_load = $am_load + $pm_load;

            // Simpan ke Database
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