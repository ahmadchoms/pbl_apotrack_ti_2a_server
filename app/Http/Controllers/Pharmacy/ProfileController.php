<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('pharmacy/profile', [
            // [DATA]
        ]);
    }
}
