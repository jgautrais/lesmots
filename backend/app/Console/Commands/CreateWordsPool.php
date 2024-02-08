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
    protected $signature = 'create:wordsPool {--day=}';

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
        $day = $this->option('day');

        if ($day !== null && ! preg_match('/'.config('services.regex.date_format').'/', $day)) {
            $this->error("Day option must be in format 'YYYY-MM-DD'");

            return Command::FAILURE;
        }

        if ($day) {
            $day = Carbon::createFromFormat('Y-m-d', $day);
        } else {
            $day = Carbon::today()->addDays(2);
        }

        if (! $day) {
            $this->error('Error parsing the date from format Y-m-d');

            return Command::FAILURE;
        }

        $day = $day->toDate();

        $wordsService->generateWords();

        $wordsPoolOfTheDay = WordsPool::query()->whereDate('day', $day->format('Y-m-d'))->first();

        if ($wordsPoolOfTheDay !== null) {
            $this->error('Words pool already existing for the day '.$day->format('Y-m-d'));

            return Command::FAILURE;
        }

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
            'letters' => $wordsService->getLettersPool(),
            'pool' => $wordsService->getMatchingWords(),
            'maxLengthWords' => $wordsService->getMatchingWordsOfMaxLength(),
            'day' => $day,
        ]);
        $end_time = microtime(true);

        $this->info('Words pool generated in '.($end_time - $start_time).' s');

        return Command::SUCCESS;
    }
}
