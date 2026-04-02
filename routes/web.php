<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\SportController;
use App\Http\Controllers\Admin\AthleteController;
use App\Http\Controllers\Admin\BenchmarkController;
use App\Http\Controllers\Admin\PerformanceController;
use App\Http\Controllers\Admin\AdminManagementController;
use App\Http\Controllers\Admin\DailyMetricController;
use App\Http\Controllers\Admin\GlobalSearchController;
use App\Http\Controllers\Admin\SettingController;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::prefix('setup')->group(function () {
    Route::get('/migrate', function () {
        try {
            Artisan::call('migrate', ['--force' => true]); 
            return '<h1>Migrasi Berhasil!</h1><br>' . nl2br(Artisan::output());
        } catch (\Exception $e) {
            return '<h1>Error:</h1> ' . $e->getMessage();
        }
    });

    Route::get('/storage-link', function () {
        try {
            Artisan::call('storage:link');
            return '<h1>Storage Link Berhasil Dibuat!</h1><br>' . nl2br(Artisan::output());
        } catch (\Exception $e) {
            return '<h1>Error:</h1> ' . $e->getMessage();
        }
    });

    Route::get('/clear-cache', function () {
        try {
            Artisan::call('optimize:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');
            return '<h1>Cache Berhasil Dibersihkan!</h1>';
        } catch (\Exception $e) {
            return '<h1>Error:</h1> ' . $e->getMessage();
        }
    });

    Route::get('/optimize', function () {
        try {
            Artisan::call('config:cache');
            Artisan::call('route:cache');
            Artisan::call('view:cache');
            return '<h1>Optimasi Berhasil!</h1>';
        } catch (\Exception $e) {
            return '<h1>Error:</h1> ' . $e->getMessage();
        }
    });
    
    Route::get('/seed', function () {
        try {
            Artisan::call('db:seed', ['--force' => true]);
            return '<h1>Seeding Berhasil!</h1><br>' . nl2br(Artisan::output());
        } catch (\Exception $e) {
            return '<h1>Error:</h1> ' . $e->getMessage();
        }
    });
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/global-search', GlobalSearchController::class)->name('global.search');

    // =========================================================
    // FITUR YANG BISA DIAKSES OLEH SEMUA ROLE (ADMIN, COACH, ATHLETE)
    // =========================================================
    
    // Performance History (Sudah diproteksi di Controllernya)
    Route::get('/performance/history', [PerformanceController::class, 'index'])->name('admin.performance.index');
    Route::get('/performance/analysis/{performanceTest}', [PerformanceController::class, 'show'])->name('admin.performance.show');

    // === GRUP AKSES: ADMIN, COACH, & ATHLETE ===
    Route::middleware(['role:admin,coach,athlete'])->group(function () {
        
        // 1. DAILY MONITORING ROUTES (Sekarang Athlete bisa akses)
        Route::post('/admin/daily-metrics/set-start-date/{user}', [\App\Http\Controllers\Admin\DailyMetricController::class, 'setStartDate'])->name('admin.daily-metrics.set-start-date');
        Route::get('/admin/daily-metrics/athlete/{user}', [\App\Http\Controllers\Admin\DailyMetricController::class, 'show'])->name('admin.daily-metrics.show');
        Route::resource('/admin/daily-metrics', \App\Http\Controllers\Admin\DailyMetricController::class)
            ->names('admin.daily-metrics')
            ->except(['show']);

        // 2. TRAINING LOADS ROUTES (Sekarang Athlete bisa akses)
        Route::get('/admin/training-loads', [\App\Http\Controllers\Admin\TrainingLoadController::class, 'index'])->name('admin.training-loads.index');
        Route::get('/admin/training-loads/athlete/{user}', [\App\Http\Controllers\Admin\TrainingLoadController::class, 'show'])->name('admin.training-loads.show');
        Route::post('/admin/training-loads/store', [\App\Http\Controllers\Admin\TrainingLoadController::class, 'store'])->name('admin.training-loads.store');
        
    });


    // =========================================================
    // FITUR EKSKLUSIF YANG HANYA BISA DIAKSES ADMIN & COACH
    // =========================================================
    Route::middleware(['role:admin,coach'])->group(function () {
        
        // Manajemen Admin / Users
        Route::resource('/admin/users', UserController::class)->names('admin.users');
        Route::resource('/admin/manage-admins', AdminManagementController::class)
            ->parameters(['manage-admins' => 'user'])
            ->except(['create', 'edit', 'show']);

        // Sports & Kategori
        Route::get('/admin/sports', [SportController::class, 'index'])->name('admin.sports.index');
        Route::post('/admin/sports', [SportController::class, 'store'])->name('admin.sports.store');
        Route::get('/admin/sports/{sport}', [SportController::class, 'show'])->name('admin.sports.show');
        Route::delete('/admin/sports/{sport}', [SportController::class, 'destroy'])->name('admin.sports.destroy');
        Route::post('/admin/sports/{sport}/tests', [SportController::class, 'storeTestItem'])->name('admin.sports.tests.store');
        Route::delete('/admin/tests/{testItem}', [SportController::class, 'destroyTestItem'])->name('admin.tests.destroy');
        Route::put('/admin/tests/{testItem}', [SportController::class, 'updateTestItem'])->name('admin.tests.update');

        // Benchmarks
        Route::get('/admin/benchmarks', [BenchmarkController::class, 'index'])->name('admin.benchmarks.index');
        Route::get('/admin/benchmarks/{sport}', [BenchmarkController::class, 'edit'])->name('admin.benchmarks.edit');
        Route::put('/admin/benchmarks/{sport}', [BenchmarkController::class, 'update'])->name('admin.benchmarks.update');

        // Performance Input Data
        Route::get('/admin/performance/create', [PerformanceController::class, 'create'])->name('admin.performance.create');
        Route::post('/admin/performance', [PerformanceController::class, 'store'])->name('admin.performance.store');
        Route::get('/admin/performance/{performanceTest}/input', [PerformanceController::class, 'edit'])->name('admin.performance.edit');
        Route::put('/admin/performance/{performanceTest}', [PerformanceController::class, 'update'])->name('admin.performance.update');
        Route::delete('/admin/performance/{performanceTest}', [PerformanceController::class, 'destroy'])->name('admin.performance.destroy');

        // Athlete Data Management
        Route::resource('/admin/athletes', AthleteController::class)->names([
            'index'   => 'admin.athletes.index',
            'store'   => 'admin.athletes.store',
            'create'  => 'admin.athletes.create',
            'show'    => 'admin.athletes.show',
            'update'  => 'admin.athletes.update',
            'destroy' => 'admin.athletes.destroy',
            'edit'    => 'admin.athletes.edit',
        ]);

        // Configuration & Settings
        Route::get('/admin/settings', [SettingController::class, 'index'])->name('admin.settings.index');
        Route::post('/admin/settings', [SettingController::class, 'update'])->name('admin.settings.update');
    });
});

require __DIR__.'/auth.php';