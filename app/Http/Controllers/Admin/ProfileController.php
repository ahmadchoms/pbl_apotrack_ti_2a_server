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
        $dateFrom = $request->date_from ?? now()->subDays(7)->format('Y-m-d');
        $dateTo = $request->date_to ?? now()->format('Y-m-d');

        $filters = array_merge($request->only(['search', 'status', 'action_type']), [
            'date_from' => $dateFrom,
            'date_to' => $dateTo
        ]);

        $logs = $this->profileService->getAuditHistory($filters);
        $actionTypes = $this->profileService->getActionTypes();

        return Inertia::render('admin/profile/audit-history', [
            'logs' => AuditLogResource::collection($logs),
            'filters' => $filters,
            'actionTypes' => $actionTypes
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|max:50|unique:users,username,' . auth()->id(),
            'email' => 'required|email|unique:users,email,' . auth()->id(),
            'phone' => 'nullable|string|max:20',
        ]);

        $this->profileService->updateProfile($data);

        return redirect()->back()->with('success', 'Profil berhasil diperbarui');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $this->profileService->updatePassword($request->password);

        return redirect()->back()->with('success', 'Password berhasil diubah');
    }
}
