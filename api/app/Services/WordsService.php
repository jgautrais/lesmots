<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class WordsService
{
    private const DICTIONARY_CSV_PATH = 'dict.csv';
    private const WORDS_JSON_PATH = 'words.json';
    private const DEFINITIONS_JSON_PATH = 'definitions.json';

    private const VOWELS = ['a', 'e', 'i', 'o', 'u'];
    private const CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r' ,'s', 't', 'v', 'w', 'x', 'y', 'z'];
    private const SPECIAL_CHARS = ['à', 'â', 'ç', 'é', 'è', 'ê', 'ë', 'ï', 'î', 'ô', 'ö', 'ü', 'ù', 'û'];

    private const WORDS_MAX_LENGTH = 6;

    private array $wordsPool;
    private array $randomLetters;
    private array $matchingWords;

    public function __construct()
    {
        $this->wordsPool = $this->getWordsPool();
    }

    public function generateJSONWordsFromCsv(): void
    {
        $csvData = Storage::get(self::DICTIONARY_CSV_PATH);
        $lines = explode(PHP_EOL, $csvData);
        $array = [];
        $words = [];
        foreach ($lines as $line) {
            $extract = str_getcsv($line, "\t");
            $word = $extract[0];
            if (! str_contains($word, ' ') && mb_strlen($word) > 2 && mb_strlen($word) < 10 && ! in_array($word, $words)) {
                $array[] = [$word];
            }
        }
        Storage::put(self::WORDS_JSON_PATH, json_encode($array));
    }

    public function generateJSONDefinitionsFromCsv(): void
    {
        $csvData = Storage::get(self::DICTIONARY_CSV_PATH);
        $lines = explode(PHP_EOL, $csvData);
        $array = [];
        $words = [];
        foreach ($lines as $line) {
            $extract = str_getcsv($line, "\t");
            $word = $extract[0];
            $def = $extract[9];
            if (! str_contains($word, ' ') && mb_strlen($word) > 2 && mb_strlen($word) < 10 && ! in_array($word, $words)) {
                $array[] = ['m' => $word, 'd' => $def];
            }
        }
        Storage::put(self::DEFINITIONS_JSON_PATH, json_encode($array));
    }

    public function getWords()
    {
        $this->generateWords();
        while ($this->areMatchingWordsValids() === false) {
            $this->generateWords();
        }

        $final = [
            3 => [],
            4 => [],
            5 => [],
            6 => [],
            7 => [],
            8 => [],
            9 => [],
        ];

        foreach ($this->matchingWords as $word) {
            $final[mb_strlen($word)][] = $word;
        }
        var_dump($this->randomLetters);

        return $final;
    }

    private function generateWords(): void
    {
        $this->matchingWords = [];
        $this->randomLetters = $this->getRandomLetters();

        foreach ($this->wordsPool as $word) {
            if ($this->isValid($word)) {
                $this->matchingWords[] = $word;
            }
        }
    }

    private function getRandomLetters(): array
    {
        $letters = array_merge(self::VOWELS, self::CONSONANTS);
        $numberOfSpecialChars = rand(0, 2);

        $randomLetters = [];
        for ($i = 0; $i < 6 - $numberOfSpecialChars; $i++) {
            $randomLetters[] = $letters[rand(0, count($letters) - (1 + $numberOfSpecialChars))];
        }

        if ($numberOfSpecialChars) {
            for ($i = 0; $i < $numberOfSpecialChars; $i++) {
                $randomLetters[] = self::SPECIAL_CHARS[rand(0, count(self::SPECIAL_CHARS) - 1)];
            }
        }

        return $randomLetters;
    }

    private function getWordsPool(): array
    {
        $json = Storage::get(self::WORDS_JSON_PATH);
        $pool = json_decode($json);

        if (json_last_error() === JSON_ERROR_NONE && $pool) {
            return $pool;
        }
        return [];
    }

    private function isValid($word): bool
    {
        if (mb_strlen($word) < 3) {
            return false;
        }
        foreach (mb_str_split($word) as $letter) {
            if (!in_array($letter, $this->randomLetters)) {
                return false;
            }
        }

        return true;
    }

    private function areMatchingWordsValids(): bool
    {
        if (!$this->hasAtLeastOneWordOfMaxLength()) {
            return false;
        }

        $this->filterMatchingWordsForLettersCount();

        if (!count($this->matchingWords) || !$this->hasAtLeastOneWordOfMaxLength()) {
            return false;
        }

        return true;
    }

    private function hasAtLeastOneWordOfMaxLength(): bool
    {
        $hasMaxWordLength = false;
        foreach ($this->matchingWords as $word) {
            if (mb_strlen($word) === self::WORDS_MAX_LENGTH) {
                $hasMaxWordLength = true;
            }
        }
        return $hasMaxWordLength;
    }

    private function filterMatchingWordsForLettersCount(): void
    {
        $lettersNumber = [];
        foreach ($this->randomLetters as $letter) {
            if (array_key_exists($letter, $lettersNumber)) {
                $lettersNumber[$letter] = $lettersNumber[$letter] + 1;
            } else {
                $lettersNumber[$letter] = 1;
            }
        }

        foreach ($this->matchingWords as $id => $word) {
            $testNbLetters = [];
            foreach (mb_str_split($word) as $char) {
                if (array_key_exists($char, $testNbLetters)) {
                    $testNbLetters[$char] = $testNbLetters[$char] + 1;
                } else {
                    $testNbLetters[$char] = 1;
                }
            }

            foreach ($testNbLetters as $character => $number) {
                if ($number > $lettersNumber[$character]) {
                    unset($this->matchingWords[$id]);
                }
            }
        }
    }
}
