<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GymAttendance;
use App\Models\User;
use App\Models\Setting;
use App\Models\CoachPayout;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class GymAttendanceController extends Controller
{
    /**
     * Main page: calendar, today's status, recap.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        // Coach (non-gym-guard) should not access this page
        if ($user->role === 'coach' && !$user->is_gym_guard) {
            abort(403, 'Akses Ditolak.');
        }

        $month = $request->query('month', now()->month);
        $year = $request->query('year', now()->year);

        // Get attendances for the selected month
        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();

        $attendances = GymAttendance::with(['user'])
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->orderBy('date')
            ->orderBy('check_in_time')
            ->get();

        // Location settings
        $settings = Setting::pluck('value', 'key');
        $gymLocation = [
            'latitude' => $settings['gym_latitude'] ?? null,
            'longitude' => $settings['gym_longitude'] ?? null,
            'radius' => $settings['gym_radius_meters'] ?? 50,
        ];

        // Today's attendance for current user (if coach)
        $todayAttendance = null;
        if ($user->role === 'coach' && $user->is_gym_guard) {
            $todayAttendance = GymAttendance::where('user_id', $user->id)
                ->where('date', now()->toDateString())
                ->first();
        }

        // ─── RECAP DATA (for superadmin) ───
        $recapData = null;
        if ($user->role === 'superadmin') {
            $recapData = User::gymGuards()
                ->get()
                ->map(function ($guard) {
                    // Count unpaid completed attendances (both check-in and check-out done)
                    $unpaidAttendances = GymAttendance::where('user_id', $guard->id)
                        ->where('is_paid', false)
                        ->whereNotNull('check_in_time')
                        ->whereNotNull('check_out_time')
                        ->get();

                    $totalAttendances = GymAttendance::where('user_id', $guard->id)
                        ->whereNotNull('check_in_time')
                        ->whereNotNull('check_out_time')
                        ->count();

                    $guard->unpaid_shifts = $unpaidAttendances->count();
                    $guard->total_shifts = $totalAttendances;
                    $guard->unpaid_shift_list = $unpaidAttendances->map(function ($att) {
                        return [
                            'id' => $att->id,
                            'date' => $att->date->format('Y-m-d'),
                            'check_in_time' => $att->check_in_time?->format('H:i'),
                            'check_out_time' => $att->check_out_time?->format('H:i'),
                        ];
                    })->values();

                    $lastPayout = CoachPayout::where('user_id', $guard->id)
                        ->where('notes', 'like', '%gym%')
                        ->latest('paid_at')
                        ->first();

                    $guard->last_payout_amount = $lastPayout ? $lastPayout->amount : 0;
                    $guard->last_payout_date = $lastPayout ? $lastPayout->paid_at->format('Y-m-d') : null;

                    return $guard;
                });
        }

        return Inertia::render('Admin/GymAttendance/Index', [
            'attendances' => $attendances,
            'gymLocation' => $gymLocation,
            'todayAttendance' => $todayAttendance,
            'recapData' => $recapData,
            'currentMonth' => (int) $month,
            'currentYear' => (int) $year,
        ]);
    }

    // ─── CHECK-IN / CHECK-OUT ───

    private function haversineDistance($lat1, $lng1, $lat2, $lng2)
    {
        $earthRadius = 6371000; // meters

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    public function checkIn(Request $request)
    {
        $user = auth()->user();

        if (!$user->is_gym_guard) {
            abort(403, 'Akses Ditolak.');
        }

        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        // Check if already checked in today
        $today = now()->toDateString();
        $existing = GymAttendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if ($existing && $existing->check_in_time) {
            return redirect()->back()->withErrors(['error' => 'Anda sudah melakukan check-in hari ini.']);
        }

        // Verify GPS radius
        $settings = Setting::pluck('value', 'key');
        $gymLat = $settings['gym_latitude'] ?? null;
        $gymLng = $settings['gym_longitude'] ?? null;
        $gymRadius = (float) ($settings['gym_radius_meters'] ?? 50);

        if (!$gymLat || !$gymLng) {
            return redirect()->back()->withErrors(['error' => 'Lokasi gym belum diatur oleh admin.']);
        }

        $distance = $this->haversineDistance(
            $request->latitude, $request->longitude,
            (float) $gymLat, (float) $gymLng
        );

        if ($distance > $gymRadius) {
            return redirect()->back()->withErrors([
                'error' => 'Anda berada di luar radius gym. Jarak Anda: ' . round($distance) . 'm (Maks: ' . $gymRadius . 'm).'
            ]);
        }

        // Create attendance record
        GymAttendance::create([
            'user_id' => $user->id,
            'date' => $today,
            'check_in_time' => now(),
            'check_in_ip' => $request->ip(),
            'check_in_device' => substr($request->header('User-Agent'), 0, 255),
            'check_in_distance' => round($distance),
        ]);

        return redirect()->back()->with('message', 'Berhasil memulai tugas penjagaan gym!');
    }

    public function checkOut(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'notes' => 'required|string|max:1000',
        ]);

        $today = now()->toDateString();
        $attendance = GymAttendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if (!$attendance || !$attendance->check_in_time) {
            return redirect()->back()->withErrors(['error' => 'Anda belum melakukan check-in hari ini.']);
        }

        if ($attendance->check_out_time) {
            return redirect()->back()->withErrors(['error' => 'Anda sudah melakukan check-out hari ini.']);
        }

        // Verify GPS radius
        $settings = Setting::pluck('value', 'key');
        $gymLat = $settings['gym_latitude'] ?? null;
        $gymLng = $settings['gym_longitude'] ?? null;
        $gymRadius = (float) ($settings['gym_radius_meters'] ?? 50);

        if (!$gymLat || !$gymLng) {
            return redirect()->back()->withErrors(['error' => 'Lokasi gym belum diatur oleh admin.']);
        }

        $distance = $this->haversineDistance(
            $request->latitude, $request->longitude,
            (float) $gymLat, (float) $gymLng
        );

        if ($distance > $gymRadius) {
            return redirect()->back()->withErrors([
                'error' => 'Anda berada di luar radius gym. Jarak Anda: ' . round($distance) . 'm (Maks: ' . $gymRadius . 'm).'
            ]);
        }

        $attendance->update([
            'check_out_time' => now(),
            'check_out_ip' => $request->ip(),
            'check_out_device' => substr($request->header('User-Agent'), 0, 255),
            'check_out_distance' => round($distance),
            'notes' => $request->notes,
        ]);

        return redirect()->back()->with('message', 'Check-out berhasil! Terima kasih.');
    }

    // ─── DESTROY ATTENDANCE ───
    public function destroy(GymAttendance $attendance)
    {
        $user = auth()->user();

        if ($user->role !== 'superadmin' && $attendance->user_id !== $user->id) {
            abort(403, 'Anda hanya bisa menghapus absensi milik sendiri.');
        }

        $attendance->delete();

        return redirect()->back()->with('message', 'Riwayat absensi berhasil dihapus.');
    }

    // ─── LOCATION SETTINGS ───

    public function updateLocation(Request $request)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403);

        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'required|integer|min:10|max:1000',
        ]);

        $settings = [
            'gym_latitude' => $request->latitude,
            'gym_longitude' => $request->longitude,
            'gym_radius_meters' => $request->radius,
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return redirect()->back()->with('message', 'Lokasi gym berhasil diperbarui.');
    }

    // ─── PAYOUT (Rekap & Cairkan) ───

    public function payGuard(Request $request, User $user)
    {
        abort_if(auth()->user()->role !== 'superadmin', 403);

        // Mark all unpaid completed attendances as paid
        $unpaidCount = GymAttendance::where('user_id', $user->id)
            ->where('is_paid', false)
            ->whereNotNull('check_in_time')
            ->whereNotNull('check_out_time')
            ->count();

        if ($unpaidCount === 0) {
            return redirect()->back()->withErrors(['error' => 'Tidak ada absen jaga yang perlu dicairkan.']);
        }

        GymAttendance::where('user_id', $user->id)
            ->where('is_paid', false)
            ->whereNotNull('check_in_time')
            ->whereNotNull('check_out_time')
            ->update(['is_paid' => true]);

        // Record payout
        CoachPayout::create([
            'user_id' => $user->id,
            'amount' => 0, // Amount can be set manually or by config
            'paid_at' => now(),
            'notes' => "Pencairan gym guard: {$unpaidCount} kali jaga",
        ]);

        return redirect()->back()->with('message', "Berhasil mencairkan {$unpaidCount} hari jaga untuk {$user->name}. Counter di-reset.");
    }
}
