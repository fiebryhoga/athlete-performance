{{-- resources/views/exports/wellness_daily_excel.blade.php --}}
@php
    $clubName = strtoupper($club->name ?? 'CLUB NAME');
    $title = $reportTitle ? strtoupper($reportTitle) : "DAILY WELLNESS & RPE REPORT $clubName";
    
    $totalCols = 3;
    if ($options['wellness']) $totalCols += 7;
    if ($options['rpe']) $totalCols += 5;
    if ($options['pain']) $totalCols += 1;
@endphp

<table>
    <thead>
        <tr>
            <th colspan="2"></th>
            <th colspan="{{ max(1, $totalCols - 3) }}" style="font-weight: bold; font-size: 20px; text-align: center; vertical-align: middle;">
                {{ $title }}
            </th>
            <th colspan="1" style="font-weight: bold; font-size: 14px; text-align: right; vertical-align: middle;">
                ISMS
            </th>
        </tr>
        <tr>
            <th colspan="2"></th>
            <th colspan="{{ max(1, $totalCols - 3) }}" style="text-align: center; font-size: 12px; color: #4b5563; vertical-align: middle;">
                Date: {{ \Carbon\Carbon::parse($date)->translatedFormat('l, d M Y') }}
            </th>
            <th colspan="1" style="text-align: right; font-style: italic; font-size: 10px; color: #4b5563; vertical-align: middle;">
                Power by: Olympus Training Surabaya X Unesa
            </th>
        </tr>

        <tr><th colspan="{{ $totalCols }}"></th></tr>
        <tr><th colspan="{{ $totalCols }}"></th></tr>
        <tr><th colspan="{{ $totalCols }}"></th></tr>

        <tr>
            <th colspan="3" style="border: 1px solid #000000; font-weight: bold; text-align: center; background-color: #1f2937; color: #ffffff;">PLAYER IDENTITY</th>
            @if($options['wellness'])
                <th colspan="7" style="border: 1px solid #000000; font-weight: bold; text-align: center; background-color: #374151; color: #ffffff;">WELLNESS METRICS</th>
            @endif
            @if($options['rpe'])
                <th colspan="5" style="border: 1px solid #000000; font-weight: bold; text-align: center; background-color: #1f2937; color: #ffffff;">RPE & LOAD</th>
            @endif
            @if($options['pain'])
                <th colspan="1" style="border: 1px solid #000000; font-weight: bold; text-align: center; background-color: #ef4444; color: #ffffff;">PAIN AREAS</th>
            @endif
        </tr>

        <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">No</th>
            <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">Pos</th>
            <th style="border: 1px solid #000000; font-weight: bold; text-align: left;">Player Name</th>
            
            @if($options['wellness'])
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">Sleep Quality</th>
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">Fatigue</th>
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">Soreness</th>
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">Stress</th>
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">Motivation</th>
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">Mood</th>
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center; background-color: #e5e7eb;">Total Score</th>
            @endif
            
            @if($options['rpe'])
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">AM RPE</th>
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">AM Dur</th>
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">PM RPE</th>
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">PM Dur</th>
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center; background-color: #e5e7eb;">Daily Load</th>
            @endif

            @if($options['pain'])
                <th style="border: 1px solid #000000; font-weight: bold; text-align: center;">Complaints</th>
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
                <td style="border: 1px solid #000000; text-align: center;">{{ $index + 1 }}</td>
                <td style="border: 1px solid #000000; text-align: center; font-weight: bold;">{{ $p->position }}</td>
                <td style="border: 1px solid #000000; text-align: left; font-weight: bold;">{{ $p->name }}</td>
                
                @if($options['wellness'])
                    <td style="border: 1px solid #000000; text-align: center;">{{ $log ? $log->quality_of_sleep : '-' }}</td>
                    <td style="border: 1px solid #000000; text-align: center;">{{ $log ? $log->fatigue : '-' }}</td>
                    <td style="border: 1px solid #000000; text-align: center;">{{ $log ? $log->muscle_soreness : '-' }}</td>
                    <td style="border: 1px solid #000000; text-align: center;">{{ $log ? $log->stress : '-' }}</td>
                    <td style="border: 1px solid #000000; text-align: center;">{{ $log ? $log->motivation : '-' }}</td>
                    <td style="border: 1px solid #000000; text-align: center;">{{ $log ? $log->mood_state : '-' }}</td>
                    <td style="border: 1px solid #000000; text-align: center; font-weight: bold; background-color: #f9fafb;">{{ $log ? $log->daily_wellness_score : '-' }}</td>
                @endif
                
                @if($options['rpe'])
                    <td style="border: 1px solid #000000; text-align: center;">{{ $log ? $log->am_rpe : '-' }}</td>
                    <td style="border: 1px solid #000000; text-align: center;">{{ $log ? $log->am_duration : '-' }}</td>
                    <td style="border: 1px solid #000000; text-align: center;">{{ $log ? $log->pm_rpe : '-' }}</td>
                    <td style="border: 1px solid #000000; text-align: center;">{{ $log ? $log->pm_duration : '-' }}</td>
                    <td style="border: 1px solid #000000; text-align: center; font-weight: bold; background-color: #f9fafb;">{{ $log ? $log->daily_load : '-' }}</td>
                @endif

                @if($options['pain'])
                    <td style="border: 1px solid #000000; text-align: left;">
                        {{ $log && $log->muscle_pain_areas && count($log->muscle_pain_areas) > 0 ? implode(', ', $log->muscle_pain_areas) : '-' }}
                    </td>
                @endif
            </tr>
        @endforeach
    </tbody>
</table>
