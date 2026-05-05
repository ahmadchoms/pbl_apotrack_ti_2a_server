<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PharmacyResource;
use App\Services\Api\PharmacyService;
use Illuminate\Http\Request;

class PharmacyController extends Controller
{
    public function __construct(
        protected PharmacyService $pharmacyService
    ) {}

    /**
     * Get a list of verified pharmacies (Optimized Query).
     */
    public function index(Request $request)
    {
        $pharmacies = $this->pharmacyService->listActivePharmacies($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar apotek berhasil diambil',
            'data' => PharmacyResource::collection($pharmacies),
            'meta' => [
                'current_page' => $pharmacies->currentPage(),
                'last_page' => $pharmacies->lastPage(),
                'total' => $pharmacies->total(),
            ],
        ]);
    }

    /**
     * Get details of a specific pharmacy.
     */
    public function show($id)
    {
        $pharmacy = $this->pharmacyService->getPharmacyDetail($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Detail apotek berhasil diambil',
            'data' => new PharmacyResource($pharmacy),
        ]);
    }
}
