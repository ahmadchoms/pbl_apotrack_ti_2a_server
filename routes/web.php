<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\PharmacyController;
use App\Http\Controllers\Pharmacy\DashboardController as PharmacyDashboardController;
use App\Http\Controllers\Pharmacy\OrderController;
use App\Http\Controllers\Pharmacy\MedicineController;
use App\Http\Controllers\Pharmacy\ProfileController;
use App\Http\Controllers\Pharmacy\StaffController;
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


Route::prefix('pharmacy')
    ->name('pharmacy.')
    ->group(function () {
        Route::get('/', [PharmacyDashboardController::class, 'index'])
            ->name('dashboard');
        Route::get('/profile', [ProfileController::class, 'index'])
            ->name('profile');
        Route::get('/staff', [StaffController::class, 'index'])
            ->name('staff');
        Route::get('/orders', [OrderController::class, 'index'])
            ->name('orders');
        Route::get('/orders/list', [OrderController::class, 'list'])
            ->name('orders.list');
        Route::get('/orders/pos', [OrderController::class, 'pos'])
            ->name('orders.pos');
        Route::get('/orders/create', [OrderController::class, 'create'])
            ->name('orders.create');
        Route::prefix('medicines')->name('medicines.')->group(function () {
            Route::get('/', [MedicineController::class, 'index'])->name('index');
            Route::get('/new', [MedicineController::class, 'create'])->name('create');
            Route::post('/new', [MedicineController::class, 'store'])->name('store');
            Route::get('/{id}/edit', [MedicineController::class, 'edit'])->name('edit');
            Route::put('/{id}/edit', [MedicineController::class, 'update'])->name('update');
            Route::delete('/{id}', [MedicineController::class, 'destroy'])->name('destroy');
        });
    });

Route::prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])
            ->name('dashboard');
        Route::get('/pharmacies', [PharmacyController::class, 'index'])
            ->name('pharmacies');
    });
