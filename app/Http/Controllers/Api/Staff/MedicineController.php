<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Services\Pharmacy\MedicineService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedicineController extends Controller
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

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar obat berhasil diambil',
            'data' => $medicines->items(),
            'meta' => [
                'current_page' => $medicines->currentPage(),
                'last_page' => $medicines->lastPage(),
                'total' => $medicines->total(),
            ],
        ]);
    }

    /**
     * Store a newly created medicine in storage.
     */
    public function store(Request $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        
        $request->validate([
            'name' => 'required|string|max:200',
            'category' => 'required|string',
            'type' => 'required|string',
            'form' => 'required|string',
            'unit' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
            'batches' => 'nullable|array',
        ]);

        $medicine = $this->medicineService->store($pharmacyId, $request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Obat berhasil ditambahkan',
            'data' => $medicine,
        ], 201);
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

        return response()->json([
            'status' => 'success',
            'message' => 'Detail obat berhasil diambil',
            'data' => $medicine,
        ]);
    }

    /**
     * Update the specified medicine in storage.
     */
    public function update(Request $request, $id)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $medicine = Medicine::where('pharmacy_id', $pharmacyId)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:200',
            'category' => 'required|string',
            'type' => 'required|string',
            'form' => 'required|string',
            'unit' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
        ]);

        $updatedMedicine = $this->medicineService->update($medicine, $request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Data obat berhasil diperbarui',
            'data' => $updatedMedicine,
        ]);
    }

    /**
     * Remove the specified medicine from storage.
     */
    public function destroy(Request $request, $id)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $medicine = Medicine::where('pharmacy_id', $pharmacyId)->findOrFail($id);
        
        $medicine->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Obat berhasil dihapus',
        ]);
    }

    /**
     * Update stock for a specific medicine (Batch Management).
     */
    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'batch_id' => 'required_if:type,ADJUSTMENT|exists:medicine_batches,id',
            'type' => 'required|in:IN,OUT,ADJUSTMENT',
            'quantity' => 'required_unless:type,ADJUSTMENT|integer|min:1',
            'new_stock' => 'required_if:type,ADJUSTMENT|integer|min:0',
            'batch_number' => 'required_if:type,IN|string',
            'expired_date' => 'required_if:type,IN|date',
            'note' => 'nullable|string',
        ]);

        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $medicine = Medicine::where('pharmacy_id', $pharmacyId)->findOrFail($id);

        try {
            if ($request->type === 'IN') {
                $batch = $this->medicineService->addBatch($medicine->id, $request->all(), $request->user()->id);
            } elseif ($request->type === 'ADJUSTMENT') {
                $batch = $this->medicineService->adjustStock($request->batch_id, $request->all(), $request->user()->id);
            } else {
                // OUT logic or generic reduction logic
                return response()->json(['status' => 'error', 'message' => 'Metode pengurangan stok (OUT) belum diimplementasikan secara langsung di endpoint ini.'], 400);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Stok berhasil diperbarui',
                'data' => $batch,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
