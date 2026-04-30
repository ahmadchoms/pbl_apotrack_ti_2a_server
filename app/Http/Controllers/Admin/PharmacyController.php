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
        $pharmacy->load(['staffs.user'])
            ->loadCount([
                'orders as monthly_orders_count' => fn($q) => $q
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
            ]);

        return Inertia::render('admin/pharmacies/detail', [
            'pharmacy' => new PharmacyDetailResource($pharmacy),
        ]);
    }

    public function export()
    {
        $pharmacies = Pharmacy::all();
        $csvHeader = ['ID', 'Name', 'Address', 'Phone', 'License Number', 'Status', 'Rating', 'Created At'];
        
        $callback = function() use ($pharmacies, $csvHeader) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $csvHeader);

            foreach ($pharmacies as $pharmacy) {
                fputcsv($file, [
                    $pharmacy->id,
                    $pharmacy->name,
                    $pharmacy->address,
                    $pharmacy->phone,
                    $pharmacy->license_number,
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
