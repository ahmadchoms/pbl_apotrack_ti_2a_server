<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('auth.login');
        }

        $userRole = strtoupper($user->role);
        $upperRoles = array_map('strtoupper', $roles);

        // 1. Check global role (Users table)
        // Note: SUPER_ADMIN bypasses most checks if requested, 
        // but for pharmacy specific routes, we usually check the staff table.
        if (in_array($userRole, $upperRoles)) {
            return $next($request);
        }

        // 2. Check Pharmacy Staff roles (PharmacyStaff table)
        // This is crucial for distinguishing between APOTEKER and STAFF
        $pharmacyStaff = $user->pharmacyStaff;
        if ($pharmacyStaff) {
            $staffRole = strtoupper($pharmacyStaff->role);
            if (in_array($staffRole, $upperRoles)) {
                return $next($request);
            }
        }

        // If none match, abort with 403
        return abort(403, 'Anda tidak memiliki akses ke halaman ini.');
    }
}
