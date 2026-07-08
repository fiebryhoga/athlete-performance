<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ $training->title }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 12mm 15mm;
        }

        body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            font-size: 14px; 
            color: #000000; 
            margin: 0; 
            padding: 0;
            line-height: 1.3;
        }

        .header-table { 
            width: 100%; 
            margin-bottom: 15px; 
            border-collapse: collapse;
        }
        .header-table td { vertical-align: middle; border: none !important; }
        .logo { max-width: 80px; max-height: 80px; object-fit: contain; }
        .title { font-size: 24px; font-weight: bold; text-transform: uppercase; margin: 0 0 5px 0; }
        .subtitle { font-size: 16px; font-weight: bold; }

        .instruction-box { 
            border: 1px solid #000000; 
            padding: 8px 12px; 
            margin-bottom: 12px; 
            background-color: #ffffff;
        }
        .instruction-title { font-weight: bold; font-size: 15px; margin-bottom: 3px; text-transform: uppercase; }
        .instruction-text { margin: 0; white-space: pre-wrap; font-size: 14px; text-align: left; }

        /* Main Table */
        .main-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 6px; 
            table-layout: fixed;
        }
        .main-table th, .main-table td {
            border: 1px solid #000000; 
            padding: 5px 4px;
            font-size: 13px;
            text-align: center;
        }
        
        .main-header th, .sub-header th { 
            background-color: #e5e7eb; 
            font-weight: bold; 
            text-transform: uppercase;
            vertical-align: middle;
            padding-top: 4px;
            padding-bottom: 4px;
            font-size: 11px;
        }
        
        /* Phase Cell */
        .phase-cell { 
            font-weight: bold; 
            background-color: #ffffff; 
            text-transform: uppercase; 
            vertical-align: top !important; 
            padding-top: 10px !important;
            font-size: 13px;
        }
        .phase-cell.first-row {
            border-top: 1px solid #000000 !important;
            border-bottom: none !important;
        }
        .phase-cell.middle-row {
            border-top: none !important;
            border-bottom: none !important;
            color: transparent;
        }
        .phase-cell.last-row {
            border-top: none !important;
            border-bottom: 1px solid #000000 !important;
            color: transparent;
        }
        .phase-cell.first-and-last-row {
            border-top: 1px solid #000000 !important;
            border-bottom: 1px solid #000000 !important;
        }

        .exercise-name { font-weight: bold; display: block; font-size: 14px; margin-bottom: 2px; }
        
        /* Inner Layout Table */
        .inner-layout-table {
            width: 100%;
            border-collapse: collapse;
            border: none;
        }
        .inner-layout-table td {
            border: none !important;
            padding: 0 !important;
            vertical-align: middle;
            text-align: left;
        }
        
        /* Images */
        .img-preview { 
            height: 60px;
            width: auto;
            max-width: 80px;
            object-fit: contain; 
            vertical-align: middle;
            border: 1px solid #e5e7eb;
            border-radius: 3px;
            padding: 1px;
            background-color: #f9fafb;
        }
        .img-grid {
            border-collapse: collapse;
            border: none;
        }
        .img-grid td {
            border: none !important;
            padding: 2px !important;
            vertical-align: middle;
            text-align: center;
        }
        .video-link {
            display: inline-block;
            margin-top: 4px;
            font-size: 12px;
            color: #2563eb;
            text-decoration: none;
            font-weight: bold;
        }
        .exercise-desc {
            font-size: 12px; 
            color: #52525b; 
            margin-top: 4px; 
            margin-bottom: 4px; 
            white-space: pre-wrap;
            text-align: justify;
        }

        /* Set Row */
        .set-row-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }
        .set-row-table td {
            border: 1px solid #d4d4d8;
            padding: 3px 4px;
            font-size: 11px;
            text-align: center;
        }
        .set-row-table th {
            border: 1px solid #d4d4d8;
            padding: 3px 4px;
            font-size: 10px;
            text-align: center;
            background-color: #f4f4f5;
            font-weight: bold;
            text-transform: uppercase;
            color: #71717a;
        }
        .set-label {
            font-weight: bold;
            font-size: 10px;
            color: #71717a;
            text-transform: uppercase;
            background-color: #fafafa;
        }
        .athlete-tag {
            font-size: 9px;
            color: #a1a1aa;
            font-style: italic;
        }

        /* Actuals Section */
        .actuals-section {
            background-color: #f8fafc;
        }
        .actuals-title {
            font-size: 11px;
            font-weight: bold;
            color: #3f3f46;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .rpe-badge {
            display: inline-block;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            background-color: #ffffff;
            padding: 2px 6px;
            margin-right: 3px;
            font-size: 10px;
        }

        .footer { margin-top: 20px; text-align: center; font-size: 13px; color: #555555; }
        .page-break { page-break-inside: avoid; }
        
        .note-box {
            font-size: 12px;
            color: #52525b;
            margin-top: 4px;
            border-left: 3px solid #d4d4d8;
            padding-left: 8px;
            font-style: italic;
        }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td width="75%" style="text-align: left;">
                <h1 class="title">{{ $training->title }}</h1>
                <div class="subtitle">
                    {{ \Carbon\Carbon::parse($training->date)->format('j F Y') }} | {{ $training->focus }}
                    <br><span style="color: inherit; font-size: 12px; font-weight: normal;">Coach: {{ $training->coachList }}</span>
                </div>
            </td>
            <td width="25%" style="text-align: right;">
                @if(!empty($clubLogo))
                    <img src="{{ $clubLogo }}" class="logo" />
                @endif
            </td>
        </tr>
    </table>

    {{-- ========== STEP 1: INSTRUCTION BLOCKS ========== --}}
    @foreach($training->blocks as $block)
        @if($block->step == 1)
            <div class="instruction-box">
                <div class="instruction-title">
                    {{ $block->title ?: str_replace('_', ' ', $block->category) }}:
                </div>
                <div class="instruction-text">{{ $block->items[0]->note ?? '' }}</div>
            </div>
        @endif
    @endforeach

    {{-- ========== STEP 2: EXERCISE BLOCKS ========== --}}
    @foreach($training->blocks as $block)
        @if($block->step == 2)
            @php
                // Category -> column type mapping (same as Show.jsx)
                $categoryMap = [
                    'warm_up' => 'medium',
                    'mobility' => 'medium',
                    'activation' => 'medium',
                    'strength_training' => 'full',
                    'stretching' => 'note_only',
                    'interval' => 'cardio',
                    'free_strength' => 'note_only',
                    'cardio' => 'cardio',
                ];
                $columns = $categoryMap[$block->category] ?? 'basic';
                $visualMode = $block->visuals_mode ?? 'all';
                $targetFilledBy = $block->target_filled_by ?? 'admin';
                $totalItems = count($block->items);
                $isNoteOnly = $columns === 'note_only';
            @endphp

            @if($isNoteOnly)
                {{-- NOTE ONLY BLOCK (e.g. Stretching) --}}
                <table class="main-table" style="margin-bottom: 0; page-break-inside: avoid;">
                    <tbody>
                        <tr class="phase-header-row page-break" style="background-color: #f8fafc;">
                            <th style="text-align: left; padding: 10px 8px; border-bottom: 2px solid #000;">
                                <div style="font-size: 13px; color: black; text-transform: uppercase;">
                                    PHASE: {{ $block->title ?: str_replace('_', ' ', $block->category) }}
                                </div>
                                @if($block->description)
                                    <div style="font-weight: normal; font-size: 11px; margin-top: 4px; text-transform: none;">
                                        {{ $block->description }}
                                    </div>
                                @endif
                            </th>
                        </tr>
                        <tr class="page-break">
                            <td style="padding: 10px; white-space: pre-wrap; text-align: left; vertical-align: middle; border-bottom: 1px solid #000;">{{ $block->items[0]->note ?? 'Tidak ada catatan.' }}</td>
                        </tr>
                    </tbody>
                </table>
            @elseif($columns === 'basic')
                {{-- BASIC BLOCK (e.g. Free Strength) - Exercise name + Sets + Note only --}}
                <table class="main-table" style="margin-bottom: 0;">
                    <colgroup>
                        <col style="width: 85%;">
                        <col style="width: 15%;">
                    </colgroup>
                    <tbody>
                        {{-- Dummy row to enforce widths in dompdf because the first row has a colspan --}}
                        <tr style="height: 0; padding: 0; border: none; line-height: 0; overflow: hidden;">
                            <td style="width: 85%; height: 0; padding: 0 !important; border: none !important; line-height: 0;"></td>
                            <td style="width: 15%; height: 0; padding: 0 !important; border: none !important; line-height: 0;"></td>
                        </tr>
                        <tr class="phase-header-row page-break" style="background-color: #f8fafc;">
                            <th colspan="2" style="text-align: left; padding: 10px 8px; border-bottom: 2px solid #000;">
                                <div style="font-size: 13px; color: black; text-transform: uppercase;">
                                    PHASE: {{ $block->title ?: str_replace('_', ' ', $block->category) }}
                                </div>
                                @if($block->description)
                                    <div style="font-weight: normal; font-size: 11px; margin-top: 4px; text-transform: none;">
                                        {{ $block->description }}
                                    </div>
                                @endif
                            </th>
                        </tr>
                        <tr class="sub-header page-break">
                            <th style="width: 85%; text-align: left;">Exercise</th>
                            <th style="width: 15%; text-align: center;">Sets</th>
                        </tr>
                        @foreach($block->items as $index => $item)
                            <tr class="page-break" style="page-break-inside: avoid;">
                                <td style="width: 85%; vertical-align: middle; padding: 6px; text-align: left;">
                                    <table class="inner-layout-table">
                                        <tr>
                                            <td style="width: 60%; padding-right: 4px !important;">
                                                <span class="exercise-name">{{ $item->exercise ? $item->exercise->name : 'Custom Exercise' }}</span>
                                                @if($item->exercise && $item->exercise->description)
                                                    <div class="exercise-desc">{{ $item->exercise->description }}</div>
                                                @endif
                                                @if(($visualMode === 'all' || $visualMode === 'video') && $item->exercise && !empty($item->exercise->videos))
                                                    @foreach($item->exercise->videos as $vid)
                                                        @if($vid)
                                                            <a href="{{ $vid }}" class="video-link" target="_blank"> > Watch Video</a>
                                                            @break
                                                        @endif
                                                    @endforeach
                                                @endif
                                                @if($item->note)
                                                    <div class="note-box">{{ $item->note }}</div>
                                                @endif
                                            </td>
                                            @if($visualMode === 'all' || $visualMode === 'image')
                                                @if($item->exercise && !empty($item->exercise->base64_images) && is_array($item->exercise->base64_images))
                                                    @php
                                                        $images = array_slice($item->exercise->base64_images, 0, 3);
                                                        $imgTotal = count($images);
                                                    @endphp
                                                    <td style="width: 30%; text-align: right; vertical-align: top;">
                                                        <table class="img-grid" style="margin-left: auto;">
                                                            @if($imgTotal === 1)
                                                                <tr><td><img src="{{ $images[0] }}" class="img-preview" /></td></tr>
                                                            @elseif($imgTotal === 2)
                                                                <tr>
                                                                    <td><img src="{{ $images[0] }}" class="img-preview" /></td>
                                                                    <td><img src="{{ $images[1] }}" class="img-preview" /></td>
                                                                </tr>
                                                            @elseif($imgTotal >= 3)
                                                                <tr>
                                                                    <td><img src="{{ $images[0] }}" class="img-preview" /></td>
                                                                    <td><img src="{{ $images[1] }}" class="img-preview" /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2"><img src="{{ $images[2] }}" class="img-preview" /></td>
                                                                </tr>
                                                            @endif
                                                        </table>
                                                    </td>
                                                @endif
                                            @endif
                                        </tr>
                                    </table>
                                </td>
                                <td style="width: 5%; text-align: center; vertical-align: middle;">{{ $item->sets ?: '-' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                {{-- FULL / MEDIUM / CARDIO BLOCKS --}}
                <table class="main-table" style="margin-bottom: 0;">
                    <colgroup>
                        <col style="width: 95%;">
                        <col style="width: 5%;">
                    </colgroup>
                    <tbody>
                        <tr style="height: 0; padding: 0; border: none; line-height: 0; overflow: hidden;">
                            <td style="width: 95%; height: 0; padding: 0 !important; border: none !important; line-height: 0;"></td>
                            <td style="width: 5%; height: 0; padding: 0 !important; border: none !important; line-height: 0;"></td>
                        </tr>
                        <tr class="phase-header-row page-break" style="background-color: #f8fafc;">
                            <th colspan="2" style="text-align: left; padding: 10px 8px; border-bottom: 2px solid #000;">
                                <div style="font-size: 13px; color: black; text-transform: uppercase;">
                                    PHASE: {{ $block->title ?: str_replace('_', ' ', $block->category) }}
                                </div>
                                @if($block->description)
                                    <div style="font-weight: normal; font-size: 11px; margin-top: 4px; text-transform: none;">
                                        {{ $block->description }}
                                    </div>
                                @endif
                                @if($targetFilledBy === 'athlete')
                                    <div style="margin-top: 4px; font-size: 10px; color: #52525b; font-style: italic; text-transform: none;">
                                        * Target pada sesi ini akan diisi oleh atlet
                                    </div>
                                @endif
                            </th>
                        </tr>
                        <tr class="sub-header page-break">
                            <th style="width: 95%; text-align: left;">Exercise</th>
                            <th style="width: 5%; text-align: center;">Sets</th>
                        </tr>

                        @foreach($block->items as $index => $item)
                            @php
                                $targetItem = isset($playerTargets) && isset($playerTargets[$item->id]) ? $playerTargets[$item->id] : $item;
                                $maxSets = 0;
                                $setsVal = $targetItem->sets ?: $item->sets;
                                if ($setsVal) {
                                    preg_match_all('/\d+/', (string)$setsVal, $setsMatches);
                                    if (!empty($setsMatches[0])) {
                                        $maxSets = max(array_map('intval', $setsMatches[0]));
                                    }
                                }
                                $maxSets = max($maxSets, 1);

                                $pLoadArray = is_array($targetItem->load_array) ? $targetItem->load_array : [];
                                $pRepsArray = is_array($targetItem->reps_array) ? $targetItem->reps_array : [];
                                $pDistanceArray = is_array($targetItem->distance_array) ? $targetItem->distance_array : [];
                                $pTempoArray = is_array($targetItem->tempo_array) ? $targetItem->tempo_array : [];
                                $pRirArray = is_array($targetItem->rir_array) ? $targetItem->rir_array : [];
                                $pRestArray = is_array($targetItem->rest_per_set_array) ? $targetItem->rest_per_set_array : [];
                                
                                $repsUnit = $targetItem->reps_unit ?: ($item->reps_unit ?: 'reps');
                                if ($columns === 'cardio' && $repsUnit === 'reps') {
                                    $repsUnit = 'minutes';
                                }
                                $repsUnitLabel = $repsUnit === 'seconds' ? 'Secs' : ($repsUnit === 'minutes' ? 'Mins' : ($repsUnit === 'hours' ? 'Hours' : 'Reps'));
                                $loadUnit = $targetItem->load_unit ?: ($item->load_unit ?: 'kg');
                            @endphp
                            <tr class="page-break" style="page-break-inside: avoid;">
                                {{-- Exercise + Per-Set Breakdown --}}
                                <td style="width: 95%; vertical-align: top; padding: 6px; text-align: left;">
                                    <table class="inner-layout-table">
                                        <tr>
                                            <td style="width: {{ ($visualMode === 'all' || $visualMode === 'image') ? '60%' : '100%' }}; padding-right: 4px !important; vertical-align: top;">
                                                <span class="exercise-name">{{ $item->exercise ? $item->exercise->name : 'Custom Exercise' }}</span>
                                                @if($item->exercise && $item->exercise->description)
                                                    <div class="exercise-desc">{{ $item->exercise->description }}</div>
                                                @endif
                                                @if(($visualMode === 'all' || $visualMode === 'video') && $item->exercise && !empty($item->exercise->videos))
                                                    @foreach($item->exercise->videos as $vid)
                                                        @if($vid)
                                                            <a href="{{ $vid }}" class="video-link" target="_blank"> > Watch Video</a>
                                                            @break
                                                        @endif
                                                    @endforeach
                                                @endif
                                                @if($item->note)
                                                    <div class="note-box">{{ $item->note }}</div>
                                                @endif
                                            </td>
                                            @if($visualMode === 'all' || $visualMode === 'image')
                                                @if($item->exercise && !empty($item->exercise->base64_images) && is_array($item->exercise->base64_images))
                                                    @php
                                                        $images = array_slice($item->exercise->base64_images, 0, 3);
                                                        $imgTotal = count($images);
                                                    @endphp
                                                    <td style="width: 30%; text-align: right; vertical-align: top;">
                                                        <table class="img-grid" style="margin-left: auto;">
                                                            @if($imgTotal === 1)
                                                                <tr><td><img src="{{ $images[0] }}" class="img-preview" /></td></tr>
                                                            @elseif($imgTotal === 2)
                                                                <tr>
                                                                    <td><img src="{{ $images[0] }}" class="img-preview" /></td>
                                                                    <td><img src="{{ $images[1] }}" class="img-preview" /></td>
                                                                </tr>
                                                            @elseif($imgTotal >= 3)
                                                                <tr>
                                                                    <td><img src="{{ $images[0] }}" class="img-preview" /></td>
                                                                    <td><img src="{{ $images[1] }}" class="img-preview" /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2"><img src="{{ $images[2] }}" class="img-preview" /></td>
                                                                </tr>
                                                            @endif
                                                        </table>
                                                    </td>
                                                @endif
                                            @endif
                                        </tr>
                                    </table>

                                    @php
                                        $playerRecord = isset($rpeRecords) && isset($rpeRecords[$item->id]) ? $rpeRecords[$item->id] : null;
                                        $rpeData = $playerRecord ? $playerRecord->rpe_data : null;
                                        
                                        $actuals = null;
                                        
                                        if (false) {
                                            $actuals = [
                                                'load' => [],
                                                'reps' => [],
                                                'distance' => [],
                                                'tempo' => [],
                                                'rir' => [],
                                                'rest' => [],
                                                'minutes' => [],
                                                'rpes' => []
                                            ];
                                            
                                            if (is_array($rpeData) && count($rpeData) > 0) {
                                                $isAssoc = array_keys($rpeData) !== range(0, count($rpeData) - 1);
                                                if ($isAssoc || isset($rpeData['rpes'])) {
                                                    $actuals = array_merge($actuals, $rpeData);
                                                    if (!isset($actuals['rpes']) || !is_array($actuals['rpes'])) {
                                                        $actuals['rpes'] = [];
                                                    }
                                                } else {
                                                    $actuals = [
                                                        'load' => [],
                                                        'reps' => [],
                                                        'distance' => [],
                                                        'tempo' => [],
                                                        'rir' => [],
                                                        'rest' => [],
                                                        'minutes' => [],
                                                        'rpes' => array_map(function($d) { return is_array($d) ? ($d['rpe'] ?? '-') : $d; }, $rpeData)
                                                    ];
                                                }
                                            }
                                        }
                                        
                                        $hasActuals = $actuals !== null;
                                    @endphp

                                    {{-- Per-Set Breakdown Table --}}
                                    @if($maxSets > 0)
                                        <table class="set-row-table" style="margin-top: 6px;">
                                            {{-- Header --}}
                                            <tr>
                                                <th style="width: 35px;"></th>
                                                @if($columns === 'cardio')
                                                    <th>Distance (m)</th>
                                                    <th>Time ({{ strtolower($repsUnitLabel) }})</th>
                                                    <th>Rest</th>
                                                @elseif($columns === 'full')
                                                    <th>Load ({{ strtolower($loadUnit) }})</th>
                                                    <th>{{ $repsUnit === 'reps' ? 'Reps' : 'Reps (' . strtolower($repsUnitLabel) . ')' }}</th>
                                                    <th>Tempo</th>
                                                    <th>RIR</th>
                                                    <th>Rest</th>
                                                @elseif($columns === 'medium')
                                                    <th>{{ $repsUnit === 'reps' ? 'Reps' : 'Reps (' . strtolower($repsUnitLabel) . ')' }}</th>
                                                    <th>Rest</th>
                                                @endif
                                                @php
                                                    $showFeedback = in_array($block->category, ['mobility', 'strength_training', 'interval', 'cardio']);
                                                @endphp
                                                @if($hasActuals && $showFeedback)
                                                    <th>{{ in_array($block->category, ['interval', 'cardio']) ? 'RPE (Actual)' : 'RIR (Actual)' }}</th>
                                                @endif
                                            </tr>
                                            {{-- Set Rows --}}
                                            @php
                                                $actualLoad = $hasActuals && is_array($actuals['load_array'] ?? $actuals['load'] ?? null) ? ($actuals['load_array'] ?? $actuals['load']) : [];
                                                $actualReps = $hasActuals && is_array($actuals['reps_array'] ?? $actuals['reps'] ?? null) ? ($actuals['reps_array'] ?? $actuals['reps']) : [];
                                                $actualDistance = $hasActuals && is_array($actuals['distance_array'] ?? $actuals['distance'] ?? null) ? ($actuals['distance_array'] ?? $actuals['distance']) : [];
                                                $actualMinutes = $hasActuals && is_array($actuals['minutes_array'] ?? $actuals['minutes'] ?? null) ? ($actuals['minutes_array'] ?? $actuals['minutes']) : [];
                                                $actualTempo = $hasActuals && is_array($actuals['tempo_array'] ?? $actuals['tempo'] ?? null) ? ($actuals['tempo_array'] ?? $actuals['tempo']) : [];
                                                $actualRir = $hasActuals && is_array($actuals['rir_array'] ?? $actuals['rir'] ?? null) ? ($actuals['rir_array'] ?? $actuals['rir']) : [];
                                                $actualRest = $hasActuals && is_array($actuals['rest_per_set_array'] ?? $actuals['rest'] ?? null) ? ($actuals['rest_per_set_array'] ?? $actuals['rest']) : [];
                                                $actualRpes = $hasActuals && is_array($actuals['rpes'] ?? null) ? $actuals['rpes'] : [];
                                                $loopCount = $hasActuals ? max($maxSets, count($actualRpes)) : $maxSets;
                                            @endphp
                                            @for($sIdx = 0; $sIdx < $loopCount; $sIdx++)
                                                @php
                                                    // Base values from targets (or default to item)
                                                    $d = $pDistanceArray[$sIdx] ?? $targetItem->distance;
                                                    $r = $pRepsArray[$sIdx] ?? ($targetItem->reps ?: $targetItem->minutes);
                                                    $l = $pLoadArray[$sIdx] ?? $targetItem->load;
                                                    $t = $pTempoArray[$sIdx] ?? $targetItem->tempo;
                                                    $rir = $pRirArray[$sIdx] ?? $targetItem->rir;
                                                    $rst = $pRestArray[$sIdx] ?? $targetItem->rest_per_set;
                                                    
                                                    // Override with athlete actuals when target is by athlete
                                                    if ($targetFilledBy === 'athlete' && $hasActuals) {
                                                        $d = ($actualDistance[$sIdx] ?? '') ?: '-';
                                                        $r = ($actualMinutes[$sIdx] ?? $actualReps[$sIdx] ?? '') ?: '-';
                                                        $l = ($actualLoad[$sIdx] ?? '') ?: '-';
                                                    }
                                                    
                                                    // For admin target, merge actuals into admin values (athlete overrides where filled)
                                                    if ($targetFilledBy !== 'athlete' && $hasActuals) {
                                                        // Athlete might have filled reps/load actuals
                                                        if (isset($actualLoad[$sIdx]) && $actualLoad[$sIdx] !== '') $l = $actualLoad[$sIdx];
                                                        if (isset($actualReps[$sIdx]) && $actualReps[$sIdx] !== '') $r = $actualReps[$sIdx];
                                                        if (isset($actualDistance[$sIdx]) && $actualDistance[$sIdx] !== '') $d = $actualDistance[$sIdx];
                                                        if (isset($actualTempo[$sIdx]) && $actualTempo[$sIdx] !== '') $t = $actualTempo[$sIdx];
                                                        if (isset($actualRir[$sIdx]) && $actualRir[$sIdx] !== '') $rir = $actualRir[$sIdx];
                                                        if (isset($actualRest[$sIdx]) && $actualRest[$sIdx] !== '') $rst = $actualRest[$sIdx];
                                                    }
                                                @endphp
                                                <tr>
                                                    <td class="set-label">S{{ $sIdx + 1 }}</td>
                                                    @if($columns === 'cardio')
                                                        <td>
                                                            @if($targetFilledBy === 'athlete' && !$hasActuals)
                                                                <span class="athlete-tag">Diisi Atlet</span>
                                                            @else
                                                                {{ $d ?: '-' }}
                                                            @endif
                                                        </td>
                                                        <td>
                                                            @if($targetFilledBy === 'athlete' && !$hasActuals)
                                                                <span class="athlete-tag">Diisi Atlet</span>
                                                            @else
                                                                {{ $r ?: '-' }}
                                                            @endif
                                                        </td>
                                                        <td>{{ $rst ?: '-' }}</td>
                                                    @elseif($columns === 'full')
                                                        <td>
                                                            @if($targetFilledBy === 'athlete' && !$hasActuals)
                                                                <span class="athlete-tag">Diisi Atlet</span>
                                                            @else
                                                                {{ $l ?: '-' }}
                                                            @endif
                                                        </td>
                                                        <td>
                                                            @if($targetFilledBy === 'athlete' && !$hasActuals)
                                                                <span class="athlete-tag">Diisi Atlet</span>
                                                            @else
                                                                {{ $r ?: '-' }}
                                                            @endif
                                                        </td>
                                                        <td>{{ $t ?: '-' }}</td>
                                                        <td>{{ $rir ?: '-' }}</td>
                                                        <td>{{ $rst ?: '-' }}</td>
                                                    @elseif($columns === 'medium')
                                                        <td>
                                                            @if($targetFilledBy === 'athlete' && !$hasActuals)
                                                                <span class="athlete-tag">Diisi Atlet</span>
                                                            @else
                                                                {{ $r ?: '-' }}
                                                            @endif
                                                        </td>
                                                        <td>{{ $rst ?: '-' }}</td>
                                                    @endif
                                                    
                                                    @if($hasActuals && $showFeedback)
                                                        @php
                                                            $rpeVal = ($actualRpes[$sIdx] ?? '') ?: '-';
                                                            $rpeBg = '#ffffff';
                                                            if (is_numeric($rpeVal)) {
                                                                if ($rpeVal <= 3) $rpeBg = '#bbf7d0';
                                                                elseif ($rpeVal <= 5) $rpeBg = '#fef08a';
                                                                elseif ($rpeVal <= 7) $rpeBg = '#fed7aa';
                                                                else $rpeBg = '#fecaca';
                                                            }
                                                        @endphp
                                                        <td style="font-weight: bold; background-color: {{ $rpeBg }}; text-align: center;">{{ $rpeVal }}</td>
                                                    @endif
                                                </tr>
                                            @endfor
                                        </table>
                                    @endif
                                </td>

                                {{-- Sets Column --}}
                                <td style="width: 5%; text-align: center; vertical-align: middle; font-weight: bold;">{{ $item->sets ?: '-' }}</td>
                            </tr>
                            

                        @endforeach
                    </tbody>
                </table>
            @endif

            @if(!$loop->last)
                <div style="page-break-after: always;"></div>
            @endif
        @endif
    @endforeach



    <div class="footer">
     Powered by: Olympus Training Surabaya
    </div>

</body>
</html>
