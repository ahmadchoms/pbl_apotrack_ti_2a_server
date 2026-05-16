<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

trait ApiResponseTrait
{
    /**
     * Send a successful response.
     */
    protected function successResponse($data = null, string $message = 'Success', int $statusCode = 200, array $meta = []): JsonResponse
    {
        $response = [
            'status' => 'success',
            'success' => true,
            'message' => $message,
            'data' => $data,
            'errors' => null,
        ];

        if ($data instanceof ResourceCollection || $data instanceof LengthAwarePaginator) {
            $paginator = $data instanceof ResourceCollection ? $data->resource : $data;
            if ($paginator instanceof LengthAwarePaginator) {
                $response['data'] = $data instanceof ResourceCollection ? $data->collection : $paginator->items();
                $response['meta'] = array_merge([
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ], $meta);
            } else {
                if (!empty($meta)) {
                    $response['meta'] = $meta;
                }
            }
        } elseif (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Send an error response.
     */
    protected function errorResponse(string $message = 'Error', int $statusCode = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'success' => false,
            'message' => $message,
            'data' => null,
            'errors' => $errors,
        ], $statusCode);
    }
}
