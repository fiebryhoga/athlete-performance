<?php

namespace Database\Seeders;

use App\Models\HelpCategory;
use App\Models\HelpGuide;
use App\Models\HelpGuideStep;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HelpGuideSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Categories
        $categories = [
            [
                'name' => 'Wellness & Pemulihan',
                'slug' => 'wellness-pemulihan',
                'icon' => 'HeartPulse',
                'order' => 1,
            ],
            [
                'name' => 'Program & Sesi Latihan',
                'slug' => 'program-sesi-latihan',
                'icon' => 'CalendarDays',
                'order' => 2,
            ],
            [
                'name' => 'Nutrisi & Pola Makan',
                'slug' => 'nutrisi-pola-makan',
                'icon' => 'UtensilsCrossed',
                'order' => 3,
            ],
            [
                'name' => 'Tes Fisik & Analisis',
                'slug' => 'tes-fisik-analisis',
                'icon' => 'Timer',
                'order' => 4,
            ],
            [
                'name' => 'Akun & Profil',
                'slug' => 'akun-profil',
                'icon' => 'UserCog',
                'order' => 5,
            ],
            [
                'name' => 'Operasional & Pelatih',
                'slug' => 'operasional-pelatih',
                'icon' => 'Building2',
                'order' => 6,
            ],
        ];

        $categoryMap = [];
        foreach ($categories as $cat) {
            $createdCat = HelpCategory::updateOrCreate(
                ['slug' => $cat['slug']],
                $cat
            );
            $categoryMap[$cat['slug']] = $createdCat->id;
        }

        // 2. Guides for Athlete (Client)
        $wellnessGuide = HelpGuide::updateOrCreate(
            ['slug' => 'cara-mengisi-wellness-kuisioner-harian'],
            [
                'category_id' => $categoryMap['wellness-pemulihan'],
                'title' => 'Cara Mengisi Kuesioner Wellness Harian',
                'slug' => 'cara-mengisi-wellness-kuisioner-harian',
                'target_role' => 'athlete',
                'summary' => 'Panduan lengkap bagi atlet/klien untuk mengisi kuisioner wellness setiap pagi guna memantau kesiapan fisik dan tingkat kelelahan.',
                'content' => 'Kuesioner Wellness wajib diisi setiap pagi sebelum memulai aktivitas atau sesi latihan. Data ini membantu pelatih menyesuaikan intensitas beban latihan sesuai kesiapan fisik Anda.',
                'is_published' => true,
                'order' => 1,
            ]
        );

        // Delete old steps if any and re-create
        HelpGuideStep::where('help_guide_id', $wellnessGuide->id)->delete();
        $wellnessSteps = [
            [
                'step_number' => 1,
                'title' => 'Buka Menu Wellness & Beban',
                'description' => 'Pada navigasi sidebar di sebelah kiri, klik menu "Wellness & Beban" di bawah kelompok Recovery Tracking.',
                'tip' => 'Pastikan Anda mengisi formulir ini saat baru bangun pagi atau sebelum sesi latihan pertama dimulai.',
            ],
            [
                'step_number' => 2,
                'title' => 'Pilih Tanggal & Buka Formulir',
                'description' => 'Sistem akan secara otomatis membuka tanggal hari ini. Klik tombol "+ Input Wellness Hari Ini" atau pilih tanggal yang ingin Anda isi.',
                'tip' => 'Jika Anda melewatkan pengisian kemarin, Anda tetap bisa memilih tanggal sebelumnya melalui kalender.',
            ],
            [
                'step_number' => 3,
                'title' => 'Isi Indikator Kesiapan (Skala 1 - 5)',
                'description' => 'Beri penilaian pada parameter: Tingkat Kelelahan (Fatigue), Kualitas Tidur (Sleep Quality), Nyeri Otot (Muscle Soreness), Tingkat Stres (Stress Level), dan Mood.',
                'tip' => 'Skor 1 menunjukkan kondisi sangat buruk/sakit, sedangkan skor 5 menunjukkan kondisi sangat prima/segar.',
            ],
            [
                'step_number' => 4,
                'title' => 'Tambahkan Catatan atau Lokasi Nyeri (Opsional)',
                'description' => 'Jika ada keluhan khusus seperti cedera ringan atau area otot tertentu yang terasa pegal, tuliskan pada kolom catatan untuk diketahui pelatih.',
                'tip' => 'Komunikasi yang jelas membantu pelatih memodifikasi menu latihan demi mencegah cedera.',
            ],
            [
                'step_number' => 5,
                'title' => 'Simpan & Pantau Skor Kesiapan',
                'description' => 'Klik tombol "Simpan Wellness". Nilai total wellness dan status kesiapan Anda (Zona Hijau/Kuning/Merah) akan langsung diperbarui.',
                'tip' => 'Zona Merah berarti tubuh membutuhkan pemulihan ekstra; pelatih akan menerima peringatan otomatis.',
            ],
        ];

        foreach ($wellnessSteps as $step) {
            HelpGuideStep::create(array_merge($step, ['help_guide_id' => $wellnessGuide->id]));
        }

        // Guide 2: Athlete - Cara Mengisi RPE Setelah Latihan
        $rpeGuide = HelpGuide::updateOrCreate(
            ['slug' => 'cara-mengisi-rpe-setelah-latihan'],
            [
                'category_id' => $categoryMap['program-sesi-latihan'],
                'title' => 'Cara Mengisi RPE & Feedback Setelah Latihan',
                'slug' => 'cara-mengisi-rpe-setelah-latihan',
                'target_role' => 'athlete',
                'summary' => 'Panduan cara mencatat Rating of Perceived Exertion (RPE) dan menyelesaikan sesi latihan yang telah dijalani.',
                'content' => 'RPE (Rating of Perceived Exertion) skala 1-10 digunakan untuk mengukur seberapa berat sesi latihan yang Anda rasakan.',
                'is_published' => true,
                'order' => 2,
            ]
        );
        HelpGuideStep::where('help_guide_id', $rpeGuide->id)->delete();
        $rpeSteps = [
            [
                'step_number' => 1,
                'title' => 'Masuk ke Menu Program Latihan',
                'description' => 'Buka menu "Program Latihan" pada sidebar untuk melihat daftar sesi latihan Anda.',
                'tip' => 'Sesi yang dijadwalkan hari ini akan berada di bagian teratas kalender atau daftar sesi.',
            ],
            [
                'step_number' => 2,
                'title' => 'Pilih Sesi Latihan yang Diselesaikan',
                'description' => 'Klik kartu sesi latihan untuk membuka detail gerakan dan target beban.',
                'tip' => 'Anda dapat melihat video referensi atau catatan repetisi yang diberikan oleh pelatih.',
            ],
            [
                'step_number' => 3,
                'title' => 'Beri Rating RPE (Skala 1 - 10)',
                'description' => 'Tentukan seberapa berat sesi latihan: Skala 1-3 (Sangat Ringan), 4-6 (Sedang), 7-8 (Berat), 9-10 (Maksimal).',
                'tip' => 'Kombinasi RPE x Durasi (Menit) akan menghasilkan Total Training Load (sRPE).',
            ],
            [
                'step_number' => 4,
                'title' => 'Konfirmasi Selesai & Beri Feedback',
                'description' => 'Tuliskan catatan singkat jika ada kendala beban atau nyeri, lalu klik tombol "Selesaikan Sesi Latihan".',
                'tip' => 'Pelatih akan langsung melihat laporan pemenuhan beban latihan Anda secara real-time.',
            ],
        ];
        foreach ($rpeSteps as $step) {
            HelpGuideStep::create(array_merge($step, ['help_guide_id' => $rpeGuide->id]));
        }

        // Guide 3: Athlete - Tracking Nutrisi
        $mealGuide = HelpGuide::updateOrCreate(
            ['slug' => 'cara-melihat-rencana-makan-dan-tracking-nutrisi'],
            [
                'category_id' => $categoryMap['nutrisi-pola-makan'],
                'title' => 'Cara Melihat Rencana Makan & Tracking Nutrisi',
                'slug' => 'cara-melihat-rencana-makan-dan-tracking-nutrisi',
                'target_role' => 'athlete',
                'summary' => 'Panduan memantau target kalori harian, makronutrisi (Protein, Karbohidrat, Lemak), dan mencatat kepatuhan makan.',
                'content' => 'Menu Rencana Makan membantu Anda menyelaraskan asupan gizi dengan fase program latihan yang sedang berjalan.',
                'is_published' => true,
                'order' => 3,
            ]
        );
        HelpGuideStep::where('help_guide_id', $mealGuide->id)->delete();
        $mealSteps = [
            [
                'step_number' => 1,
                'title' => 'Akses Menu Rencana Makan',
                'description' => 'Klik "Rencana Makan" di sidebar di bawah menu Nutrisi & Diet.',
                'tip' => 'Pelatih atau nutrisionis Anda telah menyusun target kalori dan pembagian porsi makan harian.',
            ],
            [
                'step_number' => 2,
                'title' => 'Cek Pembagian Jadwal Makan (Breakfast, Lunch, Dinner, Snack)',
                'description' => 'Lihat rekomendasi menu, jumlah gramasi bahan, dan rincian protein/karbo/lemak untuk setiap waktu makan.',
                'tip' => 'Gunakan fitur checkbox atau checklist harian untuk menandai makanan yang sudah Anda konsumsi.',
            ],
        ];
        foreach ($mealSteps as $step) {
            HelpGuideStep::create(array_merge($step, ['help_guide_id' => $mealGuide->id]));
        }

        // 3. Guides for Coach
        $coachTrainingGuide = HelpGuide::updateOrCreate(
            ['slug' => 'cara-membuat-program-latihan-klien'],
            [
                'category_id' => $categoryMap['program-sesi-latihan'],
                'title' => 'Cara Membuat Sesi Program Latihan Klien',
                'slug' => 'cara-membuat-program-latihan-klien',
                'target_role' => 'coach',
                'summary' => 'Panduan bagi pelatih untuk merancang blok latihan individual maupun grup dengan parameter set, repetisi, dan beban target.',
                'content' => 'Fitur Program Latihan memungkinkan pelatih menyusun program berbasis blok (Warm-up, Main Set, Accessory, Cool-down) dengan integrasi Master Exercise.',
                'is_published' => true,
                'order' => 1,
            ]
        );
        HelpGuideStep::where('help_guide_id', $coachTrainingGuide->id)->delete();
        $coachTrainingSteps = [
            [
                'step_number' => 1,
                'title' => 'Buka Menu Program Latihan & Pilih Klien',
                'description' => 'Navigasi ke menu "Program Latihan" pada sidebar, lalu pilih nama klien/atlet yang ingin dibuatkan program.',
                'tip' => 'Anda juga bisa membuat sesi grup melalui menu Latihan Grup jika melatih beberapa atlet sekaligus.',
            ],
            [
                'step_number' => 2,
                'title' => 'Klik "+ Buat Sesi Baru"',
                'description' => 'Tentukan nama sesi (misal: "Lower Body Strength & Power"), tanggal pelaksanaan, dan durasi perkiraan.',
                'tip' => 'Gunakan template paket latihan jika ingin memuat rangkaian gerakan siap pakai secara cepat.',
            ],
            [
                'step_number' => 3,
                'title' => 'Tambahkan Blok Latihan & Gerakan',
                'description' => 'Tambahkan blok (misal: Blok A - Compound Movement), lalu cari gerakan dari database Master Exercise. Masukkan target Set, Repetisi, %1RM atau Beban (kg), dan Waktu Istirahat.',
                'tip' => 'Anda dapat mengisi video YouTube demonstrasi atau catatan instruksi khusus untuk atlet.',
            ],
            [
                'step_number' => 4,
                'title' => 'Simpan & Publikasikan ke Klien',
                'description' => 'Klik "Simpan Sesi". Program latihan akan langsung muncul pada kalender aplikasi klien.',
                'tip' => 'Anda dapat menduplikat sesi latihan ke tanggal lain dengan 1 klik melalui tombol "Duplikat Sesi".',
            ],
        ];
        foreach ($coachTrainingSteps as $step) {
            HelpGuideStep::create(array_merge($step, ['help_guide_id' => $coachTrainingGuide->id]));
        }

        // Guide 5: Coach - Evaluasi DPA & PHV
        $coachDpaGuide = HelpGuide::updateOrCreate(
            ['slug' => 'cara-mengisi-evaluasi-dpa-dan-postur'],
            [
                'category_id' => $categoryMap['tes-fisik-analisis'],
                'title' => 'Cara Mengisi Evaluasi DPA & Analisis Postur',
                'slug' => 'cara-mengisi-evaluasi-dpa-dan-postur',
                'target_role' => 'coach',
                'summary' => 'Panduan menjalankan tes Dynamic Postural Assessment (DPA), menginput kompensasi gerakan, dan menghasilkan rekomendasi koreksi.',
                'content' => 'DPA digunakan untuk menganalisis disfungsi gerak fungsional dan kompensasi postural atlet.',
                'is_published' => true,
                'order' => 2,
            ]
        );
        HelpGuideStep::where('help_guide_id', $coachDpaGuide->id)->delete();
        $coachDpaSteps = [
            [
                'step_number' => 1,
                'title' => 'Buka Menu Analysis DPA',
                'description' => 'Pilih menu "Analysis DPA" di sidebar di bawah kelompok Tes & Evaluasi.',
                'tip' => 'Pilih atlet yang akan dievaluasi dari daftar atlet aktif.',
            ],
            [
                'step_number' => 2,
                'title' => 'Input Hasil Pengamatan Tes Gerak',
                'description' => 'Centang indikator kompensasi yang tampak pada pandangan Anterior, Lateral, dan Posterior (misal: Knee Valgus, Excessive Forward Lean, Arms Fall Forward).',
                'tip' => 'Sistem akan otomatis menghitung Total Skor DPA dan tingkat keparahan risiko cedera.',
            ],
            [
                'step_number' => 3,
                'title' => 'Generate Rekomendasi Korektif & Export PDF',
                'description' => 'Sistem akan memetakan otot yang Overactive vs Underactive dan menyusun rekomendasi latihan korektif yang bisa langsung diekspor ke PDF.',
                'tip' => 'Gunakan laporan PDF ini untuk dipresentasikan langsung kepada klien atau orang tua atlet.',
            ],
        ];
        foreach ($coachDpaSteps as $step) {
            HelpGuideStep::create(array_merge($step, ['help_guide_id' => $coachDpaGuide->id]));
        }

        // Guide 6: General (All) - Ubah Password & Profil
        $profileGuide = HelpGuide::updateOrCreate(
            ['slug' => 'cara-mengubah-profil-dan-password-akun'],
            [
                'category_id' => $categoryMap['akun-profil'],
                'title' => 'Cara Mengubah Foto Profil, Data Diri, & Password',
                'slug' => 'cara-mengubah-profil-dan-password-akun',
                'target_role' => 'all',
                'summary' => 'Panduan memperbarui profil akun, mengunggah foto profil, dan mengganti kata sandi demi keamanan akun.',
                'content' => 'Setiap pengguna dapat memperbarui foto profil dan kata sandi sewaktu-waktu melalui menu Pengaturan Akun.',
                'is_published' => true,
                'order' => 1,
            ]
        );
        HelpGuideStep::where('help_guide_id', $profileGuide->id)->delete();
        $profileSteps = [
            [
                'step_number' => 1,
                'title' => 'Klik Avatar / Nama Pengguna di Pojok Kanan Atas',
                'description' => 'Pada navbar kanan atas, klik nama atau foto Anda lalu pilih opsi "Profil & Keamanan".',
                'tip' => 'Anda juga bisa mengakses halaman profil melalui tombol Edit di samping foto navbar.',
            ],
            [
                'step_number' => 2,
                'title' => 'Update Informasi atau Ganti Kata Sandi',
                'description' => 'Unggah foto profil baru, ubah nomor telepon / kontak darurat, atau masukkan password lama dan password baru pada form Keamanan.',
                'tip' => 'Pastikan menggunakan password yang kuat minimal 8 karakter dengan kombinasi angka.',
            ],
        ];
        foreach ($profileSteps as $step) {
            HelpGuideStep::create(array_merge($step, ['help_guide_id' => $profileGuide->id]));
        }
    }
}
