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

    public function searchAvailableStaff(Request $request)
    {
        $search = $request->input('search');
        
        $users = User::whereIn('role', ['PHARMACY_STAFF', 'APOTEKER'])
            ->whereDoesntHave('pharmacyStaff')
            ->when($search, function($q) use ($search) {
                $q->where(function($sub) use ($search) {
                    $sub->where('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->select('id', 'username', 'email', 'role', 'avatar_url')
            ->limit(10)
            ->get();

        return response()->json($users);
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Pharmacy::class);
        $pharmacies = $this->pharmacyService->list($request->only(['search', 'status']));

        return Inertia::render('admin/pharmacies/index', [
            'pharmacies' => PharmacyResource::collection($pharmacies),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Pharmacy::class);
        return Inertia::render('admin/pharmacies/create', [
            'available_staff' => User::whereIn('role', ['PHARMACY_STAFF', 'APOTEKER'])
                ->select('id', 'username', 'email', 'role', 'avatar_url')
                ->get()
        ]);
    }

    public function store(StorePharmacyRequest $request)
    {
        $this->authorize('create', Pharmacy::class);
        $this->pharmacyService->store($request->validated());

        return redirect()->route('admin.pharmacies.index')
            ->with('success', 'Apotek berhasil ditambahkan');
    }

    public function edit(Pharmacy $pharmacy)
    {
        $this->authorize('update', $pharmacy);
        $pharmacy->load(['legality', 'staffs.user', 'operatingHours']);

        return Inertia::render('admin/pharmacies/edit', [
            'pharmacy' => new PharmacyResource($pharmacy),
            'available_staff' => User::whereIn('role', ['PHARMACY_STAFF', 'APOTEKER'])
                ->select('id', 'username', 'email', 'role', 'avatar_url')
                ->get()
        ]);
    }

    public function update(UpdatePharmacyRequest $request, Pharmacy $pharmacy)
    {
        $this->authorize('update', $pharmacy);
        $this->pharmacyService->update($pharmacy, $request->validated());

        return redirect()->route('admin.pharmacies.index')
            ->with('success', 'Apotek berhasil diperbarui');
    }

    public function destroy(Pharmacy $pharmacy)
    {
        $this->authorize('delete', $pharmacy);
        $this->pharmacyService->delete($pharmacy);

        return redirect()->route('admin.pharmacies.index')
            ->with('success', 'Apotek berhasil dihapus');
    }

    public function detail(Pharmacy $pharmacy)
    {
        $this->authorize('view', $pharmacy);
        $pharmacy = $this->pharmacyService->getDetail($pharmacy->id);

        return Inertia::render('admin/pharmacies/detail', [
            'pharmacy' => new PharmacyDetailResource($pharmacy),
        ]);
    }

    public function verifyLegality(Request $request, Pharmacy $pharmacy)
    {
        $this->authorize('update', $pharmacy);
        $request->validate([
            'status' => 'required|in:APPROVED,REJECTED',
            'note' => 'required_if:status,REJECTED|nullable|string'
        ]);

        $this->pharmacyService->verifyLegality($pharmacy, $request->status, $request->note);

        return redirect()->back()->with('success', 'Verifikasi legalitas berhasil diperbarui');
    }

    public function toggleSuspend(Pharmacy $pharmacy)
    {
        $this->authorize('update', $pharmacy);
        $this->pharmacyService->toggleSuspend($pharmacy);

        return redirect()->back()->with('success', 'Status suspensi apotek berhasil diubah');
    }

    public function export()
    {
        $this->authorize('viewAny', Pharmacy::class);
        $pharmacies = Pharmacy::with('legality')->get();
        $csvHeader = ['ID', 'Name', 'Address', 'Phone', 'SIA Number', 'Status', 'Rating', 'Created At'];

        $callback = function () use ($pharmacies, $csvHeader) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $csvHeader);

            foreach ($pharmacies as $pharmacy) {
                fputcsv($file, [
                    $pharmacy->id,
                    $pharmacy->name,
                    $pharmacy->address,
                    $pharmacy->phone,
                    $pharmacy->legality?->sia_number,
                    $pharmacy->verification_status,
                    $pharmacy->rating,
                    $pharmacy->created_at
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=pharmacies_export_" . now()->format('YmdHis') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ]);
    }
}
