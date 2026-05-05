<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PharmacyController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\MedicineCategoryController;
use App\Http\Controllers\Api\Staff\OrderController as StaffOrderController;
use App\Http\Controllers\Api\Staff\MedicineController as StaffMedicineController;
use App\Http\Controllers\Api\Staff\AuditController as StaffAuditController;

/*
|--------------------------------------------------------------------------
| API Routes - ApoTrack Mobile
|--------------------------------------------------------------------------
*/

// --- PUBLIC ROUTES ---
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// --- PROTECTED ROUTES (Requires Auth & Active User) ---
Route::middleware(['auth:sanctum', 'active.user'])->group(function () {

    // Auth & Profile
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Catalog & Exploration (Moved to Protected for Security)
    Route::get('/pharmacies', [PharmacyController::class, 'index']);
    Route::get('/pharmacies/{id}', [PharmacyController::class, 'show']);
    Route::get('/medicines', [MedicineController::class, 'index']);
    Route::get('/medicines/{id}', [MedicineController::class, 'show']);
    Route::get('/categories', [MedicineCategoryController::class, 'index']);

    // Shared Features (Notifications)
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // --- CUSTOMER ROUTES (role:USER) ---
    Route::middleware('role:USER')->group(function () {
        // Address Management
        Route::apiResource('user/addresses', AddressController::class);

        // Order Management
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/history', [OrderController::class, 'history']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::get('/orders/{id}/tracking', [OrderController::class, 'tracking']);
        
        // Uploads
        Route::post('/orders/{id}/prescription', [OrderController::class, 'uploadPrescription']);
    });

    // --- PHARMACY STAFF ROUTES (role:STAFF|APOTEKER) ---
    Route::middleware('role:STAFF|APOTEKER')->prefix('staff')->group(function () {
        
        // Order Management & POS
        Route::get('/orders', [StaffOrderController::class, 'index']);
        Route::get('/orders/{id}', [StaffOrderController::class, 'show']);
        Route::patch('/orders/{id}/status', [StaffOrderController::class, 'updateStatus']);
        Route::post('/orders/verify', [StaffOrderController::class, 'verify']);
        Route::post('/pos/orders', [StaffOrderController::class, 'storePOS']);

        // Inventory Management
        Route::apiResource('medicines', StaffMedicineController::class);
        Route::post('/medicines/{id}/stock', [StaffMedicineController::class, 'updateStock']);

        // Audits & Logs
        Route::get('/audits', [StaffAuditController::class, 'index']);
    });
});
