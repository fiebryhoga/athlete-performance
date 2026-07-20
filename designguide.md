# Product Requirements Document (PRD): Design System
**Project:** Aivora Dashboard (Light Theme Edition)
**Version:** 1.0
**Design Language:** Clean Minimalist, High-Contrast Light Mode dengan Aksen Oranye

## 1. Visi & Filosofi Desain
Mengadaptasi tata letak modern dari desain awal (dark mode) menjadi **Light Theme** yang segar, profesional, dan energik. Tema terang ini berfokus pada **keterbacaan yang tinggi (high readability)**, pemanfaatan ruang putih (whitespace) yang lega, dan penggunaan warna **oranye** sebagai *focal point* untuk memandu mata pengguna pada elemen-elemen penting (Call to Action, indikator progres, dan fitur AI).

## 2. Palet Warna (Design Tokens)

> [!TIP]
> Menggunakan Tailwind CSS color palette sebagai standar token warna agar mudah diimplementasikan dengan shadcn/ui.

### 2.1. Base & Surfaces (Latar Belakang)
- **Background Utama (App):** `#F8FAFC` (Slate 50) - Memberikan kontras lembut terhadap kartu, tidak menyilaukan mata seperti putih murni.
- **Surface (Cards, Sidebar, Topnav):** `#FFFFFF` (Pure White) - Untuk elemen yang menonjol dari background utama.
- **Borders & Dividers:** `#E2E8F0` (Slate 200) - Garis pemisah yang tipis dan elegan.

### 2.2. Typography (Teks)
- **Heading / Primary Text:** `#0F172A` (Slate 900) - Hitam pekat untuk judul, nama metrik, dan data penting.
- **Body / Secondary Text:** `#64748B` (Slate 500) - Abu-abu gelap untuk deskripsi dan teks pendukung.
- **Muted Text:** `#94A3B8` (Slate 400) - Untuk teks minor seperti *placeholder* dan keterangan waktu.

### 2.3. Brand & Accent (Sentuhan Oranye)
Warna oranye memberikan kesan energik, inovatif, dan ramah.
- **Primary Accent:** `#F97316` (Orange 500) - Warna utama untuk Button utama, indikator *progress*, dan ikon aktif.
- **Accent Hover:** `#EA580C` (Orange 600) - Warna saat kursor berada di atas elemen (hover).
- **Subtle Background Accent:** `#FFF7ED` (Orange 50) - Untuk latar belakang elemen yang sedang aktif (misal: menu Sidebar yang dipilih).
- **Premium AI Gradient:** Gradasi dari `#F97316` (Orange 500) ke `#F59E0B` (Amber 500) untuk menonjolkan area fitur kecerdasan buatan ("Ask Aivora").

### 2.4. Semantic / Status Colors (Badges)
- **Success (Active):** Teks `#15803D`, Background `#DCFCE7` (Green)
- **Warning (Planning/Pending):** Teks `#A16207`, Background `#FEF08A` (Yellow)
- **Info (In Progress):** Teks `#C2410C`, Background `#FFEDD5` (Orange Muted) - Disesuaikan agar senada dengan tema utama.

## 3. Tipografi
- **Font Family:** `Inter` atau `Plus Jakarta Sans` (Sans-serif modern yang sangat tajam dan terbaca di layar berlatar terang).
- **Headings:** Ketebalan Semibold (600) atau Bold (700) dengan jarak huruf (tracking) rapat (`tracking-tight`).
- **Body:** Ketebalan Regular (400) atau Medium (500) dengan jarak antar baris yang rileks (`leading-relaxed`).

## 4. Struktur Komponen UI (Adaptasi shadcn/ui)

### 4.1. Sidebar & Navigasi Utama
- **Visual:** Latar belakang `#FFFFFF` dengan bayangan kanan atau garis tepi tipis (`border-r border-slate-200`).
- **Active State (Menu Terpilih):** Saat menu (contoh: "Projects") aktif, latar belakang berubah menjadi oranye sangat pucat (`bg-orange-50`), teks/ikon berubah oranye solid (`text-orange-600`), dan ditambahkan aksen garis vertikal di sebelah kiri (`border-l-4 border-orange-500`).
- **Hover State:** Abu-abu sangat terang (`hover:bg-slate-50 text-slate-900`).

### 4.2. Kartu Proyek (Project Cards)
- **Container:** Basis menggunakan komponen `Card` shadcn. Background `#FFFFFF`, sudut membulat (`rounded-xl`), dan bayangan natural (`shadow-sm` / `shadow-[0_2px_8px_rgba(0,0,0,0.04)]`).
- **Hover Effect (Interaksi):** Saat kursor mengenai kartu, ia sedikit terangkat ke atas (`hover:-translate-y-1 transition-all`) dan bayangan membesar (`hover:shadow-md`) untuk memberikan kesan nyata (*depth*).
- **Progress Bar:** 
  - Track (Bawah): `#F1F5F9` (Slate 100).
  - Indicator (Jalur terisi): Gradasi linear Oranye (`bg-gradient-to-r from-orange-400 to-orange-500`).

### 4.3. Tombol (Buttons)
- **Primary Button ("+ Add Projects"):** Background oranye solid (`bg-orange-500`) dengan efek hover yang lebih gelap (`hover:bg-orange-600`). Teks berwarna putih tebal.
- **Secondary / Outline Button ("Filters"):** Background putih transparan dengan garis batas abu-abu (`border border-slate-300`). Saat *hover*, menjadi latar oranye pucat (`hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200`).
- **AI Action Button:** Bisa ditambahkan efek pendar bayangan membaur (`shadow-[0_0_15px_rgba(249,115,22,0.3)]`) berwarna oranye untuk menegaskan status fitur tersebut sebagai fitur pintar.

### 4.4. Bagian Khusus AI ("Ask Aivora")
- Karena ini *Light Theme*, kartu khusus AI di pojok kiri bawah tidak menggunakan gelap/neon.
- Diganti menjadi **Glass/Frost Effect Lembut**: Latar belakang gradasi putih ke oranye sangat tipis (`bg-gradient-to-br from-white to-orange-50`), tepian `border-orange-100`, dihiasi ikon bintang kejora (`sparkles`) berwarna emas/oranye mencolok.

## 5. Visual Cues & Efek Animasi
- **Transisi Halus:** Terapkan class `transition-all duration-200 ease-in-out` secara global pada tombol, tautan, dan kartu agar interaksi tidak terasa kaku.
- **Glassmorphism Top-Nav (Opsional):** Jika navigasi atas dibuat menempel (sticky), gunakan material tembus pandang bergaya *frosted glass* (`backdrop-blur-md bg-white/80`) agar saat konten di-scroll, bayang-bayang konten sedikit terlihat dari balik header.

## 6. Persyaratan Aksesibilitas (A11y)
> [!IMPORTANT]
> Kontras warna adalah hal terpenting dalam Light Theme.
- Pastikan tombol primer (Oranye `#F97316`) dengan teks putih lulus uji rasio kontras. Jika dirasa kurang tajam, teks putih dapat ditebalkan (font-weight: 600) atau warna oranye ditekan sedikit ke `#EA580C` (Orange 600).
- Dukungan *keyboard navigation* penuh untuk area Sidebar dan filter menggunakan komponen bawaan shadcn/ui.
