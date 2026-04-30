<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\UserResource;
use App\Models\Pharmacy;
use App\Models\User;
use App\Services\Admin\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'role', 'status']);
        $users = $this->userService->list($filters);

        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection($users),
            'filters' => $filters
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/users/create', [
            'pharmacies' => Pharmacy::select('id', 'name')->get(),
            'roles' => array_column(UserRole::cases(), 'value')
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('admin/users/edit', [
            'user' => new UserResource($user->load('pharmacyStaff.pharmacy')),
            'pharmacies' => Pharmacy::select('id', 'name')->get(),
            'roles' => array_column(UserRole::cases(), 'value')
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|max:50|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean'
        ]);

        $this->userService->store($data);

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dibuat');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'username' => 'required|string|max:50|unique:users,username,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean'
        ]);

        $this->userService->update($user, $data);

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil diperbarui');
    }

    public function destroy(User $user)
    {
        $this->userService->delete($user);

        return redirect()->back()->with('success', 'User berhasil dihapus');
    }

    public function export()
    {
        $users = User::all();
        $csvHeader = ['ID', 'Username', 'Email', 'Role', 'Status', 'Created At'];
        
        $callback = function() use ($users, $csvHeader) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $csvHeader);

            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->username,
                    $user->email,
                    $user->role,
                    $user->is_active ? 'Active' : 'Inactive',
                    $user->created_at
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=users_export_" . now()->format('YmdHis') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ]);
    }
}
