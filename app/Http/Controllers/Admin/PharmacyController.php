<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePharmacyRequest;
use App\Http\Requests\Admin\UpdatePharmacyRequest;
use App\Http\Resources\Admin\PharmacyDetailResource;
use App\Http\Resources\Admin\PharmacyResource;
use App\Models\Pharmacy;
use App\Models\User;
use App\Services\Admin\PharmacyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PharmacyController extends Controller
{
    public function __construct(
        protected PharmacyService $pharmacyService
    ) {}

    public function index(Request $request)
    {
        $pharmacies = $this->pharmacyService->list($request->only(['search', 'status']));

        return Inertia::render('admin/pharmacies/index', [
            'pharmacies' => PharmacyResource::collection($pharmacies),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/pharmacies/create', [
            'available_staff' => User::whereIn('role', ['PHARMACY_STAFF', 'APOTEKER'])
                ->select('id', 'username', 'email', 'role', 'avatar_url')
                ->get()
        ]);
    }

    public function store(StorePharmacyRequest $request)
    {
        $this->pharmacyService->store($request->validated());

        return redirect()->route('admin.pharmacies')
            ->with('success', 'Apotek berhasil ditambahkan');
    }

    public function edit(Pharmacy $pharmacy)
    {
        $pharmacy->load(['staffs.user', 'hours', 'images']);

        return Inertia::render('admin/pharmacies/edit', [
            'pharmacy' => new PharmacyResource($pharmacy),
            'available_staff' => User::whereIn('role', ['PHARMACY_STAFF', 'APOTEKER'])
                ->select('id', 'username', 'email', 'role', 'avatar_url')
                ->get()
        ]);
    }

    public function update(UpdatePharmacyRequest $request, Pharmacy $pharmacy)
    {
        $this->pharmacyService->update($pharmacy, $request->validated());

        return redirect()->route('admin.pharmacies')
            ->with('success', 'Apotek berhasil diperbarui');
    }

    public function destroy(Pharmacy $pharmacy)
    {
        $this->pharmacyService->delete($pharmacy);

        return redirect()->route('admin.pharmacies')
            ->with('success', 'Apotek berhasil dihapus');
    }

    public function detail(Pharmacy $pharmacy)
    {
        $pharmacy->load(['staffs.user']);

        return Inertia::render('admin/pharmacies/detail', [
            'pharmacy' => new PharmacyDetailResource($pharmacy),
        ]);
    }
}
