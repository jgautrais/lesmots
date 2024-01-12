<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Client\HttpClientException;
use Illuminate\Http\Request;

class CheckAccept
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     *
     * @throws HttpClientException
     */
    public function handle(Request $request, Closure $next, string $validAccept)
    {
        if (! in_array($request->header('Accept'), explode(',', $validAccept))) {
            throw new HttpClientException('Accept header not allowed. Must be one of '.$validAccept, 406);
        }

        return $next($request);
    }
}
