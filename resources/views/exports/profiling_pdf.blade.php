<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Profiling Report - {{ $athlete->name }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 8mm 10mm 10mm 10mm;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 9.5px;
            color: #0f172a;
            line-height: 1.35;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }

        /* ─── HEADER ─── */
        .doc-header {
            width: 100%;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 6px;
            margin-bottom: 10px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
        }
        .header-table td {
            vertical-align: middle;
            padding: 0;
        }
        .doc-title {
            font-size: 15px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 2px 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .doc-subtitle {
            font-size: 8.5px;
            color: #64748b;
            margin: 0 0 3px 0;
            font-weight: 500;
        }
        .doc-date {
            font-size: 8px;
            color: #94a3b8;
            margin: 0;
        }
        .logo-img {
            max-height: 58px;
            max-width: 190px;
            object-fit: contain;
        }
        .logo-text {
            font-size: 18px;
            font-weight: 900;
            color: #ea580c;
            letter-spacing: -0.5px;
        }

        /* ─── SECTION TITLES ─── */
        .section-title {
            font-size: 10px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin: 8px 0 4px 0;
            padding-bottom: 2px;
            border-bottom: 1.5px solid #e2e8f0;
            page-break-after: avoid;
            break-after: avoid;
        }
        .section-title span {
            color: #ea580c;
            margin-right: 2px;
        }

        /* ─── ATHLETE PROFILE CARD ─── */
        .profile-card {
            width: 100%;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            background-color: #f8fafc;
            margin-bottom: 8px;
            page-break-inside: avoid;
        }
        .profile-table {
            width: 100%;
            border-collapse: collapse;
        }
        .profile-table td {
            padding: 6px 8px;
            vertical-align: middle;
        }
        .avatar-box {
            width: 52px;
            text-align: center;
            padding-right: 0 !important;
        }
        .avatar-img {
            width: 48px;
            height: 48px;
            border-radius: 6px;
            object-fit: cover;
            border: 1px solid #cbd5e1;
        }
        .avatar-initial {
            width: 48px;
            height: 48px;
            border-radius: 6px;
            background-color: #ea580c;
            color: #ffffff;
            font-size: 20px;
            font-weight: 900;
            line-height: 48px;
            text-align: center;
            margin: 0 auto;
        }
        .athlete-info {
            width: 44%;
            padding-left: 8px !important;
        }
        .athlete-name {
            font-size: 13px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 1px 0;
        }
        .athlete-meta {
            font-size: 8.5px;
            color: #64748b;
            margin: 0 0 3px 0;
        }
        .badge {
            display: inline-block;
            font-size: 7.5px;
            font-weight: 700;
            padding: 1px 5px;
            border-radius: 6px;
            margin-right: 3px;
        }
        .badge-orange {
            background-color: #fff7ed;
            color: #ea580c;
            border: 1px solid #fed7aa;
        }
        .badge-slate {
            background-color: #f1f5f9;
            color: #334155;
            border: 1px solid #cbd5e1;
        }
        .badge-emerald {
            background-color: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
        }
        .badge-amber {
            background-color: #fffbeb;
            color: #b45309;
            border: 1px solid #fde68a;
        }
        .badge-rose {
            background-color: #fff1f2;
            color: #be123c;
            border: 1px solid #fecdd3;
        }

        /* ─── BIOMETRICS GRID ─── */
        .bio-table {
            width: 100%;
            border-collapse: collapse;
        }
        .bio-table td {
            width: 25%;
            padding: 4px 5px;
            text-align: center;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
        }
        .bio-label {
            font-size: 7.5px;
            color: #64748b;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 1px;
        }
        .bio-value {
            font-size: 11px;
            font-weight: 900;
            color: #0f172a;
        }
        .bio-unit {
            font-size: 7.5px;
            font-weight: normal;
            color: #64748b;
        }

        /* ─── EXECUTIVE STATS ─── */
        .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            page-break-inside: avoid;
        }
        .stats-table td {
            width: 25%;
            padding: 5px 6px;
            text-align: center;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
        }
        .stat-label {
            font-size: 7.5px;
            font-weight: bold;
            text-transform: uppercase;
            color: #64748b;
        }
        .stat-num {
            font-size: 14px;
            font-weight: 900;
            color: #ea580c;
            margin: 1px 0;
        }
        .stat-num-dark { color: #0f172a; }
        .stat-num-green { color: #059669; }
        .stat-desc {
            font-size: 7.5px;
            color: #94a3b8;
        }

        /* ─── DATA TABLES ─── */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }
        .data-table thead {
            display: table-header-group;
        }
        .data-table tr {
            page-break-inside: avoid;
        }
        .data-table th {
            background-color: #f1f5f9;
            color: #334155;
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            border: 1px solid #cbd5e1;
            padding: 4px 6px;
            text-align: left;
        }
        .data-table td {
            border: 1px solid #e2e8f0;
            padding: 4px 6px;
            font-size: 8.5px;
            vertical-align: middle;
        }
        .data-table tr:nth-child(even) {
            background-color: #fafafa;
        }
        .text-center { text-align: center !important; }
        .text-right { text-align: right !important; }
        .font-bold { font-weight: bold; }

        /* Progress Bar */
        .progress-bar-bg {
            background-color: #e2e8f0;
            border-radius: 6px;
            height: 6px;
            width: 100%;
            overflow: hidden;
            display: inline-block;
            vertical-align: middle;
        }
        .progress-bar-fill {
            background-color: #ea580c;
            height: 100%;
            border-radius: 6px;
        }
        .progress-bar-fill-green {
            background-color: #059669;
        }

        /* ─── STRENGTHS & WEAKNESSES CARDS ─── */
        .sw-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            page-break-inside: avoid;
        }
        .sw-table > tbody > tr > td {
            width: 50%;
            vertical-align: top;
            padding: 0 4px;
        }
        .sw-table > tbody > tr > td:first-child { padding-left: 0; }
        .sw-table > tbody > tr > td:last-child { padding-right: 0; }

        .sw-box {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            background: #ffffff;
            overflow: hidden;
        }
        .sw-header-green, .sw-header-rose {
            background-color: #f1f5f9;
            border-bottom: 1px solid #cbd5e1;
            padding: 4px 8px;
            font-size: 8px;
            font-weight: 800;
            color: #334155;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .sw-body {
            padding: 5px 8px;
            min-height: 52px;
        }
        .sw-item {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 3px;
        }
        .sw-item td {
            padding: 2px 0;
            border: none;
            font-size: 8.5px;
        }
        .sw-num {
            width: 14px;
            font-weight: bold;
            color: #64748b;
        }
        .sw-name {
            font-weight: 600;
            color: #1e293b;
        }
        .sw-score-green {
            text-align: right;
            font-weight: 800;
            color: #334155;
            font-size: 9px;
        }
        .sw-score-rose {
            text-align: right;
            font-weight: 800;
            color: #334155;
            font-size: 9px;
        }

        /* ─── MULTI-DOMAIN PROFILING MATRIX ─── */
        .matrix-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            page-break-inside: avoid;
        }
        .matrix-table td {
            width: 50%;
            padding: 3px;
            vertical-align: top;
        }
        .matrix-card {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            background: #ffffff;
            overflow: hidden;
        }
        .matrix-card-header {
            background-color: #f1f5f9;
            color: #334155;
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 4px 8px;
            border-bottom: 1px solid #cbd5e1;
            letter-spacing: 0.3px;
        }
        .matrix-card-body {
            padding: 5px 8px;
            min-height: 56px;
        }
        .matrix-row {
            width: 100%;
            border-collapse: collapse;
        }
        .matrix-row td {
            padding: 2px 0;
            font-size: 8px;
            border: none;
        }
        .matrix-label {
            color: #64748b;
            width: 55%;
        }
        .matrix-val {
            font-weight: 800;
            color: #0f172a;
            text-align: right;
            width: 45%;
        }

        /* ─── BIOMETRIC GALLERY ─── */
        .gallery-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }
        .gallery-table tr {
            page-break-inside: avoid;
        }
        .gallery-table td {
            padding: 4px;
            vertical-align: top;
            border: none;
            width: 50%;
        }
        .gallery-card {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            background: #ffffff;
            overflow: hidden;
        }
        .gallery-img-box {
            background-color: #f8fafc;
            padding: 6px;
            border-bottom: 1px solid #e2e8f0;
            height: 220px;
            text-align: center;
            vertical-align: middle;
        }
        .gallery-img {
            max-height: 210px;
            max-width: 100%;
            object-fit: contain;
            border-radius: 6px;
        }
        .gallery-meta {
            padding: 5px 7px;
            text-align: left;
        }
        .gallery-date {
            font-size: 8px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 2px;
        }
        .gallery-notes {
            font-size: 7.5px;
            color: #475569;
            line-height: 1.35;
        }

        /* ─── SIGNATURE & FOOTER ─── */
        .sign-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
            page-break-inside: avoid;
        }
        .sign-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            padding: 0 20px;
            border: none;
        }
        .sign-line {
            width: 150px;
            border-bottom: 1px solid #334155;
            margin: 32px auto 3px auto;
        }
        .footer {
            margin-top: 12px;
            border-top: 1px solid #e2e8f0;
            padding-top: 5px;
            font-size: 7.5px;
            color: #94a3b8;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!--                      HALAMAN 1 : PROFIL & ANALISIS           -->
    <!-- ══════════════════════════════════════════════════════════════ -->

    <!-- ─── HEADER ─── -->
    <div class="doc-header">
        <table class="header-table">
            <tr>
                <td style="width: 65%; vertical-align: middle;">
                    <h1 class="doc-title">Laporan Profiling & Analisis Klien</h1>
                    <p class="doc-subtitle">Integrated Performance Analysis & Physical Biometrics Report</p>
                    <div class="doc-date">Tanggal: {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</div>
                </td>
                <td style="width: 35%; text-align: right; vertical-align: middle;">
                    @if($clubLogo)
                        <img src="{{ $clubLogo }}" alt="Olympus Training Surabaya" class="logo-img">
                    @else
                        <div class="logo-text">OTS</div>
                    @endif
                </td>
            </tr>
        </table>
    </div>

    <!-- ─── ATHLETE IDENTITY & BIOMETRICS CARD ─── -->
    <div class="profile-card">
        <table class="profile-table">
            <tr>
                <td class="avatar-box">
                    @if($athletePhoto)
                        <img src="{{ $athletePhoto }}" alt="{{ $athlete->name }}" class="avatar-img">
                    @else
                        <div class="avatar-initial">{{ strtoupper(substr($athlete->name, 0, 1)) }}</div>
                    @endif
                </td>
                <td class="athlete-info">
                    <div class="athlete-name">{{ $athlete->name }}</div>
                    <div class="athlete-meta">{{ '@' . ($athlete->username ?? '-') }} &bull; {{ $athlete->gender === 'L' ? 'Laki-laki' : ($athlete->gender === 'P' ? 'Perempuan' : '-') }}</div>
                    <div style="font-size: 8.5px; margin: 2px 0;">
                        <strong style="color: #ea580c;">{{ $athlete->sport->name ?? 'Umum' }}</strong>
                        @if($packageName)
                            <span style="color: #64748b;"> &bull; {{ $packageName }}</span>
                        @endif
                    </div>
                    <div style="font-size: 8px; color: #64748b; margin-top: 2px;">
                        <strong>Coach:</strong> {{ $coachesText }}
                    </div>
                </td>
                <td style="width: 48%; padding-right: 8px;">
                    <table class="bio-table">
                        <tr>
                            <td>
                                <div class="bio-label">Tinggi</div>
                                <div class="bio-value">{{ $athlete->height ?? '-' }} <span class="bio-unit">cm</span></div>
                            </td>
                            <td>
                                <div class="bio-label">Berat</div>
                                <div class="bio-value">{{ $athlete->weight ?? '-' }} <span class="bio-unit">kg</span></div>
                            </td>
                            <td>
                                <div class="bio-label">Usia</div>
                                <div class="bio-value">{{ $age !== '-' ? $age : '-' }} <span class="bio-unit">thn</span></div>
                            </td>
                            <td>
                                <div class="bio-label">BMI</div>
                                <div class="bio-value">{{ $bmi }}</div>
                                <div style="font-size: 7.5px; font-weight: bold; color: {{ $bmiStatus['color'] ?? '#64748b' }}; margin-top: 1px;">
                                    {{ $bmiClass['label'] }}
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    <!-- ─── EXECUTIVE STATS ─── -->
    <table class="stats-table">
        <tr>
            <td>
                <div class="stat-label">Total Sesi Tes</div>
                <div class="stat-num stat-num-dark">{{ $totalSessions }}</div>
                <div class="stat-desc">Sesi Fisik Terekam</div>
            </td>
            <td>
                <div class="stat-label">Rata-Rata Skor</div>
                <div class="stat-num">{{ number_format($averageScore, 1) }}</div>
                <div class="stat-desc">Skala 0 - 100</div>
            </td>
            <td>
                <div class="stat-label">Skor Tertinggi</div>
                <div class="stat-num stat-num-green">{{ number_format($highestScore, 1) }}</div>
                <div class="stat-desc">Capaian Terbaik</div>
            </td>
            <td>
                <div class="stat-label">Tes Terakhir</div>
                <div class="stat-num stat-num-dark" style="font-size: 11px; margin-top: 3px;">{{ $latestDate }}</div>
                <div class="stat-desc">Skor: <strong style="color: #ea580c;">{{ number_format($latestScore, 1) }}</strong></div>
            </td>
        </tr>
    </table>

    <!-- ─── ANALISIS KEMAMPUAN FISIK PER KATEGORI ─── -->
    <div class="section-title">Analisis Kemampuan Fisik per Kategori</div>

    @if($categoryStats && count($categoryStats) > 0)
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Kategori Fisik</th>
                    <th style="width: 14%; text-align: center;">Skor Rata-Rata</th>
                    <th style="width: 36%;">Visual Progress (Target 100)</th>
                    <th style="width: 12%; text-align: center;">Gap Target</th>
                    <th style="width: 13%; text-align: center;">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($categoryStats as $cat)
                    @php
                        $pct = min(100, max(0, $cat['score']));
                        $isHigh = $cat['score'] >= 80;
                        $isMedium = $cat['score'] >= 60 && $cat['score'] < 80;
                    @endphp
                    <tr>
                        <td class="font-bold">{{ $cat['name'] }}</td>
                        <td class="text-center font-bold" style="color: {{ $isHigh ? '#059669' : ($isMedium ? '#ea580c' : '#e11d48') }};">
                            {{ number_format($cat['score'], 1) }}
                        </td>
                        <td>
                            <table style="width: 100%; border-collapse: collapse; border: none;">
                                <tr>
                                    <td style="width: 80%; border: none; padding: 0;">
                                        <div class="progress-bar-bg">
                                            <div class="progress-bar-fill {{ $isHigh ? 'progress-bar-fill-green' : '' }}" style="width: {{ $pct }}%;"></div>
                                        </div>
                                    </td>
                                    <td style="width: 20%; border: none; padding: 0 0 0 4px; text-align: right; font-size: 7.5px; color: #64748b;">
                                        {{ round($pct) }}%
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td class="text-center font-bold" style="color: {{ $cat['gap'] >= 0 ? '#059669' : '#e11d48' }};">
                            {{ $cat['gap'] > 0 ? '+' : '' }}{{ number_format($cat['gap'], 1) }}
                        </td>
                        <td class="text-center">
                            @if($isHigh)
                                <span class="badge badge-emerald">Sangat Baik</span>
                            @elseif($isMedium)
                                <span class="badge badge-amber">Baik</span>
                            @else
                                <span class="badge badge-rose">Perlu Latihan</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div style="border: 1px dashed #cbd5e1; border-radius: 6px; padding: 10px; text-align: center; color: #94a3b8; margin-bottom: 8px; font-size: 8.5px;">
            Belum ada data tes fisik yang terekam untuk analisis kategori.
        </div>
    @endif


    <!-- ─── MATRIKS PENILAIAN MULTI-DOMAIN ATLET ─── -->
    <div class="section-title">Matriks Penilaian Multi-Domain Atlet</div>

    <table class="matrix-table">
        <tr>
            <!-- PHV & Pertumbuhan -->
            <td>
                <div class="matrix-card">
                    <div class="matrix-card-header">
                        PHV & Pertumbuhan Biologis
                        @if($latest_phv)
                            <span style="font-size: 7.5px; font-weight: normal; color: #64748b; float: right;">
                                {{ $latest_phv->assessment_date ? \Carbon\Carbon::parse($latest_phv->assessment_date)->format('d/m/Y') : '-' }}
                            </span>
                        @endif
                    </div>
                    <div class="matrix-card-body">
                        @if($latest_phv)
                            <table class="matrix-row">
                                <tr>
                                    <td class="matrix-label">Status PHV</td>
                                    <td class="matrix-val">{{ $latest_phv->phv_status ?? ($latest_phv->maturity_status ?? '-') }}</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Maturity Offset</td>
                                    <td class="matrix-val">{{ $latest_phv->maturity_offset ?? '-' }} thn</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Prediksi Tinggi Dewasa</td>
                                    <td class="matrix-val">{{ $latest_phv->predicted_adult_height ?? '-' }} cm</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Tinggi Duduk / Berdiri</td>
                                    <td class="matrix-val">{{ $latest_phv->sitting_height ?? '-' }} / {{ $latest_phv->standing_height ?? '-' }} cm</td>
                                </tr>
                            </table>
                        @else
                            <div style="font-size: 8px; color: #94a3b8; font-style: italic; padding: 6px 0; text-align: center;">Belum ada asesmen PHV.</div>
                        @endif
                    </div>
                </div>
            </td>

            <!-- Wellness & Beban Latihan -->
            <td>
                <div class="matrix-card">
                    <div class="matrix-card-header">
                        Wellness & Beban Latihan (RPE)
                        @if($latest_wellness)
                            <span style="font-size: 7.5px; font-weight: normal; color: #64748b; float: right;">
                                {{ $latest_wellness->record_date ? \Carbon\Carbon::parse($latest_wellness->record_date)->format('d/m/Y') : '-' }}
                            </span>
                        @endif
                    </div>
                    <div class="matrix-card-body">
                        @if($latest_wellness)
                            <table class="matrix-row">
                                <tr>
                                    <td class="matrix-label">Skor Wellness Harian</td>
                                    <td class="matrix-val">{{ $latest_wellness->daily_wellness_score ?? '-' }} <span style="font-size: 7px; color: #64748b;">/ 30</span></td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Session RPE (AM/PM)</td>
                                    <td class="matrix-val">{{ $latest_wellness->am_rpe ?? '-' }} / {{ $latest_wellness->pm_rpe ?? '-' }} <span style="font-size: 7px; color: #64748b;">/ 10</span></td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Daily Training Load</td>
                                    <td class="matrix-val">{{ $latest_wellness->daily_load ?? '-' }} AU</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Keluhan Nyeri Otot</td>
                                    <td class="matrix-val" style="font-size: 7.5px;">
                                        {{ !empty($latest_wellness->muscle_pain_areas) && is_array($latest_wellness->muscle_pain_areas) ? implode(', ', $latest_wellness->muscle_pain_areas) : 'Tidak ada' }}
                                    </td>
                                </tr>
                            </table>
                        @else
                            <div style="font-size: 8px; color: #94a3b8; font-style: italic; padding: 6px 0; text-align: center;">Belum ada log wellness.</div>
                        @endif
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <!-- Dynamic Posture Assessment (DPA) -->
            <td>
                <div class="matrix-card">
                    <div class="matrix-card-header">
                        Postur Dinamis (DPA)
                        @if($latest_dpa)
                            <span style="font-size: 7.5px; font-weight: normal; color: #64748b; float: right;">
                                {{ $latest_dpa->assessment_date ? \Carbon\Carbon::parse($latest_dpa->assessment_date)->format('d/m/Y') : '-' }}
                            </span>
                        @endif
                    </div>
                    <div class="matrix-card-body">
                        @if($latest_dpa)
                            @php
                                $compCount = $latest_dpa->details ? $latest_dpa->details->count() : 0;
                            @endphp
                            <table class="matrix-row">
                                <tr>
                                    <td class="matrix-label">Status Evaluasi DPA</td>
                                    <td class="matrix-val">Terverifikasi</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Total Temuan Kompensasi</td>
                                    <td class="matrix-val">
                                        {{ $compCount }} Temuan
                                    </td>
                                </tr>
                                @if($compCount > 0)
                                    <tr>
                                        <td class="matrix-label">Contoh Kompensasi</td>
                                        <td class="matrix-val" style="font-size: 7.5px; font-weight: normal;">
                                            {{ $latest_dpa->details->map(fn($d) => $d->compensation->name ?? null)->filter()->take(2)->implode(', ') }}
                                        </td>
                                    </tr>
                                @endif
                            </table>
                        @else
                            <div style="font-size: 8px; color: #94a3b8; font-style: italic; padding: 6px 0; text-align: center;">Belum ada asesmen DPA.</div>
                        @endif
                    </div>
                </div>
            </td>

            <!-- Komposisi Tubuh (InBody) -->
            <td>
                <div class="matrix-card">
                    <div class="matrix-card-header">
                        Komposisi Tubuh & Metabolisme
                        @if($latest_composition)
                            <span style="font-size: 7.5px; font-weight: normal; color: #64748b; float: right;">
                                {{ $latest_composition->date ? \Carbon\Carbon::parse($latest_composition->date)->format('d/m/Y') : '-' }}
                            </span>
                        @endif
                    </div>
                    <div class="matrix-card-body">
                        @if($latest_composition)
                            <table class="matrix-row">
                                <tr>
                                    <td class="matrix-label">Lemak Tubuh (Body Fat)</td>
                                    <td class="matrix-val">{{ $latest_composition->body_fat_percentage ?? '-' }} %</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Massa Otot (Muscle Mass)</td>
                                    <td class="matrix-val">{{ $latest_composition->muscle_mass ?? '-' }} kg</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Visceral Fat / TBW</td>
                                    <td class="matrix-val">{{ $latest_composition->visceral_fat ?? '-' }} / {{ $latest_composition->total_body_water ?? '-' }} L</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">BMR / TDEE</td>
                                    <td class="matrix-val">{{ $latest_composition->bmr ?? '-' }} / {{ $latest_composition->tdee ?? '-' }} kcal</td>
                                </tr>
                            </table>
                        @else
                            <div style="font-size: 8px; color: #94a3b8; font-style: italic; padding: 6px 0; text-align: center;">Belum ada tes komposisi tubuh.</div>
                        @endif
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- ─── RINCIAN ITEM TES FISIK TERKINI ─── -->
    <div class="section-title">Rincian Item Tes Fisik Terkini</div>

    @if($latestTestItems && count($latestTestItems) > 0)
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 32%;">Item Tes</th>
                    <th style="width: 20%;">Kategori</th>
                    <th style="width: 14%; text-align: center;">Target</th>
                    <th style="width: 14%; text-align: center;">Hasil</th>
                    <th style="width: 15%; text-align: center;">Skor</th>
                </tr>
            </thead>
            <tbody>
                @foreach($latestTestItems as $i => $item)
                    <tr>
                        <td class="text-center" style="color: #64748b;">{{ $i + 1 }}</td>
                        <td class="font-bold">{{ $item['name'] }}</td>
                        <td style="color: #475569;">{{ $item['category'] }}</td>
                        <td class="text-center">{{ $item['target'] }} {{ $item['unit'] }}</td>
                        <td class="text-center font-bold">{{ $item['result'] }} {{ $item['unit'] }}</td>
                        <td class="text-center font-bold" style="color: {{ $item['score'] >= 80 ? '#059669' : ($item['score'] >= 60 ? '#ea580c' : '#e11d48') }};">
                            {{ number_format($item['score'], 1) }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div style="border: 1px dashed #cbd5e1; border-radius: 6px; padding: 8px; text-align: center; color: #94a3b8; margin-bottom: 8px; font-size: 8px;">
            Belum ada rincian item tes fisik terkini.
        </div>
    @endif

    <!-- ─── RIWAYAT SESI TES FISIK TERAKHIR ─── -->
    @if($history && count($history) > 0)
        <div class="section-title">Riwayat Sesi Tes Fisik Terakhir</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Tanggal Sesi</th>
                    <th style="width: 40%;">Nama Sesi Latihan</th>
                    <th style="width: 15%; text-align: center;">Jumlah Item</th>
                    <th style="width: 20%; text-align: center;">Skor Akhir</th>
                </tr>
            </thead>
            <tbody>
                @foreach($history as $h)
                    <tr>
                        <td class="font-bold">{{ $h['date'] }}</td>
                        <td>{{ $h['name'] }}</td>
                        <td class="text-center">{{ $h['items_count'] }} tes</td>
                        <td class="text-center font-bold" style="color: {{ $h['score'] >= 70 ? '#059669' : '#ea580c' }};">
                            {{ number_format($h['score'], 1) }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <!-- ─── GALERI BIOMETRIK & PERKEMBANGAN FISIK ─── -->
    @if(isset($galleries) && count($galleries) > 0)
        <div class="section-title">Galeri Biometrik & Perkembangan Fisik</div>
        <table class="gallery-table">
            @foreach(collect($galleries)->chunk(2) as $row)
                <tr>
                    @foreach($row as $photo)
                        <td style="width: 50%;">
                            <div class="gallery-card">
                                <div class="gallery-img-box">
                                    <img src="{{ $photo['image'] }}" class="gallery-img" alt="Foto Biometrik">
                                </div>
                                <div class="gallery-meta">
                                    <div class="gallery-date">{{ $photo['date'] }}</div>
                                    @if(!empty($photo['notes']))
                                        <div class="gallery-notes">{{ $photo['notes'] }}</div>
                                    @endif
                                </div>
                            </div>
                        </td>
                    @endforeach
                    @if(count($row) === 1)
                        <td style="width: 50%; border: none;"></td>
                    @endif
                </tr>
            @endforeach
        </table>
    @endif

    <!-- ─── FOOTER ─── -->
    <div class="footer">
        Generated on {{ \Carbon\Carbon::now()->translatedFormat('d F Y H:i') }} &bull; Powered by: Olympus Training Surabaya
    </div>

</body>
</html>
