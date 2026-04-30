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

        if (in_array($user->role, $roles)) {
            return $next($request);
        }

        if ($user->role === 'USER') {
            $user->loadMissing('pharmacyStaff');

            $pharmacyStaff = $user->pharmacyStaff;

            if ($pharmacyStaff && $pharmacyStaff->is_active) {
                if (in_array($pharmacyStaff->role, $roles)) {
                    return $next($request);
                }
            }
        }

        abort(403, 'Anda tidak memiliki otoritas untuk mengakses halaman ini.');
    }
}
