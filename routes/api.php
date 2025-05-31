<?php

use Illuminate\Http\Request;
use Inertia\Indertia;
use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::post('/login', [Controllers\Auth\AuthenticationController::class, 'login']);
Route::post('/register', [Controllers\Auth\AuthenticationController::class, 'register']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('siswa',Controllers\Siswa\DashboardController::class);
    Route::apiResource('data_pkl',Controllers\Siswa\PKLController::class);
    Route::post('/logout', [Controllers\Auth\AuthenticationController::class, 'logout']);
    Route::put('/siswa/update/{id}', [Controllers\Siswa\SiswaProfileController::class, 'update']);
});