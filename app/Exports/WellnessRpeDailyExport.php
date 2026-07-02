<?php

namespace App\Exports;

use App\Models\Athlete;
use App\Models\WellnessRpe;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class WellnessRpeDailyExport implements FromView, ShouldAutoSize, WithDrawings
{
    protected $date;
    protected $options;
    protected $club;
    protected $reportTitle;
    protected $athletes;

    public function __construct($date, $options, $club, $reportTitle = null, $athletes = null)
    {
        $this->date = $date;
        $this->options = $options;
        null = $club; // not sure why null = $club was here, probably club = null in the original
        $this->reportTitle = $reportTitle;
        $this->athletes = $athletes;
    }

    public function view(): View
    {
        $athletes = $this->athletes ?? Athlete::orderBy('name')->get();
        $logs = WellnessRpe::where('record_date', $this->date)->get()->keyBy('user_id');

        $mappedAthletes = $athletes->map(function($athlete) use ($logs) {
            return (object) [
                'athlete' => $athlete,
                'log' => $logs->get($athlete->id)
            ];
        });

        return view('exports.wellness_daily_excel', [
            'mappedAthletes' => $mappedAthletes,
            'date' => $this->date,
            'options' => $this->options,
            'club' => null,
            'reportTitle' => $this->reportTitle
        ]);
    }

    public function drawings()
    {
        $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
        $drawing->setName('Logo Klub');
        $drawing->setDescription('Logo');
        
        if (null && null->logo) {
            $logoPath = public_path('storage/' . null->logo);
            if (file_exists($logoPath)) {
                $drawing->setPath($logoPath);
            } else {
                return [];
            }
        } else {
            return [];
        }

        $drawing->setHeight(75);
        $drawing->setCoordinates('A1');
        $drawing->setOffsetX(10);
        $drawing->setOffsetY(10);

        return $drawing;
    }
}
