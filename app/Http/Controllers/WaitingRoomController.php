<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pharmacy;
use Illuminate\Support\Facades\Auth;

class WaitingRoomController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $mockRegistration = [
            'pharmacyName' => 'Apotek Sehat Selalu',
            'pharmacistName' => 'Dr. Prayitno Apoteker',
            'email' => 'prayitno@apotek.id',
            'phone' => '084444444444',
            'address' => 'Jl. Kaliurang No. 123, Sleman, Yogyakarta',
            'licenseNumber' => 'SIPA-2026-00123',
            'status' => 'PENDING', // coba: PENDING | VERIFIED | REJECTED
            'submissionDate' => '23 Apr 2026',
            'isRejected' => false,
        ];

        // $pharmacy = Pharmacy::whereHas('staffs', function ($query) use ($user) {
        //     $query->where('user_id', $user->id);
        // })->with(['staffs.user'])->first();

        // if (!$pharmacy) {
        //     return redirect()->route('home');
        // }

        // if ($pharmacy->verification_status === 'VERIFIED') {
        //     return redirect()->route('pharmacy.dashboard');
        // }

        return Inertia::render('waiting-room', [
            'registration' => $mockRegistration
            // 'registration' => [
            //     'pharmacyName' => $pharmacy->name,
            //     'pharmacistName' => $user->username,
            //     'email' => $user->email,
            //     'phone' => $pharmacy->phone ?? $user->phone,
            //     'address' => $pharmacy->address,
            //     'licenseNumber' => $pharmacy->license_number,
            //     'status' => $pharmacy->verification_status,
            //     'submissionDate' => $pharmacy->created_at->format('d M Y'),
            //     'isRejected' => $pharmacy->verification_status === 'REJECTED',
            // ]
        ]);
    }
}
