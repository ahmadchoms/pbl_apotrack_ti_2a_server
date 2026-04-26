<?php

namespace App\Http\Controllers\Admin;

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
            'roles' => ['CUSTOMER', 'PHARMACY_STAFF', 'APOTEKER', 'SUPER_ADMIN']
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('admin/users/edit', [
            'user' => new UserResource($user->load('pharmacyStaff.pharmacy')),
            'pharmacies' => Pharmacy::select('id', 'name')->get(),
            'roles' => ['CUSTOMER', 'PHARMACY_STAFF', 'APOTEKER', 'SUPER_ADMIN']
        ]);
    }
}
