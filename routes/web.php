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
    MedicineController,
    ReportController
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
            Route::get('/register/staff', 'staffRegister')->name('register.staff');
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
                Route::patch('/', 'update')->name('update');
                Route::post('/password', 'updatePassword')->name('updatePassword');
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
                Route::get('/export', 'export')->name('export');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{user}/edit', 'edit')->name('edit');
                Route::put('/{user}', 'update')->name('update');
                Route::delete('/{user}', 'destroy')->name('destroy');
                Route::patch('/{user}/reset-password', 'resetPassword')->name('reset-password');
            });

        /*
        | Pharmacies
        */
        Route::prefix('pharmacies')
            ->name('pharmacies.')
            ->controller(PharmacyController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/export', 'export')->name('export');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{pharmacy}', 'detail')->name('show');
                Route::get('/{pharmacy}/edit', 'edit')->name('edit');
                Route::put('/{pharmacy}', 'update')->name('update');
                Route::delete('/{pharmacy}', 'destroy')->name('destroy');
                Route::patch('/{pharmacy}/verify-legality', 'verifyLegality')->name('verify-legality');
                Route::patch('/{pharmacy}/toggle-suspend', 'toggleSuspend')->name('toggle-suspend');
            });
    });

/*
|--------------------------------------------------------------------------
| Pharmacy Routes
|--------------------------------------------------------------------------
*/

Route::prefix('pharmacy')
    ->name('pharmacy.')
    ->middleware(['auth', 'role:APOTEKER', 'verified.pharmacy'])
    ->group(function () {

        // Dashboard
        Route::get('/', [PharmacyDashboardController::class, 'index'])
            ->name('dashboard');

        /*
        | Profile
        */
        Route::prefix('profile')
            ->name('profile.')
            ->controller(PharmacyProfileController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::patch('/', 'update')->name('update');
                Route::post('/password', 'updatePassword')->name('updatePassword');
                Route::post('/hours', 'updateHours')->name('updateHours');
                Route::delete('/', 'delete')->name('delete');
                Route::get('/audit-logs', 'auditLogs')->name('audit-logs');
            });

        /*
        | Staff (Only APOTEKER)
        */
        Route::prefix('staff')
            ->name('staff.')
            ->middleware('role:APOTEKER')
            ->controller(StaffController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('/', 'store')->name('store');
                Route::patch('/{staff}/toggle', 'toggleStatus')->name('toggle-status');
                Route::post('/invitation', 'generateInvitation')->name('invitation');
                Route::put('/{staff}', 'update')->name('update');
                Route::delete('/{staff}', 'destroy')->name('destroy');
            });

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
                Route::post('/', 'store')->name('store');
                Route::get('/{id}', 'show')->name('show');
                Route::patch('/{id}/status', 'updateStatus')->name('status.update');
                Route::patch('/{id}/reject', 'reject')->name('reject');
                Route::patch('/prescriptions/{id}/validate', 'validatePrescription')->name('prescription.validate');
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
                Route::get('/{medicine}', 'show')->name('show');
                Route::get('/{medicine}/edit', 'edit')->name('edit');
                Route::put('/{medicine}', 'update')->name('update');
                Route::delete('/{medicine}', 'destroy')->name('destroy');
                Route::post('/{medicine}/batches', 'addBatch')->name('batches.store');
                Route::patch('/batches/{batchId}/adjust', 'adjustStock')->name('batches.adjust');
            });

        /*
        | Reports
        */
        Route::prefix('reports')
            ->name('reports.')
            ->controller(ReportController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/sales/export', 'exportSales')->name('sales.export');
                Route::get('/stock/export', 'exportStock')->name('stock.export');
            });
    });
