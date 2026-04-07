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
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles  <-- Menerima parameter role dinamis
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (! $request->user()) {
            return redirect('login');
        }

        
        if (! in_array($request->user()->role, $roles)) {
            abort(403, 'Akses Ditolak. Anda tidak memiliki izin untuk halaman ini.');
        }

        return $next($request);
    }
}