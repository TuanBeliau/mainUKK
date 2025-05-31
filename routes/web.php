<?php

use App\Http\Controllers\Auth\AuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers;
use Illuminate\Support\Facades\Log;

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');