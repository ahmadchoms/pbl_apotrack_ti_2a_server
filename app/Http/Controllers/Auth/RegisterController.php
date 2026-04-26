<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CompleteRegisterRequest;
use App\Services\Auth\AuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function index()
    {
        return Inertia::render('auth/register');
    }

    public function store(CompleteRegisterRequest $request)
    {
        $result = $this->authService->registerWithPharmacy($request->validated());
        
        Auth::login($result['user']);

        return redirect()->route('waiting-room')
            ->with('success', 'Registrasi berhasil. Silakan tunggu verifikasi.');
    }
}

