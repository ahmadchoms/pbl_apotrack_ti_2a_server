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
            return $next($request);
        }

        // --- NORMALISASI ROLES ---
        // Jika parameter dikirim sebagai 'STAFF|APOTEKER', pecah menjadi array ['STAFF', 'APOTEKER']
        $normalizedRoles = [];
        foreach ($roles as $role) {
            if (str_contains($role, '|')) {
                $normalizedRoles = array_merge($normalizedRoles, explode('|', $role));
            } else {
                $normalizedRoles[] = $role;
            }
        }

        // 1. Cek role utama di tabel users
        if (in_array($user->role, $normalizedRoles)) {
            return $next($request);
        }

        // 2. Logika Khusus Staf
        $user->loadMissing('pharmacyStaff');
        $staff = $user->pharmacyStaff;

        if ($staff && $staff->is_active) {
            // Izinkan jika rute ini memang ditujukan untuk staf (role STAFF atau APOTEKER diminta)
            if (in_array('STAFF', $normalizedRoles) || in_array('APOTEKER', $normalizedRoles)) {
                return $next($request);
            }
            
            // Cek role spesifik milik staf tersebut
            if (in_array($staff->role, $normalizedRoles)) {
                return $next($request);
            }
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Anda tidak memiliki otoritas untuk mengakses halaman ini.',
            'debug' => [
                'user_role' => $user->role,
                'staff_found' => (bool)$staff,
                'required_roles' => $normalizedRoles
            ]
        ], 403);
    }
}
