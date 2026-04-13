<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('index');
});

Route::get('/auth/login', function () {
    return Inertia::render('auth/login');
});
