<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Models\PharmacyStaff;
use App\Services\Pharmacy\PharmacyStaffService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StaffInvitationController extends Controller
{
    public function __construct(
        protected PharmacyStaffService $staffService
    ) {}

    public function join(Request $request)
    {
        $request->validate([
            'invitation_url' => 'nullable|string',
            'pin'            => 'nullable|string|min:6|max:10',
        ]);

        // Deteksi mode: URL (scan QR) atau PIN (input manual)
        if ($request->filled('invitation_url')) {
            $invitationUrl = $request->input('invitation_url');

        } elseif ($request->filled('pin')) {
            $pin = strtoupper(trim($request->input('pin')));
            $invitationUrl = $this->staffService->resolveInvitationPin($pin);

            if (!$invitationUrl) {
                return response()->json([
                    'message' => 'Kode undangan tidak valid atau sudah kadaluarsa.',
                ], 422);
            }

        } else {
            return response()->json([
                'message' => 'Kirim invitation_url atau pin.',
            ], 422);
        }

        return $this->processJoin($request, $invitationUrl);
    }

    private function processJoin(Request $request, string $invitationUrl)
    {
        $parsedUrl = parse_url($invitationUrl);
        parse_str($parsedUrl['query'] ?? '', $queryParams);

        $pharmacyId = $queryParams['pharmacy_id'] ?? null;

        if (!$pharmacyId) {
            return response()->json([
                'message' => 'Undangan tidak valid. pharmacy_id tidak ditemukan.',
            ], 422);
        }

        if (!$this->isValidSignedUrl($invitationUrl)) {
            return response()->json([
                'message' => 'Link undangan tidak valid atau sudah kadaluarsa.',
            ], 422);
        }

        $pharmacy = Pharmacy::find($pharmacyId);
        if (!$pharmacy) {
            return response()->json([
                'message' => 'Apotek tidak ditemukan.',
            ], 404);
        }

        $user = $request->user();

        $alreadyStaff = PharmacyStaff::where('pharmacy_id', $pharmacyId)
            ->where('user_id', $user->id)
            ->whereNull('deleted_at')
            ->exists();

        if ($alreadyStaff) {
            return response()->json([
                'message' => 'Kamu sudah terdaftar sebagai staff di apotek ini.',
            ], 409);
        }

        $isStaffElsewhere = PharmacyStaff::where('user_id', $user->id)
            ->whereNull('deleted_at')
            ->exists();

        if ($isStaffElsewhere) {
            return response()->json([
                'message' => 'Kamu sudah terdaftar sebagai staff di apotek lain.',
            ], 409);
        }

        DB::transaction(function () use ($pharmacyId, $user) {
            PharmacyStaff::create([
                'pharmacy_id' => $pharmacyId,
                'user_id'     => $user->id,
                'role'        => 'STAFF',
                'is_active'   => true,
            ]);
        });

        return response()->json([
            'message'  => 'Berhasil bergabung sebagai staff apotek!',
            'pharmacy' => [
                'id'   => $pharmacy->id,
                'name' => $pharmacy->name,
            ],
        ], 200);
    }

    private function isValidSignedUrl(string $url): bool
    {
        try {
            $fakeRequest = Request::create($url);
            return $fakeRequest->hasValidSignature();
        } catch (\Throwable $e) {
            return false;
        }
    }
}