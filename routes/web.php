<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\SportController;
use App\Http\Controllers\Admin\AthleteController;
use App\Http\Controllers\Admin\BenchmarkController;
use App\Http\Controllers\Admin\PerformanceController;
use App\Http\Controllers\Admin\AdminManagementController;
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
    
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth:sanctum', config('jetstream.auth_session'), 'verified'])->group(function () {

    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    
    
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/global-search', GlobalSearchController::class)->name('global.search');

    
    
    Route::get('/performance/history', [PerformanceController::class, 'index'])->name('admin.performance.index');
    Route::get('/performance/analysis/{performanceTest}', [PerformanceController::class, 'show'])->name('admin.performance.show');


    
    Route::middleware(['role:admin,coach'])->group(function () {
        
        
        Route::resource('/admin/users', UserController::class)->names('admin.users');
        Route::resource('/admin/manage-admins', AdminManagementController::class)
            ->parameters(['manage-admins' => 'user'])
            ->except(['create', 'edit', 'show']);

        
        Route::get('/admin/sports', [SportController::class, 'index'])->name('admin.sports.index');
        Route::post('/admin/sports', [SportController::class, 'store'])->name('admin.sports.store');
        Route::get('/admin/sports/{sport}', [SportController::class, 'show'])->name('admin.sports.show');
        Route::delete('/admin/sports/{sport}', [SportController::class, 'destroy'])->name('admin.sports.destroy');
        Route::post('/admin/sports/{sport}/tests', [SportController::class, 'storeTestItem'])->name('admin.sports.tests.store');
        Route::delete('/admin/tests/{testItem}', [SportController::class, 'destroyTestItem'])->name('admin.tests.destroy');
        Route::put('/admin/tests/{testItem}', [SportController::class, 'updateTestItem'])->name('admin.tests.update');

        Route::get('/admin/benchmarks', [BenchmarkController::class, 'index'])->name('admin.benchmarks.index');
        Route::get('/admin/benchmarks/{sport}', [BenchmarkController::class, 'edit'])->name('admin.benchmarks.edit');
        Route::put('/admin/benchmarks/{sport}', [BenchmarkController::class, 'update'])->name('admin.benchmarks.update');

        
        
        Route::get('/admin/performance/create', [PerformanceController::class, 'create'])->name('admin.performance.create');
        Route::post('/admin/performance', [PerformanceController::class, 'store'])->name('admin.performance.store');
        Route::get('/admin/performance/{performanceTest}/input', [PerformanceController::class, 'edit'])->name('admin.performance.edit');
        Route::put('/admin/performance/{performanceTest}', [PerformanceController::class, 'update'])->name('admin.performance.update');
        Route::delete('/admin/performance/{performanceTest}', [PerformanceController::class, 'destroy'])->name('admin.performance.destroy');

        Route::resource('/admin/athletes', AthleteController::class)->names([
            'index'   => 'admin.athletes.index',
            'store'   => 'admin.athletes.store',
            'create'  => 'admin.athletes.create',
            'show'    => 'admin.athletes.show',
            'update'  => 'admin.athletes.update',
            'destroy' => 'admin.athletes.destroy',
            'edit'    => 'admin.athletes.edit',
        ]);

        Route::get('/admin/settings', [SettingController::class, 'index'])->name('admin.settings.index');
        Route::post('/admin/settings', [SettingController::class, 'update'])->name('admin.settings.update');
    });
});

require __DIR__.'/auth.php';
