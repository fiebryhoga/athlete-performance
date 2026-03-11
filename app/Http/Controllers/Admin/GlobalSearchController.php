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

        // Cari Atlet berdasarkan Nama atau ID
        $athletes = User::where('role', 'athlete')
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('athlete_id', 'like', "%{$query}%");
            })
            ->take(5) // Batasi 5 hasil saja biar cepat
            ->get()
            ->map(function ($athlete) {
                return [
                    'id' => $athlete->id,
                    'title' => $athlete->name,
                    'subtitle' => $athlete->athlete_id . ' • ' . ($athlete->sport->name ?? 'No Sport'),
                    'type' => 'Athlete',
                    'url' => route('admin.athletes.show', $athlete->id), // Link ke profil
                ];
            });

        return response()->json($athletes);
    }
}