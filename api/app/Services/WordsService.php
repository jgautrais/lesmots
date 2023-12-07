<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class WordsService
{
    private const DICTIONARY_CSV_PATH = 'dict.csv';

    private const DICTIONARY_TXT_PATH = 'gutenberg.txt';

    private const WORDS_JSON_PATH = 'words.json';

    private const DEFINITIONS_JSON_PATH = 'definitions.json';

    private const VOWELS = ['a', 'e', 'i', 'o', 'u'];

    private const MOST_USED_CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v'];

    private const LEAST_USED_CONSONANTS = ['j', 'k', 'w', 'x', 'y', 'z'];

    private const LETTERS = ['a', 'e', 'i', 'o', 'u', 'b', 'c', 'd', 'f', 'g', 'h', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'j', 'k', 'w', 'x', 'y', 'z'];

    private const A_SPECIAL_CHARS = ['à', 'â'];

    private const C_SPECIAL_CHARS = ['ç'];

    private const E_SPECIAL_CHARS = ['ê', 'ë', 'é', 'è'];

    private const I_SPECIAL_CHARS = ['ï', 'î'];

    private const O_SPECIAL_CHARS = ['ô', 'ö'];

    private const U_SPECIAL_CHARS = ['ü', 'ù', 'û'];

    private const SPECIAL_CHARS = [
        'a' => self::A_SPECIAL_CHARS,
        'c' => self::C_SPECIAL_CHARS,
        'e' => self::E_SPECIAL_CHARS,
        'i' => self::I_SPECIAL_CHARS,
        'o' => self::O_SPECIAL_CHARS,
        'u' => self::U_SPECIAL_CHARS,
    ];

    private const WORDS_MAX_LENGTH = 9;

    private const WORDS_MIN_LENGTH = 4;

    /** @var array<string> */
    private array $wordsPool;

    /** @var array<string> */
    private array $randomLetters;

    /** @var array<string> */
    private array $matchingWords;

    /** @var array<int, array<string>> */
    private array $matchingWordsGroupedByLength;

    public function __construct()
    {
        $this->wordsPool = $this->getWordsPool();
    }

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
        Storage::put('gutenberg.json', $json);
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

    public function generateWords(): void
    {
        $this->setMatchingWords();
        while ($this->areMatchingWordsValids() === false) {
            $this->setMatchingWords();
        }

        foreach ($this->matchingWords as $word) {
            $this->matchingWordsGroupedByLength[mb_strlen($word)][] = $word;
        }
    }

    private function setMatchingWords(): void
    {
        $this->matchingWords = [];
        $this->resetWordsGroupedByLengthArray();
        $this->randomLetters = $this->generateRandomLetters();

        foreach ($this->wordsPool as $word) {
            if (! $this->isValid($word)) {
                continue;
            }
            $word = $this->removeSpecialChars($word);
            if (! in_array($word, $this->matchingWords)) {
                $this->matchingWords[] = $word;
            }
        }
    }

    /**
     * @return array<string>
     */
    private function generateRandomLetters(): array
    {
        $numberOfVowels = rand(3, 4);
        $numberOfMostUsedConsonants = rand(2, (self::WORDS_MAX_LENGTH - ($numberOfVowels + 1)));
        $numberOfLeastUsedConsonants = self::WORDS_MAX_LENGTH - ($numberOfVowels + $numberOfMostUsedConsonants);

        $randomLetters = ['e'];
        for ($i = 0; $i < $numberOfMostUsedConsonants; $i++) {
            $randomLetters[] = self::MOST_USED_CONSONANTS[rand(0, count(self::MOST_USED_CONSONANTS) - 1)];
        }
        for ($i = 0; $i < $numberOfLeastUsedConsonants; $i++) {
            $randomLetters[] = self::LEAST_USED_CONSONANTS[rand(0, count(self::LEAST_USED_CONSONANTS) - 1)];
        }
        for ($i = 0; $i < $numberOfVowels; $i++) {
            $randomLetters[] = self::VOWELS[rand(0, count(self::VOWELS) - 1)];
        }

        return $randomLetters;
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

    private function isValid(string $word): bool
    {
        if (mb_strlen($word) < self::WORDS_MIN_LENGTH) {
            return false;
        }
        foreach (mb_str_split($word) as $letter) {
            if (in_array($letter, self::A_SPECIAL_CHARS) && in_array('a', $this->randomLetters)) {
                continue;
            }
            if (in_array($letter, self::C_SPECIAL_CHARS) && in_array('c', $this->randomLetters)) {
                continue;
            }
            if (in_array($letter, self::E_SPECIAL_CHARS) && in_array('e', $this->randomLetters)) {
                continue;
            }
            if (in_array($letter, self::I_SPECIAL_CHARS) && in_array('i', $this->randomLetters)) {
                continue;
            }
            if (in_array($letter, self::O_SPECIAL_CHARS) && in_array('o', $this->randomLetters)) {
                continue;
            }
            if (in_array($letter, self::U_SPECIAL_CHARS) && in_array('u', $this->randomLetters)) {
                continue;
            }
            if (! in_array($letter, $this->randomLetters)) {
                return false;
            }
        }

        return true;
    }

    private function areMatchingWordsValids(): bool
    {
        if (! $this->hasAtLeastOneWordOfMaxLength()) {
            return false;
        }

        $this->filterMatchingWordsForLettersCount();

        if (! count($this->matchingWords) || ! $this->hasAtLeastOneWordOfMaxLength()) {
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

    private function removeSpecialChars(string $word): string
    {
        $wordWithoutSpecialChar = '';
        foreach (mb_str_split($word) as $char) {
            if (in_array($char, self::LETTERS)) {
                $wordWithoutSpecialChar .= $char;
            } else {
                array_map(function (string $letter, array $specialChars) use ($char, &$wordWithoutSpecialChar) {
                    if (in_array($char, $specialChars)) {
                        $wordWithoutSpecialChar .= $letter;
                    }
                }, array_keys(self::SPECIAL_CHARS), self::SPECIAL_CHARS);
            }
        }

        return $wordWithoutSpecialChar;
    }

    private function resetWordsGroupedByLengthArray(): void
    {
        $array = [];
        array_map(function (int $length) use (&$array) {
            $array[$length] = [];
        }, range(self::WORDS_MIN_LENGTH, self::WORDS_MAX_LENGTH));

        $this->matchingWordsGroupedByLength = $array;
    }

    /** @return array<string> */
    public function getRandomLetters(): array
    {
        return $this->randomLetters;
    }

    /** @return array<string> */
    public function getMatchingWords(): array
    {
        return $this->matchingWords;
    }

    /** @return array<int, array<string>> */
    public function getMatchingWordsGroupedByLength(): array
    {
        return $this->matchingWordsGroupedByLength;
    }

    public function getMatchingCount(): int
    {
        return count($this->matchingWords);
    }
}
