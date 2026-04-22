<?php

use App\Http\Controllers\Apotek\DashboardController;
use App\Http\Controllers\Apotek\ProfileController;
use App\Http\Controllers\Apotek\StaffManagementController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('index'))->name('home');

Route::get('/waiting-room', fn() => Inertia::render('waiting-room'))
    ->name('waiting-room');

Route::prefix('auth')->name('auth.')->group(function () {
    Route::get('/login', [LoginController::class, 'index'])->name('login');
    Route::get('/register', [RegisterController::class, 'index'])->name('register');
    Route::get('/forgot-password', [ForgotPasswordController::class, 'index'])->name('forgot-password');
});


Route::prefix('apotek')
    ->name('apotek.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])
            ->name('dashboard');
        Route::get('/profile', [ProfileController::class, 'index'])
            ->name('profile');
        Route::get('/staff', [StaffManagementController::class, 'index'])
            ->name('staff');
    });
