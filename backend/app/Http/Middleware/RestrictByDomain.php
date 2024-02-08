<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictByDomain
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigins = env('CORS_ALLOWED_ORIGINS');
        // Check if the request originated from the allowed domain
        if (! in_array($request->headers->get('origin'), explode(',', is_string($allowedOrigins) ? $allowedOrigins : ''))) {
            return response('Unauthorized.', 401);
        }

        return $next($request);
    }
}
