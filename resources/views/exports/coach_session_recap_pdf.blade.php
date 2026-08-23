<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Rekap Honor & Sesi Pelatih - {{ $coach->name }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 10mm 12mm 12mm 12mm;
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
            border-bottom: 2px solid #4f46e5;
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
            font-size: 16px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 2px 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .doc-subtitle {
            font-size: 9px;
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
            max-height: 52px;
            max-width: 180px;
            object-fit: contain;
        }
        .logo-text {
            font-size: 18px;
            font-weight: 900;
            color: #4f46e5;
            letter-spacing: -0.5px;
        }

        /* ─── SECTION TITLES ─── */
        .section-title {
            font-size: 10.5px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin: 12px 0 5px 0;
            padding-bottom: 3px;
            border-bottom: 1.5px solid #e2e8f0;
            page-break-after: avoid;
            break-after: avoid;
        }
        .section-title span {
            color: #4f46e5;
            margin-right: 3px;
        }

        /* ─── COACH PROFILE CARD ─── */
        .profile-card {
            width: 100%;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            background-color: #f8fafc;
            margin-bottom: 10px;
            page-break-inside: avoid;
        }
        .profile-table {
            width: 100%;
            border-collapse: collapse;
        }
        .profile-table td {
            padding: 8px 10px;
            vertical-align: middle;
        }
        .coach-name {
            font-size: 14px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 2px 0;
        }
        .coach-meta {
            font-size: 9px;
            color: #64748b;
            margin: 0 0 4px 0;
        }
        .badge {
            display: inline-block;
            font-size: 7.5px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            margin-right: 4px;
        }
        .badge-indigo {
            background-color: #eef2ff;
            color: #4338ca;
            border: 1px solid #c7d2fe;
        }
        .badge-emerald {
            background-color: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
        }
        .badge-rose {
            background-color: #fff1f2;
            color: #be123c;
            border: 1px solid #fecdd3;
        }
        .badge-slate {
            background-color: #f1f5f9;
            color: #334155;
            border: 1px solid #cbd5e1;
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
            padding: 7px 8px;
            text-align: center;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
        }
        .stat-label {
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            color: #64748b;
        }
        .stat-num {
            font-size: 14px;
            font-weight: 900;
            color: #4f46e5;
            margin: 2px 0;
        }
        .stat-num-dark { color: #0f172a; }
        .stat-num-green { color: #059669; }
        .stat-num-rose { color: #e11d48; }
        .stat-desc {
            font-size: 7.5px;
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
            background-color: #f1f5f9;
            color: #475569;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            padding: 5px 6px;
            border: 1px solid #cbd5e1;
            text-align: left;
        }
        .data-table td {
            padding: 5px 6px;
            border: 1px solid #e2e8f0;
            font-size: 8.5px;
            vertical-align: middle;
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }

        /* ─── SIGNATURE BLOCK ─── */
        .sign-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
            page-break-inside: avoid;
        }
        .sign-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            padding: 0 20px;
        }
        .sign-space {
            height: 48px;
        }
        .sign-name {
            font-size: 10px;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 1px solid #0f172a;
            display: inline-block;
            min-width: 150px;
            padding-bottom: 2px;
        }
        .sign-role {
            font-size: 8.5px;
            color: #64748b;
            margin-top: 2px;
        }

        /* ─── FOOTER ─── */
        .footer {
            margin-top: 15px;
            border-top: 1px solid #e2e8f0;
            padding-top: 6px;
            font-size: 7.5px;
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
                    <h1 class="doc-title">Rekapitulasi Sesi & Honor Pelatih</h1>
                    <p class="doc-subtitle">Coach Fee Statement & Performance Session Log</p>
                    <div class="doc-date">Tanggal Cetak: {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</div>
                </td>
                <td style="width: 35%; text-align: right; vertical-align: middle;">
                    @if($clubLogo)
                        <img src="{{ $clubLogo }}" alt="Olympus Training Surabaya" class="logo-img">
                    @else
                        <div class="logo-text">OTS FITNESS</div>
                    @endif
                </td>
            </tr>
        </table>
    </div>

    <!-- ─── COACH IDENTITY CARD ─── -->
    <div class="profile-card">
        <table class="profile-table">
            <tr>
                <td style="width: 60%;">
                    <div class="coach-name">{{ $coach->name }}</div>
                    <div class="coach-meta">{{ '@' . ($coach->username ?? '-') }} &bull; Peran: Pelatih / Trainer</div>
                    <div>
                        <span class="badge badge-indigo">Pelatih OTS</span>
                        @if($coach->is_gym_guard)
                            <span class="badge badge-slate">Petugas Jaga Gym</span>
                        @endif
                    </div>
                </td>
                <td style="width: 40%; text-align: right;">
                    <div style="font-size: 8px; color: #64748b;">Total Akumulasi Honor:</div>
                    <div style="font-size: 15px; font-weight: 900; color: #0f172a;">
                        Rp {{ number_format($totalFee, 0, ',', '.') }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- ─── EXECUTIVE STATS ─── -->
    <table class="stats-table">
        <tr>
            <td>
                <div class="stat-label">Total Sesi Bertugas</div>
                <div class="stat-num stat-num-dark">{{ count($allSessions) }}</div>
                <div class="stat-desc">Sesi Terdaftar</div>
            </td>
            <td>
                <div class="stat-label">Total Tagihan Honor</div>
                <div class="stat-num">Rp {{ number_format($totalFee, 0, ',', '.') }}</div>
                <div class="stat-desc">Semua Periode</div>
            </td>
            <td>
                <div class="stat-label">Sudah Dicairkan</div>
                <div class="stat-num stat-num-green">Rp {{ number_format($paidFee, 0, ',', '.') }}</div>
                <div class="stat-desc">{{ count($paidSessions) }} Sesi Lunas</div>
            </td>
            <td>
                <div class="stat-label">Belum Dicairkan</div>
                <div class="stat-num stat-num-rose">Rp {{ number_format($unpaidFee, 0, ',', '.') }}</div>
                <div class="stat-desc">{{ count($unpaidSessions) }} Sesi Tertunda</div>
            </td>
        </tr>
    </table>

    <!-- ─── REKAPITULASI PER BULAN ─── -->
    <div class="section-title"><span>■</span> Rekapitulasi Honor Per Bulan (Juli, Juni, dll.)</div>

    @if(isset($monthlyBreakdown) && count($monthlyBreakdown) > 0)
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Bulan Periode</th>
                    <th style="width: 12%; text-align: center;">Individu</th>
                    <th style="width: 12%; text-align: center;">Grup</th>
                    <th style="width: 12%; text-align: center;">Jaga Gym</th>
                    <th style="width: 13%; text-align: center;">Total Sesi</th>
                    <th style="width: 26%; text-align: right;">Total Honor</th>
                </tr>
            </thead>
            <tbody>
                @foreach($monthlyBreakdown as $mb)
                    <tr>
                        <td class="font-bold" style="color: #0f172a;">{{ $mb['month_label'] }}</td>
                        <td class="text-center">{{ $mb['individual_sessions'] }}</td>
                        <td class="text-center">{{ $mb['group_sessions'] }}</td>
                        <td class="text-center">{{ $mb['gym_sessions'] }}</td>
                        <td class="text-center font-bold">{{ $mb['total_sessions'] }}</td>
                        <td class="text-right font-bold">
                            Rp {{ number_format($mb['total_fee'], 0, ',', '.') }}
                            @if($mb['unpaid_fee'] > 0)
                                <span style="display: block; font-size: 7px; color: #e11d48;">Belum: Rp {{ number_format($mb['unpaid_fee'], 0, ',', '.') }}</span>
                            @else
                                <span style="display: block; font-size: 7px; color: #059669;">Lunas</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div style="border: 1px dashed #cbd5e1; border-radius: 6px; padding: 8px; text-align: center; color: #94a3b8; margin-bottom: 10px;">
            Belum ada rekapitulasi bulanan yang terekam.
        </div>
    @endif

    <!-- ─── DAFTAR RINCIAN SELURUH SESI ─── -->
    <div class="section-title"><span>■</span> Rincian Sesi Latihan & Klien</div>

    @if(isset($allSessions) && count($allSessions) > 0)
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 14%;">Tanggal</th>
                    <th style="width: 12%; text-align: center;">Tipe</th>
                    <th style="width: 25%;">Klien / Grup</th>
                    <th style="width: 27%;">Nama Sesi / Program</th>
                    <th style="width: 12%; text-align: right;">Honor</th>
                    <th style="width: 10%; text-align: center;">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($allSessions as $s)
                    <tr>
                        <td>{{ $s['date'] ? \Carbon\Carbon::parse($s['date'])->format('d M Y') : '-' }}</td>
                        <td class="text-center">
                            <span class="badge {{ $s['type'] === 'Grup' ? 'badge-slate' : ($s['type'] === 'Jaga Gym' ? 'badge-emerald' : 'badge-indigo') }}">
                                {{ $s['type'] }}
                            </span>
                        </td>
                        <td class="font-bold">{{ $s['client_name'] ?? 'Klien' }}</td>
                        <td>
                            @if(!empty($s['session_number']))
                                <span style="font-weight: bold; color: #4f46e5;">#{{ $s['session_number'] }}</span>
                            @endif
                            {{ $s['name'] }}
                        </td>
                        <td class="text-right font-bold">
                            Rp {{ number_format($s['fee'], 0, ',', '.') }}
                        </td>
                        <td class="text-center">
                            @if($s['is_paid'])
                                <span class="badge badge-emerald">Lunas</span>
                            @else
                                <span class="badge badge-rose">Belum</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div style="border: 1px dashed #cbd5e1; border-radius: 6px; padding: 8px; text-align: center; color: #94a3b8; margin-bottom: 10px;">
            Belum ada rincian sesi yang terekam.
        </div>
    @endif

    <!-- ─── TANDA TANGAN & PENGESAHAN ─── -->
    <table class="sign-table">
        <tr>
            <td>
                <div style="font-size: 8.5px; color: #64748b; margin-bottom: 4px;">Dibuat & Diverifikasi Oleh:</div>
                <div class="sign-space"></div>
                <div class="sign-name">Admin / Superadmin</div>
                <div class="sign-role">Olympus Training Surabaya</div>
            </td>
            <td>
                <div style="font-size: 8.5px; color: #64748b; margin-bottom: 4px;">Diterima Oleh Pelatih:</div>
                <div class="sign-space"></div>
                <div class="sign-name">{{ $coach->name }}</div>
                <div class="sign-role">Pelatih Fisik / Trainer</div>
            </td>
        </tr>
    </table>

    <!-- ─── FOOTER ─── -->
    <div class="footer">
        Dicetak pada {{ \Carbon\Carbon::now()->translatedFormat('d F Y H:i') }} &bull; Olympus Training Surabaya &bull; Dokumen Resmi Keuangan & Sesi
    </div>

</body>
</html>
