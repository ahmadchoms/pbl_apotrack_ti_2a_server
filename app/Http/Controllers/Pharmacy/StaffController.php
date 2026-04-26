<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pharmacy\StoreStaffRequest;
use App\Http\Requests\Pharmacy\UpdateStaffRequest;
use App\Http\Resources\Pharmacy\PharmacyStaffResource;
use App\Models\PharmacyStaff;
use App\Services\Pharmacy\PharmacyStaffService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function __construct(
        protected PharmacyStaffService $staffService
    ) {}

    public function index(Request $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff?->pharmacy_id;
        $filters = $request->only(['search', 'status']);

        $staff = $this->staffService->list($pharmacyId, $filters);

        return Inertia::render('pharmacy/staff', [
            'staff' => PharmacyStaffResource::collection($staff),
            'filters' => $filters
        ]);
    }

    public function store(StoreStaffRequest $request)
    {
        $this->staffService->store(
            $request->user()->pharmacyStaff->pharmacy_id,
            $request->validated()
        );

        return redirect()->back()->with('success', 'Staff berhasil ditambahkan');
    }

    public function update(UpdateStaffRequest $request, PharmacyStaff $staff)
    {
        $this->staffService->update($staff, $request->validated());

        return redirect()->back()->with('success', 'Staff berhasil diperbarui');
    }

    public function destroy(PharmacyStaff $staff)
    {
        $this->staffService->delete($staff);

        return redirect()->back()->with('success', 'Staff berhasil dihapus');
    }
}
