<?php

namespace App\Console\Commands;

use App\Models\WordsPool;
use App\Services\WordsService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CreateWordsPool extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:wordsPool';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(WordsService $wordsService)
    {
        $start_time = microtime(true);
        $wordsService->generateWords();

        $wordPoolsWithSameMatchingWords = WordsPool::query()->find([
            'maxLengthWords' => $wordsService->getMatchingWordsOfMaxLength(),
        ]);

        while ($wordPoolsWithSameMatchingWords->count() > 0) {
            $wordsService->generateWords();

            $wordPoolsWithSameMatchingWords = WordsPool::query()->find([
                'maxLengthWords' => $wordsService->getMatchingWordsOfMaxLength(),
            ]);
        }

        WordsPool::query()->create([
            'letters' => json_encode($wordsService->getLettersPool()),
            'pool' => json_encode($wordsService->getMatchingWords()),
            'maxLengthWords' => $wordsService->getMatchingWordsOfMaxLength(),
            'day' => Carbon::today()->toDate(),
        ]);
        $end_time = microtime(true);

        $this->info('Words pool generated in '.($end_time - $start_time).' s');

        return Command::SUCCESS;
    }
}
