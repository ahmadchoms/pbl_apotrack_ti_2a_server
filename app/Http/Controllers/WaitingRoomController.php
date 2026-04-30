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
        
        $pharmacyStaff = $user->pharmacyStaff()->with('pharmacy.legality')->first();
        
        if (!$pharmacyStaff || !$pharmacyStaff->pharmacy) {
            return redirect()->route('home');
        }
        
        $pharmacy = $pharmacyStaff->pharmacy;
        
        if ($pharmacy->verification_status === 'VERIFIED') {
            return redirect()->route('pharmacy.dashboard');
        }

        return Inertia::render('waiting-room', [
            'registration' => [
                'pharmacyName'   => $pharmacy->name,
                'pharmacistName' => $user->username,
                'email'          => $user->email,
                'phone'          => $pharmacy->phone ?? $user->phone,
                'address'        => $pharmacy->address,
                'sia_number'     => $pharmacy->legality?->sia_number,
                'status'         => $pharmacy->verification_status,
                'submissionDate' => $pharmacy->created_at->format('d M Y'),
                'isRejected'     => $pharmacy->verification_status === 'REJECTED',
            ]
        ]);
    }
}
