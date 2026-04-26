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

Route::get('/', fn() => Inertia::render('index'))->name('home');

Route::get('/waiting-room', fn() => Inertia::render('waiting-room'))
    ->name('waiting-room');


/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')
    ->name('auth.')
    ->controller(LoginController::class)
    ->group(function () {
        Route::get('/login', 'index')->name('login');
    });

Route::prefix('auth')
    ->name('auth.')
    ->group(function () {
        Route::get('/register', [RegisterController::class, 'index'])->name('register');
        Route::get('/forgot-password', [ForgotPasswordController::class, 'index'])->name('forgot-password');
    });


/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->name('admin.')
    // ->middleware(['auth', 'role:admin']) // aktifkan nanti
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
    // ->middleware(['auth', 'role:pharmacy'])
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
        | Staff
        */
        Route::get('/staff', [StaffController::class, 'index'])
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
