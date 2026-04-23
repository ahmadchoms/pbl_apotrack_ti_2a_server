<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('pharmacy/orders/index', [
            // [DATA]
        ]);
    }

    public function create()
    {
        return Inertia::render('pharmacy/orders/create', [
            // [DATA]
        ]);
    }
}
