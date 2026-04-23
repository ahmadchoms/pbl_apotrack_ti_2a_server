<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    public function index()
    {
        return Inertia::render('pharmacy/medicine/index');
    }

    public function create()
    {
        return Inertia::render('pharmacy/medicine/create');
    }

    public function store(Request $request) {}

    public function edit($id)
    {
        return Inertia::render('pharmacy/medicine/edit', ['id' => $id]);
    }

    public function update(Request $request, $id) {}

    public function destroy($id) {}
}
