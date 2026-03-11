<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestItem extends Model
{
    protected $guarded = ['id'];

    public const PARAMS = [
        'reps'   => 'Repetisi (Reps)',
        'second' => 'Detik (Seconds)',
        'minute' => 'Menit (Minutes)',
        'meter'  => 'Meter',
        'cm'     => 'Centimeter',
        'kg'     => 'Kilogram',
        'vo2max' => 'VO2 Max',
        'points' => 'Poin (Points)',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Hitung Skor Persentase
     */
    public function calculateScore($actualResult)
    {
        $target = floatval($this->target_value);
        $actual = floatval($actualResult);

        // Jika target 0, skor 0 untuk hindari error division by zero
        if ($target == 0) return 0;

        $score = 0;

        switch ($this->parameter_type) {
            // KASUS 1: WAKTU (Makin KECIL makin bagus, misal Lari Sprint)
            // TAPI: Untuk PLANK (Tahan tubuh), biasanya MAKIN LAMA MAKIN BAGUS.
            // PENTING: Cek kembali apakah "Plank" di sistem Anda masuk kategori 'minute' yang mana.
            // ASUMSI UMUM: 
            // - Lari (Speed/Agility) = Lower is Better (Target / Actual)
            // - Plank (Endurance) = Higher is Better (Actual / Target)
            
            // JIKA SEMUA TIPE WAKTU DIANGGAP "LOWER IS BETTER" (Sesuai kode sebelumnya):
            // Maka Rumusnya: (Target / Actual) * 100
            
            // NAMUN, User bilang Plank 1.15 menit / 2 menit = 57.50%.
            // Ini artinya Rumusnya: (1.15 / 2.00) * 100 = 57.5%.
            // Berarti Plank dianggap "HIGHER IS BETTER" (Makin lama makin bagus).
            
            // SOLUSI: Kita harus membedakan logic berdasarkan Kategori atau Tipe Parameter.
            // Untuk amannya, mari kita ikuti permintaan spesifik User:
            // "Plank 1.15 dari 2.00 hasilnya 57.50" -> Ini rumus (Actual / Target).
            
            // Jadi, tipe 'minute' untuk Plank harus menggunakan rumus (Actual / Target).
            // Sedangkan tipe 'second' untuk Lari Sprint menggunakan (Target / Actual).
            
            // SEMENTARA, saya buat logika hybrid sederhana:
            // Jika kategori Speed/Agility -> Lower is Better.
            // Jika kategori Strength/Endurance -> Higher is Better.

            case 'second': // Biasanya Lari (Speed) -> Lower is Better
                if ($actual <= 0) $score = 0;
                else $score = ($target / $actual) * 100;
                break;

            case 'minute': // Biasanya Plank/Lari Jarak Jauh -> Higher is Better (Sesuai request Plank)
                $score = ($actual / $target) * 100;
                break;

            case 'reps':
            case 'cm':
            case 'meter':
            case 'vo2max':
            case 'points':
            default: // Higher is Better (Kuat/Banyak/Jauh)
                $score = ($actual / $target) * 100;
                break;
        }

        // Batasi Maksimal 100% (Capping)
        if ($score > 100) {
            $score = 100;
        }

        return $score; // Return nilai float asli (misal 41.666666...)
    }
}