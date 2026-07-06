<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ $training->title ?? 'Sesi Latihan' }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 12mm 15mm;
        }

        body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            font-size: 12px; 
            color: #000000; 
            margin: 0; 
            padding: 0;
            line-height: 1.3;
        }

        .header-table { 
            width: 100%; 
            margin-bottom: 20px; 
            border-collapse: collapse;
        }
        .header-table td { vertical-align: middle; border: none !important; }
        .logo { max-width: 90px; max-height: 90px; object-fit: contain; }
        .title { font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; }
        .subtitle { font-size: 14px; font-weight: bold; }

        .instruction-box { border: 1px solid #000000; padding: 10px 12px; margin-bottom: 12px; background-color: #ffffff; }
        .instruction-title { font-weight: bold; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; }
        .instruction-text { margin: 0; white-space: pre-wrap; font-size: 12px; text-align: left; }

        .main-table { 
            width: 100%; 
            border-collapse: collapse;
            margin-bottom: 0px; 
            table-layout: fixed;
            border: 1px solid #000;
        }
        .main-table th, .main-table td {
            border: 1px solid #000000; 
            padding: 8px; 
        }
        
        .phase-header-cell {
            background-color: #ffffff;
            text-align: left;
            padding: 10px 12px !important;
        }
        
        .phase-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        
        .phase-desc {
            font-size: 11px;
            font-weight: normal;
        }

        .sub-header { background-color: #f4f4f5; }
        .sub-header th { 
            font-weight: bold; 
            font-size: 10px;
            text-transform: uppercase;
            padding: 6px 8px;
            text-align: left;
        }
        
        .exercise-name { font-weight: bold; font-size: 13px; color: #18181b; display: block; margin-bottom: 4px; }
        .exercise-desc { font-size: 11px; color: #52525b; margin-top: 4px; margin-bottom: 8px; white-space: pre-wrap; text-align: justify; }

        .inner-layout-table { width: 100%; border-collapse: collapse; border: none; }
        .inner-layout-table td { border: none !important; padding: 0 !important; vertical-align: top; text-align: left; }

        .img-preview { 
            height: 90px;
            width: auto;
            max-width: 120px;
            object-fit: contain; 
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 2px;
            background-color: #f9fafb;
            margin-left: 8px;
        }

        .video-link {
            display: inline-block;
            margin-top: 4px;
            font-size: 11px;
            color: #2563eb;
            text-decoration: none;
            font-weight: bold;
        }

        /* Set Details Table */
        .sets-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            text-align: center;
        }
        .sets-table th {
            background-color: #f4f4f5;
            color: #71717a;
            font-size: 9px;
            text-transform: uppercase;
            padding: 4px;
            border: 1px solid #e4e4e7;
        }
        .sets-table td {
            font-size: 11px;
            padding: 5px;
            border: 1px solid #e4e4e7;
        }
        .set-number {
            font-weight: bold;
            color: #71717a;
            width: 40px;
            background-color: #fafafa;
        }

        .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #555555; }
        .page-break { page-break-inside: avoid; }
        .page-break-after { page-break-after: always; }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td width="75%" style="text-align: left;">
                <h1 class="title">{{ $training->title ?? 'Sesi Latihan' }}</h1>
                <div class="subtitle">
                    {{ \Carbon\Carbon::parse($training->date)->format('j F Y') }}
                    @if(isset($training->focus) && $training->focus) | {{ $training->focus }} @endif
                    @if(isset($group)) <br><span style="color: #2563eb; font-size: 12px; font-weight: normal;">Group: {{ $group->name }}</span> @endif
                    @if(isset($athlete)) <br><span style="color: #2563eb; font-size: 12px; font-weight: normal;">Athlete: {{ $athlete->name }}</span> @endif
                </div>
            </td>
            <td width="25%" style="text-align: right;">
                @if(isset($clubLogo) && !empty($clubLogo))
                    <img src="{{ $clubLogo }}" class="logo" />
                @endif
            </td>
        </tr>
    </table>

    {{-- ========== INSTRUCTION BLOCKS ========== --}}
    @if(isset($training->blocks))
        @foreach($training->blocks as $block)
            @if(isset($block['step']) && $block['step'] == 1)
                <div class="instruction-box">
                    <div class="instruction-title">
                        {{ $block['title'] ?: str_replace('_', ' ', $block['category']) }}:
                    </div>
                    <div class="instruction-text">{{ $block['items'][0]['note'] ?? '' }}</div>
                </div>
            @endif
        @endforeach
    @endif

    {{-- ========== EXERCISE BLOCKS ========== --}}
    @if(isset($training->blocks))
        @php
            $exerciseBlocks = collect($training->blocks)->filter(fn($b) => isset($b['step']) && $b['step'] == 2)->values();
        @endphp

        @foreach($exerciseBlocks as $blockIndex => $block)
            @php
                $visualMode = $block['visuals_mode'] ?? 'all';
                $isNoteOnly = in_array($block['category'] ?? '', ['stretching']);
                $items = collect($block['items'] ?? []);
            @endphp

            <table class="main-table">
                <thead>
                    <tr style="border: none; padding: 0; line-height: 0; height: 0; font-size: 0;">
                        <th style="width: 93%; border: none; padding: 0; line-height: 0; height: 0; font-size: 0;"></th>
                        <th style="width: 7%; border: none; padding: 0; line-height: 0; height: 0; font-size: 0;"></th>
                    </tr>
                    <tr>
                        <th colspan="2" class="phase-header-cell">
                            <div class="phase-title">PHASE: {{ $block['title'] ?: str_replace('_', ' ', $block['category']) }}</div>
                            @if(isset($block['description']) && $block['description'])
                                <div class="phase-desc">{{ $block['description'] }}</div>
                            @endif
                        </th>
                    </tr>
                    @if(!$isNoteOnly)
                    <tr class="sub-header">
                        <th>EXERCISE</th>
                        <th style="text-align: center;">SETS</th>
                    </tr>
                    @endif
                </thead>
                <tbody>
                    @if($isNoteOnly)
                        <tr>
                            <td colspan="2" style="padding: 12px; white-space: pre-wrap; font-size: 11px;">{{ $block['items'][0]['note'] ?? 'Tidak ada catatan.' }}</td>
                        </tr>
                    @else
                        @foreach($items as $itemIndex => $item)
                            @php
                                $hasLoad = !empty($item['load']);
                                $hasReps = !empty($item['reps']);
                                $hasTempo = !empty($item['tempo']);
                                $hasRir = !empty($item['rir']);
                                $hasRest = !empty($item['rest_per_set']);
                                $showSetsTable = $hasLoad || $hasReps || $hasTempo || $hasRir || $hasRest;
                                $setsCount = (int)($item['sets'] ?? 1);
                                if($setsCount < 1) $setsCount = 1;
                            @endphp
                            <tr class="page-break">
                                <td style="width: 93%; padding: 8px; vertical-align: top;">
                                    <table class="inner-layout-table">
                                        <tr>
                                            <td style="width: 75%; padding-right: 8px !important;">
                                                <span class="exercise-name">{{ isset($item['exercise']) ? $item['exercise']['name'] : 'Custom Exercise' }}</span>
                                                
                                                @if(isset($item['exercise']) && !empty($item['exercise']['description']))
                                                    <div class="exercise-desc">{{ $item['exercise']['description'] }}</div>
                                                @endif

                                                @if(($visualMode === 'all' || $visualMode === 'video') && isset($item['exercise']) && !empty($item['exercise']['videos']))
                                                    @foreach($item['exercise']['videos'] as $vid)
                                                        @if($vid)
                                                            <div>
                                                                <a href="{{ $vid }}" class="video-link" target="_blank" rel="noopener noreferrer">> Watch Video</a>
                                                            </div>
                                                            @break
                                                        @endif
                                                    @endforeach
                                                @endif

                                                @if(!empty($item['note']))
                                                    <div style="font-size: 11px; color: #52525b; margin-top: 6px;"><strong>Note:</strong> {{ $item['note'] }}</div>
                                                @endif
                                            </td>
                                            
                                            @if($visualMode === 'all' || $visualMode === 'image')
                                                @if(isset($item['exercise']) && !empty($item['exercise']['base64_images']) && is_array($item['exercise']['base64_images']))
                                                    <td style="width: 25%; text-align: right; vertical-align: middle;">
                                                        @php $imgCount = 0; @endphp
                                                        @foreach($item['exercise']['base64_images'] as $base64Img)
                                                            @if($imgCount < 1) {{-- Showing only 1 image for compactness in this layout as per reference --}}
                                                                <img src="{{ $base64Img }}" class="img-preview" />
                                                            @endif
                                                            @php $imgCount++; @endphp
                                                        @endforeach
                                                    </td>
                                                @endif
                                            @endif
                                        </tr>
                                    </table>

                                    @if($showSetsTable)
                                        <table class="sets-table">
                                            <thead>
                                                <tr>
                                                    <th class="set-number"></th>
                                                    @if($hasLoad) <th>LOAD ({{ $item['load_unit'] ?? 'KG' }})</th> @endif
                                                    @if($hasReps) <th>REPS</th> @endif
                                                    @if($hasTempo) <th>TEMPO</th> @endif
                                                    @if($hasRir) <th>RIR</th> @endif
                                                    @if($hasRest) <th>REST</th> @endif
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @for($s = 1; $s <= $setsCount; $s++)
                                                    <tr>
                                                        <td class="set-number">S{{ $s }}</td>
                                                        @if($hasLoad) <td>{{ $item['load'] ?? '-' }}</td> @endif
                                                        @if($hasReps) <td>{{ $item['reps'] ?? '-' }}</td> @endif
                                                        @if($hasTempo) <td>{{ $item['tempo'] ?? '-' }}</td> @endif
                                                        @if($hasRir) <td>{{ $item['rir'] ?? '-' }}</td> @endif
                                                        @if($hasRest) <td>{{ !empty($item['rest_per_set']) ? $item['rest_per_set'] : '-' }}</td> @endif
                                                    </tr>
                                                @endfor
                                            </tbody>
                                        </table>
                                    @endif
                                </td>
                                <td style="width: 7%; vertical-align: middle; text-align: center; font-weight: bold; font-size: 14px;">
                                    {{ $item['sets'] ?? '1' }}
                                </td>
                            </tr>
                        @endforeach
                    @endif
                </tbody>
            </table>
            
            @if($blockIndex < $exerciseBlocks->count() - 1)
                <div class="page-break-after"></div>
            @else
                <br>
            @endif
        @endforeach
    @endif

    {{-- ========== ATHLETE ACTUALS/FEEDBACK (IF ANY) ========== --}}
    @if(isset($athletesData) && count($athletesData) > 0)
        <div class="page-break-after"></div>
        <h2 style="font-size: 18px; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 5px;">LAPORAN ATLET</h2>
        
        <table class="main-table" style="margin-bottom: 20px;">
            <thead>
                <tr class="sub-header">
                    <th style="width: 5%;">No</th>
                    <th style="width: 30%; text-align: left;">Nama Atlet</th>
                    <th style="width: 15%;">Status</th>
                    <th style="width: 50%; text-align: left;">Feedback / RPE</th>
                </tr>
            </thead>
            <tbody>
                @foreach($athletesData as $index => $atData)
                    <tr>
                        <td style="font-weight: bold; text-align: center;">{{ $index + 1 }}</td>
                        <td style="text-align: left; font-weight: bold;">{{ $atData['name'] }}</td>
                        <td style="text-align: center;">
                            @if($atData['is_completed'])
                                <span style="color: #16a34a; font-weight: bold;">SELESAI</span>
                            @else
                                <span style="color: #dc2626; font-weight: bold;">BELUM SELESAI</span>
                            @endif
                        </td>
                        <td style="text-align: left; font-size: 11px;">
                            @if(!empty($atData['note']))
                                <div style="margin-bottom: 5px;"><strong>Catatan:</strong> <i>"{{ $atData['note'] }}"</i></div>
                            @endif
                            @if(!empty($atData['rpes']))
                                <div>
                                    @foreach($atData['rpes'] as $rpe)
                                        <span style="display: inline-block; border: 1px solid #cbd5e1; border-radius: 4px; background-color: #ffffff; padding: 2px 6px; margin-right: 3px; font-size: 10px;">{{ $rpe['label'] }}: {{ $rpe['value'] }}</span>
                                    @endforeach
                                </div>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="footer">
     Power by: Athlete Performance Management
    </div>

</body>
</html>
