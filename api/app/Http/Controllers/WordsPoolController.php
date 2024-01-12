<?php

namespace App\Http\Controllers;

use App\Models\WordsPool;
use Illuminate\Http\JsonResponse;

class WordsPoolController extends Controller
{
    public function getWordsPoolOfTheDay(string $day): JsonResponse
    {
        /** @var WordsPool|null $wordsPool */
        $wordsPool = WordsPool::query()->whereDate('day', $day)->first();

        if (! $wordsPool) {
            return response()->json([
                'message' => 'WordsPool not found for day '.$day,
            ], 404);
        }

        return response()->json([
            'letters' => $wordsPool->letters,
            'wordsPool' => $wordsPool->pool,
            'maxLengthWords' => explode(',', $wordsPool->maxLengthWords),
        ]);
    }
}
