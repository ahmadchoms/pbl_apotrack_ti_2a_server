<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Resources\Admin\PharmacyResource;
use App\Services\Api\PharmacyService;
use Illuminate\Http\Request;

class PharmacyController extends BaseApiController
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

        return $this->successResponse(PharmacyResource::collection($pharmacies), 'Daftar apotek berhasil diambil');
    }

    /**
     * Get details of a specific pharmacy.
     */
    public function show($id)
    {
        $pharmacy = $this->pharmacyService->getPharmacyDetail($id);

        return $this->successResponse(new PharmacyResource($pharmacy), 'Detail apotek berhasil diambil');
    }
}
