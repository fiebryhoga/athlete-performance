<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Exercise;
use App\Models\Sport;
use App\Models\DpaCompensation;
use App\Models\TrainingGroup;
use App\Models\MealPlan;
use App\Models\SubscriptionPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class GlobalSearchController extends Controller
{
    private function safeRoute($name, $fallback = '/', $params = [])
    {
        if (Route::has($name)) {
            try {
                return route($name, $params);
            } catch (\Exception $e) {
                return url($fallback);
            }
        }
        return url($fallback);
    }

    public function __invoke(Request $request)
    {
        $query = trim($request->input('query', ''));

        if (!$query || strlen($query) < 1) {
            return response()->json([]);
        }

        $user = $request->user();
        $userRole = $user ? $user->role : 'athlete';
        $isAthlete = $userRole === 'athlete';
        $isSuperAdmin = $userRole === 'superadmin';
        $isCoach = $userRole === 'coach';

        $results = collect();
        $queryLower = strtolower($query);
        $queryWords = array_values(array_filter(explode(' ', $queryLower)));

        // ─── 1. ATHLETES / CLIENTS & EXPANDED SUB-MODULE SEARCH (COACH & ADMIN ONLY) ───
        if (!$isAthlete) {
            try {
                // Find matching athletes using full query OR individual name parts
                $usersQuery = User::with(['sport', 'subscriptionPackage'])
                    ->where(function ($q) use ($query, $queryWords) {
                        $q->where('name', 'like', "%{$query}%")
                          ->orWhere('username', 'like', "%{$query}%");
                        
                        foreach ($queryWords as $word) {
                            if (strlen($word) >= 2) {
                                $q->orWhere('name', 'like', "%{$word}%")
                                  ->orWhere('username', 'like', "%{$word}%");
                            }
                        }
                    });

                // STRICT COACH SCOPE: Coach only sees athletes they are assigned to
                if ($isCoach && $user) {
                    $coachId = $user->id;
                    $usersQuery->where('role', 'athlete')->where(function ($q) use ($coachId) {
                        $q->whereHas('coaches', function ($cq) use ($coachId) {
                            $cq->where('coach_id', $coachId);
                        })->orWhereHas('groups.coaches', function ($gq) use ($coachId) {
                            $gq->where('users.id', $coachId);
                        });
                    });
                }

                $matchedUsers = $usersQuery->orderByRaw("CASE WHEN role = 'athlete' THEN 1 ELSE 2 END")
                    ->take(3)
                    ->get();

                foreach ($matchedUsers as $u) {
                    $sportName = $u->sport->name ?? ($u->sport_category ?: null);
                    
                    if ($u->role === 'athlete') {
                        // 1. Primary Profile item
                        $subtitleParts = array_filter([$sportName, $u->gender ? ($u->gender === 'male' || $u->gender === 'L' ? 'Laki-laki' : 'Perempuan') : null, $u->age ? "{$u->age} thn" : null]);
                        $results->push([
                            'id' => 'user_profile_' . $u->id,
                            'title' => $u->name,
                            'subtitle' => 'Profil Fisik & Ringkasan' . ($subtitleParts ? ' • ' . implode(' • ', $subtitleParts) : ''),
                            'type' => 'Athlete',
                            'badge' => 'Profil Klien',
                            'url' => $this->safeRoute('admin.athletes.show', "/admin/athletes/{$u->id}", ['athlete' => $u->id]),
                        ]);

                        // 2. Comprehensive Sub-Modules for this specific client
                        $subModules = [
                            [
                                'id' => 'user_dpa_' . $u->id,
                                'title' => "{$u->name} - Analisis DPA",
                                'subtitle' => 'Kompensasi gerak & protokol latihan korektif',
                                'type' => 'DPA',
                                'badge' => 'DPA',
                                'module_keys' => ['dpa', 'posture', 'postur', 'kompensasi', 'korektif'],
                                'url' => $this->safeRoute('admin.athletes.dpa.show', "/admin/athletes/{$u->id}/dpa", ['user' => $u->id]),
                            ],
                            [
                                'id' => 'user_phv_' . $u->id,
                                'title' => "{$u->name} - Kalkulator PHV",
                                'subtitle' => 'Prediksi Peak Height Velocity & kematangan biologis',
                                'type' => 'PHV',
                                'badge' => 'PHV',
                                'module_keys' => ['phv', 'maturity', 'kematangan', 'biologis', 'pertumbuhan', 'tinggi'],
                                'url' => $this->safeRoute('admin.phv-calculator.show', "/admin/phv-calculator/{$u->id}", ['user' => $u->id]),
                            ],
                            [
                                'id' => 'user_comp_' . $u->id,
                                'title' => "{$u->name} - Komposisi Tubuh",
                                'subtitle' => 'Pengukuran body fat %, massa otot, BMR, & skinfold',
                                'type' => 'Composition',
                                'badge' => 'Komposisi',
                                'module_keys' => ['komposisi', 'tubuh', 'fat', 'body', 'bmr', 'berat', 'skinfold', 'lemak'],
                                'url' => $this->safeRoute('admin.composition-tests.show', "/admin/composition/{$u->id}", ['user' => $u->id]),
                            ],
                            [
                                'id' => 'user_wellness_' . $u->id,
                                'title' => "{$u->name} - Wellness & RPE",
                                'subtitle' => 'Monitoring kebugaran harian & beban latihan (AU)',
                                'type' => 'Wellness',
                                'badge' => 'Wellness',
                                'module_keys' => ['wellness', 'rpe', 'borg', 'au', 'beban', 'stres', 'kelelahan', 'pemulihan'],
                                'url' => $this->safeRoute('admin.wellness-rpe.athlete.show', "/admin/wellness-rpe/athlete/{$u->id}", ['user' => $u->id]),
                            ],
                            [
                                'id' => 'user_training_' . $u->id,
                                'title' => "{$u->name} - Program Latihan",
                                'subtitle' => 'Jadwal sesi latihan privat & log gerakan',
                                'type' => 'Training',
                                'badge' => 'Latihan',
                                'module_keys' => ['program', 'latihan', 'training', 'sesi', 'privat', 'workout', 'drill'],
                                'url' => $this->safeRoute('admin.individual-trainings.show', "/admin/individual-trainings/{$u->id}/show", ['user' => $u->id]),
                            ],
                            [
                                'id' => 'user_metrics_' . $u->id,
                                'title' => "{$u->name} - Pantauan Harian",
                                'subtitle' => 'Log RHR, SpO2, Vertical Jump, & Readiness',
                                'type' => 'DailyMetric',
                                'badge' => 'Pantauan',
                                'module_keys' => ['pantauan', 'harian', 'daily', 'metrics', 'rhr', 'spo2', 'readiness'],
                                'url' => $this->safeRoute('admin.daily-metrics.show', "/admin/daily-metrics/athlete/{$u->id}", ['user' => $u->id]),
                            ],
                            [
                                'id' => 'user_recovery_' . $u->id,
                                'title' => "{$u->name} - Recovery Strategi",
                                'subtitle' => 'Jadwal ice bath, massage, stretching, & pemulihan',
                                'type' => 'Recovery',
                                'badge' => 'Recovery',
                                'module_keys' => ['recovery', 'strategi', 'pemulihan', 'ice', 'bath', 'massage'],
                                'url' => $this->safeRoute('admin.recovery-strategies.show', "/admin/recovery-strategies/athlete/{$u->id}", ['user' => $u->id]),
                            ],
                            [
                                'id' => 'user_meal_' . $u->id,
                                'title' => "{$u->name} - Rencana Nutrisi",
                                'subtitle' => 'Target kalori, makronutrisi, & meal planner',
                                'type' => 'Meal',
                                'badge' => 'Nutrisi',
                                'module_keys' => ['nutrisi', 'meal', 'plan', 'makan', 'gizi', 'diet', 'kalori'],
                                'url' => $this->safeRoute('admin.meal-plans.show', "/admin/meal-plans/{$u->id}", ['user' => $u->id]),
                            ],
                        ];

                        // Check if user specifically typed a module keyword (e.g. "ethan dpa", "deasy nutrisi")
                        $matchedSpecificModules = [];
                        foreach ($subModules as $sm) {
                            foreach ($queryWords as $qw) {
                                if (in_array($qw, $sm['module_keys'])) {
                                    $matchedSpecificModules[] = $sm;
                                    break;
                                }
                            }
                        }

                        if (!empty($matchedSpecificModules)) {
                            // Put specifically requested client submodules
                            foreach ($matchedSpecificModules as $msm) {
                                unset($msm['module_keys']);
                                $results->push($msm);
                            }
                        } else {
                            // If just athlete name searched, display top core modules for immediate jump
                            foreach (array_slice($subModules, 0, 5) as $sm) {
                                unset($sm['module_keys']);
                                $results->push($sm);
                            }
                        }

                    } elseif ($u->role === 'coach') {
                        $results->push([
                            'id' => 'user_' . $u->id,
                            'title' => $u->name,
                            'subtitle' => 'Pelatih • Username: ' . $u->username,
                            'type' => 'Athlete',
                            'badge' => 'Pelatih',
                            'url' => $this->safeRoute('admin.users.index', '/admin/users'),
                        ]);
                    } else {
                        $results->push([
                            'id' => 'user_' . $u->id,
                            'title' => $u->name,
                            'subtitle' => 'Administrator Sistem',
                            'type' => 'Athlete',
                            'badge' => 'Superadmin',
                            'url' => $this->safeRoute('admin.users.index', '/admin/users'),
                        ]);
                    }
                }
            } catch (\Exception $e) {
                \Log::error('Global search error users: ' . $e->getMessage());
            }
        }

        // ─── 2. ROLE-BASED NAVIGATION MENU SEARCH ───
        $dpaAthleteUrl = $user ? $this->safeRoute('admin.athletes.dpa.show', "/admin/athletes/{$user->id}/dpa", ['user' => $user->id]) : $this->safeRoute('admin.athletes.dpa.index', '/admin/athletes/dpa');

        $menuList = [
            [
                'title' => 'Dashboard Overview',
                'subtitle' => 'Ringkasan performa, agenda, & metrik utama',
                'roles' => ['superadmin', 'coach', 'athlete'],
                'keywords' => 'dashboard overview home utama statistik performa agenda',
                'url' => $this->safeRoute('dashboard', '/dashboard'),
            ],
            [
                'title' => 'Profil Fisik & Evaluasi',
                'subtitle' => 'Hasil tes performa, antropometri, & grafik radar',
                'roles' => ['athlete'],
                'keywords' => 'profil fisik profiling evaluasi radar kemampuan performa atlet',
                'url' => $this->safeRoute('athlete.profiling', '/profiling'),
            ],
            [
                'title' => 'Program Latihan & Sesi',
                'subtitle' => 'Kalender latihan, log gerakan, & feedback sesi',
                'roles' => ['superadmin', 'coach', 'athlete'],
                'keywords' => 'program latihan individual training sesi privat jadwal workout drill',
                'url' => $this->safeRoute('admin.individual-trainings.index', '/admin/individual-trainings'),
            ],
            [
                'title' => 'Tes & Evaluasi Fisik',
                'subtitle' => 'Pencatatan & analisis baterai tes performa',
                'roles' => ['superadmin', 'coach', 'athlete'],
                'keywords' => 'tes fisik performance test sprint agility vo2max vertical jump endurance kecepatan',
                'url' => $this->safeRoute('admin.performance.index', '/performance/history'),
            ],
            [
                'title' => 'Komposisi Tubuh & Antropometri',
                'subtitle' => 'Pengukuran skinfold, body fat %, massa otot, & BMR',
                'roles' => ['superadmin', 'coach', 'athlete'],
                'keywords' => 'komposisi tubuh body composition fat bmr berat tinggi skinfold antropometri massa lemak',
                'url' => $this->safeRoute('admin.composition-tests.index', '/admin/composition'),
            ],
            [
                'title' => 'Analisis DPA (Dynamic Posture)',
                'subtitle' => 'Pemeriksaan kompensasi gerak & latihan korektif',
                'roles' => ['superadmin', 'coach', 'athlete'],
                'keywords' => 'dpa dynamic posture assessment kompensasi postur otot overactive underactive korektif gerak',
                'url' => $isAthlete ? $dpaAthleteUrl : $this->safeRoute('admin.athletes.dpa.index', '/admin/athletes/dpa'),
            ],
            [
                'title' => 'Rencana Nutrisi & Meal Planner',
                'subtitle' => 'Target kalori, makronutrisi, & menu makan harian',
                'roles' => ['superadmin', 'coach', 'athlete'],
                'keywords' => 'rencana makan meal plan nutrisi gizi kalori protein karbohidrat lemak diet jadwal makan',
                'url' => $this->safeRoute('admin.meal-plans.index', '/admin/meal-plans'),
            ],
            [
                'title' => 'Wellness & Beban Latihan (RPE)',
                'subtitle' => 'Monitoring skor kebugaran, RPE Borg CR-10, & AU',
                'roles' => ['superadmin', 'coach', 'athlete'],
                'keywords' => 'wellness rpe borg load au skor pemulihan kelelahan stres tidur nyeri otot kebugaran',
                'url' => $this->safeRoute('admin.wellness-rpe.index', '/admin/wellness-rpe'),
            ],
            [
                'title' => 'Recovery Strategi & Protokol',
                'subtitle' => 'Jadwal ice bath, massage, stretching, & pemulihan',
                'roles' => ['superadmin', 'coach', 'athlete'],
                'keywords' => 'recovery strategi pemulihan ice bath massage pijat active recovery tidur rest',
                'url' => $this->safeRoute('admin.recovery-strategies.index', '/admin/recovery-strategies'),
            ],
            [
                'title' => 'Pantauan Harian & Kesiapan Fisik',
                'subtitle' => 'Pencatatan RHR, SpO2, Vertical Jump, & Readiness score',
                'roles' => ['superadmin', 'coach', 'athlete'],
                'keywords' => 'pantauan harian daily metrics rhr spo2 vertical jump readiness kesiapan detak jantung',
                'url' => $this->safeRoute('admin.daily-metrics.index', '/admin/daily-metrics'),
            ],
            [
                'title' => 'Analisis Beban & Rasio ACWR',
                'subtitle' => 'Acute:Chronic Workload Ratio, monotoni, & strain beban',
                'roles' => ['superadmin', 'coach', 'athlete'],
                'keywords' => 'analisis beban load analysis acwr ratio acute chronic strain monotony beban kerja',
                'url' => $this->safeRoute('admin.load-analysis.index', '/admin/load-analysis'),
            ],

            // ─── ADMIN / COACH EXCLUSIVE MENUS ───
            [
                'title' => 'Kalkulator PHV & Maturitas',
                'subtitle' => 'Prediksi Peak Height Velocity & kematangan biologis atlet',
                'roles' => ['superadmin', 'coach'],
                'keywords' => 'kalkulator phv peak height velocity maturitas umur biologis pertumbuhan',
                'url' => $this->safeRoute('admin.phv-calculator.index', '/admin/phv-calculator'),
            ],
            [
                'title' => 'Daftar Klien & Profiling Atlet',
                'subtitle' => 'Manajemen data profil, cabor, kontak, & rekap data atlet',
                'roles' => ['superadmin', 'coach'],
                'keywords' => 'profiling atlet klien player user data master profil kontak client daftar',
                'url' => $this->safeRoute('admin.athletes.index', '/admin/athletes'),
            ],
            [
                'title' => 'Kategori Cabang Olahraga',
                'subtitle' => 'Master data cabor & spesialisasi posisi atlet',
                'roles' => ['superadmin', 'coach'],
                'keywords' => 'kategori olahraga sports sepak bola basket bulutangkis renang voli cabor',
                'url' => $this->safeRoute('admin.sports.index', '/admin/sports'),
            ],
            [
                'title' => 'Master Exercise & Database Latihan',
                'subtitle' => 'Bank gerakan latihan, video, fase korektif, & kategori',
                'roles' => ['superadmin', 'coach'],
                'keywords' => 'master exercise latihan gerakan squat bench press deadlift gym drill bank',
                'url' => $this->safeRoute('admin.exercises.index', '/admin/exercises'),
            ],
            [
                'title' => 'Master DPA Compensations',
                'subtitle' => 'Database kompensasi gerak DPA & 4 fase korektif',
                'roles' => ['superadmin', 'coach'],
                'keywords' => 'dpa compensations kompensasi database otot smr stretching isometric',
                'url' => $this->safeRoute('admin.dpa-compensations.index', '/admin/dpa-compensations'),
            ],
            [
                'title' => 'Manajemen Paket Langganan',
                'subtitle' => 'Pengaturan paket sesi, harga, kuota latihan, & membership',
                'roles' => ['superadmin'],
                'keywords' => 'manajemen paket packages langganan sesi kuota harga membership biaya',
                'url' => $this->safeRoute('admin.packages.index', '/admin/packages'),
            ],
            [
                'title' => 'Manajemen Pengguna & Hak Akses',
                'subtitle' => 'Kelola akun admin, pelatih (coach), dan staf',
                'roles' => ['superadmin', 'coach'],
                'keywords' => 'manajemen pengguna users akun user admin coach pelatih hak akses permission',
                'url' => $this->safeRoute('admin.users.index', '/admin/users'),
            ],
            [
                'title' => 'Rekap Sesi & Kehadiran Latihan',
                'subtitle' => 'Riwayat penggunaan sesi dan log aktivitas latihan',
                'roles' => ['superadmin'],
                'keywords' => 'rekap sesi sessions kehadiran logbook absensi riwayat kuota laporan gaji',
                'url' => $this->safeRoute('admin.reports.sessions', '/admin/reports/sessions'),
            ],
            [
                'title' => 'Latihan Grup & Tim',
                'subtitle' => 'Manajemen sesi latihan bersama grup & tim',
                'roles' => ['superadmin', 'coach'],
                'keywords' => 'group trainings latihan grup tim bersama skuad',
                'url' => $this->safeRoute('admin.groups.index', '/admin/groups'),
            ],
            [
                'title' => 'Absensi & Presensi Gym',
                'subtitle' => 'Pencatatan kedatangan & check-in member gym',
                'roles' => ($isSuperAdmin || ($user && $user->is_gym_guard)) ? ['superadmin', 'coach'] : ['superadmin'],
                'keywords' => 'absensi gym attendance check in presensi kehadiran scanner jaga',
                'url' => $this->safeRoute('admin.gym-attendance.index', '/admin/gym-attendance'),
            ],
            [
                'title' => 'Pengaturan Sistem & Profil Klub',
                'subtitle' => 'Konfigurasi nama organisasi, logo, dan preferensi aplikasi',
                'roles' => ['superadmin'],
                'keywords' => 'pengaturan sistem settings logo profil nama klub sistem organisasi',
                'url' => $this->safeRoute('admin.settings.index', '/admin/settings'),
            ],
        ];

        $matchedMenus = collect($menuList)
            ->filter(function ($item) use ($userRole) {
                return in_array($userRole, $item['roles']);
            })
            ->filter(function ($item) use ($queryWords) {
                $searchString = strtolower($item['title'] . ' ' . $item['subtitle'] . ' ' . $item['keywords']);
                foreach ($queryWords as $kw) {
                    if ($kw && strpos($searchString, $kw) !== false) {
                        return true;
                    }
                }
                return false;
            })
            ->take(3)
            ->map(function ($item) {
                return [
                    'id' => 'menu_' . md5($item['title']),
                    'title' => $item['title'],
                    'subtitle' => $item['subtitle'],
                    'type' => 'Menu',
                    'badge' => 'Fitur',
                    'url' => $item['url'],
                ];
            });

        $results = $results->merge($matchedMenus);

        // If user is Athlete, only return their menus and their own meal plan
        if ($isAthlete) {
            try {
                if ($user) {
                    $myMealPlans = MealPlan::where('user_id', $user->id)
                        ->where(function ($q) use ($query) {
                            $q->where('recommendation', 'like', "%{$query}%")
                              ->orWhere('notes', 'like', "%{$query}%");
                        })
                        ->take(2)
                        ->get()
                        ->map(function ($mp) {
                            return [
                                'id' => 'meal_' . $mp->id,
                                'title' => 'Meal Plan Saya',
                                'subtitle' => 'Rencana Nutrisi' . ($mp->recommendation ? ' • ' . $mp->recommendation : ''),
                                'type' => 'Meal',
                                'badge' => 'Nutrisi',
                                'url' => route('admin.meal-plans.index'),
                            ];
                        });

                    $results = $results->merge($myMealPlans);
                }
            } catch (\Exception $e) {}

            return response()->json($results->values());
        }

        // ─── 3. MASTER EXERCISES SEARCH (COACH & ADMIN) ───
        try {
            $exercises = Exercise::with('category')
                ->where(function ($q) use ($queryWords) {
                    foreach ($queryWords as $word) {
                        $q->where(function ($sq) use ($word) {
                            $sq->where('name', 'like', "%{$word}%")
                               ->orWhere('description', 'like', "%{$word}%")
                               ->orWhereHas('category', function ($cq) use ($word) {
                                   $cq->where('name', 'like', "%{$word}%");
                               });
                        });
                    }
                })
                ->take(2)
                ->get()
                ->map(function ($ex) {
                    $catName = $ex->category->name ?? 'Umum';
                    return [
                        'id' => 'exercise_' . $ex->id,
                        'title' => $ex->name,
                        'subtitle' => 'Latihan • Kategori: ' . $catName,
                        'type' => 'Exercise',
                        'badge' => 'Exercise',
                        'url' => $this->safeRoute('admin.exercises.index', '/admin/exercises'),
                    ];
                });

            $results = $results->merge($exercises);
        } catch (\Exception $e) {}

        // ─── 4. DPA COMPENSATIONS SEARCH (COACH & ADMIN) ───
        try {
            $compensations = DpaCompensation::where(function ($q) use ($queryWords) {
                    foreach ($queryWords as $word) {
                        $q->where(function ($sq) use ($word) {
                            $sq->where('name', 'like', "%{$word}%")
                               ->orWhere('category', 'like', "%{$word}%")
                               ->orWhere('overactive_muscles', 'like', "%{$word}%")
                               ->orWhere('underactive_muscles', 'like', "%{$word}%")
                               ->orWhere('possible_injuries', 'like', "%{$word}%");
                        });
                    }
                })
                ->take(2)
                ->get()
                ->map(function ($comp) {
                    return [
                        'id' => 'dpa_' . $comp->id,
                        'title' => $comp->name,
                        'subtitle' => 'Kompensasi DPA • ' . $comp->category,
                        'type' => 'DPA',
                        'badge' => 'DPA',
                        'url' => $this->safeRoute('admin.dpa-compensations.index', '/admin/dpa-compensations'),
                    ];
                });

            $results = $results->merge($compensations);
        } catch (\Exception $e) {}

        // ─── 5. CABANG OLAHRAGA (SPORTS) ───
        try {
            $sports = Sport::where('name', 'like', "%{$query}%")
                ->take(2)
                ->get()
                ->map(function ($sport) {
                    return [
                        'id' => 'sport_' . $sport->id,
                        'title' => $sport->name,
                        'subtitle' => 'Kategori Cabang Olahraga',
                        'type' => 'Sport',
                        'badge' => 'Cabor',
                        'url' => $this->safeRoute('admin.sports.index', '/admin/sports'),
                    ];
                });

            $results = $results->merge($sports);
        } catch (\Exception $e) {}

        // ─── 6. TRAINING GROUPS (SCOPED FOR COACH) ───
        try {
            $groupsQuery = TrainingGroup::where(function ($gq) use ($query) {
                $gq->where('name', 'like', "%{$query}%")
                   ->orWhere('description', 'like', "%{$query}%");
            });

            if ($isCoach && $user) {
                $coachId = $user->id;
                $groupsQuery->whereHas('coaches', function ($cq) use ($coachId) {
                    $cq->where('users.id', $coachId);
                });
            }

            $groups = $groupsQuery->take(2)
                ->get()
                ->map(function ($group) {
                    return [
                        'id' => 'group_' . $group->id,
                        'title' => $group->name,
                        'subtitle' => 'Grup Latihan' . ($group->description ? ' • ' . $group->description : ''),
                        'type' => 'Group',
                        'badge' => 'Grup',
                        'url' => $this->safeRoute('admin.group-trainings.show', "/admin/group-trainings/{$group->id}/show", ['group' => $group->id]),
                    ];
                });

            $results = $results->merge($groups);
        } catch (\Exception $e) {
            \Log::error('Global search error groups: ' . $e->getMessage());
        }

        // ─── 7. MEAL PLANS (SCOPED FOR COACH) ───
        try {
            $mealPlansQuery = MealPlan::with('user')
                ->where(function ($mq) use ($query) {
                    $mq->where('recommendation', 'like', "%{$query}%")
                       ->orWhere('notes', 'like', "%{$query}%")
                       ->orWhereHas('user', function ($uq) use ($query) {
                           $uq->where('name', 'like', "%{$query}%");
                       });
                });

            if ($isCoach && $user) {
                $coachId = $user->id;
                $mealPlansQuery->where(function ($mq) use ($coachId) {
                    $mq->where('coach_id', $coachId)
                       ->orWhereHas('user.coaches', function ($cq) use ($coachId) {
                           $cq->where('coach_id', $coachId);
                       })
                       ->orWhereHas('user.groups.coaches', function ($gq) use ($coachId) {
                           $gq->where('users.id', $coachId);
                       });
                });
            }

            $mealPlans = $mealPlansQuery->take(2)
                ->get()
                ->map(function ($mp) {
                    $clientName = $mp->user->name ?? 'Semua Atlet';
                    return [
                        'id' => 'meal_' . $mp->id,
                        'title' => 'Meal Plan: ' . $clientName,
                        'subtitle' => 'Rencana Nutrisi' . ($mp->recommendation ? ' • ' . $mp->recommendation : ''),
                        'type' => 'Meal',
                        'badge' => 'Nutrisi',
                        'url' => $this->safeRoute('admin.meal-plans.show', "/admin/meal-plans/{$mp->id}", ['user' => $mp->user_id ?? $mp->id]),
                    ];
                });

            $results = $results->merge($mealPlans);
        } catch (\Exception $e) {
            \Log::error('Global search error meal_plans: ' . $e->getMessage());
        }

        // ─── 8. SUBSCRIPTION PACKAGES (SUPERADMIN ONLY) ───
        if ($isSuperAdmin) {
            try {
                $packages = SubscriptionPackage::where('name', 'like', "%{$query}%")
                    ->orWhere('package_type', 'like', "%{$query}%")
                    ->take(2)
                    ->get()
                    ->map(function ($pkg) {
                        return [
                            'id' => 'pkg_' . $pkg->id,
                            'title' => $pkg->name,
                            'subtitle' => 'Paket Langganan • ' . ($pkg->session_count ? "{$pkg->session_count} Sesi" : 'Membership'),
                            'type' => 'Package',
                            'badge' => 'Paket',
                            'url' => $this->safeRoute('admin.packages.index', '/admin/packages'),
                        ];
                    });

                $results = $results->merge($packages);
            } catch (\Exception $e) {}
        }

        return response()->json($results->values());
    }
}