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
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\DailyMetricController;
use App\Http\Controllers\Admin\GlobalSearchController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\IndividualTrainingController;
use App\Http\Controllers\Admin\TrainingLogController;
use App\Http\Controllers\Admin\CompositionTestController;
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

    
    
    
    
    
    Route::get('/performance/history', [PerformanceController::class, 'index'])->name('admin.performance.index');
    Route::get('/performance/analysis/{performanceTest}', [PerformanceController::class, 'show'])->name('admin.performance.show');

    
    Route::middleware(['role:admin,coach,athlete'])->group(function () {
        
        
        Route::post('/admin/daily-metrics/set-start-date/{user}', [\App\Http\Controllers\Admin\DailyMetricController::class, 'setStartDate'])->name('admin.daily-metrics.set-start-date');
        Route::get('/admin/daily-metrics/athlete/{user}', [\App\Http\Controllers\Admin\DailyMetricController::class, 'show'])->name('admin.daily-metrics.show');
        Route::resource('/admin/daily-metrics', \App\Http\Controllers\Admin\DailyMetricController::class)
            ->names('admin.daily-metrics')
            ->except(['show']);

        Route::get('/admin/wellness-rpe', [\App\Http\Controllers\Admin\WellnessRpeController::class, 'index'])->name('admin.wellness-rpe.index');
        Route::post('/admin/wellness-rpe/update-start-date', [\App\Http\Controllers\Admin\WellnessRpeController::class, 'updateStartDate'])->name('admin.wellness-rpe.updateStartDate');
        Route::get('/admin/wellness-rpe/session-form', [\App\Http\Controllers\Admin\WellnessRpeController::class, 'sessionForm'])->name('admin.wellness-rpe.session-form');
        Route::post('/admin/wellness-rpe/session', [\App\Http\Controllers\Admin\WellnessRpeController::class, 'storeSession'])->name('admin.wellness-rpe.store-session');
        Route::get('/admin/wellness-rpe/{date}', [\App\Http\Controllers\Admin\WellnessRpeController::class, 'show'])->name('admin.wellness-rpe.show');
        Route::post('/admin/wellness-rpe/weekly-data', [\App\Http\Controllers\Admin\WellnessRpeController::class, 'getWeeklyData'])->name('admin.wellness-rpe.weekly-data');
        Route::post('/admin/wellness-rpe/export-pdf-daily/{date}', [\App\Http\Controllers\Admin\WellnessRpeController::class, 'exportDailyPdf'])->name('admin.wellness-rpe.export-pdf-daily');
        Route::post('/admin/wellness-rpe/export-excel/{date}', [\App\Http\Controllers\Admin\WellnessRpeController::class, 'exportExcel'])->name('admin.wellness-rpe.export-excel');
        Route::post('/admin/wellness-rpe/store', [\App\Http\Controllers\Admin\WellnessRpeController::class, 'store'])->name('admin.wellness-rpe.store');
        Route::post('/admin/wellness-rpe/export-pdf/{userId}', [\App\Http\Controllers\Admin\WellnessRpeController::class, 'exportPdf'])->name('admin.wellness-rpe.export-pdf');

        Route::get('/admin/individual-trainings', [\App\Http\Controllers\Admin\IndividualTrainingController::class, 'index'])->name('admin.individual-trainings.index');
        Route::get('/admin/individual-trainings/{user}/show', [\App\Http\Controllers\Admin\IndividualTrainingController::class, 'showAthleteTrainings'])->name('admin.individual-trainings.show');
        Route::get('/admin/individual-trainings/{user}/session/create', [\App\Http\Controllers\Admin\IndividualTrainingController::class, 'createSession'])->name('admin.individual-trainings.session.create');
        Route::post('/admin/individual-trainings/{user}/session', [\App\Http\Controllers\Admin\IndividualTrainingController::class, 'storeSession'])->name('admin.individual-trainings.session.store');
        Route::delete('/admin/individual-trainings/session/{training}', [\App\Http\Controllers\Admin\IndividualTrainingController::class, 'destroySession'])->name('admin.individual-trainings.session.destroy');

        Route::get('composition-tests/create', [CompositionTestController::class, 'create'])->name('admin.composition-tests.create');
        Route::post('composition-tests', [CompositionTestController::class, 'store'])->name('admin.composition-tests.store');
        Route::get('/admin/composition', [\App\Http\Controllers\Admin\CompositionTestController::class, 'index'])->name('admin.composition-tests.index');

        Route::post('/admin/composition', [\App\Http\Controllers\Admin\CompositionTestController::class, 'store'])->name('admin.composition-tests.store');
        Route::delete('/admin/composition/{compositionTest}', [\App\Http\Controllers\Admin\CompositionTestController::class, 'destroy'])->name('admin.composition-tests.destroy');
        
        Route::post('/admin/composition/benchmarks', [\App\Http\Controllers\Admin\CompositionTestController::class, 'saveBenchmarks'])->name('admin.composition-tests.save-benchmarks');
        Route::get('/admin/composition/{user}', [\App\Http\Controllers\Admin\CompositionTestController::class, 'show'])->name('admin.composition-tests.show');

        Route::post('/admin/athletes/{user}/gallery', [App\Http\Controllers\Admin\AthleteController::class, 'storeGallery'])->name('admin.athletes.gallery.store');
Route::delete('/admin/gallery/{gallery}', [App\Http\Controllers\Admin\AthleteController::class, 'destroyGallery'])->name('admin.athletes.gallery.destroy');
Route::put('/admin/gallery/{gallery}', [App\Http\Controllers\Admin\AthleteController::class, 'updateGallery'])->name('admin.athletes.gallery.update');
        
        
    });


    
    
    
    Route::middleware(['role:superadmin,coach'])->group(function () {
        
        
        Route::resource('/admin/users', UserManagementController::class)->names('admin.users')->middleware('role:superadmin');

        
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

        

        
        Route::get('/admin/settings', [SettingController::class, 'index'])->name('admin.settings.index')->middleware('role:superadmin');
        Route::post('/admin/settings', [SettingController::class, 'update'])->name('admin.settings.update')->middleware('role:superadmin');

        // Master Exercises
        Route::get('/admin/exercises', [\App\Http\Controllers\Admin\ExerciseController::class, 'index'])->name('admin.exercises.index');
        Route::get('/admin/exercises/create', [\App\Http\Controllers\Admin\ExerciseController::class, 'create'])->name('admin.exercises.create');
        Route::get('/admin/exercises/bulk-create', [\App\Http\Controllers\Admin\ExerciseController::class, 'bulkCreate'])->name('admin.exercises.bulk-create');
        Route::post('/admin/exercises/bulk', [\App\Http\Controllers\Admin\ExerciseController::class, 'bulkStore'])->name('admin.exercises.bulk-store');
        Route::post('/admin/exercises', [\App\Http\Controllers\Admin\ExerciseController::class, 'store'])->name('admin.exercises.store');
        Route::get('/admin/exercises/{exercise}/edit', [\App\Http\Controllers\Admin\ExerciseController::class, 'edit'])->name('admin.exercises.edit');
        Route::post('/admin/exercises/{exercise}', [\App\Http\Controllers\Admin\ExerciseController::class, 'update'])->name('admin.exercises.update');
        Route::delete('/admin/exercises/{exercise}', [\App\Http\Controllers\Admin\ExerciseController::class, 'destroy'])->name('admin.exercises.destroy');
        Route::delete('/admin/exercises-bulk/destroy', [\App\Http\Controllers\Admin\ExerciseController::class, 'bulkDestroy'])->name('admin.exercises.bulk-destroy');
        Route::post('/admin/exercises-bulk/category', [\App\Http\Controllers\Admin\ExerciseController::class, 'bulkAssignCategory'])->name('admin.exercises.bulk-assign-category');
        
        Route::post('/admin/exercise-categories', [\App\Http\Controllers\Admin\ExerciseController::class, 'storeCategory'])->name('admin.exercise-categories.store');
        Route::put('/admin/exercise-categories/{exerciseCategory}', [\App\Http\Controllers\Admin\ExerciseController::class, 'updateCategory'])->name('admin.exercise-categories.update');
        Route::delete('/admin/exercise-categories/{exerciseCategory}', [\App\Http\Controllers\Admin\ExerciseController::class, 'destroyCategory'])->name('admin.exercise-categories.destroy');

        Route::get('/admin/exercise-packages/create', [\App\Http\Controllers\Admin\ExercisePackageController::class, 'create'])->name('admin.exercise-packages.create');
        Route::post('/admin/exercise-packages', [\App\Http\Controllers\Admin\ExercisePackageController::class, 'store'])->name('admin.exercise-packages.store');
        Route::get('/admin/exercise-packages/{exercisePackage}/edit', [\App\Http\Controllers\Admin\ExercisePackageController::class, 'edit'])->name('admin.exercise-packages.edit');
        Route::put('/admin/exercise-packages/{exercisePackage}', [\App\Http\Controllers\Admin\ExercisePackageController::class, 'update'])->name('admin.exercise-packages.update');
        Route::delete('/admin/exercise-packages/{exercisePackage}', [\App\Http\Controllers\Admin\ExercisePackageController::class, 'destroy'])->name('admin.exercise-packages.destroy');
    });
});

require __DIR__.'/auth.php';
