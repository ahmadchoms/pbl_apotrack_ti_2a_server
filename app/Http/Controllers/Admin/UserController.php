<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->select([
                'users.id',
                'users.username',
                'users.email',
                'users.phone',
                'users.role',
                'users.is_active',
                'users.avatar_url',
                'pharmacies.name as pharmacy_name'
            ])
            ->leftJoin('pharmacy_staffs', 'users.id', '=', 'pharmacy_staffs.user_id')
            ->leftJoin('pharmacies', 'pharmacy_staffs.pharmacy_id', '=', 'pharmacies.id')
            ->orderBy('users.created_at', 'desc');

        // Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('users.username', 'ilike', '%' . $request->search . '%')
                  ->orWhere('users.email', 'ilike', '%' . $request->search . '%')
                  ->orWhere('pharmacies.name', 'ilike', '%' . $request->search . '%');
            });
        }

        // Filter Role
        if ($request->role && $request->role !== 'all') {
            $query->where('users.role', $request->role);
        }

        // Filter Status
        if ($request->status && $request->status !== 'all') {
            $isActive = $request->status === 'active';
            $query->where('users.is_active', $isActive);
        }

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status'])
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/users/create', [
            'pharmacies' => Pharmacy::select('id', 'name')->get(),
            'roles' => ['CUSTOMER', 'PHARMACY_STAFF', 'APOTEKER', 'SUPER_ADMIN']
        ]);
    }

    public function edit($id)
    {
        $user = User::with(['pharmacyStaff.pharmacy'])->findOrFail($id);

        return Inertia::render('admin/users/edit', [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'pharmacy_id' => $user->pharmacyStaff?->pharmacy_id
            ],
            'pharmacies' => Pharmacy::select('id', 'name')->get(),
            'roles' => ['CUSTOMER', 'PHARMACY_STAFF', 'APOTEKER', 'SUPER_ADMIN']
        ]);
    }
}
