<?php

namespace App\Http\Controllers\Apotek;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('apotek/orders/index', [
            // [DATA]
        ]);
    }

    public function new()
    {
        return Inertia::render('apotek/orders/new', [
            // [DATA]
        ]);
    }
}
