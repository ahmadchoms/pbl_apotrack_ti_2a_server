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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Public Routes ---
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Catalog Exploration
Route::get('/pharmacies', [PharmacyController::class, 'index']);
Route::get('/pharmacies/{id}', [PharmacyController::class, 'show']);
Route::get('/medicines', [MedicineController::class, 'index']);
Route::get('/medicines/{id}', [MedicineController::class, 'show']);
Route::get('/categories', [MedicineCategoryController::class, 'index']);

// --- Protected Routes (Sanctum) ---
Route::middleware(['auth:sanctum', 'active.user'])->group(function () {
    
    // Auth & Profile
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // --- Customer Specific (Role: USER) ---
    Route::middleware('role:USER')->group(function () {
        
        // Addresses Management
        Route::apiResource('user/addresses', AddressController::class);
        
        // Orders (Customer Side)
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        
        // Uploads for Orders
        Route::post('/orders/{id}/prescription', [OrderController::class, 'uploadPrescription']);
        
        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    });

    // --- Pharmacy Staff Specific (Role: STAFF|APOTEKER) ---
    Route::middleware('role:STAFF|APOTEKER')->group(function () {
        
        Route::prefix('staff')->group(function () {
            // Orders Management
            Route::get('/orders', [StaffOrderController::class, 'index']);
            Route::patch('/orders/{id}/status', [StaffOrderController::class, 'updateStatus']);
            
            // Verification (QR/Code)
            Route::post('/orders/verify', [StaffOrderController::class, 'verify']);
        });
    });
});
