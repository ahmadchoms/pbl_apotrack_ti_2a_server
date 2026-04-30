<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePharmacyVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'USER') {
            $user->loadMissing('pharmacyStaff.pharmacy');
            $staff = $user->pharmacyStaff;

            if ($staff && $staff->pharmacy) {
                $status = $staff->pharmacy->verification_status;

                if ($status !== 'VERIFIED') {
                    if (!$request->routeIs('waiting-room')) {
                        return redirect()->route('waiting-room');
                    }
                }
            }
        }

        return $next($request);
    }
}
