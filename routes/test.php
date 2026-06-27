<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\WellnessRpeController;
use Illuminate\Http\Request;

Route::get('/test-weekly', function () {
    $request = new Request(['date' => '2026-06-27']);
    $controller = app(WellnessRpeController::class);
    return $controller->getWeeklyData($request);
});
