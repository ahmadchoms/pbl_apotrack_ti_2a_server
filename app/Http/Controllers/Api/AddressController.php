<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use App\Services\Api\AddressService;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function __construct(
        protected AddressService $addressService
    ) {}

    /**
     * Get all addresses for the authenticated user.
     */
    public function index(Request $request)
    {
        $addresses = $this->addressService->getUserAddresses($request->user());

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar alamat berhasil diambil',
            'data' => $addresses,
        ]);
    }

    /**
     * Store a new address (Transaction Protected).
     */
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string|max:50',
            'address_detail' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'is_primary' => 'boolean',
        ]);

        $address = $this->addressService->createAddress($request->user(), $request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Alamat berhasil ditambahkan',
            'data' => $address,
        ], 201);
    }

    /**
     * Update an address (Transaction Protected).
     */
    public function update(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $request->validate([
            'label' => 'string|max:50',
            'address_detail' => 'string',
            'latitude' => 'numeric',
            'longitude' => 'numeric',
            'is_primary' => 'boolean',
        ]);

        $updatedAddress = $this->addressService->updateAddress($address, $request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Alamat berhasil diperbarui',
            'data' => $updatedAddress,
        ]);
    }

    /**
     * Delete an address.
     */
    public function destroy(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $this->addressService->deleteAddress($address);

        return response()->json([
            'status' => 'success',
            'message' => 'Alamat berhasil dihapus',
        ]);
    }
}
