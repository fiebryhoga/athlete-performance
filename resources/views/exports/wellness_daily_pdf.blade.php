<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Wellness & RPE Daily Report - {{ \Carbon\Carbon::parse($date)->format('Y-m-d') }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 12mm 15mm;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 9px;
            color: #27272a; 
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        
        .doc-header {
            width: 100%;
            margin-bottom: 15px;
            border-bottom: 3px solid #18181b; 
            padding-bottom: 10px;
        }
        .doc-header table { width: 100%; border-collapse: collapse; }
        .doc-header td { border: none; vertical-align: middle; padding: 0; }
        
        .club-logo { height: 50px; object-fit: contain; margin-bottom: 2px; }
        .title {
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0 0 4px 0;
            letter-spacing: 1px;
            color: #09090b;
        }
        .subtitle {
            font-size: 10px;
            margin: 0;
            color: #52525b; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .subtitle b { color: #09090b; }

        .brand-name {
            font-weight: bold;
            margin: 0 0 2px 0;
            font-size: 14px;
            color: #09090b;
            letter-spacing: 1px;
        }
        .brand-tag {
            font-size: 8px;
            color: #71717a; 
            font-weight: bold;
            letter-spacing: 0.5px;
        }

        .table-data {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
        }
        
        .table-data th, .table-data td {
            border: 1px solid #d4d4d8; 
            padding: 6px 3px;
        }

        .group-header th {
            background-color: #18181b; 
            color: #ffffff;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border: 1px solid #18181b;
            padding: 8px 4px;
        }
        .group-header th.alt-bg {
            background-color: #3f3f46; 
            border: 1px solid #3f3f46;
        }
        .group-header th.danger-bg {
            background-color: #ef4444; 
            border: 1px solid #ef4444;
        }

        .sub-header th {
            background-color: #f4f4f5; 
            color: #18181b; 
            font-size: 8px;
            font-weight: bold;
            text-transform: capitalize;
            border-bottom: 2px solid #a1a1aa; 
        }

        .table-data tbody tr:nth-child(even) { background-color: #fafafa; }
        .table-data tbody tr:nth-child(odd) { background-color: #ffffff; }
        
        .text-left { text-align: left !important; padding-left: 6px !important; }
        .text-right { text-align: right !important; padding-right: 6px !important; }
        .font-bold { font-weight: bold; }
        .font-black { font-weight: 900; color: #09090b; }
        
        .col-id { width: 3%; }
        .col-pos { width: 5%; }
        .col-name { width: 15%; }
        
        .note-container {
            margin-top: 20px;
            padding: 10px;
            background-color: #f4f4f5;
            border-left: 4px solid #18181b;
            font-size: 10px;
        }
        .note-title { font-weight: bold; margin-bottom: 4px; color: #18181b; }
    </style>
</head>
<body>

    @php
        $clubName = strtoupper($club->name ?? 'CLUB NAME');
        $title = $reportTitle ? strtoupper($reportTitle) : "DAILY WELLNESS & RPE REPORT $clubName";
        
        $wellnessCols = $options['wellness'] ? 5 : 0;
        $rpeCols = $options['rpe'] ? 5 : 0;
        $painCols = $options['pain'] ? 1 : 0;
    @endphp

    <div class="doc-header">
        <table>
            <tr>
                <td style="width: 20%;" class="text-left">
                    @if($club && $club->logo)
                        <img src="{{ public_path('storage/' . $club->logo) }}" alt="Logo" class="club-logo">
                    @endif
                </td>
                <td style="width: 60%; text-align: center;">
                    <h1 class="title">{{ $title }}</h1>
                    <p class="subtitle">
                        TANGGAL: <b>{{ \Carbon\Carbon::parse($date)->translatedFormat('l, d F Y') }}</b>
                    </p>
                </td>
                <td style="width: 20%; text-align: right;" class="branding-info">
                    <h2 class="brand-name">ISMS</h2>
                    <div class="brand-tag">Power by: Olympus Training Surabaya X Unesa</div>
                </td>
            </tr>
        </table>
    </div>

    <table class="table-data">
        <thead>
            <tr class="group-header">
                <th colspan="3">PLAYER IDENTITY</th>
                @if($options['wellness'])
                    <th colspan="5" class="alt-bg">WELLNESS METRICS</th>
                @endif
                @if($options['rpe'])
                    <th colspan="5">RPE & LOAD</th>
                @endif
                @if($options['pain'])
                    <th colspan="1" class="danger-bg">PAIN AREAS</th>
                @endif
            </tr>
            <tr class="sub-header">
                <th class="col-id">No</th>
                <th class="col-pos">Pos</th>
                <th class="col-name text-left">Player Name</th>
                
                @if($options['wellness'])
                    <th>Sleep</th>
                    <th>Fatigue</th>
                    <th>Soreness</th>
                    <th>Stress</th>
                    <th style="background-color:#e4e4e7">Score</th>
                @endif
                
                @if($options['rpe'])
                    <th>AM RPE</th>
                    <th>AM Dur</th>
                    <th>PM RPE</th>
                    <th>PM Dur</th>
                    <th style="background-color:#e4e4e7">Load</th>
                @endif

                @if($options['pain'])
                    <th>Complaints</th>
                @endif
            </tr>
        </thead>
        <tbody>
            @foreach($mappedPlayers as $index => $row)
                @php 
                    $p = $row->player;
                    $log = $row->log;
                @endphp
                <tr>
                    <td class="font-bold">{{ $index + 1 }}</td>
                    <td class="font-bold">{{ $p->position }}</td>
                    <td class="text-left font-bold">{{ $p->name }}</td>
                    
                    @if($options['wellness'])
                        <td>{{ $log ? $log->quality_of_sleep : '-' }}</td>
                        <td>{{ $log ? $log->fatigue : '-' }}</td>
                        <td>{{ $log ? $log->muscle_soreness : '-' }}</td>
                        <td>{{ $log ? $log->stress : '-' }}</td>
                        <td class="font-bold" style="background-color:#f4f4f5">{{ $log ? $log->daily_wellness_score : '-' }}</td>
                    @endif
                    
                    @if($options['rpe'])
                        <td>{{ $log ? $log->am_rpe : '-' }}</td>
                        <td>{{ $log ? $log->am_duration : '-' }}</td>
                        <td>{{ $log ? $log->pm_rpe : '-' }}</td>
                        <td>{{ $log ? $log->pm_duration : '-' }}</td>
                        <td class="font-bold" style="background-color:#f4f4f5">{{ $log ? $log->daily_load : '-' }}</td>
                    @endif

                    @if($options['pain'])
                        <td class="text-left" style="font-size: 8px;">
                            {{ $log && $log->muscle_pain_areas && count($log->muscle_pain_areas) > 0 ? implode(', ', $log->muscle_pain_areas) : '-' }}
                        </td>
                    @endif
                </tr>
            @endforeach
        </tbody>
    </table>

    @if(!empty($note))
        <div class="note-container">
            <div class="note-title">Coach Notes:</div>
            <div>{!! nl2br(e($note)) !!}</div>
        </div>
    @endif

</body>
</html>
