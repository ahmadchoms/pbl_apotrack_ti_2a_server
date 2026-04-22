<?php

use App\Http\Controllers\Apotek\DashboardController;
use App\Http\Controllers\Apotek\ObatController; // ← tambah ini
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
        Route::get('/', [DashboardController::class, 'index'])
            ->name('dashboard');
        Route::get('/profile', [ProfileController::class, 'index'])
            ->name('profile');
        
        Route::prefix('obat')->name('obat.')->group(function () {
            Route::get('/', [ObatController::class, 'index'])->name('index');
            Route::get('/tambah', [ObatController::class, 'create'])->name('create');
            Route::post('/tambah', [ObatController::class, 'store'])->name('store');
            Route::get('/{id}/edit', [ObatController::class, 'edit'])->name('edit');
            Route::put('/{id}/edit', [ObatController::class, 'update'])->name('update');
            Route::delete('/{id}', [ObatController::class, 'destroy'])->name('destroy');
        });
            
});
