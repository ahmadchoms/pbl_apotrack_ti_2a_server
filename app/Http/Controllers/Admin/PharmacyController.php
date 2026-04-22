<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PharmacyController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/pharmacies/index', [
            // [DATA]
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/pharmacies/new', [
            // [DATA]
        ]);
    }

    public function detail($id)
    {
        return Inertia::render('admin/pharmacies/detail', [
            // [DATA]
        ]);
    }
}
