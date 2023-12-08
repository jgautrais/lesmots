<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class WordsService
{
    private const WORDS_JSON_PATH = 'gutenberg.json';

    private const WORDS_MAX_LENGTH = 9;

    private const WORDS_MIN_LENGTH = 4;

    /** @var array<string> */
    private array $words;

    /** @var array<string> */
    private array $wordsOfMaxLength;

    /** @var array<string> */
    private array $lettersPool;

    /** @var array<string> */
    private array $matchingWords;

    /** @var array<string> */
    private array $matchingWordsOfMaxLength;

    public function __construct()
    {
        $this->words = $this->getWordsPool();
        $this->wordsOfMaxLength = $this->getWordsPoolOfMaxLength();
    }

    public function generateWords(): void
    {
        $this->setMatchingWords();
        $this->filterMatchingWordsForLettersCount();

        foreach ($this->matchingWords as $word) {
            if (mb_strlen($word) === self::WORDS_MAX_LENGTH) {
                $this->matchingWordsOfMaxLength[] = $word;
            }
        }
    }

    private function setMatchingWords(): void
    {
        $this->matchingWords = [];
        $this->matchingWordsOfMaxLength = [];
        $randomMaxLengthWord = $this->wordsOfMaxLength[rand(0, count($this->wordsOfMaxLength))];
        $this->lettersPool = mb_str_split($randomMaxLengthWord);

        foreach ($this->words as $word) {
            if (! $this->isValid($word)) {
                continue;
            }
            if (! in_array($word, $this->matchingWords)) {
                $this->matchingWords[] = $word;
            }
        }
    }

    /**
     * @return array<string>
     */
    private function getWordsPool(): array
    {
        $json = Storage::get(self::WORDS_JSON_PATH);
        assert(is_string($json));

        $pool = json_decode($json);

        if (json_last_error() === JSON_ERROR_NONE && is_array($pool)) {
            return $pool;
        }

        return [];
    }

    /**
     * @return array<string>
     */
    private function getWordsPoolOfMaxLength(): array
    {
        $maxLengthWords = [];
        foreach ($this->words as $word) {
            if (mb_strlen($word) === self::WORDS_MAX_LENGTH) {
                $maxLengthWords[] = $word;
            }
        }

        return $maxLengthWords;
    }

    private function isValid(string $word): bool
    {
        if (mb_strlen($word) < self::WORDS_MIN_LENGTH) {
            return false;
        }
        foreach (mb_str_split($word) as $letter) {
            if (! in_array($letter, $this->lettersPool)) {
                return false;
            }
        }

        return true;
    }

    private function filterMatchingWordsForLettersCount(): void
    {
        $lettersNumber = [];
        foreach ($this->lettersPool as $letter) {
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

    /** @return array<string> */
    public function getLettersPool(): array
    {
        return $this->lettersPool;
    }

    /** @return array<string> */
    public function getMatchingWords(): array
    {
        return array_values($this->matchingWords);
    }

    public function getMatchingWordsOfMaxLength(): string
    {
        sort($this->matchingWordsOfMaxLength);

        return implode(',', $this->matchingWordsOfMaxLength);
    }
}
