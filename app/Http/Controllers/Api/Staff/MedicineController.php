<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Services\Pharmacy\MedicineService;
use App\Http\Resources\Pharmacy\MedicineResource;
use App\Http\Requests\Api\Staff\StoreMedicineRequest;
use App\Http\Requests\Api\Staff\UpdateMedicineRequest;
use App\Http\Requests\Api\Staff\UpdateMedicineStockRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedicineController extends BaseApiController
{
    public function __construct(
        protected MedicineService $medicineService
    ) {}

    /**
     * Display a listing of the medicines for the pharmacy.
     */
    public function index(Request $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $medicines = $this->medicineService->list($pharmacyId, $request->all());

        return $this->successResponse(MedicineResource::collection($medicines), 'Daftar obat berhasil diambil');
    }

    /**
     * Store a newly created medicine in storage.
     */
    public function store(StoreMedicineRequest $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        
        $medicine = $this->medicineService->store($pharmacyId, $request->validated());

        return $this->successResponse(new MedicineResource($medicine->refresh()->loadMissing(['category', 'form', 'type', 'unit', 'batches'])->loadSum(['batches as total_active_stock' => function ($sq) {
            $sq->where('expired_date', '>=', now()->startOfDay());
        }], 'stock')), 'Obat berhasil ditambahkan', 201);
    }

    /**
     * Display the specified medicine.
     */
    public function show(Request $request, $id)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $medicine = Medicine::with(['category', 'form', 'type', 'unit', 'batches'])
            ->where('pharmacy_id', $pharmacyId)
            ->findOrFail($id);

        return $this->successResponse(new MedicineResource($medicine->loadSum(['batches as total_active_stock' => function ($sq) {
            $sq->where('expired_date', '>=', now()->startOfDay());
        }], 'stock')), 'Detail obat berhasil diambil');
    }

    /**
     * Update the specified medicine in storage.
     */
    public function update(UpdateMedicineRequest $request, $id)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $medicine = Medicine::where('pharmacy_id', $pharmacyId)->findOrFail($id);

        $updatedMedicine = $this->medicineService->update($medicine, $request->validated());

        return $this->successResponse(new MedicineResource($updatedMedicine->refresh()->loadMissing(['category', 'form', 'type', 'unit', 'batches'])->loadSum(['batches as total_active_stock' => function ($sq) {
            $sq->where('expired_date', '>=', now()->startOfDay());
        }], 'stock')), 'Data obat berhasil diperbarui');
    }

    /**
     * Remove the specified medicine from storage.
     */
    public function destroy(Request $request, $id)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $medicine = Medicine::where('pharmacy_id', $pharmacyId)->findOrFail($id);
        
        $medicine->delete();

        return $this->successResponse(null, 'Obat berhasil dihapus');
    }

    /**
     * Update stock for a specific medicine (Batch Management).
     */
    public function updateStock(UpdateMedicineStockRequest $request, $id)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $medicine = Medicine::where('pharmacy_id', $pharmacyId)->findOrFail($id);

        try {
            if ($request->type === 'IN') {
                $batch = $this->medicineService->addBatch($medicine->id, $request->validated(), $request->user()->id);
            } elseif ($request->type === 'ADJUSTMENT') {
                $batch = $this->medicineService->adjustStock($request->batch_id, $request->validated(), $request->user()->id);
            } else {
                return $this->errorResponse('Metode pengurangan stok (OUT) belum diimplementasikan secara langsung di endpoint ini.', 400);
            }

            return $this->successResponse($batch, 'Stok berhasil diperbarui');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
