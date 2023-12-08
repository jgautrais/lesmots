<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class WordsJsonGeneratorService
{
    private const DICTIONARY_CSV_PATH = 'dict.csv';

    private const DICTIONARY_TXT_PATH = 'gutenberg.txt';

    private const WORDS_JSON_PATH = 'gutenberg.json';

    private const DEFINITIONS_JSON_PATH = 'definitions.json';

    private const WORDS_MAX_LENGTH = 9;

    private const WORDS_MIN_LENGTH = 4;

    public function generateJSONWordsFromCsv(): void
    {
        $rawData = Storage::get(self::DICTIONARY_CSV_PATH);
        assert(is_string($rawData));

        $lines = explode(PHP_EOL, $rawData);
        $array = [];
        $words = [];
        foreach ($lines as $line) {
            $extract = str_getcsv($line, "\t");
            $word = $extract[0];
            assert(is_string($word));

            if (! str_contains($word, ' ') && mb_strlen($word) >= self::WORDS_MIN_LENGTH && mb_strlen($word) <= self::WORDS_MAX_LENGTH && ! in_array($word, $words)) {
                $array[] = $word;
            }
        }

        $json = json_encode($array);
        assert(is_string($json));
        Storage::put(self::WORDS_JSON_PATH, $json);
    }

    public function generateJSONWordsFromTxt(): void
    {
        $rawData = Storage::get(self::DICTIONARY_TXT_PATH);
        assert(is_string($rawData));

        $lines = explode(PHP_EOL, $rawData);
        $array = [];
        $words = [];
        foreach ($lines as $word) {
            assert(is_string($word));

            if (! str_contains($word, ' ') && mb_strlen($word) >= self::WORDS_MIN_LENGTH && mb_strlen($word) <= self::WORDS_MAX_LENGTH && ! in_array($word, $words)) {
                $array[] = $word;
            }
        }

        $json = json_encode($array);
        assert(is_string($json));
        Storage::put(self::WORDS_JSON_PATH, $json);
    }

    public function generateJSONDefinitionsFromCsv(): void
    {
        $csvData = Storage::get(self::DICTIONARY_CSV_PATH);
        assert(is_string($csvData));

        $lines = explode(PHP_EOL, $csvData);
        $array = [];
        $words = [];
        foreach ($lines as $line) {
            $extract = str_getcsv($line, "\t");
            $word = $extract[0];
            assert(is_string($word));
            $def = $extract[9];
            assert(is_string($def));

            if (! str_contains($word, ' ') && mb_strlen($word) > self::WORDS_MIN_LENGTH && mb_strlen($word) < self::WORDS_MAX_LENGTH && ! in_array($word, $words)) {
                $array[] = ['m' => $word, 'd' => $def];
            }
        }

        $json = json_encode($array);
        assert(is_string($json));
        Storage::put(self::DEFINITIONS_JSON_PATH, $json);
    }
}
