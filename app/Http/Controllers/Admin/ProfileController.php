<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AuditLogResource;
use App\Services\Admin\ProfileService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService
    ) {}

    public function index()
    {
        $user = $this->profileService->getProfileData();
        $auditLogs = $this->profileService->getRecentLogs();

        return Inertia::render('admin/profile', [
            'user' => $user,
            'auditLogs' => AuditLogResource::collection($auditLogs)
        ]);
    }

    public function auditHistory(Request $request)
    {
        $filters = $request->only(['search', 'status', 'action_type', 'date_from', 'date_to']);
        $logs = $this->profileService->getAuditHistory($filters);
        $actionTypes = $this->profileService->getActionTypes();

        return Inertia::render('admin/profile/audit-history', [
            'logs' => AuditLogResource::collection($logs),
            'filters' => $filters,
            'actionTypes' => $actionTypes
        ]);
    }
}
