<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json([]);
        }

        
        $user = $request->user();

        if ($user && $user->role === 'athlete') {
            $items = collect([
                ['title' => 'Dashboard', 'subtitle' => 'Ringkasan Performa & Agenda', 'url' => route('dashboard')],
                ['title' => 'Profil Fisik & Analisis', 'subtitle' => 'Hasil Evaluasi & Tes Performa', 'url' => route('athlete.profiling')],
                ['title' => 'Program Latihan', 'subtitle' => 'Daftar Sesi Latihan Privat & Grup', 'url' => route('admin.individual-trainings.index')],
                ['title' => 'Rencana Nutrisi & Makan', 'subtitle' => 'Meal Plans & Panduan Gizi', 'url' => route('admin.meal-plans.index')],
                ['title' => 'Wellness & Recovery', 'subtitle' => 'Kuisioner Kebugaran & RPE', 'url' => route('admin.wellness-rpe.index')],
            ])->filter(function ($item) use ($query) {
                return stripos($item['title'], $query) !== false || stripos($item['subtitle'], $query) !== false;
            })->values()->map(function ($item, $idx) {
                return [
                    'id' => $idx + 1,
                    'title' => $item['title'],
                    'subtitle' => $item['subtitle'],
                    'type' => 'Menu',
                    'url' => $item['url'],
                ];
            });

            return response()->json($items);
        }

        $athletes = User::where('role', 'athlete')
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('username', 'like', "%{$query}%");
            })
            ->take(5) 
            ->get()
            ->map(function ($athlete) {
                return [
                    'id' => $athlete->id,
                    'title' => $athlete->name,
                    'subtitle' => $athlete->username . ' • ' . ($athlete->sport->name ?? 'No Sport'),
                    'type' => 'Athlete',
                    'url' => route('admin.athletes.show', $athlete->id), 
                ];
            });

        return response()->json($athletes);
    }
}