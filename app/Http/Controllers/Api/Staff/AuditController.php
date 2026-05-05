<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    /**
     * Display a listing of the audit logs for the staff's pharmacy.
     */
    public function index(Request $request)
    {
        $staff = $request->user()->pharmacyStaff;
        
        // Find all staff IDs in this pharmacy to show their logs
        $staffUserIds = \App\Models\PharmacyStaff::where('pharmacy_id', $staff->pharmacy_id)
            ->pluck('user_id');

        $logs = AuditLog::with('user:id,username')
            ->whereIn('user_id', $staffUserIds)
            ->search($request->search)
            ->filterStatus($request->status)
            ->filterAction($request->action)
            ->filterDate($request->date_from, $request->date_to)
            ->latest('created_at')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'message' => 'Log riwayat aktivitas apotek berhasil diambil',
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'total' => $logs->total(),
            ],
        ]);
    }
}
