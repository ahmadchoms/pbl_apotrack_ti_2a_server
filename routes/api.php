<?php

use Illuminate\Support\Facades\Route;

// Endpoint: http://localhost:8000/api/status
Route::get('/status', function () {
    return response()->json([
        'project' => 'ApoTrack API',
        'version' => '1.0.0',
        'status' => 'Active',
        'database_connection' => 'Connected'
    ]);
});

// Endpoint untuk testing data obat (Dummy)
Route::get('/test-medicines', function () {
    return response()->json([
        [
            'id' => 1,
            'name' => 'Paracetamol 500mg',
            'category' => 'Obat Bebas',
            'price' => 5000
        ],
        [
            'id' => 2,
            'name' => 'Amoxicillin 500mg',
            'category' => 'Obat Keras',
            'price' => 12000
        ]
    ]);
});
