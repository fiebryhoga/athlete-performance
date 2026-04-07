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

        
        $athletes = User::where('role', 'athlete')
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('athlete_id', 'like', "%{$query}%");
            })
            ->take(5) 
            ->get()
            ->map(function ($athlete) {
                return [
                    'id' => $athlete->id,
                    'title' => $athlete->name,
                    'subtitle' => $athlete->athlete_id . ' • ' . ($athlete->sport->name ?? 'No Sport'),
                    'type' => 'Athlete',
                    'url' => route('admin.athletes.show', $athlete->id), 
                ];
            });

        return response()->json($athletes);
    }
}