<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Services\Auth\AuthService;

class ForgotPasswordController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function index()
    {
        return Inertia::render('auth/forgot-password');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ], [
            'email.exists' => 'Email tidak terdaftar dalam sistem kami.',
        ]);

        $this->authService->forgotPassword($data);

        return back()->with('status', 'Kami telah mengirimkan tautan reset kata sandi ke email Anda.');
    }
}
