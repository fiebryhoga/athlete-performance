    public function showAthlete(Request $request, $user)
    {
        $athlete = User::where('role', 'athlete')->findOrFail($user);

        // Dynamic Start Date based on the athlete's first log (Option 1)
        $firstLog = WellnessRpe::where('user_id', $athlete->id)
            ->orderBy('record_date', 'asc')
            ->first();

        // If there's a log, use its date as start date. Otherwise, default to the start of this week.
        $season_start_date = $firstLog 
            ? Carbon::parse($firstLog->record_date)->format('Y-m-d') 
            : Carbon::today()->startOfWeek()->format('Y-m-d');

        $calendarWeeks = [];

        if ($season_start_date) {
            $start = Carbon::parse($season_start_date)->startOfWeek(); 
            $end = Carbon::today()->endOfWeek(); 
            
            $allLogs = WellnessRpe::where('user_id', $athlete->id)
                ->where('record_date', '>=', $start->format('Y-m-d'))
                ->where('record_date', '<=', $end->format('Y-m-d'))
                ->get();

            $currentDate = $start->copy();
            $weekNumber = 1;

            while ($currentDate <= $end) {
                $weekStart = $currentDate->copy();
                $weekEnd = $currentDate->copy()->endOfWeek();
                
                $days = [];
                for ($i = 0; $i < 7; $i++) {
                    $dateStr = $currentDate->format('Y-m-d');
                    $log = $allLogs->firstWhere('record_date', $dateStr);
                    
                    $days[] = [
                        'date' => $dateStr,
                        'day_name' => $currentDate->locale(app()->getLocale())->shortDayName,
                        'formatted_date' => $currentDate->format('d M Y'),
                        'has_data' => $log ? true : false,
                        'wellness_score' => $log ? $log->daily_wellness_score : null,
                        'daily_load' => $log ? $log->daily_load : null,
                    ];
                    $currentDate->addDay();
                }

                $calendarWeeks[] = [
                    'week_number' => $weekNumber,
                    'week_range' => $weekStart->format('d M') . ' - ' . $weekEnd->format('d M'),
                    'days' => $days
                ];

                $weekNumber++;
            }
        }

        return Inertia::render('Admin/WellnessRpe/AthleteCalendar', [
            'athlete' => $athlete,
            'season_start_date' => $season_start_date,
            'calendarWeeks' => array_reverse($calendarWeeks), 
        ]);
    }
