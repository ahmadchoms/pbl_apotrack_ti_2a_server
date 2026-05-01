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
use App\Enums\UserRole;
use Illuminate\Validation\Rules\Rule;

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
        $activityLogs = $this->staffService->getActivityLogs($pharmacyId);

        return Inertia::render('pharmacy/staff', [
            'staff' => PharmacyStaffResource::collection($staff),
            'activityLogs' => $activityLogs,
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
        $this->authorize('update', $staff);
        $this->staffService->update($staff, $request->validated());

        return redirect()->back()->with('success', 'Staff berhasil diperbarui');
    }

    public function destroy(PharmacyStaff $staff)
    {
        $this->authorize('update', $staff); // Usually delete also needs update permission
        $this->staffService->delete($staff);

        return redirect()->back()->with('success', 'Staff berhasil dihapus');
    }

    public function toggleStatus(PharmacyStaff $staff)
    {
        $this->authorize('toggleStatus', $staff);
        $this->staffService->toggleStatus($staff);

        return redirect()->back()->with('success', 'Status staff berhasil diperbarui');
    }

    public function generateInvitation(Request $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $url = $this->staffService->generateInvitationUrl($pharmacyId);

        return response()->json(['url' => $url]);
    }
}
