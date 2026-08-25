<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Slip Gaji & Rekapitulasi Honor - {{ $coach->name }}</title>
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

        /* ─── HEADER (STANDAR PROFILING PDF) ─── */
        .doc-header {
            width: 100%;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 8px;
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

        /* ─── PAYSLIP TITLE & DIVIDER ─── */
        .payslip-title-bar {
            margin: 10px 0 8px 0;
        }
        .payslip-title {
            font-size: 11px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-bottom: 4px;
        }
        .payslip-divider {
            width: 100%;
            border-bottom: 1.5px solid #cbd5e1;
            margin-bottom: 8px;
        }

        /* ─── 2-COLUMN METADATA (TABEL REFERENSI SLIP GAJI) ─── */
        .meta-columns-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }
        .meta-columns-table td {
            vertical-align: top;
            padding: 0;
        }
        .key-val-table {
            width: 100%;
            border-collapse: collapse;
        }
        .key-val-table td {
            padding: 2px 0;
            font-size: 8.5px;
            vertical-align: top;
        }
        .kv-key {
            width: 110px;
            color: #475569;
            font-weight: 500;
        }
        .kv-sep {
            width: 12px;
            text-align: center;
            color: #64748b;
        }
        .kv-val {
            color: #0f172a;
        }

        .section-divider {
            width: 100%;
            border-bottom: 1px solid #cbd5e1;
            margin: 8px 0 10px 0;
        }

        /* ─── 2-COLUMN FINANCIAL BOX (PENDAPATAN VS POTONGAN/PENCAIRAN) ─── */
        .salary-box {
            width: 100%;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            margin-bottom: 12px;
            page-break-inside: avoid;
        }
        .salary-table {
            width: 100%;
            border-collapse: collapse;
        }
        .salary-table th {
            background-color: #f8fafc;
            color: #334155;
            font-size: 8.5px;
            font-weight: 900;
            letter-spacing: 0.4px;
            padding: 5px 10px;
            text-align: left;
            border-bottom: 1px solid #cbd5e1;
        }
        .item-table {
            width: 100%;
            border-collapse: collapse;
        }
        .item-table td {
            padding: 2.5px 0;
            font-size: 8.5px;
            vertical-align: top;
        }
        .it-label {
            color: #334155;
        }
        .it-sep {
            width: 12px;
            text-align: center;
            color: #64748b;
        }
        .it-val {
            text-align: right;
            color: #0f172a;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-weight: bold;
            width: 85px;
        }

        .summary-row {
            background-color: #f8fafc;
            border-top: 1.5px solid #cbd5e1;
        }

        /* ─── SECTION LOG TABLES ─── */
        .section-title {
            font-size: 9px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin: 10px 0 4px 0;
            padding-bottom: 2px;
            border-bottom: 1px solid #e2e8f0;
            page-break-after: avoid;
            break-after: avoid;
        }

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
            color: #334155;
            font-size: 7.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            padding: 3.5px 5px;
            border: 1px solid #cbd5e1;
            text-align: left;
        }
        .data-table td {
            padding: 3.5px 5px;
            border: 1px solid #e2e8f0;
            font-size: 8px;
            vertical-align: middle;
        }

        .badge {
            display: inline-block;
            font-size: 7px;
            font-weight: 700;
            padding: 1px 4px;
            border-radius: 2px;
        }
        .badge-orange { background-color: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; }
        .badge-blue { background-color: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
        .badge-emerald { background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .badge-rose { background-color: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }

        /* ─── SIGNATURE BLOCK ─── */
        .sign-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            page-break-inside: avoid;
        }
        .sign-table td {
            vertical-align: top;
            padding: 0 10px;
        }
        .sign-name {
            font-size: 9px;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 1px solid #0f172a;
            display: inline-block;
            min-width: 150px;
            padding-bottom: 2px;
        }
        .sign-role {
            font-size: 8px;
            color: #64748b;
            margin-top: 2px;
        }

        /* ─── FOOTER (SESUAI INSTRUKSI USER) ─── */
        .doc-footer {
            margin-top: 12px;
            border-top: 1px solid #e2e8f0;
            padding-top: 5px;
            font-size: 7px;
            color: #64748b;
            text-align: center;
            line-height: 1.3;
        }
    </style>
</head>
<body>

    <!-- ─── HEADER (PERSIS DENGAN LAPORAN PROFILING PDF) ─── -->
    <div class="doc-header">
        <table class="header-table">
            <tr>
                <td style="width: 65%; vertical-align: middle;">
                    <h1 class="doc-title">Slip Gaji & Rekapitulasi Honor Pelatih</h1>
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

    <!-- ─── JUDUL SLIP GAJI PERIODE ─── -->
    <div class="payslip-title-bar">
        <div class="payslip-title">SLIP GAJI PERIODE {{ strtoupper($targetMonthLabel) }}</div>
        <div class="payslip-divider"></div>
    </div>

    <!-- ─── METADATA 2 KOLOM (SEPERTI CONTOH REFERENSI) ─── -->
    <table class="meta-columns-table">
        <tr>
            <td style="width: 50%; padding-right: 15px;">
                <table class="key-val-table">
                    <tr>
                        <td class="kv-key">Nama</td>
                        <td class="kv-sep">:</td>
                        <td class="kv-val font-bold">{{ $coach->name }}</td>
                    </tr>
                    <tr>
                        <td class="kv-key">Departemen</td>
                        <td class="kv-sep">:</td>
                        <td class="kv-val">Performance & Conditioning</td>
                    </tr>
                    <tr>
                        <td class="kv-key">Jabatan</td>
                        <td class="kv-sep">:</td>
                        <td class="kv-val">Pelatih Fisik / Trainer</td>
                    </tr>
                    <tr>
                        <td class="kv-key">Tanggal Gajian</td>
                        <td class="kv-sep">:</td>
                        <td class="kv-val">{{ \Carbon\Carbon::now()->translatedFormat('d-m-Y') }}</td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%; padding-left: 15px;">
                <table class="key-val-table">
                    <tr>
                        <td class="kv-key">Total Sesi Bertugas</td>
                        <td class="kv-sep">:</td>
                        <td class="kv-val font-bold">{{ count($allSessions) }} Sesi ({{ count($indRegularSessions) + count($grpRegularSessions) }} Asli, {{ count($indExtraSessions) + count($grpExtraSessions) }} Tambahan)</td>
                    </tr>
                    <tr>
                        <td class="kv-key">Shift Jaga Gym</td>
                        <td class="kv-sep">:</td>
                        <td class="kv-val">{{ count($gymSessions) }} Shift</td>
                    </tr>
                    <tr>
                        <td class="kv-key">Status Pencairan</td>
                        <td class="kv-sep">:</td>
                        <td class="kv-val font-bold">
                            @if($payoutStatus === 'PAID')
                                <span style="color: #059669;">LUNAS (TELAH DICAIRKAN)</span>
                            @elseif($payoutStatus === 'PARTIAL')
                                <span style="color: #d97706;">DICAIRKAN SEBAGIAN</span>
                            @else
                                <span style="color: #ea580c;">BELUM DICAIRKAN (DRAFT)</span>
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td class="kv-key">Rekening Bank</td>
                        <td class="kv-sep">:</td>
                        <td class="kv-val">{{ $coach->bank_account ?? 'Transfer Bank / Rekening OTS' }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <div class="section-divider"></div>

    <!-- ─── TABEL PENDAPATAN VS POTONGAN (SESUAI CONTOH GAMBAR) ─── -->
    <div class="salary-box">
        <table class="salary-table">
            <thead>
                <tr>
                    <th style="width: 50%; border-right: 1px solid #cbd5e1;">PENDAPATAN</th>
                    <th style="width: 50%;">POTONGAN & PENCAIRAN</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <!-- Kolom Kiri: Pendapatan -->
                    <td style="vertical-align: top; border-right: 1px solid #cbd5e1; padding: 6px 10px;">
                        <table class="item-table">
                            <tr>
                                <td class="it-label">Honor Sesi Individu Reguler ({{ count($indRegularSessions) }}x)</td>
                                <td class="it-sep">:</td>
                                <td class="it-val">Rp {{ number_format($indRegularSessions->sum('fee'), 0, ',', '.') }}</td>
                            </tr>
                            @if(count($indExtraSessions) > 0)
                                <tr>
                                    <td class="it-label" style="color: #ea580c;">Honor Sesi Individu Tambahan ({{ count($indExtraSessions) }}x)</td>
                                    <td class="it-sep">:</td>
                                    <td class="it-val" style="color: #ea580c;">Rp {{ number_format($indExtraSessions->sum('fee'), 0, ',', '.') }}</td>
                                </tr>
                            @endif
                            <tr>
                                <td class="it-label">Honor Sesi Grup Reguler ({{ count($grpRegularSessions) }}x)</td>
                                <td class="it-sep">:</td>
                                <td class="it-val">Rp {{ number_format($grpRegularSessions->sum('fee'), 0, ',', '.') }}</td>
                            </tr>
                            @if(count($grpExtraSessions) > 0)
                                <tr>
                                    <td class="it-label" style="color: #2563eb;">Honor Sesi Grup Tambahan ({{ count($grpExtraSessions) }}x)</td>
                                    <td class="it-sep">:</td>
                                    <td class="it-val" style="color: #2563eb;">Rp {{ number_format($grpExtraSessions->sum('fee'), 0, ',', '.') }}</td>
                                </tr>
                            @endif
                            @if(count($gymSessions) > 0)
                                <tr>
                                    <td class="it-label">Honor Shift Jaga Gym OTS ({{ count($gymSessions) }}x)</td>
                                    <td class="it-sep">:</td>
                                    <td class="it-val">Rp {{ number_format($gymSessions->sum('fee'), 0, ',', '.') }}</td>
                                </tr>
                            @endif
                        </table>
                    </td>

                    <!-- Kolom Kanan: Potongan / Pencairan -->
                    <td style="vertical-align: top; padding: 6px 10px;">
                        <table class="item-table">
                            <tr>
                                <td class="it-label">Pajak / Potongan Admin</td>
                                <td class="it-sep">:</td>
                                <td class="it-val">Rp 0</td>
                            </tr>
                            <tr>
                                <td class="it-label">Telah Dicairkan / Dibayar</td>
                                <td class="it-sep">:</td>
                                <td class="it-val" style="color: #059669;">Rp {{ number_format($paidFee, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td class="it-label">Belum Dicairkan (Pending)</td>
                                <td class="it-sep">:</td>
                                <td class="it-val" style="color: {{ $unpaidFee > 0 ? '#ea580c' : '#059669' }};">Rp {{ number_format($unpaidFee, 0, ',', '.') }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Summary Row (Total Pendapatan vs Gaji Bersih) -->
                <tr class="summary-row">
                    <td style="border-right: 1px solid #cbd5e1; padding: 6px 10px;">
                        <table class="item-table font-bold">
                            <tr>
                                <td class="it-label" style="font-weight: bold;">Total Pendapatan</td>
                                <td class="it-sep">:</td>
                                <td class="it-val" style="font-weight: bold;">Rp {{ number_format($totalFee, 0, ',', '.') }}</td>
                            </tr>
                        </table>
                    </td>
                    <td style="padding: 6px 10px;">
                        <table class="item-table font-bold">
                            <tr>
                                <td class="it-label" style="font-weight: bold; color: {{ $unpaidFee > 0 ? '#ea580c' : '#059669' }};">
                                    {{ $payoutStatus === 'PAID' ? 'Total Gaji Bersih' : 'Sisa Belum Dicairkan' }}
                                </td>
                                <td class="it-sep">:</td>
                                <td class="it-val" style="font-weight: bold; color: {{ $unpaidFee > 0 ? '#ea580c' : '#059669' }}; font-size: 9.5px;">
                                    Rp {{ number_format($unpaidFee > 0 ? $unpaidFee : $totalFee, 0, ',', '.') }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- ─── REKAPITULASI PER BULAN (Jika Ekspor Semua Periode) ─── -->
    @if((!$filterMonth || $filterMonth === 'all') && isset($monthlyBreakdown) && count($monthlyBreakdown) > 1)
        <div class="section-title">Rekapitulasi Pembayaran Per Bulan</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Periode Bulan</th>
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
                        <td class="font-bold">{{ $mb['month_label'] }}</td>
                        <td class="text-center">
                            {{ $mb['individual_sessions'] }}
                            @if($mb['individual_extra'] > 0)
                                <span style="font-size: 6.5px; color: #ea580c;">(+{{ $mb['individual_extra'] }})</span>
                            @endif
                        </td>
                        <td class="text-center">
                            {{ $mb['group_sessions'] }}
                            @if($mb['group_extra'] > 0)
                                <span style="font-size: 6.5px; color: #2563eb;">(+{{ $mb['group_extra'] }})</span>
                            @endif
                        </td>
                        <td class="text-center">{{ $mb['gym_sessions'] }}</td>
                        <td class="text-center font-bold">{{ $mb['total_sessions'] }}</td>
                        <td class="text-right font-bold">
                            Rp {{ number_format($mb['total_fee'], 0, ',', '.') }}
                            @if($mb['unpaid_fee'] > 0)
                                <span style="display: block; font-size: 6.5px; color: #ea580c;">Belum Cair: Rp {{ number_format($mb['unpaid_fee'], 0, ',', '.') }}</span>
                            @else
                                <span style="display: block; font-size: 6.5px; color: #059669;">Lunas</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <!-- ─── DAFTAR RINCIAN LOG SESI TERLAMPIR ─── -->
    <div class="section-title">Rincian Log Sesi Terlampir</div>
    @if(isset($allSessions) && count($allSessions) > 0)
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 13%;">Tanggal</th>
                    <th style="width: 12%; text-align: center;">Tipe</th>
                    <th style="width: 25%;">Klien / Atlet</th>
                    <th style="width: 26%;">Program / Sesi</th>
                    <th style="width: 13%; text-align: right;">Honor Sesi</th>
                    <th style="width: 11%; text-align: center;">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($allSessions as $s)
                    <tr>
                        <td>{{ $s['date'] ? \Carbon\Carbon::parse($s['date'])->format('d M Y') : '-' }}</td>
                        <td class="text-center">
                            <span class="badge {{ $s['type'] === 'Grup' ? 'badge-blue' : ($s['type'] === 'Jaga Gym' ? 'badge-emerald' : 'badge-orange') }}">
                                {{ $s['type'] }}
                            </span>
                        </td>
                        <td class="font-bold">{{ $s['client_name'] ?? 'Klien' }}</td>
                        <td>
                            @if(!empty($s['session_number']))
                                <strong>#{{ $s['session_number'] }}</strong>
                            @endif
                            {{ $s['name'] }}
                            @if(!empty($s['is_extra']))
                                <span class="badge badge-rose" style="font-size: 6px;">Tambahan</span>
                            @endif
                        </td>
                        <td class="text-right font-bold">
                            Rp {{ number_format($s['fee'], 0, ',', '.') }}
                        </td>
                        <td class="text-center">
                            @if($s['is_paid'])
                                <span class="badge badge-emerald">Lunas</span>
                            @else
                                <span class="badge badge-orange">Belum Cair</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div style="border: 1px dashed #cbd5e1; border-radius: 4px; padding: 6px; text-align: center; color: #94a3b8; margin-bottom: 8px;">
            Belum ada rincian sesi yang terekam pada periode ini.
        </div>
    @endif

    <!-- ─── TANDA TANGAN KANAN BAWAH (SESUAI CONTOH) ─── -->
    <table class="sign-table">
        <tr>
            <td style="width: 50%; text-align: center;">
                <div style="font-size: 8px; color: #64748b; margin-bottom: 2px;">Diterima Oleh Pelatih:</div>
                <div style="height: 38px;"></div>
                <div class="sign-name">{{ $coach->name }}</div>
                <div class="sign-role">Pelatih Fisik / Trainer</div>
            </td>
            <td style="width: 50%; text-align: center;">
                <div style="font-size: 8px; color: #64748b; margin-bottom: 2px;">
                    Surabaya, {{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM Y') }}
                </div>
                <div style="height: 38px;"></div>
                <div class="sign-name">Manajemen / Finance OTS</div>
                <div class="sign-role">Manager Olympus Training Surabaya</div>
            </td>
        </tr>
    </table>

    <!-- ─── FOOTER (SESUAI PERMINTAAN USER) ─── -->
    <div class="doc-footer">
        Dokumen ini diterbitkan secara elektronik oleh Sistem Manajemen Performa Olympus Training Surabaya • Valid tanpa cap basah jika berstatus LUNAS.
    </div>

</body>
</html>
