<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Pharmacy\MedicineResource;
use App\Services\Api\MedicineService;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    public function __construct(
        protected MedicineService $medicineService
    ) {}

    /**
     * Display a listing of medicines (Optimized with Service Pattern).
     */
    public function index(Request $request)
    {
        $medicines = $this->medicineService->listMedicines($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar obat berhasil diambil',
            'data' => MedicineResource::collection($medicines),
            'meta' => [
                'current_page' => $medicines->currentPage(),
                'last_page' => $medicines->lastPage(),
                'total' => $medicines->total(),
            ],
        ]);
    }

    /**
     * Display the specified medicine detail.
     */
    public function show($id)
    {
        $medicine = $this->medicineService->getMedicineDetail($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Detail obat berhasil diambil',
            'data' => new MedicineResource($medicine),
        ]);
    }
}
