<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditController extends BaseApiController
{
    /**
     * Display a listing of the audit logs for the staff's pharmacy.
     */
    public function index(Request $request)
    {
        $staff = $request->user()->pharmacyStaff;
        
        // Pemilahan Data (Data Filtering):
        // Jika rolenya adalah APOTEKER (Manajer/Penanggung Jawab Apotek), mereka berhak melihat seluruh aktivitas log dari semua staf di apotek tersebut.
        // Namun jika rolenya adalah STAFF biasa (seperti Rina Staff), mereka hanya berhak melihat riwayat aktivitas yang mereka lakukan sendiri.
        if ($staff && $staff->role === 'APOTEKER') {
            $staffUserIds = \App\Models\PharmacyStaff::where('pharmacy_id', $staff->pharmacy_id)
                ->pluck('user_id');
            $query = AuditLog::whereIn('user_id', $staffUserIds);
        } else {
            $query = AuditLog::where('user_id', $request->user()->id);
        }

        $logs = $query->with('user:id,username')
            ->search($request->search)
            ->filterStatus($request->status)
            ->filterAction($request->action)
            ->filterDate($request->date_from, $request->date_to)
            ->latest('created_at')
            ->paginate(20);

        return $this->successResponse(\App\Http\Resources\Admin\AuditLogResource::collection($logs), 'Log riwayat aktivitas apotek berhasil diambil');
    }
}
