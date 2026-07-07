import re

with open('resources/views/exports/athlete_session_report_pdf.blade.php', 'r') as f:
    content = f.read()

css = """
        /* Unified Grid Styles (Recap) */
        .mc-grid { width: 100%; border-collapse: collapse; margin-bottom: 30px; table-layout: fixed; border: 2px solid #000; }
        .mc-grid td { border: 1px solid #000; text-align: center; vertical-align: top; padding: 0; height: 40px; }
        
        .day-header { background-color: #e4e4e7; padding: 6px 2px; border-bottom: 1px solid #000; }
        .day-number { font-size: 11px; font-weight: bold; margin-bottom: 1px; color: #18181b; }
        .day-date { font-size: 10px; font-weight: bold; color: #18181b; }
        
        .activity-item { 
            padding: 6px 2px; 
            border-bottom: 1px solid #000; 
            font-size: 10px; 
            color: #18181b; 
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .activity-item:last-child { border-bottom: none; }
        .activity-primary { background-color: #93c5fd; font-weight: bold; }
"""

html = """
    <!-- FRONT PAGE SUMMARY GRID -->
    <table class="header-table">
        <tr>
            <td width="75%" style="text-align: left;">
                <h1 class="title">LAPORAN SESI - {{ strtoupper($athlete->name) }}</h1>
                <div class="subtitle">
                    Total Sesi: {{ count($trainings) }}
                </div>
            </td>
            <td width="25%" style="text-align: right;">
                @if(!empty($clubLogo))
                    <img src="{{ $clubLogo }}" class="logo" />
                @endif
            </td>
        </tr>
    </table>

    <table class="mc-grid">
        <tbody>
            @foreach($trainings->chunk(7) as $chunk)
                <tr>
                    @foreach($chunk as $index => $t)
                        <td style="width: 14.28%;">
                            <div class="day-header">
                                <div class="day-number">Sesi {{ $t->session_number ?: ($index + 1) }}</div>
                                <div class="day-date">{{ \Carbon\Carbon::parse($t->date)->format('d F Y') }}</div>
                            </div>
                            
                            <div class="activity-item activity-primary" style="background-color: #fef08a;">
                                {{ $t->title ?: $t->name }}
                            </div>
                            <div class="activity-item">
                                {{ $t->focus ?: 'Individual Training' }}
                            </div>
                        </td>
                    @endforeach
                    @for($i = $chunk->count(); $i < 7; $i++)
                        <td style="width: 14.28%; background-color: #f4f4f5;"></td>
                    @endfor
                </tr>
            @endforeach
        </tbody>
    </table>
    
    <div style="page-break-after: always;"></div>
    <!-- END OF SUMMARY GRID -->
"""

content = content.replace('    </style>', css + '    </style>')
content = content.replace('<body>', '<body>\n' + html)

with open('resources/views/exports/athlete_session_report_pdf.blade.php', 'w') as f:
    f.write(content)

print("Patched successfully")
