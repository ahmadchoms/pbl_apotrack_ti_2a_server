<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function index()
    {
        return Inertia::render('auth/login');
    }

    public function store(LoginRequest $request)
    {
        $user = $this->authService->login($request->validated());

        if ($user->role === 'SUPER_ADMIN') {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role === 'APOTEKER' || $user->role === 'PHARMACY_STAFF') {
            $staff = $user->pharmacyStaff;
            $pharmacy = $staff?->pharmacy;
            
            if ($pharmacy && $pharmacy->verification_status !== 'VERIFIED') {
                return redirect()->route('waiting-room');
            }
            
            return redirect()->route('pharmacy.dashboard');
        }

        return redirect()->route('home');
    }

    public function destroy()
    {
        $this->authService->logout();

        return redirect()->route('auth.login');
    }
}
