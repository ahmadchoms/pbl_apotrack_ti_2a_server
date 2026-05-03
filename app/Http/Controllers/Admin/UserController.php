<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
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
        $this->authorize('viewAny', User::class);

        $filters = $request->only(['search', 'role', 'status']);
        $users = $this->userService->list($filters);

        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection($users),
            'filters' => $filters
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        return Inertia::render('admin/users/create', [
            'pharmacies' => Pharmacy::select('id', 'name')->get(),
            'roles' => array_column(\App\Enums\UserRole::cases(), 'value')
        ]);
    }

    public function edit(User $user)
    {
        $this->authorize('view', $user);

        return Inertia::render('admin/users/edit', [
            'user' => new UserResource($user->load('pharmacyStaff.pharmacy')),
            'pharmacies' => Pharmacy::select('id', 'name')->get(),
            'roles' => array_column(\App\Enums\UserRole::cases(), 'value')
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', User::class);

        $this->userService->store($request->validated());

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dibuat');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $this->userService->update($user, $request->validated());

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil diperbarui');
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $this->userService->toggleActive($user);
        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()->with('success', "User berhasil {$status}");
    }

    public function resetPassword(User $user)
    {
        $this->authorize('update', $user);

        $newPassword = $this->userService->resetPassword($user);

        return redirect()->back()->with('success', "Password user {$user->username} telah direset menjadi: {$newPassword}");
    }

    public function export()
    {
        $this->authorize('viewAny', User::class);

        return $this->userService->export();
    }
}
