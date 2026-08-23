# Panduan Lengkap Peak Height Velocity (PHV)
### Konsep, Rumus Perhitungan, Interpretasi, dan Implikasi Latihan untuk Atlet

---

## 1. Pendahuluan & Konsep Dasar

### 1.1 Apa itu Peak Height Velocity (PHV)?
**Peak Height Velocity (PHV)** adalah periode waktu ketika seorang anak atau remaja mengalami laju pertumbuhan tinggi badan tercepat selama masa lonjakan pertumbuhan pubertas (*adolescent growth spurt*).

Dalam pembinaan performa atlet usia muda, pemantauan kematangan biologis sangat penting karena:
* **Usia Kronologis vs Usia Biologis**: Dua atlet dengan usia tanggal lahir yang sama (misalnya 14 tahun) dapat memiliki tingkat kematangan biologis yang sangat berbeda (satu atlet sudah bertubuh dewasa, sementara yang lain belum mengalami pubertas).
* **Bio-banding**: Pengelompokan atlet berdasarkan tingkat kematangan tubuh agar latihan lebih aman dan kompetisi lebih adil.
* **Window of Trainability**: Menentukan fase paling optimal untuk melatih kecepatan, kekuatan, daya tahan, dan kelincahan sesuai perkembangan hormonal tubuh.
* **Pencegahan Cedera**: Fase puncak pertumbuhan (*Circa-PHV*) merupakan masa paling rentan terhadap cedera traksi apofisis (seperti *Osgood-Schlatter* pada lutut atau *Sever's disease* pada tumit) karena tulang memanjang lebih cepat dibanding elastisitas otot dan tendon.

---

## 2. Parameter Input Pengukuran (Antropometri)

Untuk menghitung estimasi PHV, diperlukan data antropometri berikut:

| Parameter | Simbol | Satuan | Deskripsi & Metode Pengukuran |
| :--- | :---: | :---: | :--- |
| **Jenis Kelamin** | `Gender` | Laki-laki / Perempuan | Jenis kelamin atlet |
| **Usia Kronologis** | `Age` | Tahun (desimal) | Usia atlet saat pengukuran (contoh: 13.5 tahun) |
| **Tinggi Berdiri** (*Standing Height*) | `H` | cm | Diukur menggunakan stadiometer tegak tanpa alas kaki |
| **Tinggi Duduk** (*Sitting Height*) | `SH` | cm | Diukur saat atlet duduk tegak di atas bangku datar |
| **Panjang Tungkai** (*Leg Length*) | `LL` | cm | Dihitung dari selisih: **Panjang Tungkai = Tinggi Berdiri − Tinggi Duduk** |
| **Berat Badan** (*Body Weight*) | `W` | kg | Diukur menggunakan timbangan terkalibrasi |

---

## 3. Rumus Utama: Persamaan Mirwald (Maturity Offset)

Aplikasi ini menggunakan **Persamaan Regresi Mirwald et al. (2002)** untuk menghitung jarak waktu menuju atau setelah puncak PHV (*Maturity Offset*).

### 3.1 Rumus untuk Atlet Laki-laki (Male)

```text
Maturity Offset = -9.236
                + (0.0002708 × LL × SH)
                - (0.001663 × Age × LL)
                + (0.007216 × Age × SH)
                + (0.02292 × (W / H × 100))
```

---

### 3.2 Rumus untuk Atlet Perempuan (Female)

```text
Maturity Offset = -9.376
                + (0.0001882 × LL × SH)
                + (0.0022 × Age × LL)
                + (0.005841 × Age × SH)
                - (0.002658 × Age × W)
                + (0.07693 × (W / H × 100))
```

> **Catatan Rasio Massa:**
> `(W / H × 100)` adalah rasio perbandingan Berat Badan (kg) terhadap Tinggi Berdiri (cm) dikalikan 100.

---

## 4. Perhitungan Turunan & Interpretasi Hasil

### 4.1 Maturity Offset (MO)
Nilai **Maturity Offset** menunjukkan posisi atlet saat ini relatif terhadap puncak lonjakan pertumbuhan (dalam satuan tahun):
* **Nilai Negatif (MO < 0)**: Atlet **belum mencapai PHV** (misal: `-1.5` berarti sekitar 1.5 tahun lagi menuju puncak PHV).
* **Nilai Nol (MO = 0)**: Atlet sedang berada **tepat di puncak laju pertumbuhan**.
* **Nilai Positif (MO > 0)**: Atlet **sudah melewati puncak PHV** (misal: `+1.2` berarti puncak PHV sudah lewat 1.2 tahun yang lalu).

---

### 4.2 Usia Saat PHV (Age at PHV)
Menghitung perkiraan usia atlet ketika puncak laju pertumbuhan terjadi:

```text
Age at PHV = Usia Kronologis Saat Ini − Maturity Offset
```

---

### 4.3 Kategori Waktu Kematangan (Maturity Timing)
Kategori kematangan biologis dikelompokkan berdasarkan usia saat PHV tercapai:

#### Atlet Laki-laki:
* **Early Maturing (Cepat)**: Usia PHV < 13.0 tahun
* **Average Maturing (Normal / Rata-rata)**: Usia PHV antara 13.0 s.d 15.0 tahun
* **Late Maturing (Lambat)**: Usia PHV > 15.0 tahun

#### Atlet Perempuan:
* **Early Maturing (Cepat)**: Usia PHV < 11.0 tahun
* **Average Maturing (Normal / Rata-rata)**: Usia PHV antara 11.0 s.d 13.0 tahun
* **Late Maturing (Lambat)**: Usia PHV > 13.0 tahun

---

### 4.4 Kategori Fase Pertumbuhan (Growth Phases)

| Fase Pertumbuhan | Rentang Maturity Offset | Ciri & Karakteristik Tubuh |
| :--- | :---: | :--- |
| **Pre-PHV** | Kurang dari -1.0 tahun | Pertumbuhan linier stabil, fleksibilitas baik, koordinasi motorik berkembang pesat. |
| **Circa-PHV** | -1.0 s.d +1.0 tahun | **Puncak lonjakan pertumbuhan**. Tulang memanjang sangat cepat, otot/tendon menjadi tegang (*tight*), koordinasi gerak bisa menurun sementara (*adolescent awkwardness*), rentan cedera traksi. |
| **Post-PHV** | Lebih dari +1.0 tahun | Pertumbuhan tinggi mulai melambat, massa otot bertambah signifikan karena peningkatan hormon anabolik alami. |

---

## 5. Prediksi Sisa Pertumbuhan & Tinggi Badan Dewasa

Prediksi sisa pertumbuhan tinggi badan (*Remaining Growth*) menggunakan tabel acuan interpolasi persentil longitudinal (Sherar et al.):

### 5.1 Tabel Acuan Sisa Pertumbuhan (Remaining Growth dalam cm)

| Maturity Offset (Tahun) | Early Maturing (cm) | Average Maturing (cm) | Late Maturing (cm) |
| :---: | :---: | :---: | :---: |
| **-3.0** | 39.69 | 35.04 | 30.27 |
| **-2.0** | 33.79 | 30.04 | 25.74 |
| **-1.5** | 30.78 | 27.34 | 23.12 |
| **-1.0** | 27.53 | 24.26 | 20.19 |
| **-0.5** | 23.73 | 20.62 | 16.91 |
| **0.0 (Puncak PHV)** | 18.97 | 16.16 | 13.05 |
| **+0.5** | 13.94 | 11.57 | 9.07 |
| **+1.0** | 9.82 | 7.95 | 5.78 |
| **+1.5** | 6.67 | 5.20 | 3.23 |
| **+2.0** | 4.34 | 3.19 | 1.47 |
| **+2.5** | 2.61 | 1.78 | 0.48 |
| **+3.0** | 1.36 | 0.87 | 0.00 |

---

### 5.2 Rumus Prediksi Tinggi Dewasa (Predicted Adult Height)

```text
Prediksi Tinggi Dewasa = Tinggi Berdiri Saat Ini + Sisa Pertumbuhan (Remaining Growth)
```

---

### 5.3 Persentase Tinggi Dewasa Saat Ini (% Adult Height)

```text
% Tinggi Dewasa = (Tinggi Berdiri Saat Ini / Prediksi Tinggi Dewasa) × 100%
```

---

## 6. Rekomendasi Program Latihan Berdasarkan Fase PHV (LTAD)

Prinsip *Long-Term Athlete Development* (LTAD) menyesuaikan beban dan materi latihan dengan fase pertumbuhan atlet:

```text
[ Pre-PHV: Offset < -1.0 ]
   └─► Fokus: Skill Gerak Dasar, Kelincahan, Kecepatan Reaksi (CNS), Koordinasi Tubuh
         │
[ Circa-PHV: Offset -1.0 s/d +1.0 ]
   └─► Fokus: Fleksibilitas & Mobilitas, Core Stability, Daya Tahan Aerobik, Hindari Overtraining
         │
[ Post-PHV: Offset > +1.0 ]
   └─► Fokus: Kekuatan Maksimal (Hypertrophy / Max Strength), Power Ledak, Kapasitas Anaerobik
```

### Rincian Panduan Latihan:

#### 1. Fase Pre-PHV (Offset < -1.0)
* **Fokus Utama**: Pembentukan keterampilan gerak dasar (*Fundamental Movement Skills*), koordinasi, kelincahan, keseimbangan, dan kecepatan reaksi (*Speed 1*).
* **Latihan Beban**: Gunakan beban tubuh sendiri (*bodyweight*), latih mekanika gerak yang benar (squat, lunge, hinge, push, pull).
* **Target**: Membentuk fondasi motorik yang solid sebelum lonjakan pertumbuhan.

#### 2. Fase Circa-PHV (Offset -1.0 s.d +1.0)
* **Fokus Utama**: Latihan mobilitas dan peregangan (terutama paha belakang/hamstring, paha depan/quads, betis), penguatan otot penopang inti (*core stability*), dan daya tahan aerobik.
* **Pencegahan Cedera**:
  * Kurangi volume latihan benturan keras (*high-impact plyometrics*).
  * Perhatikan keluhan rasa sakit di area bawah tempurung lutut (*Osgood-Schlatter*) atau tumit (*Sever's disease*).
  * Maklumi jika koordinasi atlet tampak sedikit canggung (*adolescent awkwardness*) karena panjang tungkai bertambah dengan cepat.

#### 3. Fase Post-PHV (Offset > +1.0)
* **Fokus Utama**: Kekuatan maksimal (*Max Strength*), pembentukan massa otot (*Hypertrophy*), daya ledak (*Power*), dan kapasitas anaerobik.
* **Target**: Memaksimalkan jendela adaptasi hormonal alami tubuh (lonjakan testosteron dan hormon pertumbuhan) untuk peningkatan kekuatan fisik.

---

## 7. Contoh Simulasi Perhitungan Langkah demi Langkah

### Data Contoh Atlet:
* **Nama Atlet**: Budi
* **Jenis Kelamin**: Laki-laki (`male`)
* **Usia Kronologis (`Age`)**: 13.5 tahun
* **Tinggi Berdiri (`H`)**: 160.0 cm
* **Tinggi Duduk (`SH`)**: 85.0 cm
* **Berat Badan (`W`)**: 48.0 kg

---

### Langkah 1: Hitung Panjang Tungkai (Leg Length)
```text
LL = Tinggi Berdiri − Tinggi Duduk
LL = 160.0 − 85.0 = 75.0 cm
```

---

### Langkah 2: Hitung Rasio Berat terhadap Tinggi
```text
Rasio = (W / H) × 100
Rasio = (48.0 / 160.0) × 100 = 30.0
```

---

### Langkah 3: Masukkan ke Persamaan Mirwald Laki-laki
```text
Maturity Offset = -9.236
                + (0.0002708 × 75.0 × 85.0)
                - (0.001663 × 13.5 × 75.0)
                + (0.007216 × 13.5 × 85.0)
                + (0.02292 × 30.0)
```

**Perhitungan Tiap Komponen:**
* Bagian 1: `-9.236`
* Bagian 2: `0.0002708 × 6375 = +1.72635`
* Bagian 3: `-0.001663 × 1012.5 = -1.68379`
* Bagian 4: `0.007216 × 1147.5 = +8.28036`
* Bagian 5: `0.02292 × 30.0 = +0.6876`

```text
Maturity Offset = -9.236 + 1.72635 - 1.68379 + 8.28036 + 0.6876
Maturity Offset = -0.23 tahun
```

---

### Langkah 4: Hitung Usia PHV & Kategori Kematangan
```text
Age at PHV = Usia Saat Ini − Maturity Offset
Age at PHV = 13.5 − (-0.23) = 13.73 tahun
```

* Karena nilai `13.73 tahun` berada di rentang 13.0 s.d 15.0 tahun, maka kategori atlet adalah **Average Maturing**.
* Karena nilai `Maturity Offset = -0.23` berada di rentang -1.0 s.d +1.0 tahun, maka atlet berada pada fase **Circa-PHV** (puncak pertumbuhan).

---

### Langkah 5: Prediksi Sisa Pertumbuhan & Tinggi Dewasa
* Dari tabel acuan untuk offset `-0.2` (Average): Sisa Pertumbuhan diperkirakan **17.95 cm**.
* **Prediksi Tinggi Dewasa**:
  ```text
  Prediksi Tinggi Dewasa = 160.0 cm + 17.95 cm = 177.95 cm
  ```
* **Persentase Tinggi Dewasa Saat Ini**:
  ```text
  % Tinggi Dewasa = (160.0 / 177.95) × 100% = 89.91%
  ```

---

## 8. Referensi Jurnal Ilmiah
1. **Mirwald, R. L., Baxter-Jones, A. D., Bailey, D. A., & Beunen, G. P. (2002)**. *An assessment of maturity from anthropometric measurements*. Medicine and Science in Sports and Exercise, 34(4), 689-694.
2. **Sherar, L. B., Mirwald, R. L., Baxter-Jones, A. D., & Thomis, M. (2005)**. *Prediction of adult height from maturity offset in boys and girls*. The Journal of Pediatrics, 147(4), 508-514.
3. **Lloyd, R. S., & Oliver, J. L. (2012)**. *The youth physical development model: A new approach to long-term athletic development*. Strength & Conditioning Journal, 34(3), 61-72.
4. **Malina, R. M., Bouchard, C., & Bar-Or, O. (2004)**. *Growth, maturation, and physical activity*. Human Kinetics.
