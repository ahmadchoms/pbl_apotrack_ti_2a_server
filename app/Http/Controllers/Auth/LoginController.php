<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function index()
    {
        if (Auth::check()) {
            return $this->redirectBasedOnRole(Auth::user());
        }

        return Inertia::render('auth/login');
    }

    public function store(LoginRequest $request)
    {
        $user = $this->authService->login($request->validated());

        return $this->redirectBasedOnRole($user);
    }

    public function destroy()
    {
        $this->authService->logout();

        return redirect()->route('auth.login');
    }

    private function redirectBasedOnRole($user)
    {
        if ($user->role === UserRole::SUPER_ADMIN->value) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role === UserRole::USER->value) {
            $user->loadMissing('pharmacyStaff.pharmacy');

            $staff = $user->pharmacyStaff;
            $pharmacy = $staff?->pharmacy;

            if ($pharmacy && $pharmacy->verification_status !== 'VERIFIED') {
                return redirect()->route('waiting-room');
            }

            if ($pharmacy && $pharmacy->verification_status === 'VERIFIED') {
                return redirect()->route('pharmacy.dashboard');
            }
        }

        return redirect()->route('home');
    }
}
