<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\WellnessRpeController;
use Illuminate\Http\Request;

Route::post('/test-store', function (Request $request) {
    $controller = app(WellnessRpeController::class);
    return $controller->store($request);
});
