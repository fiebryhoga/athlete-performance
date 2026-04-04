<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompositionTest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompositionTestController extends Controller
{
    public function create()
    {
        // PERBAIKAN: Ganti 'dob' menjadi 'age' sesuai tabel users
        $athletes = User::where('role', 'athlete')->get(['id', 'name', 'gender', 'weight', 'height', 'age']);

        return Inertia::render('Admin/CompositionTests/Create', [
            'athletes' => $athletes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'age' => 'required|numeric',
            'weight' => 'required|numeric',
            'height' => 'required|numeric',
        ]);

        // 1. Simpan data Composition Test
        $composition = CompositionTest::create($request->all());

        // 2. Update Data Profil Atlet
        $user = User::find($request->user_id);
        $user->update([
            'weight' => $request->weight,
            'height' => $request->height,
            'age'    => $request->age // PERBAIKAN: Umur di profil juga ikut diperbarui
        ]);

        return redirect()->back()->with('message', 'Data Body Composition & Profil Atlet berhasil diperbarui!');
    }
}