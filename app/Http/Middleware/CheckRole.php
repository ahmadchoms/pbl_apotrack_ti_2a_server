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

        // 1. Cek jika role ini berkaitan dengan Staff (STAFF atau APOTEKER)
        $isStaffRole = in_array($user->role, ['STAFF', 'APOTEKER']) || 
                       in_array('STAFF', $normalizedRoles) || 
                       in_array('APOTEKER', $normalizedRoles);

        if ($isStaffRole) {
            $user->loadMissing('pharmacyStaff');
            $staff = $user->pharmacyStaff;

            if (!$staff || !$staff->is_active) {
                return $request->expectsJson() || $request->is('api/*')
                    ? response()->json([
                        'status' => 'error',
                        'message' => 'Anda tidak terdaftar sebagai staf apotek aktif. Silakan hubungi admin.',
                    ], 403)
                    : abort(403, 'Anda tidak terdaftar sebagai staf apotek aktif. Silakan hubungi admin.');
            }

            // Izinkan jika role utama di tabel users cocok
            if (in_array($user->role, $normalizedRoles)) {
                return $next($request);
            }
            
            // Cek role spesifik milik staf tersebut di tabel staffs
            if (in_array($staff->role, $normalizedRoles)) {
                return $next($request);
            }
        } else {
            // Untuk non-staff (misal SUPER_ADMIN atau USER)
            if (in_array($user->role, $normalizedRoles)) {
                return $next($request);
            }
        }

        return $request->expectsJson() || $request->is('api/*')
            ? response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki otoritas untuk mengakses halaman ini.',
                'debug' => [
                    'user_role' => $user->role,
                    'staff_found' => isset($staff) ? (bool)$staff : false,
                    'required_roles' => $normalizedRoles
                ]
            ], 403)
            : abort(403, 'Anda tidak memiliki otoritas untuk mengakses halaman ini.');
    }
}
