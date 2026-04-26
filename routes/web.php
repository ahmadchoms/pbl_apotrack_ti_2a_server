<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ForgotPasswordController;

use App\Http\Controllers\Admin\{
    DashboardController as AdminDashboardController,
    ProfileController as AdminProfileController,
    PharmacyController,
    UserController
};

use App\Http\Controllers\Pharmacy\{
    DashboardController as PharmacyDashboardController,
    ProfileController as PharmacyProfileController,
    StaffController,
    OrderController,
    MedicineController
};

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\WaitingRoomController;

Route::get('/', fn() => Inertia::render('index'))->name('home');

Route::get('/waiting-room', [WaitingRoomController::class, 'index'])
    ->middleware('auth')
    ->name('waiting-room');

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')
    ->name('auth.')
    ->group(function () {
        Route::controller(LoginController::class)->group(function () {
            Route::get('/login', 'index')->name('login');
            Route::post('/login', 'store')->name('login.store');
            Route::post('/logout', 'destroy')->name('logout');
        });

        Route::controller(RegisterController::class)->group(function () {
            Route::get('/register', 'index')->name('register');
            Route::post('/register', 'store')->name('register.store');
        });

        Route::controller(ForgotPasswordController::class)->group(function () {
            Route::get('/forgot-password', 'index')->name('forgot-password');
            Route::post('/forgot-password', 'store')->name('forgot-password.store');
        });
    });

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'role:SUPER_ADMIN'])
    ->group(function () {

        // Dashboard
        Route::get('/', [AdminDashboardController::class, 'index'])
            ->name('dashboard');

        /*
        | Profile
        */
        Route::prefix('profile')
            ->name('profile.')
            ->controller(AdminProfileController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/audit-history', 'auditHistory')->name('audit-history');
            });

        /*
        | Users
        */
        Route::prefix('users')
            ->name('users.')
            ->controller(UserController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::get('/{id}/edit', 'edit')->name('edit');
            });

        /*
        | Pharmacies
        */
        Route::prefix('pharmacies')
            ->name('pharmacies.')
            ->controller(PharmacyController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{id}', 'detail')->name('show');
                Route::get('/{id}/edit', 'edit')->name('edit');
                Route::put('/{id}', 'update')->name('update');
                Route::delete('/{id}', 'destroy')->name('destroy');
            });
    });

/*
|--------------------------------------------------------------------------
| Pharmacy Routes
|--------------------------------------------------------------------------
*/

Route::prefix('pharmacy')
    ->name('pharmacy.')
    ->middleware(['auth', 'role:APOTEKER,STAFF'])
    ->group(function () {

        // Dashboard
        Route::get('/', [PharmacyDashboardController::class, 'index'])
            ->name('dashboard');

        /*
        | Profile
        */
        Route::get('/profile', [PharmacyProfileController::class, 'index'])
            ->name('profile');

        /*
        | Staff (Only APOTEKER)
        */
        Route::get('/staff', [StaffController::class, 'index'])
            ->middleware('role:APOTEKER')
            ->name('staff');

        /*
        | Orders
        */
        Route::prefix('orders')
            ->name('orders.')
            ->controller(OrderController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/list', 'list')->name('list');
                Route::get('/pos', 'pos')->name('pos');
            });

        /*
        | Medicines
        */
        Route::prefix('medicines')
            ->name('medicines.')
            ->controller(MedicineController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{id}/edit', 'edit')->name('edit');
                Route::put('/{id}', 'update')->name('update');
                Route::delete('/{id}', 'destroy')->name('destroy');
            });
    });
