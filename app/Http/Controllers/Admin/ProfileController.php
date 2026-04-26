<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ProfileController extends Controller
{
    public function index()
    {
        $user = [
            'id' => '019db9a6-8991-7103-b685-bf0ed93fe9fb',
            'username' => 'Super Admin',
            'email' => 'admin@apotek.id',
            'phone' => '081111111111',
            'role' => 'SUPER_ADMIN',
            'avatar_url' => 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/avatar/avatar.jpg',
            'is_active' => true,
            'created_at' => '25 Apr 2026',
            'addresses' => []
        ];
        $auditLogs = \App\Models\AuditLog::where('user_id', $user['id'])
            ->latest()
            ->take(4)
            ->get();
        return Inertia::render('admin/profile', [
            // [DATA]
            'user' => $user,
            'auditLogs' => $auditLogs
        ]);
    }
    public function auditHistory(Request $request)
    {
        // For now, use the hardcoded admin ID for consistency with other parts
        $adminId = '019db9a6-8991-7103-b685-bf0ed93fe9fb';
        $query = \App\Models\AuditLog::where('user_id', $adminId)
            ->select('id', 'action', 'description', 'status', 'created_at', 'metadata')
            ->latest();
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('description', 'ilike', "%{$request->search}%")
                  ->orWhere('action', 'ilike', "%{$request->search}%");
            });
        }
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->action_type && $request->action_type !== 'all') {
            $query->where('action', $request->action_type);
        }
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        $logs = $query->paginate(10)->withQueryString();
        // Get unique actions for filter dropdown
        $actionTypes = \App\Models\AuditLog::where('user_id', $adminId)
            ->distinct()
            ->pluck('action');
        return Inertia::render('admin/profile/audit-history', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'status', 'action_type', 'date_from', 'date_to']),
            'actionTypes' => $actionTypes
        ]);
    }
}
