<?php

namespace App\Http\Controllers\Apotek;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    public function index()
    {
        return Inertia::render('apotek/medicines', [
            // [DATA]
        ]);
    }
}
