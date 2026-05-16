<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Services\Api\CartService;
use App\Http\Requests\Api\Customer\StoreCartRequest;
use App\Http\Resources\Api\CartResource;
use Illuminate\Http\Request;

class CartController extends BaseApiController
{
    public function __construct(
        protected CartService $cartService
    ) {}

    public function index(Request $request)
    {
        $cartData = $this->cartService->getCart($request->user());

        if (empty($cartData['items'])) {
            return $this->successResponse([
                'items' => [],
                'total_price' => 0,
            ], 'Keranjang kosong');
        }

        return $this->successResponse(new CartResource($cartData), 'Data keranjang berhasil diambil');
    }

    public function store(StoreCartRequest $request)
    {
        $this->cartService->addItem($request->user(), $request->validated());

        return $this->successResponse(null, 'Item berhasil ditambahkan ke keranjang');
    }

    public function destroy(Request $request, $id)
    {
        try {
            $this->cartService->removeItem($request->user(), $id);

            return $this->successResponse(null, 'Item berhasil dihapus dari keranjang');
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 404;
            return $this->errorResponse($e->getMessage(), $code);
        }
    }
}
