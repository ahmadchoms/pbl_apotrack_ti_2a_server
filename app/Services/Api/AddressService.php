<?php

namespace App\Services\Api;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Support\Facades\DB;

class AddressService
{
    /**
     * Get all addresses for a user.
     */
    public function getUserAddresses(User $user)
    {
        return $user->addresses()
            ->select(['id', 'user_id', 'label', 'address_detail', 'latitude', 'longitude', 'is_primary'])
            ->latest()
            ->get();
    }

    /**
     * Create a new address and handle primary status.
     */
    public function createAddress(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            if ($data['is_primary'] ?? false) {
                $user->addresses()->update(['is_primary' => false]);
            }

            return $user->addresses()->create($data);
        });
    }

    /**
     * Update address and handle primary status changes.
     */
    public function updateAddress(UserAddress $address, array $data)
    {
        return DB::transaction(function () use ($address, $data) {
            if ($data['is_primary'] ?? false) {
                UserAddress::where('user_id', $address->user_id)
                    ->where('id', '!=', $address->id)
                    ->update(['is_primary' => false]);
            }

            $address->update($data);
            return $address;
        });
    }

    /**
     * Delete an address.
     */
    public function deleteAddress(UserAddress $address)
    {
        return $address->delete();
    }
}
