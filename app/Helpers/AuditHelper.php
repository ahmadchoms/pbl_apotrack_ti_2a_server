<?php

namespace App\Helpers;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuditHelper
{
    /**
     * Catat aktivitas sistem (Human-Readable Audit Log).
     *
     * @param string $action Kode internal aksi (misal: SHIP_ORDER, UPDATE_PROFILE)
     * @param string $description Narasi aktivitas manusiawi
     * @param array $metadata Data terstruktur tambahan untuk pelacakan mesin
     * @param string $status Status eksekusi (default: SUCCESS)
     * @return AuditLog|null
     */
    public static function log(string $action, string $description, array $metadata = [], string $status = 'SUCCESS'): ?AuditLog
    {
        try {
            return AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'description' => $description,
                'status' => $status,
                'metadata' => empty($metadata) ? null : $metadata,
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            Log::error("Gagal mencatat Audit Log [{$action}]: " . $e->getMessage(), [
                'description' => $description,
                'metadata' => $metadata,
                'user_id' => Auth::id(),
            ]);
            return null;
        }
    }
}
