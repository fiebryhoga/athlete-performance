<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Profiling Report - {{ $athlete->name }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 7mm 9mm 7mm 9mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 8.5px;
            color: #0f172a;
            line-height: 1.3;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }

        /* ─── HEADER ─── */
        .doc-header {
            width: 100%;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 5px;
            margin-bottom: 8px;
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
            font-size: 14px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 1px 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .doc-subtitle {
            font-size: 8px;
            color: #64748b;
            margin: 0;
            font-weight: 500;
        }
        .doc-date {
            font-size: 7.5px;
            color: #94a3b8;
            margin: 0;
        }
        .logo-img {
            max-height: 40px;
            max-width: 150px;
            object-fit: contain;
        }
        .logo-text {
            font-size: 16px;
            font-weight: 900;
            color: #ea580c;
            letter-spacing: -0.5px;
        }

        /* ─── ATHLETE IDENTITY & BIOMETRICS BANNER ─── */
        .profile-card {
            width: 100%;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            background-color: #ffffff;
            margin-bottom: 8px;
        }
        .profile-banner {
            background-color: #fff7ed;
            border-bottom: 1px solid #fed7aa;
            padding: 3px 8px;
            text-align: right;
            font-size: 7.5px;
            font-weight: bold;
            color: #c2410c;
        }
        .profile-table {
            width: 100%;
            border-collapse: collapse;
        }
        .profile-table td {
            padding: 4px 6px;
            vertical-align: middle;
        }
        .avatar-box {
            width: 44px;
            text-align: center;
            padding-right: 0 !important;
        }
        .avatar-img {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            object-fit: cover;
            border: 1px solid #e2e8f0;
        }
        .avatar-initial {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            background-color: #ea580c;
            color: #ffffff;
            font-size: 17px;
            font-weight: 900;
            line-height: 40px;
            text-align: center;
            margin: 0 auto;
        }
        .athlete-info {
            width: 48%;
            padding-left: 6px !important;
        }
        .athlete-name {
            font-size: 11px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 1px 0;
            line-height: 1.1;
        }
        .athlete-meta {
            font-size: 7.5px;
            color: #64748b;
            margin: 0 0 2px 0;
        }

        /* ─── BIOMETRICS GRID ─── */
        .bio-table {
            width: 100%;
            border-collapse: collapse;
        }
        .bio-table td {
            width: 25%;
            padding: 3px 4px;
            text-align: center;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }
        .bio-label {
            font-size: 6.5px;
            color: #64748b;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 1px;
        }
        .bio-value {
            font-size: 9.5px;
            font-weight: 900;
            color: #0f172a;
        }
        .bio-unit {
            font-size: 6.5px;
            font-weight: normal;
            color: #64748b;
        }

        /* ─── 3-COLUMN MAIN LAYOUT TABLE ─── */
        .main-layout {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
        }
        .main-layout > tbody > tr > td {
            vertical-align: top;
            padding: 0 4px;
        }
        .main-layout > tbody > tr > td:first-child { padding-left: 0; width: 30%; }
        .main-layout > tbody > tr > td:nth-child(2) { width: 33%; }
        .main-layout > tbody > tr > td:last-child { padding-right: 0; width: 37%; }

        /* ─── CARDS & SECTIONS ─── */
        .card {
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            background: #ffffff;
            margin-bottom: 6px;
            overflow: hidden;
        }
        .card-header {
            background-color: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            padding: 3.5px 6px;
            font-size: 7.5px;
            font-weight: 800;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .card-body {
            padding: 5px 6px;
        }

        /* ─── SCORE GAUGE BOX ─── */
        .score-box {
            text-align: center;
            background: #fafafa;
            border: 1px solid #fed7aa;
            border-radius: 5px;
            padding: 6px 4px;
            margin-bottom: 5px;
        }
        .score-big {
            font-size: 20px;
            font-weight: 900;
            color: #ea580c;
            line-height: 1;
        }
        .score-label {
            font-size: 7px;
            font-weight: bold;
            color: #64748b;
            margin-top: 1px;
        }
        .score-status {
            display: inline-block;
            font-size: 7px;
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 10px;
            margin-top: 2px;
        }
        .status-green { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .status-amber { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
        .status-rose { background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; }

        .mini-stats {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }
        .mini-stats td {
            width: 33.3%;
            text-align: center;
            padding: 3px 2px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }

        /* ─── PROGRESS BARS ─── */
        .progress-bar-bg {
            background-color: #f1f5f9;
            border-radius: 3px;
            height: 4.5px;
            width: 100%;
            overflow: hidden;
            display: inline-block;
            vertical-align: middle;
        }
        .progress-bar-fill {
            background-color: #ea580c;
            height: 100%;
            border-radius: 3px;
        }
        .progress-bar-fill-green {
            background-color: #059669;
        }
        .progress-bar-fill-rose {
            background-color: #e11d48;
        }

        /* ─── TABLES ─── */
        .data-table {
            width: 100%;
            border-collapse: collapse;
        }
        .data-table th {
            background-color: #f8fafc;
            color: #475569;
            font-size: 7px;
            font-weight: 800;
            text-transform: uppercase;
            border: 1px solid #e2e8f0;
            padding: 3px 4px;
            text-align: left;
        }
        .data-table td {
            border: 1px solid #f1f5f9;
            padding: 2.5px 4px;
            font-size: 7.5px;
            vertical-align: middle;
        }
        .data-table tr:nth-child(even) {
            background-color: #fcfcfc;
        }
        .text-center { text-align: center !important; }
        .text-right { text-align: right !important; }
        .font-bold { font-weight: bold; }

        /* ─── MULTI DOMAIN ─── */
        .matrix-table {
            width: 100%;
            border-collapse: collapse;
        }
        .matrix-table td {
            width: 50%;
            padding: 2px;
            vertical-align: top;
        }
        .matrix-box {
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            background: #ffffff;
            padding: 4px 5px;
        }
        .matrix-title {
            font-size: 6.5px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 1px;
            margin-bottom: 2px;
        }
        .matrix-row {
            width: 100%;
            border-collapse: collapse;
        }
        .matrix-row td {
            padding: 1px 0;
            font-size: 7px;
            border: none;
        }

        /* ─── SIGNATURE & FOOTER ─── */
        .sign-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        .sign-table td {
            width: 33.3%;
            text-align: center;
            vertical-align: top;
            padding: 0 10px;
            border: none;
        }
        .sign-line {
            width: 110px;
            border-bottom: 1px solid #334155;
            margin: 22px auto 2px auto;
        }
        .footer {
            margin-top: 6px;
            border-top: 1px solid #e2e8f0;
            padding-top: 3px;
            font-size: 6.5px;
            color: #94a3b8;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- ─── 1. OFFICIAL DOCUMENT HEADER (LANDSCAPE) ─── -->
    <div class="doc-header">
        <table class="header-table">
            <tr>
                <td style="width: 65%; vertical-align: middle;">
                    <h1 class="doc-title">Laporan Profiling & Analisis Performa</h1>
                    <p class="doc-subtitle">Olympus Training Surabaya - Performance Hub</p>
                </td>
                <td style="width: 35%; text-align: right; vertical-align: middle;">
                    <div style="font-size: 7px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">Tanggal Cetak</div>
                    <div style="font-size: 9px; font-weight: bold; color: #0f172a;">{{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y') }}</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- ─── 2. TOP HERO PROFILE & BIOMETRICS BANNER ─── -->
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
                    <div class="athlete-meta">{{ '@' . ($athlete->username ?? '-') }} &bull; {{ $athlete->gender === 'L' || $athlete->gender === 'male' || $athlete->gender === 'Laki-laki' ? 'Laki-laki' : 'Perempuan' }} &bull; <strong style="color: #ea580c;">{{ $athlete->sport->name ?? 'Umum' }}</strong></div>
                    <div style="font-size: 7px; color: #64748b;">
                        <strong>Coach:</strong> {{ $coachesText }}
                    </div>
                </td>
                <td style="width: 48%; padding-right: 6px;">
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
                                <div style="font-size: 6.5px; font-weight: bold; color: {{ $bmiStatus['color'] ?? '#64748b' }};">
                                    {{ $bmiClass['label'] }}
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    <!-- ─── 3. MAIN CONTENT: 3 BALANCED LANDSCAPE COLUMNS ─── -->
    <table class="main-layout">
        <tr>
            
            <!-- ═══ KOLOM 1: SCORE GAUGE & KEUNGGULAN / PRIORITAS ═══ -->
            <td>
                <!-- Skor Performa -->
                <div class="card">
                    <div class="card-header">Skor Performa Fisik</div>
                    <div class="card-body">
                        @php
                            $evalRating = $averageScore >= 80 ? 'Excellent' : ($averageScore >= 60 ? 'Good' : 'Needs Improvement');
                            $evalClass = $averageScore >= 80 ? 'status-green' : ($averageScore >= 60 ? 'status-amber' : 'status-rose');
                        @endphp
                        <div class="score-box">
                            <div class="score-big">{{ number_format($averageScore, 1) }}</div>
                            <div class="score-label">Rata-Rata Sesi Terkini</div>
                            <div class="score-status {{ $evalClass }}">{{ $evalRating }}</div>
                        </div>

                        <table class="mini-stats">
                            <tr>
                                <td>
                                    <div style="font-size: 6.5px; color: #64748b; font-weight: bold; text-transform: uppercase;">Total Sesi</div>
                                    <div style="font-size: 9px; font-weight: 900; color: #0f172a;">{{ $totalSessions }}</div>
                                </td>
                                <td>
                                    <div style="font-size: 6.5px; color: #64748b; font-weight: bold; text-transform: uppercase;">Puncak</div>
                                    <div style="font-size: 9px; font-weight: 900; color: #059669;">{{ number_format($highestScore, 1) }}</div>
                                </td>
                                <td>
                                    <div style="font-size: 6.5px; color: #64748b; font-weight: bold; text-transform: uppercase;">Terbaik</div>
                                    <div style="font-size: 9px; font-weight: 900; color: #ea580c; white-space: nowrap; overflow: hidden;">{{ $stats['best_category'] ?? '-' }}</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Keunggulan Fisik -->
                <div class="card">
                    <div class="card-header">Keunggulan Fisik (&gt;70%)</div>
                    <div class="card-body">
                        @if($strengths && count($strengths) > 0)
                            @foreach($strengths as $item)
                                @php $pct = min(100, max(0, $item['score'])); @endphp
                                <div style="margin-bottom: 3px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="font-size: 7.5px; font-weight: bold; color: #0f172a; padding: 0;">{{ $item['name'] }}</td>
                                            <td style="font-size: 7.5px; font-weight: 900; color: #059669; text-align: right; padding: 0;">{{ number_format($item['score'], 1) }}%</td>
                                        </tr>
                                    </table>
                                    <div class="progress-bar-bg" style="margin-top: 1px;">
                                        <div class="progress-bar-fill progress-bar-fill-green" style="width: {{ $pct }}%;"></div>
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <div style="font-size: 7px; color: #94a3b8; font-style: italic; text-align: center; padding: 2px 0;">Belum ada kategori di atas 70%.</div>
                        @endif
                    </div>
                </div>

                <!-- Prioritas Peningkatan -->
                <div class="card">
                    <div class="card-header">Prioritas Peningkatan (&le;70%)</div>
                    <div class="card-body">
                        @if($weaknesses && count($weaknesses) > 0)
                            @foreach($weaknesses as $item)
                                @php $pct = min(100, max(0, $item['score'])); @endphp
                                <div style="margin-bottom: 3px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="font-size: 7.5px; font-weight: bold; color: #0f172a; padding: 0;">{{ $item['name'] }}</td>
                                            <td style="font-size: 7.5px; font-weight: 900; color: #e11d48; text-align: right; padding: 0;">{{ number_format($item['score'], 1) }}%</td>
                                        </tr>
                                    </table>
                                    <div class="progress-bar-bg" style="margin-top: 1px;">
                                        <div class="progress-bar-fill progress-bar-fill-rose" style="width: {{ $pct }}%;"></div>
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <div style="font-size: 7px; color: #94a3b8; font-style: italic; text-align: center; padding: 2px 0;">Semua kategori berada di atas 70%.</div>
                        @endif
                    </div>
                </div>
            </td>

            <!-- ═══ KOLOM 2: ANALISIS KATEGORI FISIK & MULTI-DOMAIN ═══ -->
            <td>
                <!-- Analisis Kategori Fisik -->
                <div class="card">
                    <div class="card-header">Analisis Kemampuan per Kategori</div>
                    <div class="card-body" style="padding: 0;">
                        @if($categoryStats && count($categoryStats) > 0)
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th style="width: 38%;">Kategori</th>
                                        <th style="width: 32%;">Progress</th>
                                        <th style="width: 30%; text-align: right;">Skor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($categoryStats as $cat)
                                        @php
                                            $pct = min(100, max(0, $cat['score']));
                                            $isHigh = $cat['score'] >= 80;
                                            $isMed = $cat['score'] >= 60 && $cat['score'] < 80;
                                        @endphp
                                        <tr>
                                            <td class="font-bold">{{ $cat['name'] }}</td>
                                            <td>
                                                <div class="progress-bar-bg">
                                                    <div class="progress-bar-fill {{ $isHigh ? 'progress-bar-fill-green' : ($isMed ? '' : 'progress-bar-fill-rose') }}" style="width: {{ $pct }}%;"></div>
                                                </div>
                                            </td>
                                            <td class="text-right font-bold" style="color: {{ $isHigh ? '#059669' : ($isMed ? '#d97706' : '#e11d48') }};">
                                                {{ number_format($cat['score'], 1) }}%
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        @endif
                    </div>
                </div>

                <!-- Status Multi-Domain Asesmen -->
                <div class="card">
                    <div class="card-header">Status Multi-Domain Asesmen</div>
                    <div class="card-body" style="padding: 3px;">
                        <table class="matrix-table">
                            <tr>
                                <td>
                                    <div class="matrix-box">
                                        <div class="matrix-title">PHV & Pertumbuhan</div>
                                        @if($latest_phv)
                                            <table class="matrix-row">
                                                <tr>
                                                    <td style="color: #64748b;">Offset</td>
                                                    <td class="font-bold text-right">{{ number_format($latest_phv->maturity_offset ?? 0, 1) }} thn</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #64748b;">Sisa Tumbuh</td>
                                                    <td class="font-bold text-right" style="color: #ea580c;">+{{ $latest_phv->remaining_growth ?? '-' }} cm</td>
                                                </tr>
                                            </table>
                                        @else
                                            <div style="font-size: 6.5px; color: #94a3b8; font-style: italic; text-align: center;">Belum ada PHV</div>
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <div class="matrix-box">
                                        <div class="matrix-title">Komposisi Tubuh</div>
                                        @if($latest_composition)
                                            <table class="matrix-row">
                                                <tr>
                                                    <td style="color: #64748b;">Body Fat</td>
                                                    <td class="font-bold text-right" style="color: #ea580c;">{{ $latest_composition->body_fat_percentage ?? '-' }}%</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #64748b;">Massa Otot</td>
                                                    <td class="font-bold text-right">{{ $latest_composition->muscle_mass ?? '-' }} kg</td>
                                                </tr>
                                            </table>
                                        @else
                                            <div style="font-size: 6.5px; color: #94a3b8; font-style: italic; text-align: center;">Belum ada data</div>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="matrix-box">
                                        <div class="matrix-title">Beban & Wellness</div>
                                        @if($latest_wellness)
                                            <table class="matrix-row">
                                                <tr>
                                                    <td style="color: #64748b;">Wellness</td>
                                                    <td class="font-bold text-right" style="color: #059669;">{{ $latest_wellness->daily_wellness_score ?? '-' }}/30</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #64748b;">Daily Load</td>
                                                    <td class="font-bold text-right" style="color: #ea580c;">{{ $latest_wellness->daily_load ?? 0 }} AU</td>
                                                </tr>
                                            </table>
                                        @else
                                            <div style="font-size: 6.5px; color: #94a3b8; font-style: italic; text-align: center;">Belum ada catatan</div>
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <div class="matrix-box">
                                        <div class="matrix-title">Postur Dinamis DPA</div>
                                        @if($latest_dpa)
                                            <table class="matrix-row">
                                                <tr>
                                                    <td style="color: #64748b;">Evaluasi</td>
                                                    <td class="font-bold text-right">{{ $latest_dpa->conclusion ?? 'Normal' }}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #64748b;">Deviasi</td>
                                                    <td class="font-bold text-right">{{ $latest_dpa->total_score ?? 0 }} item</td>
                                                </tr>
                                            </table>
                                        @else
                                            <div style="font-size: 6.5px; color: #94a3b8; font-style: italic; text-align: center;">Belum ada DPA</div>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </td>

            <!-- ═══ KOLOM 3: RINCIAN PARAMETER TES (SORTED BY SCORE DESCENDING) ═══ -->
            <td>
                <div class="card">
                    <div class="card-header">
                        Rincian Parameter Tes Sesi Terakhir
                        @if($latestTestItems && count($latestTestItems) > 0)
                            <span style="float: right; font-weight: normal; color: #64748b;">{{ count($latestTestItems) }} Item</span>
                        @endif
                    </div>
                    <div class="card-body" style="padding: 0;">
                        @if($latestTestItems && count($latestTestItems) > 0)
                            @php
                                $sortedItems = collect($latestTestItems)->sortByDesc('score')->values();
                            @endphp
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th style="width: 6%; text-align: center;">No</th>
                                        <th style="width: 44%;">Item Tes & Kategori</th>
                                        <th style="width: 16%; text-align: center;">Target</th>
                                        <th style="width: 16%; text-align: center;">Hasil</th>
                                        <th style="width: 18%; text-align: right;">Skor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($sortedItems as $i => $item)
                                        <tr>
                                            <td class="text-center" style="color: #64748b;">{{ $i + 1 }}</td>
                                            <td>
                                                <div class="font-bold">{{ $item['name'] ?? '-' }}</div>
                                                <div style="font-size: 6.5px; color: #94a3b8;">{{ $item['category'] ?? '-' }}</div>
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
                        @else
                            <div style="font-size: 7.5px; color: #94a3b8; font-style: italic; text-align: center; padding: 10px 0;">Belum ada data parameter tes.</div>
                        @endif
                    </div>
                </div>
            </td>

        </tr>
    </table>

    <!-- ─── 4. SIGNATURE SECTION ─── -->
    <table class="sign-table">
        <tr>
            <td>
                <div style="font-size: 7px; color: #64748b;">Atlet / Klien</div>
                <div class="sign-line"></div>
                <strong style="font-size: 8px; color: #0f172a;">{{ $athlete->name }}</strong>
            </td>
            <td>
                <div style="font-size: 7px; color: #64748b;">Pelatih Kepala</div>
                <div class="sign-line"></div>
                <strong style="font-size: 8px; color: #0f172a;">{{ $coachesText !== '-' ? $coachesText : 'Head Coach' }}</strong>
            </td>
            <td>
                <div style="font-size: 7px; color: #64748b;">Sports Performance Lead</div>
                <div class="sign-line"></div>
                <strong style="font-size: 8px; color: #0f172a;">Olympus Performance Lead</strong>
            </td>
        </tr>
    </table>

    <!-- ─── 5. FOOTER ─── -->
    <div class="footer">
        Generated via Olympus Performance System &bull; Dokumen resmi analisis performa atlet &bull; Dicetak: {{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y, HH:mm') }}
    </div>

</body>
</html>
