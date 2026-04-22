<?php

namespace App\Http\Controllers\Apotek;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class StaffManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('apotek/staff-management', [
            // [DATA]
        ]);
    }
}