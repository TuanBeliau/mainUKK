<?php

use Illuminate\Http\Request;
use Inertia\Indertia;
use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::post('/login', [Controllers\Auth\AuthenticationController::class, 'login']);
Route::post('/register', [Controllers\Auth\AuthenticationController::class, 'register']);
Route::get('/data/siswa/register', [Controllers\Auth\AuthenticationController::class, 'getRegister']);

Route::middleware(['auth:sanctum', 'role:siswa|guru', 'isVerified'])->group(function () {
    Route::post('/logout', [Controllers\Auth\AuthenticationController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'role:siswa', 'isVerified'])->group(function () {
    Route::apiResource('siswa',Controllers\Siswa\DashboardSiswaController::class);
    Route::apiResource('data_pkl',Controllers\Siswa\PKLController::class);
    Route::put('/siswa/update/{id}', [Controllers\Siswa\SiswaProfileController::class, 'update']);
});

Route::middleware(['auth:sanctum', 'role:guru', 'isVerified'])->group(function () {
    Route::apiResource('guru',Controllers\Guru\DashboardGuruController::class);
    Route::put('/guru/update/{id}', [Controllers\Guru\DashboardGuruController::class, 'update']);
});