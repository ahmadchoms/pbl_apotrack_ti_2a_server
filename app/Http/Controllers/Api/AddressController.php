<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\UserAddress;
use App\Services\Api\AddressService;
use App\Http\Requests\Api\Customer\StoreAddressRequest;
use App\Http\Requests\Api\Customer\UpdateAddressRequest;
use App\Http\Resources\Api\AddressResource;
use Illuminate\Http\Request;

class AddressController extends BaseApiController
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

        return $this->successResponse(AddressResource::collection($addresses), 'Daftar alamat berhasil diambil');
    }

    /**
     * Store a new address (Transaction Protected).
     */
    public function store(StoreAddressRequest $request)
    {
        $address = $this->addressService->createAddress($request->user(), $request->validated());

        return $this->successResponse(new AddressResource($address), 'Alamat berhasil ditambahkan', 201);
    }

    /**
     * Update an address (Transaction Protected).
     */
    public function update(UpdateAddressRequest $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $updatedAddress = $this->addressService->updateAddress($address, $request->validated());

        return $this->successResponse(new AddressResource($updatedAddress), 'Alamat berhasil diperbarui');
    }

    /**
     * Delete an address.
     */
    public function destroy(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $this->addressService->deleteAddress($address);

        return $this->successResponse(null, 'Alamat berhasil dihapus');
    }
}
