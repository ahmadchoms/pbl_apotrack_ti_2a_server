<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\PharmacyController;
use App\Http\Controllers\Apotek\DashboardController as ApotekDashboardController;
use App\Http\Controllers\Apotek\OrderController;
use App\Http\Controllers\Apotek\ProfileController;
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
        Route::get('/', [ApotekDashboardController::class, 'index'])
            ->name('dashboard');
        Route::get('/profile', [ProfileController::class, 'index'])
            ->name('profile');
        Route::get('/orders', [OrderController::class, 'index'])
            ->name('orders');
        Route::get('/orders/new', [OrderController::class, 'new'])
            ->name('orders.new');
    });

Route::prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])
            ->name('dashboard');
        Route::get('/pharmacies', [PharmacyController::class, 'index'])
            ->name('pharmacies');
    });
