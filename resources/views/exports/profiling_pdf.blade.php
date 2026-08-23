<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Profiling Report - {{ $athlete->name }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 10mm 12mm 12mm 12mm;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 9px;
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
            padding-bottom: 8px;
            margin-bottom: 12px;
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
            margin: 0 0 2px 0;
            font-weight: 500;
        }
        .doc-date {
            font-size: 8px;
            color: #94a3b8;
            margin: 0;
        }
        .logo-img {
            max-height: 48px;
            max-width: 160px;
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
            font-size: 9.5px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin: 10px 0 5px 0;
            padding-bottom: 3px;
            border-bottom: 1.5px solid #e2e8f0;
            page-break-after: avoid;
            break-after: avoid;
        }

        /* ─── ATHLETE PROFILE CARD ─── */
        .profile-card {
            width: 100%;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            background-color: #ffffff;
            margin-bottom: 10px;
            page-break-inside: avoid;
        }
        .profile-banner {
            background-color: #fff7ed;
            border-bottom: 1px solid #fed7aa;
            padding: 4px 8px;
            text-align: right;
            font-size: 8px;
            font-weight: bold;
            color: #c2410c;
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
            border: 1px solid #e2e8f0;
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
            width: 45%;
            padding-left: 8px !important;
        }
        .athlete-name {
            font-size: 12px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 1px 0;
        }
        .athlete-meta {
            font-size: 8px;
            color: #64748b;
            margin: 0 0 3px 0;
        }
        .badge {
            display: inline-block;
            font-size: 7.5px;
            font-weight: 700;
            padding: 1px 5px;
            border-radius: 4px;
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
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }
        .bio-label {
            font-size: 7px;
            color: #64748b;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 1px;
        }
        .bio-value {
            font-size: 10px;
            font-weight: 900;
            color: #0f172a;
        }
        .bio-unit {
            font-size: 7px;
            font-weight: normal;
            color: #64748b;
        }

        /* ─── EXECUTIVE STATS ─── */
        .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            page-break-inside: avoid;
        }
        .stats-table td {
            width: 25%;
            padding: 5px 6px;
            text-align: center;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }
        .stat-label {
            font-size: 7px;
            font-weight: bold;
            text-transform: uppercase;
            color: #64748b;
        }
        .stat-num {
            font-size: 13px;
            font-weight: 900;
            color: #ea580c;
            margin: 1px 0;
        }
        .stat-num-dark { color: #0f172a; }
        .stat-num-green { color: #059669; }
        .stat-desc {
            font-size: 7px;
            color: #94a3b8;
        }

        /* ─── DATA TABLES ─── */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .data-table thead {
            display: table-header-group;
        }
        .data-table tr {
            page-break-inside: avoid;
        }
        .data-table th {
            background-color: #f8fafc;
            color: #475569;
            font-size: 7.5px;
            font-weight: 800;
            text-transform: uppercase;
            border: 1px solid #e2e8f0;
            padding: 4px 6px;
            text-align: left;
        }
        .data-table td {
            border: 1px solid #f1f5f9;
            padding: 4px 6px;
            font-size: 8px;
            vertical-align: middle;
        }
        .data-table tr:nth-child(even) {
            background-color: #fcfcfc;
        }
        .text-center { text-align: center !important; }
        .text-right { text-align: right !important; }
        .font-bold { font-weight: bold; }

        /* Progress Bar */
        .progress-bar-bg {
            background-color: #f1f5f9;
            border-radius: 4px;
            height: 5px;
            width: 100%;
            overflow: hidden;
            display: inline-block;
            vertical-align: middle;
        }
        .progress-bar-fill {
            background-color: #ea580c;
            height: 100%;
            border-radius: 4px;
        }
        .progress-bar-fill-green {
            background-color: #059669;
        }

        /* ─── STRENGTHS & WEAKNESSES ─── */
        .sw-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
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
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            background: #ffffff;
            overflow: hidden;
        }
        .sw-header {
            background-color: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            padding: 4px 6px;
            font-size: 7.5px;
            font-weight: 800;
            color: #334155;
            text-transform: uppercase;
        }
        .sw-body {
            padding: 5px 6px;
        }
        .sw-item {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 3px;
        }
        .sw-item td {
            padding: 2px 0;
            border: none;
            font-size: 8px;
        }

        /* ─── MULTI-DOMAIN PROFILING MATRIX ─── */
        .matrix-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            page-break-inside: avoid;
        }
        .matrix-table td {
            width: 50%;
            padding: 3px;
            vertical-align: top;
        }
        .matrix-card {
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            background: #ffffff;
            overflow: hidden;
        }
        .matrix-card-header {
            background-color: #f8fafc;
            color: #334155;
            font-size: 7.5px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 4px 6px;
            border-bottom: 1px solid #e2e8f0;
        }
        .matrix-card-body {
            padding: 5px 6px;
        }
        .matrix-row {
            width: 100%;
            border-collapse: collapse;
        }
        .matrix-row td {
            padding: 2px 0;
            font-size: 7.5px;
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

        /* ─── SIGNATURE & FOOTER ─── */
        .sign-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
            page-break-inside: avoid;
        }
        .sign-table td {
            width: 33.3%;
            text-align: center;
            vertical-align: top;
            padding: 0 10px;
            border: none;
        }
        .sign-line {
            width: 120px;
            border-bottom: 1px solid #334155;
            margin: 28px auto 3px auto;
        }
        .footer {
            margin-top: 12px;
            border-top: 1px solid #e2e8f0;
            padding-top: 4px;
            font-size: 7px;
            color: #94a3b8;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- ─── HEADER ─── -->
    <div class="doc-header">
        <table class="header-table">
            <tr>
                <td style="width: 65%; vertical-align: middle;">
                    <h1 class="doc-title">Laporan Profiling & Analisis Performa</h1>
                    <p class="doc-subtitle">Olympus Training Surabaya - Performance Hub</p>
                    <div class="doc-date">Tanggal Cetak: {{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y') }}</div>
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
        <div class="profile-banner">
            {{ $packageName ?? ($athlete->sport->name ?? 'Olympus Member') }}
        </div>
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
                    <div class="athlete-meta">{{ '@' . ($athlete->username ?? '-') }} &bull; {{ $athlete->gender === 'L' || $athlete->gender === 'male' || $athlete->gender === 'Laki-laki' ? 'Laki-laki' : 'Perempuan' }}</div>
                    <div style="font-size: 8px; margin: 2px 0;">
                        <strong style="color: #ea580c;">{{ $athlete->sport->name ?? 'Umum' }}</strong>
                        @if($packageName)
                            <span style="color: #64748b;"> &bull; {{ $packageName }}</span>
                        @endif
                    </div>
                    <div style="font-size: 7.5px; color: #64748b;">
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
                                <div class="bio-value" style="color: {{ $bmiStatus['color'] ?? '#0f172a' }};">{{ $bmi }}</div>
                                <div style="font-size: 7px; font-weight: bold; color: {{ $bmiStatus['color'] ?? '#64748b' }}; margin-top: 1px;">
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
                <div class="stat-desc">Capaian Puncak</div>
            </td>
            <td>
                <div class="stat-label">Tes Terakhir</div>
                <div class="stat-num stat-num-dark" style="font-size: 10px; margin-top: 2px;">{{ $latestDate }}</div>
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
                    <th style="width: 28%;">Kategori Fisik</th>
                    <th style="width: 14%; text-align: center;">Skor Rata-Rata</th>
                    <th style="width: 38%;">Visual Progress (Target 100)</th>
                    <th style="width: 20%; text-align: center;">Status</th>
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
                        <td class="text-center font-bold" style="color: {{ $isHigh ? '#059669' : ($isMedium ? '#d97706' : '#e11d48') }};">
                            {{ number_format($cat['score'], 1) }}%
                        </td>
                        <td>
                            <table style="width: 100%; border-collapse: collapse; border: none;">
                                <tr>
                                    <td style="width: 80%; border: none; padding: 0;">
                                        <div class="progress-bar-bg">
                                            <div class="progress-bar-fill {{ $isHigh ? 'progress-bar-fill-green' : '' }}" style="width: {{ $pct }}%;"></div>
                                        </div>
                                    </td>
                                    <td style="width: 20%; border: none; padding: 0 0 0 4px; text-align: right; font-size: 7px; color: #64748b;">
                                        {{ round($pct) }}%
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td class="text-center font-bold" style="color: {{ $isHigh ? '#059669' : ($isMedium ? '#d97706' : '#e11d48') }};">
                            {{ $isHigh ? 'Excellent' : ($isMedium ? 'Good' : 'Needs Improvement') }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <!-- ─── KEUNGGULAN & PRIORITAS PENINGKATAN ─── -->
    <table class="sw-table">
        <tbody>
            <tr>
                <td>
                    <div class="sw-box">
                        <div class="sw-header">Keunggulan Fisik (>70%)</div>
                        <div class="sw-body">
                            @if($strengths && count($strengths) > 0)
                                @foreach($strengths as $item)
                                    <table class="sw-item">
                                        <tr>
                                            <td class="font-bold" style="color: #0f172a;">{{ $item['name'] }}</td>
                                            <td class="text-right font-bold" style="color: #059669;">{{ number_format($item['score'], 1) }}%</td>
                                        </tr>
                                    </table>
                                @endforeach
                            @else
                                <div style="font-size: 7.5px; color: #94a3b8; font-style: italic; text-align: center; padding: 4px 0;">Belum ada kategori di atas 70%.</div>
                            @endif
                        </div>
                    </div>
                </td>
                <td>
                    <div class="sw-box">
                        <div class="sw-header">Prioritas Peningkatan (≤70%)</div>
                        <div class="sw-body">
                            @if($weaknesses && count($weaknesses) > 0)
                                @foreach($weaknesses as $item)
                                    <table class="sw-item">
                                        <tr>
                                            <td class="font-bold" style="color: #0f172a;">{{ $item['name'] }}</td>
                                            <td class="text-right font-bold" style="color: #e11d48;">{{ number_format($item['score'], 1) }}%</td>
                                        </tr>
                                    </table>
                                @endforeach
                            @else
                                <div style="font-size: 7.5px; color: #94a3b8; font-style: italic; text-align: center; padding: 4px 0;">Semua kategori berada di atas 70%.</div>
                            @endif
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- ─── MATRIKS PENILAIAN MULTI-DOMAIN ATLET ─── -->
    <div class="section-title">Status Multi-Domain Asesmen Atlet</div>

    <table class="matrix-table">
        <tr>
            <!-- PHV & Pertumbuhan -->
            <td>
                <div class="matrix-card">
                    <div class="matrix-card-header">PHV & Pertumbuhan</div>
                    <div class="matrix-card-body">
                        @if($latest_phv)
                            <table class="matrix-row">
                                <tr>
                                    <td class="matrix-label">Maturity Offset</td>
                                    <td class="matrix-val">{{ number_format($latest_phv->maturity_offset ?? 0, 2) }} thn</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Prediksi Tinggi</td>
                                    <td class="matrix-val">{{ $latest_phv->predicted_adult_height ?? '-' }} cm</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Sisa Tumbuh</td>
                                    <td class="matrix-val" style="color: #ea580c;">+{{ $latest_phv->remaining_growth ?? '-' }} cm</td>
                                </tr>
                            </table>
                        @else
                            <div style="font-size: 7.5px; color: #94a3b8; font-style: italic; padding: 4px 0; text-align: center;">Belum ada asesmen PHV.</div>
                        @endif
                    </div>
                </div>
            </td>

            <!-- Komposisi Tubuh -->
            <td>
                <div class="matrix-card">
                    <div class="matrix-card-header">Komposisi Tubuh</div>
                    <div class="matrix-card-body">
                        @if($latest_composition)
                            <table class="matrix-row">
                                <tr>
                                    <td class="matrix-label">Body Fat</td>
                                    <td class="matrix-val" style="color: #ea580c;">{{ $latest_composition->body_fat_percentage ?? '-' }} %</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Massa Otot</td>
                                    <td class="matrix-val">{{ $latest_composition->muscle_mass ?? '-' }} kg</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">BMR / Visceral</td>
                                    <td class="matrix-val">{{ $latest_composition->bmr ?? '-' }} kcal / Lvl {{ $latest_composition->visceral_fat_level ?? '-' }}</td>
                                </tr>
                            </table>
                        @else
                            <div style="font-size: 7.5px; color: #94a3b8; font-style: italic; padding: 4px 0; text-align: center;">Belum ada tes komposisi tubuh.</div>
                        @endif
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <!-- Wellness -->
            <td>
                <div class="matrix-card">
                    <div class="matrix-card-header">Beban & Wellness</div>
                    <div class="matrix-card-body">
                        @if($latest_wellness)
                            <table class="matrix-row">
                                <tr>
                                    <td class="matrix-label">Skor Wellness</td>
                                    <td class="matrix-val" style="color: #059669;">{{ $latest_wellness->daily_wellness_score ?? '-' }} / 30</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Session RPE</td>
                                    <td class="matrix-val">{{ $latest_wellness->session_rpe ?? ($latest_wellness->am_rpe ?? '-') }} / 10</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Daily Load</td>
                                    <td class="matrix-val" style="color: #ea580c;">{{ $latest_wellness->daily_load ?? '-' }} AU</td>
                                </tr>
                            </table>
                        @else
                            <div style="font-size: 7.5px; color: #94a3b8; font-style: italic; padding: 4px 0; text-align: center;">Belum ada catatan wellness.</div>
                        @endif
                    </div>
                </div>
            </td>

            <!-- Postur Dinamis DPA -->
            <td>
                <div class="matrix-card">
                    <div class="matrix-card-header">Postur Dinamis (DPA)</div>
                    <div class="matrix-card-body">
                        @if($latest_dpa)
                            <table class="matrix-row">
                                <tr>
                                    <td class="matrix-label">Hasil Evaluasi</td>
                                    <td class="matrix-val">{{ $latest_dpa->conclusion ?? 'Normal' }}</td>
                                </tr>
                                <tr>
                                    <td class="matrix-label">Total Deviasi</td>
                                    <td class="matrix-val">{{ $latest_dpa->total_score ?? 0 }} kompensasi</td>
                                </tr>
                            </table>
                        @else
                            <div style="font-size: 7.5px; color: #94a3b8; font-style: italic; padding: 4px 0; text-align: center;">Belum ada asesmen DPA.</div>
                        @endif
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- ─── RINCIAN PARAMETER TES SESI TERAKHIR (SORTED BY SCORE DESCENDING) ─── -->
    <div class="section-title">Rincian Parameter Tes Sesi Terakhir</div>

    @if($latestTestItems && count($latestTestItems) > 0)
        @php
            $sortedItems = collect($latestTestItems)->sortByDesc('score')->values();
        @endphp
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 40%;">Item Tes & Kategori</th>
                    <th style="width: 18%; text-align: center;">Target</th>
                    <th style="width: 18%; text-align: center;">Hasil</th>
                    <th style="width: 19%; text-align: right;">Skor</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sortedItems as $i => $item)
                    <tr>
                        <td class="text-center" style="color: #64748b;">{{ $i + 1 }}</td>
                        <td>
                            <div class="font-bold">{{ $item['name'] ?? '-' }}</div>
                            <div style="font-size: 7px; color: #94a3b8;">{{ $item['category'] ?? '-' }}</div>
                        </td>
                        <td class="text-center" style="color: #64748b;">
                            {{ $item['target_value'] ?? ($item['target'] ?? '-') }} {{ $item['unit'] ?? '' }}
                        </td>
                        <td class="text-center font-bold">
                            {{ $item['result_value'] ?? ($item['result'] ?? '-') }} {{ $item['unit'] ?? '' }}
                        </td>
                        <td class="text-right font-bold" style="color: {{ ($item['score'] ?? 0) >= 80 ? '#059669' : (($item['score'] ?? 0) >= 60 ? '#d97706' : '#e11d48') }};">
                            {{ number_format($item['score'] ?? 0, 1) }}%
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <!-- ─── TANDA TANGAN ─── -->
    <table class="sign-table">
        <tr>
            <td>
                <div style="font-size: 7.5px; color: #64748b;">Atlet / Klien</div>
                <div class="sign-line"></div>
                <strong style="font-size: 8.5px; color: #0f172a;">{{ $athlete->name }}</strong>
            </td>
            <td>
                <div style="font-size: 7.5px; color: #64748b;">Pelatih Kepala</div>
                <div class="sign-line"></div>
                <strong style="font-size: 8.5px; color: #0f172a;">{{ $coachesText !== '-' ? $coachesText : 'Head Coach' }}</strong>
            </td>
            <td>
                <div style="font-size: 7.5px; color: #64748b;">Sports Performance Lead</div>
                <div class="sign-line"></div>
                <strong style="font-size: 8.5px; color: #0f172a;">Olympus Performance Lead</strong>
            </td>
        </tr>
    </table>

    <!-- ─── FOOTER ─── -->
    <div class="footer">
        Generated on {{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y, HH:mm') }} &bull; Olympus Training Surabaya
    </div>

</body>
</html>
