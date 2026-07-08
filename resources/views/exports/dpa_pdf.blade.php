<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #18181b; margin: 0; padding: 20px; line-height: 1.4; }
        .header { border-bottom: 1px solid #e4e4e7; padding-bottom: 15px; margin-bottom: 25px; display: table; width: 100%; }
        .header-content { display: table-cell; vertical-align: middle; }
        .logo-container { display: table-cell; vertical-align: middle; text-align: right; width: 80px; }
        .logo { max-width: 60px; max-height: 60px; }
        h1 { margin: 0 0 5px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #18181b; }
        .meta { font-size: 11px; color: #71717a; font-weight: normal; }
        
        .note-section { margin-bottom: 25px; border: 1px solid #000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #000; background-color: #fff; page-break-inside: avoid; }
        .note-title { text-align: center; font-weight: bold; padding: 6px; border-bottom: 1px solid #000; text-transform: uppercase; font-size: 11px; background-color: #fafafa; }
        .note-content { padding: 12px 16px; margin: 0; }
        .note-content p { margin: 0 0 8px 0; }
        .note-content p:last-child { margin-bottom: 0; }
        .note-content ul, .note-content ol { margin: 5px 0 10px 0; padding-left: 20px; }
        .note-content li { margin-bottom: 4px; }

        .section-title { font-size: 14px; font-weight: 800; color: #18181b; margin: 30px 0 15px 0; padding-bottom: 5px; border-bottom: 1px solid #d4d4d8; text-transform: uppercase; letter-spacing: 0.5px; }
        
        /* Overall Profile */
        .overall-grid { display: table; width: 100%; margin-bottom: 25px; border: 1px solid #e4e4e7; background: #fff; }
        .overall-row { display: table-row; }
        .overall-col { display: table-cell; width: 33.33%; padding: 15px; border-right: 1px solid #e4e4e7; vertical-align: top; }
        .overall-col:last-child { border-right: none; }
        .overall-title { font-size: 11px; font-weight: 800; color: #18181b; text-transform: uppercase; margin-bottom: 10px; }
        .list-item { margin-bottom: 5px; padding-left: 10px; position: relative; color: #3f3f46; font-size: 11px; }
        .list-item:before { content: "-"; position: absolute; left: 0; color: #a1a1aa; font-weight: bold; }
        
        /* Specific Compensation */
        .comp-card { border: 1px solid #e4e4e7; margin-bottom: 25px; background: #fff; page-break-inside: avoid; }
        .comp-header { background: #f4f4f5; padding: 12px 15px; border-bottom: 1px solid #e4e4e7; }
        .comp-category { font-size: 10px; font-weight: bold; color: #71717a; text-transform: uppercase; margin-bottom: 2px; }
        .comp-name { font-size: 14px; font-weight: 800; color: #18181b; margin: 0; }
        
        .comp-body { display: table; width: 100%; }
        .comp-left { display: table-cell; width: 35%; padding: 15px; border-right: 1px solid #e4e4e7; vertical-align: top; }
        .comp-right { display: table-cell; width: 65%; padding: 15px; vertical-align: top; }
        
        .comp-image-wrapper { margin-bottom: 15px; text-align: center; border: 1px solid #e4e4e7; padding: 5px; background: #fff; }
        .comp-image { max-width: 100%; max-height: 180px; }
        
        .mini-title { font-size: 10px; font-weight: 800; color: #18181b; text-transform: uppercase; margin: 15px 0 5px 0; }
        .mini-title:first-child { margin-top: 0; }
        
        .nasm-grid { display: table; width: 100%; margin-top: 5px; }
        .nasm-row { display: table-row; }
        .nasm-col { display: table-cell; width: 50%; padding: 10px; border: 1px solid #e4e4e7; vertical-align: top; }
        
        .step-header { font-size: 10px; font-weight: 800; color: #18181b; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #f4f4f5; padding-bottom: 4px; }
        .step-number { background: #18181b; color: #fff; padding: 1px 5px; border-radius: 3px; margin-right: 5px; }
        
        .exercise-img { max-width: 100%; max-height: 100px; margin-top: 8px; border: 1px solid #e4e4e7; border-radius: 2px; }
        
        .empty-text { font-size: 10px; color: #a1a1aa; font-style: italic; }
        
        .footer { text-align: center; font-size: 9px; color: #a1a1aa; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }

    </style>
</head>
<body>

    <div class="header">
        <div class="header-content">
            <h1>{{ $title ?? 'DPA Assessment Report' }}</h1>
            <div class="meta">
                Player: <span style="color: #18181b; font-weight: 600;">{{ $player->name ?? 'N/A' }}</span> &nbsp;|&nbsp; 
                Position: {{ $player->position ?? '-' }} &nbsp;|&nbsp; 
                Assessment Date: {{ $latest ? date('d F Y', strtotime($latest['assessment_date'])) : '-' }} &nbsp;|&nbsp; 
            </div>
        </div>
        <div class="logo-container">
            @if(isset($club) && $club->logo_url)
                <img src="{{ $club->logo_url }}" class="logo" alt="Club Logo">
            @endif
        </div>
    </div>

        @if($latest)
        
        @php
            $hasCompensations = false;
            if(isset($latest['details']) && count($latest['details']) > 0) {
                foreach($latest['details'] as $detail) {
                    if(isset($detail['compensation'])) {
                        $hasCompensations = true;
                        break;
                    }
                }
            }
        @endphp

        @if($hasCompensations)
            <div class="section-title">Overall Imbalance Profile</div>
            <div class="overall-grid">
                <div class="overall-row">
                    <div class="overall-col">
                        <div class="overall-title">Overactive Muscles</div>
                        @if(!empty($analysis['overactive']) && count($analysis['overactive']) > 0)
                            @foreach($analysis['overactive'] as $m)
                                <div class="list-item">{{ $m }}</div>
                            @endforeach
                        @else
                            <div class="empty-text">None identified</div>
                        @endif
                    </div>
                    <div class="overall-col">
                        <div class="overall-title">Underactive Muscles</div>
                        @if(!empty($analysis['underactive']) && count($analysis['underactive']) > 0)
                            @foreach($analysis['underactive'] as $m)
                                <div class="list-item">{{ $m }}</div>
                            @endforeach
                        @else
                            <div class="empty-text">None identified</div>
                        @endif
                    </div>
                    <div class="overall-col">
                        <div class="overall-title">Possible Injuries / Risks</div>
                        @if(!empty($analysis['injuries']) && count($analysis['injuries']) > 0)
                            @foreach($analysis['injuries'] as $m)
                                <div class="list-item">{{ $m }}</div>
                            @endforeach
                        @else
                            <div class="empty-text">None identified</div>
                        @endif
                    </div>
                </div>
            </div>

            @php $firstComp = true; @endphp
            @foreach($latest['details'] as $detail)
                @if(isset($detail['compensation']))
                    @php 
                        $c = $detail['compensation']; 
                        
                        // Helper to split strings
                        $split = function($str) {
                            if(!$str) return [];
                            return array_filter(array_map('trim', preg_split('/[\n,]/', $str)));
                        };
                        
                        $over = $split($c['overactive_muscles'] ?? '');
                        $under = $split($c['underactive_muscles'] ?? '');
                        $inj = $split($c['possible_injuries'] ?? '');
                        $smr = $split($c['exercises_smr'] ?? '');
                        $str = $split($c['exercises_stretching'] ?? '');
                        $iso = $split($c['exercises_isometrics'] ?? '');
                        $int = $split($c['exercises_integrated'] ?? '');
                    @endphp
                    
                    <div style="page-break-before: always;"></div>
                    @if($firstComp)
                        <div class="section-title" style="margin-top: 0;">Specific Compensations Breakdown</div>
                        @php $firstComp = false; @endphp
                    @endif
                    
                    <div class="comp-card">
                        <div class="comp-header">
                            <div class="comp-category">{{ $c['category'] ?? 'Category' }}</div>
                            <h3 class="comp-name">{{ $c['name'] ?? 'Compensation' }}</h3>
                        </div>
                        <div class="comp-body">
                            <div class="comp-left">
                                @if(!empty($c['image_path']))
                                    <div class="comp-image-wrapper">
                                        <img src="{{ storage_path('app/public/'.$c['image_path']) }}" class="comp-image">
                                    </div>
                                @endif
                                
                                <div class="mini-title">Overactive</div>
                                @foreach($over as $m) <div class="list-item">{{ ltrim($m, '-') }}</div> @endforeach
                                @if(count($over) == 0) <span class="empty-text">None</span> @endif
                                
                                <div class="mini-title">Underactive</div>
                                @foreach($under as $m) <div class="list-item">{{ ltrim($m, '-') }}</div> @endforeach
                                @if(count($under) == 0) <span class="empty-text">None</span> @endif
                                
                                <div class="mini-title">Injuries</div>
                                @foreach($inj as $m) <div class="list-item">{{ ltrim($m, '-') }}</div> @endforeach
                                @if(count($inj) == 0) <span class="empty-text">None</span> @endif
                            </div>
                            <div class="comp-right">
                                <div class="mini-title" style="font-size:12px; margin-bottom:10px;">Corrective Exercise Continuum</div>
                                
                                <div class="nasm-grid">
                                    <div class="nasm-row">
                                        <div class="nasm-col" style="border-right: none; border-bottom: none;">
                                            <div class="step-header"><span class="step-number">1</span> Inhibit (SMR)</div>
                                            @foreach($smr as $m) <div class="list-item">{{ ltrim($m, '-') }}</div> @endforeach
                                            @if(!empty($c['image_smr']))
                                                <img src="{{ storage_path('app/public/'.$c['image_smr']) }}" class="exercise-img">
                                            @endif
                                        </div>
                                        <div class="nasm-col" style="border-bottom: none;">
                                            <div class="step-header"><span class="step-number">2</span> Lengthen (Stretch)</div>
                                            @foreach($str as $m) <div class="list-item">{{ ltrim($m, '-') }}</div> @endforeach
                                            @if(!empty($c['image_stretching']))
                                                <img src="{{ storage_path('app/public/'.$c['image_stretching']) }}" class="exercise-img">
                                            @endif
                                        </div>
                                    </div>
                                    <div class="nasm-row">
                                        <div class="nasm-col" style="border-right: none;">
                                            <div class="step-header"><span class="step-number">3</span> Activate</div>
                                            @foreach($iso as $m) <div class="list-item">{{ ltrim($m, '-') }}</div> @endforeach
                                            @if(!empty($c['image_isometrics']))
                                                <img src="{{ storage_path('app/public/'.$c['image_isometrics']) }}" class="exercise-img">
                                            @endif
                                        </div>
                                        <div class="nasm-col">
                                            <div class="step-header"><span class="step-number">4</span> Integrate</div>
                                            @foreach($int as $m) <div class="list-item">{{ ltrim($m, '-') }}</div> @endforeach
                                            @if(!empty($c['image_integrated']))
                                                <img src="{{ storage_path('app/public/'.$c['image_integrated']) }}" class="exercise-img">
                                            @endif
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                @endif
            @endforeach
            
        @else
            <div class="notes-box" style="text-align:center; padding:30px;">
                <h4 style="margin:0; font-size:14px; color:#18181b;">No Compensations Detected</h4>
                <p style="margin:5px 0 0 0; color:#71717a; font-size:12px;">Player shows excellent postural alignment.</p>
            </div>
        @endif
        
    @endif

    @if(!empty($note) && $note !== '<p><br></p>')
    <div class="note-section" style="margin-top: 25px;">
        <div class="note-title">Clinical Notes / Remarks</div>
        <div class="note-content">
            {!! $note !!}
        </div>
    </div>
    @endif

    <div class="footer">
        Generated on {{ \Carbon\Carbon::now()->translatedFormat('d F Y H:i') }} &mdash; Power by: Olympus Training Surabaya X Unesa
    </div>

</body>
</html>
