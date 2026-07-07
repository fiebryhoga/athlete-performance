<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Wellness & ACWR Report - {{ $player->name }}</title>
    <style>
        @page { 
            size: A3 landscape; 
            margin: 15mm 18mm; 
        }
        
        /* PENGATURAN FONT UTAMA - Memaksa semua elemen menggunakan jenis font yang sama */
        body, table, tr, th, td, h1, h2, h3, p, div, span { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important; 
            color: #1c1c1e;
        }
        
        body { 
            font-size: 8.5px; 
            margin: 0; 
            padding: 0; 
            background-color: #ffffff; 
            line-height: 1.3; 
        }
        
        /* TIMELINE HEADER & BRANDING */
        .doc-header { width: 100%; margin-bottom: 20px; border-bottom: 2px solid #000000; padding-bottom: 12px; }
        .doc-header table { width: 100%; border-collapse: collapse; }
        .doc-header td { border: none; vertical-align: middle; padding: 0; }
        .club-logo { height: 55px; max-width: 140px; object-fit: contain; }
        .title { font-size: 22px; font-weight: bold; text-transform: uppercase; margin: 0 0 4px 0; color: #000000; letter-spacing: -0.5px; }
        .subtitle { font-size: 13px; margin: 0; color: #48484a; }
        .subtitle b { color: #000000; font-weight: bold; }
        .brand-name { font-weight: bold; margin: 0 0 2px 0; font-size: 18px; color: #000000; letter-spacing: 1px; }
        .brand-tag { font-size: 11px; color: #8e8e93; font-weight: bold; }

        /* ATHLETE ACCOUNT CARD */
        .profile-wrapper { width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #e5e5ea; background-color: #fafafa; }
        .profile-wrapper td { padding: 14px; vertical-align: top; border: none; }
        .player-photo { height: 90px; width: 90px; border-radius: 6px; object-fit: cover; border: 1px solid #d1d1d6; }
        .no-photo { height: 90px; width: 90px; background-color: #e5e5ea; border: 1px dashed #a1a1aa; border-radius: 6px; }
        .meta-title { font-size: 16px; font-weight: bold; text-transform: uppercase; color: #000000; margin-bottom: 6px; }
        .badge-pos { background-color: #000000; color: #ffffff; font-size: 8px; font-weight: bold; padding: 4px 8px; text-transform: uppercase; border-radius: 3px; }
        .jersey-num { color: #8e8e93; font-size: 13px; font-weight: bold; margin-left: 8px; }

        /* CORE DATA TABLES */
        .table-data { width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 25px; box-sizing: border-box; }
        .table-data th, .table-data td { border: 1px solid #e5e5ea; padding: 7px 4px; vertical-align: middle; }
        .table-data tbody tr:nth-child(even) { background-color: #fcfcfd; }
        
        .group-header th { background-color: #000000; color: #ffffff; font-size: 8.5px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.2px; padding: 7px; border: 1px solid #000000; }
        .group-header th.alt-bg { background-color: #2c2c2e; border: 1px solid #2c2c2e; }
        .sub-header th { background-color: #f2f2f7; color: #000000; font-size: 8px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #aeaea3; padding: 6px 4px; }
        
        /* VALUE STYLING */
        .font-bold { font-weight: bold; }
        .font-black { font-weight: bold; color: #000000; }
        .bg-target { background-color: #f2f2f7; color: #000000; font-weight: bold; }
        .text-left { text-align: left !important; padding-left: 8px !important; }
        
        /* CARD HEADER PER MINGGU */
        .week-title-bar { background-color: #000000; color: #ffffff; padding: 8px 14px; font-weight: bold; text-transform: uppercase; font-size: 11px; margin-top: 20px; border-radius: 4px 4px 0 0; border: 1px solid #000000; }
        .week-title-bar span.period { color: #fcfcfc; float: right; font-size: 9.5px; font-weight: bold; letter-spacing: 0.2px; }
        
        .footer-summary-row { background-color: #000000; color: #ffffff; font-weight: bold; }
        .footer-summary-row td { border: 1px solid #000000; padding: 8px; font-size: 9px; }

        /* Unified Note & Smart Insights Box */
        .note-section { margin-top: 30px; border: 1px solid #000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #000; background-color: #fff; page-break-inside: avoid; }
        .note-title { text-align: center; font-weight: bold; padding: 6px; border-bottom: 1px solid #000; text-transform: uppercase; font-size: 11px; }
        .note-content { padding: 12px 16px; }
        .note-content p { margin: 0 0 8px 0; }
        .note-content p:last-child { margin-bottom: 0; }
        .note-content ul, .note-content ol { margin: 5px 0 10px 0; padding-left: 20px; }
        .note-content li { margin-bottom: 4px; }
    </style>
</head>
<body>

    <div class="doc-header">
        <table>
            <tr>
                <td style="width: 25%;" class="text-left">
                    @if($club && $club->logo_url)
                        <img src="{{ $club->logo_url }}" class="club-logo">
                    @endif
                </td>
                <td style="width: 50%; text-align: center;">
                    <h1 class="title">{{ $title ?? 'Wellness & Workload Load Report' }}</h1>
                    <p class="subtitle">
                        Player: <b>{{ $player->name }}</b> &nbsp;|&nbsp; Position: <b>{{$player->position}}</b> &nbsp;|&nbsp; Jersey Number: <b>{{$player->position_number}}</b>
                    </p>
                </td>
                <td style="width: 25%; text-align: right;">
                    <h2 class="brand-name">ISMS</h2>
                    <div class="brand-tag">Power by: Olympus Training Surabaya X Unesa</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- <table class="profile-wrapper">
        <tr>
            <td style="width: 90px;">
                @if($player->photo_url)
                    <img src="{{ $player->photo_url }}" class="player-photo">
                @else
                    <div class="no-photo"></div>
                @endif
            </td>
            <td>
                <div class="meta-title">{{ $player->name }}</div>
                <div style="margin-top: 4px; margin-bottom: 12px;">
                    <span class="badge-pos">{{ $player->position }}</span>
                    <span class="jersey-num">#{{ str_pad($player->position_number, 2, '0', STR_PAD_LEFT) }}</span>
                </div>
                <div style="font-size: 9.5px; color: #3a3a3c; font-weight: 500;">
                    Laporan komprehensif peninjauan data beban latihan (*Training Load*) harian pemain yang diintegrasikan langsung dengan kuisioner kebugaran (*Wellness Scores*) atlet untuk pemantauan performa berkala.
                </div>
            </td>
        </tr>
    </table> -->

    <h2 style=" font-size: 14px; margin-top: 5px; margin-bottom:0; color: #18181b; border-bottom: 2px solid #18181b; padding-bottom: 5px;">
        1. Rincian Metrik Harian Per Minggu / Weekly Daily Metrics Detail
    </h2>

    @forelse($historyReversed as $week)
        
        <div style="page-break-inside: avoid;">
            <div class="week-title-bar">
                Minggu Ke-{{ $week['week_number'] }}
                <span class="period">{{ $week['formatted_period'] }}</span>
            </div>

            <table class="table-data" style="margin-top: 0;">
                <thead>
                    <tr class="group-header">
                        <th class="alt-bg" style="width: 8%;">Hari</th>
                        <th colspan="6" class="alt-bg">Wellness Metrics (1-5)</th>
                        <th colspan="2" class="alt-bg">AM Session</th>
                        <th colspan="2" class="alt-bg">PM Session</th>
                        <th colspan="2" class="alt-bg">Daily Totals</th>
                    </tr>
                    <tr class="sub-header">
                        <th>Tanggal</th>
                        <th title="Sleep">Sleep</th>
                        <th title="Fatigue">Fatigue</th>
                        <th title="Soreness">Soreness</th>
                        <th title="Stress">Stress</th>
                        <th title="Motivation">Motiv</th>
                        <th title="Mood State">Mood</th>
                        <th>RPE</th>
                        <th>Dur (m)</th>
                        <th>RPE</th>
                        <th>Dur (m)</th>
                        <th class="bg-target">Daily Score</th>
                        <th class="bg-target">Daily Load</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($week['days_data'] as $day)
                        <tr>
                            <td class="text-left">
                                <b style="color: #09090b; font-size: 9px;">{{ $day['dayName'] }}</b><br>
                                <span style="color: #71717a; font-size: 7px;">{{ $day['dateLabel'] }}</span>
                            </td>
                            
                            <td class="font-bold">{{ $day['quality_of_sleep'] }}</td>
                            <td class="font-bold">{{ $day['fatigue'] }}</td>
                            <td class="font-bold">{{ $day['muscle_soreness'] }}</td>
                            <td class="font-bold">{{ $day['stress'] }}</td>
                            <td class="font-bold">{{ $day['motivation'] ?? '-' }}</td>
                            <td class="font-bold">{{ $day['mood_state'] ?? '-' }}</td>
                            
                            <td>{{ $day['am_rpe'] }}</td>
                            <td>{{ $day['am_duration'] }}</td>
                            <td>{{ $day['pm_rpe'] }}</td>
                            <td>{{ $day['pm_duration'] }}</td>
                            
                            <td class="bg-target font-black">{{ $day['daily_wellness_score'] }}</td>
                            <td class="bg-target font-black">{{ $day['daily_load'] }}</td>
                        </tr>
                    @endforeach
                    
                    <tr style="background-color: #18181b; color: #ffffff;">
                        <td colspan="7" style="text-align: right; padding-right: 15px; font-size: 8px; font-weight: bold;">
                        <span style="color: #fcfcfc;">Total Mingguan (Minggu {{ $week['week_number'] }}) :</span>
    
                        
                        </td>
                        <td colspan="4" style="text-align: right; padding-right: 10px; font-size: 8px; font-weight: bold; ">
                            <span style="color: #fcfcfc;">Weekly Wellness Score:</span>
                        </td>
                        <td class="font-black" style="background-color: #ffffff; z-index: 10; color: #18181b; font-size: 11px; ">
                            {{ $week['weekly_wellness_score'] }}
                        </td>
                        <td class="font-black" style="background-color: #ffffff; z-index: 10; color: #18181b; font-size: 11px; ">
                            {{ $week['weekly_load'] }} <span style="font-size: 7px; color:#71717a;">AU</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    @empty
        <div style="padding: 20px; text-align: center; color: #71717a; border: 1px dashed #d4d4d8; margin-top: 15px;">
            Belum ada riwayat data latihan harian untuk pemain ini.
        </div>
    @endforelse

    <div style="page-break-before: always;"></div>

    <h2 style=" font-size: 14px; margin-top: 20px; color: #18181b; border-bottom: 2px solid #18181b; padding-bottom: 5px;">
        2. Rangkuman Metrik & Monitoring Indeks / Metrics Summary & Monitoring Index (ACWR)
    </h2>

    <table class="table-data" style="margin-top: 15px;">
        <thead>
            <tr class="group-header">
                <th colspan="2">PERIOD IDENTITY</th>
                <th colspan="2" class="alt-bg">LOAD & WELLNESS METRICS</th>
                <th colspan="5">MONITORING INDICES</th>
            </tr>
            <tr class="sub-header">
                <th style="width: 12%;">Week Number</th>
                <th style="width: 25%;">Date Range</th>
                <th style="width: 12%;">Weekly Wellness Score</th>
                <th style="width: 12%;" class="bg-target">Weekly Load (AU)</th>
                <th style="width: 10%;">ACWR Ratio</th>
                <th style="width: 10%;">Mean Daily Load</th>
                <th style="width: 10%;">Std Deviation</th>
                <th style="width: 10%;" class="bg-target">Training Monotony</th>
                <th style="width: 9%;" class="bg-target">Strain</th>
            </tr>
        </thead>
        <tbody>
            @forelse($historyReversed as $history)
                <tr>
                    <td class="font-black text-left" style="padding-left: 10px;">Minggu Ke-{{ $history['week_number'] }}</td>
                    <td class="font-bold text-left">{{ $history['formatted_period'] }}</td>
                    <td class="font-bold">{{ $history['weekly_wellness_score'] }}</td>
                    <td class="bg-target font-black" style="font-size: 11px;">{{ $history['weekly_load'] }}</td>
                    
                    <td class="font-black" style="color: {{ $history['acwr'] > 1.5 ? '#dc2626' : ($history['acwr'] < 0.8 ? '#d97706' : '#059669') }}; font-size: 11px;">
                        {{ number_format($history['acwr'], 2) }}
                    </td>
                    
                    <td class="font-bold">{{ $history['mean_daily_load'] }}</td>
                    <td>{{ $history['standard_deviation'] }}</td>
                    <td class="bg-target">{{ $history['training_monotony'] }}</td>
                    <td class="bg-target font-black">{{ $history['strain'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" style="padding: 20px; font-style: italic; color: #71717a;">Belum ada riwayat data untuk dirangkum.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div style="page-break-before: always;"></div>

    {{-- SMART INSIGHTS SECTION --}}
    @if(isset($includeInsights) && $includeInsights && !empty($insights))
        <div class="note-section" style="margin-top: 0;">
            <div class="note-title">
                SMART INSIGHTS & RECOMMENDATIONS<br/>
                <span style="font-size: 9px; font-weight: normal; text-transform: none;">(Wawasan & Rekomendasi Cerdas)</span>
            </div>
            <div class="note-content">
                <ul>
                    @foreach($insights as $insight)
                        <li>{!! $insight !!}</li>
                    @endforeach
                </ul>
            </div>
        </div>
    @endif

    {{-- NOTES --}}
    @if(!empty($note) && $note !== '<p><br></p>')
        <div class="note-section" style="{{ (!isset($includeInsights) || !$includeInsights || empty($insights)) ? 'margin-top: 0;' : '' }}">
            <div class="note-title">
                NOTES<br/>
                <span style="font-size: 9px; font-weight: normal; text-transform: none;">(Catatan)</span>
            </div>
            <div class="note-content">
                {!! $note !!}
            </div>
        </div>
    @endif

    <div style="text-align: center; font-size: 9px; color: #a1a1aa; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
        Generated on {{ \Carbon\Carbon::now()->translatedFormat('d F Y H:i') }} | Power by: Olympus Training Surabaya X Unesa
    </div>

</body>
</html>