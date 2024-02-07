<?php

use App\Http\Controllers\WordsPoolController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['accept:application/json', 'domain'])->group(function () {
    Route::get('/wordsPool/{day}', [WordsPoolController::class, 'getWordsPoolOfTheDay'])->where('day', config('services.regex.date_format'));
});
