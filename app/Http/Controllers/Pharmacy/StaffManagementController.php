<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class StaffManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('pharmacy/staff', [
            // [DATA]
        ]);
    }
}
