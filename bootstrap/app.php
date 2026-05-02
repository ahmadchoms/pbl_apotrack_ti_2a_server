<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \App\Http\Middleware\CheckUserActive::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        $middleware->statefulApi();

        $middleware->redirectTo(
            guests: '/auth/login',
            users: '/'
        );

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'verified.pharmacy' => \App\Http\Middleware\EnsurePharmacyVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, Throwable $exception, \Illuminate\Http\Request $request) {
            if (!app()->isLocal() && in_array($response->getStatusCode(), [500, 503, 404, 403, 401])) {
                return \Inertia\Inertia::render('error', [
                    'status' => $response->getStatusCode(),
                ])->toResponse($request)->setStatusCode($response->getStatusCode());
            }

            // Always handle 404 and 403 for Inertia even in local for consistency
            if (in_array($response->getStatusCode(), [404, 403])) {
                return \Inertia\Inertia::render('error', [
                    'status' => $response->getStatusCode(),
                ])->toResponse($request)->setStatusCode($response->getStatusCode());
            }

            if ($response->getStatusCode() === 419) {
                return back()->with([
                    'message' => 'Halaman telah kedaluwarsa, silakan coba lagi.',
                ]);
            }

            return $response;
        });
    })->create();
